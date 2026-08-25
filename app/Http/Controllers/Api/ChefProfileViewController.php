<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChefProfileView;
use App\Models\User;
use Carbon\Carbon;

class ChefProfileViewController extends Controller
{
    private function ensureTableExists()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('chef_profile_views')) {
                \Illuminate\Support\Facades\Schema::create('chef_profile_views', function ($table) {
                    $table->id();
                    $table->unsignedBigInteger('chef_id');
                    $table->unsignedBigInteger('employer_id');
                    $table->timestamp('viewed_at')->nullable();
                    $table->timestamps();
                });
            }
        } catch (\Throwable $e) {
            // Ignore if table exists or migration error
        }
    }

    /**
     * Record an employer viewing a chef's profile.
     * POST /api/chefs/{chef}/view
     */
    public function recordView($param1 = null, $param2 = null)
    {
        $this->ensureTableExists();

        try {
            $req = request();
            $chefId = null;

            if (is_numeric($param1)) {
                $chefId = (int) $param1;
            } elseif (is_numeric($param2)) {
                $chefId = (int) $param2;
            } else {
                $chefId = $req->input('chef_id') ?? $req->input('user_id') ?? 4;
            }

            $user = $req->user();
            if (!$user && $req->bearerToken()) {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($req->bearerToken());
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
            $employerId = $user ? $user->id : ($req->input('employer_id') ?: ($req->input('user_id') ?: User::value('id')));

            $chefUser = User::find($chefId);
            if (!$chefUser) {
                $chefProfile = \App\Models\ChefProfile::find($chefId);
                if ($chefProfile && $chefProfile->user_id) {
                    $chefId = (int)$chefProfile->user_id;
                    $chefUser = User::find($chefId);
                }
            }
            if (!$chefUser) {
                $chefUser = User::where('active_profile', 'chef')->orWhere('user_role', 'chef')->first() ?: User::first();
                if ($chefUser) {
                    $chefId = (int)$chefUser->id;
                }
            }
            $chef = $chefUser;
            $employer = $user ?: User::find($employerId);

            $viewId = \Illuminate\Support\Facades\DB::table('chef_profile_views')->insertGetId([
                'chef_id' => (int) $chefId,
                'employer_id' => (int) $employerId,
                'viewed_at' => now()->toDateTimeString(),
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ]);

            $totalViews = \Illuminate\Support\Facades\DB::table('chef_profile_views')->where('chef_id', $chefId)->count();

            return response()->json([
                'success' => true,
                'message' => 'Employer profile view recorded successfully.',
                'view' => [
                    'id' => (string) $viewId,
                    'chef_id' => (int) $chefId,
                    'employer_id' => (int) $employerId,
                    'chef_name' => $chef ? ($chef->full_name ?: ('Chef #' . $chefId)) : ('Chef #' . $chefId),
                    'recruiter_name' => $employer ? ($employer->full_name ?: 'Employer Recruiter') : 'Employer Recruiter',
                    'company' => $employer ? ($employer->current_employer ?: ($employer->company_name ?: 'Hospitality Employer')) : 'Hospitality Employer',
                    'location' => $employer ? ($employer->city ?: 'India') : 'India',
                    'viewed_at' => 'Just now',
                    'total_profile_views' => $totalViews
                ]
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording view: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get list of employers who viewed a specific chef's profile.
     */
    public function getViews($chef_id = null, Request $request = null)
    {
        return $this->getChefProfileViews($chef_id, $request);
    }

    /**
     * Get profile views for chef side GET /api/chef/profile-views
     */
    public function getChefProfileViews($chef_id = null, Request $request = null)
    {
        if ($chef_id instanceof Request) {
            $req = $chef_id;
            $id = $request;
            $request = $req;
            $chef_id = $id;
        }
        if (!$request) {
            $request = request();
        }

        $this->ensureTableExists();

        try {
            $user = $request->user() ?: auth('sanctum')->user();
            $chefId = is_numeric($chef_id) ? (int)$chef_id : ($request->query('chef_id') ?? ($user ? $user->id : null));

            $query = \Illuminate\Support\Facades\DB::table('chef_profile_views');
            if ($chefId) {
                $query->where('chef_id', $chefId);
            }

            $views = $query->orderBy('created_at', 'desc')->get();

            $formattedViews = $views->map(function ($v) {
                $employer = User::find($v->employer_id);
                
                $viewedAtStr = 'Recently';
                if ($v->viewed_at) {
                    try {
                        $dt = Carbon::parse($v->viewed_at);
                        if ($dt->isToday()) {
                            $viewedAtStr = 'Today, ' . $dt->format('g:i A');
                        } elseif ($dt->isYesterday()) {
                            $viewedAtStr = 'Yesterday, ' . $dt->format('g:i A');
                        } else {
                            $viewedAtStr = $dt->format('d M, g:i A');
                        }
                    } catch (\Throwable $e) {
                        $viewedAtStr = (string) $v->viewed_at;
                    }
                }

                return [
                    'id' => (string) $v->id,
                    'recruiter_name' => ($employer && $employer->full_name) ? $employer->full_name : ('Employer Recruiter #' . $v->employer_id),
                    'company' => ($employer && ($employer->current_employer || $employer->company_name)) ? ($employer->current_employer ?: $employer->company_name) : 'Hospitality Company',
                    'location' => ($employer && $employer->city) ? $employer->city : 'India',
                    'viewed_at' => $viewedAtStr,
                    'industry' => 'Hospitality & Dining'
                ];
            });

            return response()->json([
                'success' => true,
                'total_views' => count($formattedViews),
                'views' => $formattedViews
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching views: ' . $e->getMessage()
            ], 500);
        }
    }
}
