<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WebProfileController extends Controller
{
    /**
     * Show profile page with progress percentage and active roles switcher.
     */
    public function index()
    {
        $user = Auth::user()->load(['roles', 'chefProfile']);
        
        // Formulate activated and available roles lists
        $userRoles = $user->roles->pluck('role_type')->toArray();
        $activeRole = $user->currentRoleContext();

        return view('profile', compact('user', 'userRoles', 'activeRole'));
    }

    /**
     * Update user details to boost completeness score.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'profile_photo_path' => 'nullable|url|max:255',
            'city' => 'required|string|max:255',
            'experience_range' => 'required|string|max:255',
            'preferred_role' => 'required|string|max:255',
            'current_employer' => 'nullable|string|max:255',
            'skills' => 'nullable|string', // Comma separated, will convert to array
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process skills string to array
        $skillsArray = [];
        if ($request->filled('skills')) {
            $skillsArray = array_filter(array_map('trim', explode(',', $request->skills)));
        }

        $user->update([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'profile_photo_path' => $request->profile_photo_path,
            'city' => $request->city,
            'experience_range' => $request->experience_range,
            'preferred_role' => $request->preferred_role,
            'current_employer' => $request->current_employer,
            'skills' => $skillsArray,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile information updated! Your profile progress has been recalculated.',
        ]);
    }

    /**
     * Show personal information form on its own separate page.
     */
    public function editPersonal()
    {
        $user = Auth::user();
        return view('profile.personal', compact('user'));
    }

    /**
     * Update personal and professional details.
     */
    public function updatePersonal(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'profile_photo_path' => 'nullable|url|max:255',
            'city' => 'required|string|max:255',
            'experience_range' => 'required|string|max:255',
            'preferred_role' => 'required|string|max:255',
            'current_employer' => 'nullable|string|max:255',
            'skills' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process skills string to array
        $skillsArray = [];
        if ($request->filled('skills')) {
            $skillsArray = array_filter(array_map('trim', explode(',', $request->skills)));
        }

        $user->update([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'profile_photo_path' => $request->profile_photo_path,
            'city' => $request->city,
            'experience_range' => $request->experience_range,
            'preferred_role' => $request->preferred_role,
            'current_employer' => $request->current_employer,
            'skills' => $skillsArray,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile information updated successfully!',
        ]);
    }

    /**
     * Show the user's job applications on a separate page.
     */
    public function applications()
    {
        $user = Auth::user();
        $applications = $user->applications()->with('jobPost')->orderBy('created_at', 'desc')->get();
        return view('profile.applications', compact('user', 'applications'));
    }
}
