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
    public function recordView(Request $request, $chef_id = null)
    {
        $this->ensureTableExists();
        try {
            $chefId = $chef_id ?? $request->input('chef_id') ?? $request->input('user_id');
            $user = $request->user();
            $employerId = $user ? $user->id : ($request->input('employer_id') ?? 1);

            if (!$chefId) {
                return response()->json([
                    'success' => false,
                    'message' => 'The chef_id parameter is required.'
                ], 422);
            }

            $chef = User::find($chefId);
            $employer = User::find($employerId);

            $view = ChefProfileView::create([
                'chef_id' => $chefId,
                'employer_id' => $employerId,
                'viewed_at' => now(),
            ]);

            $totalViews = ChefProfileView::where('chef_id', $chefId)->count();

            return response()->json([
                'success' => true,
                'message' => 'Employer profile view recorded successfully.',
                'view' => [
                    'id' => (string) $view->id,
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
    public function getViews(Request $request, $chef_id = null)
    {
        return $this->getChefProfileViews($request, $chef_id);
    }

    /**
     * Get profile views for chef side GET /api/chef/profile-views
     */
    public function getChefProfileViews(Request $request, $chef_id = null)
    {
        $this->ensureTableExists();
        $user = $request->user();
        $chefId = $chef_id ?? $request->query('chef_id') ?? ($user ? $user->id : null);

        $query = ChefProfileView::with('employer');
        if ($chefId) {
            $query->where('chef_id', $chefId);
        }

        $views = $query->orderBy('created_at', 'desc')->get();

        $formattedViews = $views->map(function ($v) {
            $employer = $v->employer;
            
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
                } catch (\Exception $e) {
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
    }
}
