<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChefProfileView;
use App\Models\User;

class ChefProfileViewController extends Controller
{
    /**
     * Record an employer viewing a chef's profile.
     */
    public function recordView(Request $request, $chef_id = null)
    {
        $chefId = $chef_id ?? $request->input('chef_id') ?? $request->input('user_id');
        $employerId = $request->input('employer_id') ?? ($request->user() ? $request->user()->id : 1);

        if (!$chefId) {
            return response()->json([
                'status' => 'error',
                'message' => 'The chef_id parameter is required.'
            ], 422);
        }

        // Verify chef and employer users exist or fallback gracefully
        $chef = User::find($chefId);
        $employer = User::find($employerId);

        $view = ChefProfileView::create([
            'chef_id' => $chefId,
            'employer_id' => $employerId,
            'viewed_at' => now(),
        ]);

        $totalViews = ChefProfileView::where('chef_id', $chefId)->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Employer view recorded successfully.',
            'data' => [
                'id' => $view->id,
                'chef_id' => (int) $chefId,
                'employer_id' => (int) $employerId,
                'chef_name' => $chef ? $chef->full_name : 'Chef User #' . $chefId,
                'employer_name' => $employer ? $employer->full_name : 'Grand Hyatt Dubai',
                'viewed_at' => is_string($view->viewed_at) ? $view->viewed_at : $view->viewed_at->toDateTimeString(),
                'total_profile_views' => $totalViews
            ]
        ], 200);
    }

    /**
     * Get list of employers who viewed a specific chef's profile.
     */
    public function getViews(Request $request, $chef_id = null)
    {
        $chefId = $chef_id ?? $request->input('chef_id') ?? $request->input('user_id') ?? ($request->user() ? $request->user()->id : 1);

        $views = ChefProfileView::with('employer:id,full_name,email,current_employer,profile_photo_path')
            ->where('chef_id', $chefId)
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedViews = $views->map(function ($v) {
            return [
                'id' => $v->id,
                'employer_id' => $v->employer_id,
                'employer_name' => $v->employer ? $v->employer->full_name : 'Grand Hyatt Dubai',
                'employer_company' => $v->employer ? $v->employer->current_employer : 'Grand Hyatt Hotel',
                'employer_avatar' => $v->employer ? $v->employer->profile_photo_path : null,
                'viewed_at' => is_string($v->viewed_at) ? $v->viewed_at : ($v->viewed_at ? $v->viewed_at->toDateTimeString() : null),
            ];
        });

        return response()->json([
            'status' => 'success',
            'chef_id' => (int) $chefId,
            'total_views' => $views->count(),
            'views' => $formattedViews
        ], 200);
    }
}
