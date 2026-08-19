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
     * Helper method to normalize input role strings.
     */
    private function normalizeRole(?string $role): ?string
    {
        if (!$role) return null;
        $r = strtolower(trim($role));
        if (in_array($r, ['jobseeker', 'job_seeker', 'talent', 'candidate'])) {
            return 'job_seeker';
        }
        if (in_array($r, ['employer', 'recruiter', 'hirer'])) {
            return 'employer';
        }
        if (in_array($r, ['chef', 'cook'])) {
            return 'chef';
        }
        if (in_array($r, ['agency', 'referrer'])) {
            return 'agency';
        }
        return $r;
    }

    /**
     * Request OTP endpoint.
     */
    public function requestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|regex:/^[0-9]{10}$/',
            'role'          => 'nullable|string',
            'role_type'     => 'nullable|string',
            'login_role'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $requestedRole = $this->normalizeRole($request->role ?? $request->role_type ?? $request->login_role);

        if ($requestedRole) {
            $user = User::where('mobile_number', $request->mobile_number)->first();
            if ($user) {
                $activeRole = $user->activeRole()->first();
                $existingRoleType = $activeRole ? $activeRole->role_type : ($user->roles()->first()?->role_type);
                $existingRoleType = $this->normalizeRole($existingRoleType);

                if ($existingRoleType && $existingRoleType !== $requestedRole) {
                    $displayExisting = str_replace('_', ' ', $existingRoleType);
                    $displayRequested = str_replace('_', ' ', $requestedRole);
                    return response()->json([
                        'success' => false,
                        'message' => "Role conflict error: Mobile number {$request->mobile_number} is already registered as '{$displayExisting}'. You cannot request OTP or log in as '{$displayRequested}'.",
                    ], 400);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully. Use 123456 for testing.',
        ]);
    }

    /**
     * Verify OTP endpoint.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number'     => 'required|string|regex:/^[0-9]{10}$/',
            'otp'               => 'required|string|size:6',
            'selected_language' => 'nullable|string|max:10',
            'fcm_token'          => 'nullable|string',
            'role'              => 'nullable|string',
            'role_type'         => 'nullable|string',
            'login_role'        => 'nullable|string',
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

        $requestedRole = $this->normalizeRole($request->role ?? $request->role_type ?? $request->login_role);

        // Fetch user
        $user = User::where('mobile_number', $request->mobile_number)->first();
        $isNewUser = false;

        if ($user) {
            // Check for Role Mismatch/Conflict on existing user
            $activeRole = $user->activeRole()->first();
            $existingRoleType = $activeRole ? $activeRole->role_type : ($user->roles()->first()?->role_type);
            $existingRoleType = $this->normalizeRole($existingRoleType);

            if ($requestedRole && $existingRoleType && $existingRoleType !== $requestedRole) {
                $displayExisting = str_replace('_', ' ', $existingRoleType);
                $displayRequested = str_replace('_', ' ', $requestedRole);
                return response()->json([
                    'success' => false,
                    'message' => "Role conflict error: Mobile number {$request->mobile_number} is already registered as '{$displayExisting}'. You cannot log in or change role to '{$displayRequested}'.",
                ], 400);
            }

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
        } else {
            // Create New User with requested role or default to job_seeker
            $isNewUser = true;
            $userRoleType = $requestedRole ?? 'job_seeker';

            $user = User::create([
                'mobile_number' => $request->mobile_number,
                'is_suspended' => false,
                'selected_language' => $request->selected_language ?? 'en',
                'fcm_token' => $request->fcm_token,
            ]);

            UserRole::create([
                'user_id' => $user->id,
                'role_type' => $userRoleType,
                'is_active' => true,
            ]);
        }

        // Check if user is suspended
        if ($user->is_suspended) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended by an administrator.',
            ], 403);
        }

        // Enforce single active role for the user
        $user->roles()->update(['is_active' => false]);
        $primaryRole = $user->roles()->first();
        if ($primaryRole) {
            $primaryRole->update(['is_active' => true]);
        } else {
            UserRole::create([
                'user_id' => $user->id,
                'role_type' => $requestedRole ?? 'job_seeker',
                'is_active' => true,
            ]);
        }

        // Restrict multiple active logins for the same account:
        // Revoke all previous Sanctum tokens so any previous device login is automatically logged out
        $user->tokens()->delete();
        \App\Models\UserDeviceToken::where('user_id', $user->id)->update(['is_active' => false]);

        // Generate new single active Sanctum auth token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Fetch roles details
        $roles = $user->roles()->get();
        $activeRole = $user->activeRole()->first();
        $activeRoleType = $activeRole ? $activeRole->role_type : ($user->roles()->first()?->role_type ?: 'job_seeker');

        // Strictly check active role and attach only the active role's profile data
        $chefData = null;
        $employerData = null;

        if ($activeRoleType === 'chef') {
            $chefProfile = $user->chefProfile()->first();
            if (!$chefProfile && $user->hasActiveRole('chef')) {
                $chefProfile = \App\Models\ChefProfile::create([
                    'user_id' => $user->id,
                    'approval_status' => 'approved',
                ]);
            }
            if ($chefProfile) {
                $availability = [];
                if ($chefProfile->availability_info) {
                    $availability = json_decode($chefProfile->availability_info, true) ?: [];
                }
                $chefData = [
                    'id' => $chefProfile->id,
                    'user_id' => $chefProfile->user_id,
                    'cuisine_specialty' => $chefProfile->cuisine_specialty ?: null,
                    'specialties' => $chefProfile->cuisine_specialty ?: null,
                    'bio' => $chefProfile->bio ?: null,
                    'calendly_link' => $chefProfile->calendly_link ?: null,
                    'approval_status' => $chefProfile->approval_status ?: 'approved',
                    'status' => $chefProfile->approval_status ?: 'approved',
                    'availability_info' => $availability,
                    'created_at' => $chefProfile->created_at ? $chefProfile->created_at->toIso8601String() : null,
                    'updated_at' => $chefProfile->updated_at ? $chefProfile->updated_at->toIso8601String() : null,
                ];
            }
        } elseif ($activeRoleType === 'employer') {
            $employerProfile = $user->employerProfile()->first();
            if ($employerProfile) {
                $ops = $employerProfile->operational_locations;
                if (is_string($ops)) {
                    $ops = json_decode($ops, true) ?: [];
                }
                $employerData = [
                    'id' => $employerProfile->id,
                    'user_id' => $employerProfile->user_id,
                    'business_name' => $employerProfile->business_name ?: null,
                    'company_name' => $employerProfile->business_name ?: null,
                    'industry_segment' => $employerProfile->industry_segment ?: null,
                    'description' => $employerProfile->industry_segment ?: null,
                    'business_location' => $employerProfile->business_location ?: null,
                    'city' => $employerProfile->business_location ?: null,
                    'contact_person_name' => $employerProfile->contact_person_name ?: null,
                    'designation' => $employerProfile->contact_person_name ?: null,
                    'business_mobile' => $employerProfile->business_mobile ?: null,
                    'business_email' => $employerProfile->business_email ?: null,
                    'preferred_language' => $employerProfile->preferred_language ?: null,
                    'company_logo_path' => $employerProfile->company_logo_path ?: null,
                    'company_logo_url' => $employerProfile->company_logo_path ?: null,
                    'operational_locations' => is_array($ops) ? $ops : [],
                    'nominee_name' => $employerProfile->nominee_name ?: null,
                    'nominee_relationship' => $employerProfile->nominee_relationship ?: null,
                    'nominee_mobile' => $employerProfile->nominee_mobile ?: null,
                    'is_completed' => (bool)$employerProfile->is_completed,
                    'created_at' => $employerProfile->created_at ? $employerProfile->created_at->toIso8601String() : null,
                    'updated_at' => $employerProfile->updated_at ? $employerProfile->updated_at->toIso8601String() : null,
                ];
            }
        }

        // Fetch Socials
        $socials = $user->socials()->first();
        $socialsData = null;
        if ($socials) {
            $socialsData = [
                'instagram' => $socials->instagram ?: '',
                'linkedin' => $socials->linkedin ?: '',
                'facebook' => $socials->facebook ?: '',
                'twitter' => $socials->twitter ?: '',
                'youtube' => $socials->youtube ?: '',
                'website' => $socials->website ?: '',
            ];
        }

        // Parse skills array
        $skills = [];
        if (is_array($user->skills)) {
            $skills = $user->skills;
        } elseif (is_string($user->skills)) {
            $skills = json_decode($user->skills, true) ?: array_values(array_filter(array_map('trim', explode(',', $user->skills))));
        }

        $completeness = \App\Services\ProfileProgressService::calculate($user);

        $chefProfile = $user->chefProfile()->first();
        $chefAvailability = ($chefProfile && $chefProfile->availability_info) ? (json_decode($chefProfile->availability_info, true) ?: []) : [];

        $jobLocation = $user->city ?: ($chefAvailability['location_preference'] ?? null);
        $preference = $user->preferred_role ?: (is_array($chefAvailability['employment_preference'] ?? null) ? implode(', ', $chefAvailability['employment_preference']) : ($chefAvailability['employment_preference'] ?? null));
        $country = $user->country ?: null;
        $city = $user->city ?: ($employerData['city'] ?? null);
        $availabilityStatus = $user->availability_status ?: null;

        $talentCompleteness = \App\Services\ProfileProgressService::calculateTalent($user)['completeness'];
        $talentData = [
            'id' => $user->id,
            'user_id' => $user->id,
            'full_name' => $user->full_name ?: null,
            'name' => $user->full_name ?: null,
            'email' => $user->email ?: null,
            'gender' => $user->gender ?: null,
            'mobile_number' => $user->mobile_number ?: null,
            'country' => $country,
            'city' => $city,
            'experience_range' => $user->experience_range ?: ($user->experience_years ?: null),
            'experience_years' => $user->experience_range ?: ($user->experience_years ?: null),
            'preferred_role' => $user->preferred_role ?: null,
            'current_employer' => $user->current_employer ?: null,
            'skills' => !empty($skills) ? $skills : null,
            'availability_status' => $availabilityStatus,
            'is_available' => (bool)$user->is_available,
            'selected_language' => $user->selected_language ?: null,
            'profile_photo_path' => $user->profile_photo_path,
            'completeness' => $talentCompleteness,
            'profile_completeness' => $talentCompleteness,
            'created_at' => $user->created_at ? $user->created_at->toIso8601String() : null,
            'updated_at' => $user->updated_at ? $user->updated_at->toIso8601String() : null,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'mobile_number' => $user->mobile_number,
                'full_name' => $user->full_name ?: null,
                'name' => $user->full_name ?: null,
                'email' => $user->email ?: null,
                'gender' => $user->gender ?: null,
                'profile_photo_path' => $user->profile_photo_path,
                'country' => $country,
                'city' => $city,
                'job_location' => $jobLocation,
                'preference' => $preference,
                'experience_years' => $user->experience_range ?: ($user->experience_years ?: null),
                'experience_range' => $user->experience_range ?: ($user->experience_years ?: null),
                'preferred_role' => $user->preferred_role ?: null,
                'current_employer' => $user->current_employer ?: null,
                'skills' => !empty($skills) ? $skills : null,
                'availability_status' => $availabilityStatus,
                'is_available' => (bool)$user->is_available,
                'selected_language' => $user->selected_language ?: null,
                'fcm_token' => $user->fcm_token,
                'completeness' => $completeness,
                'profile_completeness' => $completeness,
                'active_profile' => $activeRoleType,
                'active_role' => $activeRoleType,
                'user_role' => $activeRoleType,
                'profiles' => $roles->map(function ($r) {
                    return [
                        'role_type' => $r->role_type,
                        'is_active' => $r->is_active,
                    ];
                }),
                'talent_profile' => $talentData,
                'talent_profile_details' => $talentData,
                'job_seeker_profile' => $talentData,
                'chef_profile' => $chefData,
                'chef_profile_details' => $chefData,
                'employer_profile' => $employerData,
                'socials' => $socialsData,
            ],
            'country' => $country,
            'city' => $city,
            'job_location' => $jobLocation,
            'preference' => $preference,
            'availability_status' => $availabilityStatus,
            'is_available' => (bool)$user->is_available,
            'talent_profile' => $talentData,
            'talent_profile_details' => $talentData,
            'job_seeker_profile' => $talentData,
            'chef_profile' => $chefData,
            'employer_profile' => $employerData,
            'socials' => $socialsData,
        ]);
    }

    /**
     * Switch active profile (Blocked if trying to change registered locked role).
     */
    public function toggleProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_type' => 'required|string|in:job_seeker,employer,chef,referrer,agency',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $targetRole = $this->normalizeRole($request->role_type);

        $activeRole = $user->activeRole()->first();
        $existingRoleType = $activeRole ? $activeRole->role_type : ($user->roles()->first()?->role_type);
        $existingRoleType = $this->normalizeRole($existingRoleType);

        if ($existingRoleType && $existingRoleType !== $targetRole) {
            $displayExisting = str_replace('_', ' ', $existingRoleType);
            $displayTarget = str_replace('_', ' ', $targetRole);
            return response()->json([
                'success' => false,
                'message' => "Role conflict error: Mobile number {$user->mobile_number} is locked to role '{$displayExisting}'. Role change to '{$displayTarget}' is not allowed.",
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile profile toggled successfully.',
            'active_profile' => $existingRoleType,
            'profiles' => $user->roles()->get()->map(function ($r) {
                return [
                    'role_type' => $r->role_type,
                    'is_active' => $r->is_active,
                ];
            })
        ]);
    }
}
