<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Fetch user profile.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'mobile_number' => $user->mobile_number,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'profile_photo_path' => $user->profile_photo_path,
                'city' => $user->city,
                'experience_years' => $user->experience_years,
                'preferred_role' => $user->preferred_role,
                'current_employer' => $user->current_employer,
                'skills' => $user->skills,
                'completeness' => $user->profile_completeness,
            ]
        ]);
    }

    /**
     * Update user profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'profile_photo_path' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'experience_years' => 'nullable|numeric|min:0|max:99',
            'preferred_role' => 'nullable|string|max:255',
            'current_employer' => 'nullable|string|max:255',
            'skills' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update($request->only([
            'full_name',
            'email',
            'profile_photo_path',
            'city',
            'experience_years',
            'preferred_role',
            'current_employer',
            'skills',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => [
                'id' => $user->id,
                'mobile_number' => $user->mobile_number,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'profile_photo_path' => $user->profile_photo_path,
                'city' => $user->city,
                'experience_years' => $user->experience_years,
                'preferred_role' => $user->preferred_role,
                'current_employer' => $user->current_employer,
                'skills' => $user->skills,
                'completeness' => $user->profile_completeness,
            ]
        ]);
    }
}
