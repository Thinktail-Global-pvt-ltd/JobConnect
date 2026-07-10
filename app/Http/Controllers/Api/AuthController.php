<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Request OTP mock endpoint.
     */
    public function requestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|regex:/^[0-9]{10}$/',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Standard response showing OTP sent to user (OTP is locked to '123456' for local XAMPP sandbox)
        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully. Use 123456 for testing.',
        ]);
    }

    /**
     * Verify OTP mock endpoint.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|regex:/^[0-9]{10}$/',
            'otp' => 'required|string|size:6',
            'selected_language' => 'nullable|string|max:10',
            'fcm_token' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Verify strictly 123456
        if ($request->otp !== '123456') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP code provided.',
            ], 401);
        }

        // Fetch or create user
        $user = User::where('mobile_number', $request->mobile_number)->first();
        $isNewUser = false;

        if (!$user) {
            $isNewUser = true;
            $user = User::create([
                'mobile_number' => $request->mobile_number,
                'is_suspended' => false,
                'selected_language' => $request->selected_language ?? 'en',
                'fcm_token' => $request->fcm_token,
            ]);

            // Automatically register default profile (Job Seeker)
            UserRole::create([
                'user_id' => $user->id,
                'role_type' => 'job_seeker',
                'is_active' => true,
            ]);
        } else {
            $updateData = [];
            if ($request->filled('selected_language')) {
                $updateData['selected_language'] = $request->selected_language;
            }
            if ($request->filled('fcm_token')) {
                $updateData['fcm_token'] = $request->fcm_token;
            }
            if (!empty($updateData)) {
                $user->update($updateData);
            }
        }

        // Check if user is suspended
        if ($user->is_suspended) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended by an administrator.',
            ], 403);
        }

        // If it's an existing user, make sure they have at least one active profile
        if (!$isNewUser) {
            $activeRole = $user->activeRole()->first();
            if (!$activeRole) {
                // If no active profile, activate the first role or default to job_seeker
                $firstRole = $user->roles()->first();
                if ($firstRole) {
                    $firstRole->update(['is_active' => true]);
                } else {
                    UserRole::create([
                        'user_id' => $user->id,
                        'role_type' => 'job_seeker',
                        'is_active' => true,
                    ]);
                }
            }
        }

        // Generate Sanctum auth token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Fetch roles details
        $roles = $user->roles()->get();
        $activeRole = $user->activeRole()->first();

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'token' => $token,
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
                'profiles' => $roles->map(function ($r) {
                    return [
                        'role_type' => $r->role_type,
                        'is_active' => $r->is_active,
                    ];
                }),
                'active_profile' => $activeRole ? $activeRole->role_type : 'job_seeker',
            ]
        ]);
    }

    /**
     * Switch active profile.
     */
    public function toggleProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_type' => 'required|string|in:job_seeker,employer,referrer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Check if role already exists in database
        $role = UserRole::where('user_id', $user->id)
            ->where('role_type', $request->role_type)
            ->first();

        if (!$role) {
            // Activate and create since single-user has multi-profile flexibility
            $role = UserRole::create([
                'user_id' => $user->id,
                'role_type' => $request->role_type,
                'is_active' => true,
            ]);
        }

        // Toggle all other profiles to inactive
        UserRole::where('user_id', $user->id)
            ->where('id', '!=', $role->id)
            ->update(['is_active' => false]);

        // Explicitly set target profile active
        $role->update(['is_active' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Profile profile toggled successfully.',
            'active_profile' => $role->role_type,
            'profiles' => $user->roles()->get()->map(function ($r) {
                return [
                    'role_type' => $r->role_type,
                    'is_active' => $r->is_active,
                ];
            })
        ]);
    }
}
