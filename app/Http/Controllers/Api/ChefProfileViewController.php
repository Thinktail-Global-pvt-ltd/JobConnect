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
    public function recordView($chef_id = null, Request $request = null)
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
            $chefId = is_numeric($chef_id) ? (int)$chef_id : ($request->input('chef_id') ?? $request->input('user_id') ?? 4);
            $user = $request->user() ?: auth('sanctum')->user();
            $employerId = $user ? $user->id : ($request->input('employer_id') ?? 1);

            $chef = User::find($chefId);
            $employer = User::find($employerId);

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
