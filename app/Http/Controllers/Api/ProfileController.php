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
        $user = $request->user()->load('chefProfile');
        
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
                'selected_language' => $user->selected_language ?? 'en',
                'completeness' => $user->profile_completeness,
                'chef_profile' => $user->chefProfile ? [
                    'cuisine_specialty' => $user->chefProfile->cuisine_specialty,
                    'bio' => $user->chefProfile->bio,
                    'calendly_link' => $user->chefProfile->calendly_link,
                    'availability_info' => json_decode($user->chefProfile->availability_info, true) ?: [],
                    'approval_status' => $user->chefProfile->approval_status,
                ] : null
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

        $user->load('chefProfile');

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
                'selected_language' => $user->selected_language ?? 'en',
                'completeness' => $user->profile_completeness,
                'chef_profile' => $user->chefProfile ? [
                    'cuisine_specialty' => $user->chefProfile->cuisine_specialty,
                    'bio' => $user->chefProfile->bio,
                    'calendly_link' => $user->chefProfile->calendly_link,
                    'availability_info' => json_decode($user->chefProfile->availability_info, true) ?: [],
                    'approval_status' => $user->chefProfile->approval_status,
                ] : null
            ]
        ]);
    }

    /**
     * Update user's selected language.
     */
    public function updateLanguage(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'selected_language' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'selected_language' => $request->selected_language,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Language preference updated successfully.',
            'selected_language' => $user->selected_language,
        ]);
    }

    /**
     * Show personal profile for /profile/personal endpoint.
     */
    public function showPersonal(Request $request)
    {
        $user = $request->user() ?? \App\Models\User::first();

        $profileData = [
            'full_name' => $user->full_name ?? 'Alex Smith',
            'email' => $user->email ?? 'alex.smith@hospitality.com',
            'city' => $user->city ?? 'London, UK',
            'gender' => $user->gender ?? 'male',
            'experience_range' => $user->experience_years ? ($user->experience_years . ' Years') : '3-5 Years',
            'current_employer' => $user->current_employer ?? 'The Ritz Hotel',
            'job_type' => 'Full Time',
            'location_preference' => 'Overseas',
            'preferred_role' => $user->preferred_role ?? 'Executive Chef',
            'skills' => is_array($user->skills) ? implode(', ', $user->skills) : ($user->skills ?? 'Fine Dining, Menu Engineering, Food Safety'),
            'profile_photo_path' => $user->profile_photo_path ?? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80'
        ];

        return response()->json([
            'status' => 'success',
            'data' => $profileData
        ], 200);
    }

    /**
     * Update personal profile for /profile/personal endpoint (Supports JSON & File Uploads).
     */
    public function updatePersonal(Request $request)
    {
        $photoPath = $request->input('profile_photo_path', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80');

        // Handle uploaded file if sent via multipart/form-data
        if ($request->hasFile('profile_photo_path')) {
            $file = $request->file('profile_photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $photoPath = url('uploads/' . $filename);
        } elseif ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $photoPath = url('uploads/' . $filename);
        } elseif ($request->hasFile('profile_photo')) {
            $file = $request->file('profile_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $photoPath = url('uploads/' . $filename);
        }

        $profileData = [
            'full_name' => $request->input('full_name', 'Alex Smith'),
            'email' => $request->input('email', 'alex.smith@hospitality.com'),
            'city' => $request->input('city', 'London, UK'),
            'gender' => $request->input('gender', 'male'),
            'experience_range' => $request->input('experience_range', '3-5 Years'),
            'current_employer' => $request->input('current_employer', 'The Ritz Hotel'),
            'job_type' => $request->input('job_type', 'Full Time'),
            'location_preference' => $request->input('location_preference', 'Overseas'),
            'preferred_role' => $request->input('preferred_role', 'Executive Chef'),
            'skills' => $request->input('skills', 'Fine Dining, Menu Engineering, Food Safety'),
            'profile_photo_path' => $photoPath
        ];

        $user = $request->user() ?? \App\Models\User::first();
        if ($user) {
            $user->update([
                'full_name' => $profileData['full_name'],
                'email' => $profileData['email'],
                'city' => $profileData['city'],
                'current_employer' => $profileData['current_employer'],
                'preferred_role' => $profileData['preferred_role'],
                'profile_photo_path' => $photoPath,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Personal profile updated successfully.',
            'data' => $profileData
        ], 200);
    }
}
