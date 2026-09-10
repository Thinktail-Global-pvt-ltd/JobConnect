<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private const REVIEW_TEST_OTP = '000000';

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

    private function normalizeMobileForLogin(Request $request): string
    {
        $mobile = preg_replace('/[^0-9]/', '', (string) $request->input('mobile_number'));
        $countryCode = $request->input('country_code')
            ?? $request->input('extension')
            ?? $request->input('dial_code')
            ?? $request->input('phone_code');
        $countryCode = preg_replace('/[^0-9]/', '', (string) $countryCode);

        if ($countryCode !== '') {
            $mobile = ltrim($mobile, '0');
            if (!str_starts_with($mobile, $countryCode)) {
                return $countryCode . $mobile;
            }
        }

        return $mobile;
    }

    private function reviewTestAccounts(): array
    {
        return [
            '8602180000' => [
                'role' => 'employer',
                'mobile_number' => '918602180000',
                'user' => [
                    'full_name' => 'App Review Employer',
                    'email' => 'app.review.employer@jobrito.com',
                    'country' => 'India',
                    'city' => 'Mumbai',
                    'selected_language' => 'en',
                    'is_suspended' => false,
                    'is_available' => true,
                    'availability_status' => 'Available',
                ],
                'employer_profile' => [
                    'business_name' => 'Jobrito Review Hospitality',
                    'industry_segment' => 'Hotels, Restaurants and Catering',
                    'business_location' => 'Mumbai, Maharashtra',
                    'contact_person_name' => 'Review Hiring Manager',
                    'business_mobile' => '918602180000',
                    'business_email' => 'app.review.employer@jobrito.com',
                    'preferred_language' => 'en',
                    'operational_locations' => ['Mumbai', 'Delhi', 'Bengaluru'],
                    'nominee_name' => 'Review Operations',
                    'nominee_relationship' => 'Manager',
                    'nominee_mobile' => '918602180000',
                    'is_completed' => true,
                ],
            ],
            '8602180001' => [
                'role' => 'job_seeker',
                'mobile_number' => '918602180001',
                'user' => [
                    'full_name' => 'App Review Talent',
                    'email' => 'app.review.talent@jobrito.com',
                    'country' => 'India',
                    'city' => 'Delhi',
                    'experience_range' => '3-5 Years',
                    'preferred_role' => 'Commis Chef',
                    'current_employer' => 'Sample Bistro',
                    'skills' => ['Food Preparation', 'Kitchen Hygiene', 'Inventory Support'],
                    'age' => '27',
                    'overseas_work_experience' => 'No',
                    'selected_language' => 'en',
                    'is_suspended' => false,
                    'is_available' => true,
                    'availability_status' => 'Available',
                ],
            ],
            '8602180002' => [
                'role' => 'chef',
                'mobile_number' => '918602180002',
                'user' => [
                    'full_name' => 'App Review Chef',
                    'email' => 'app.review.chef@jobrito.com',
                    'country' => 'India',
                    'city' => 'Bengaluru',
                    'experience_range' => '5-8 Years',
                    'preferred_role' => 'Sous Chef',
                    'current_employer' => 'Sample Fine Dining',
                    'skills' => ['Indian Cuisine', 'Continental Cuisine', 'Menu Planning'],
                    'age' => '32',
                    'overseas_work_experience' => 'Yes',
                    'selected_language' => 'en',
                    'is_suspended' => false,
                    'is_available' => true,
                    'availability_status' => 'Available',
                ],
                'chef_profile' => [
                    'cuisine_specialty' => 'Indian and Continental Cuisine',
                    'operational_experties' => 'Kitchen Operations, Menu Planning, Team Training',
                    'bio' => 'Review chef profile for app store testing across feed, saved jobs, training and consulting flows.',
                    'calendly_link' => 'https://calendly.com/jobrito-review/chef-consulting',
                    'availability_info' => [
                        'employment_preference' => ['Full Time', 'Consulting'],
                        'location_preference' => 'Bengaluru',
                        'languages' => ['English', 'Hindi'],
                        'age' => '32',
                    ],
                    'approval_status' => 'approved',
                    'overseas_work_experience' => 'Yes',
                ],
            ],
        ];
    }

    private function getReviewTestAccountForMobile(string $mobile): ?array
    {
        $cleanMobile = preg_replace('/[^0-9]/', '', $mobile);
        $last10 = strlen($cleanMobile) >= 10 ? substr($cleanMobile, -10) : $cleanMobile;

        return $this->reviewTestAccounts()[$last10] ?? null;
    }

    private function onlyExistingColumns(string $table, array $data): array
    {
        return array_filter(
            $data,
            fn ($value, $column) => \Illuminate\Support\Facades\Schema::hasColumn($table, $column),
            ARRAY_FILTER_USE_BOTH
        );
    }

    private function findUserByMobile(string $mobile): ?User
    {
        $cleanMobile = preg_replace('/[^0-9]/', '', $mobile);
        $last10 = strlen($cleanMobile) >= 10 ? substr($cleanMobile, -10) : $cleanMobile;

        return User::where('mobile_number', $mobile)
            ->orWhere('mobile_number', $cleanMobile)
            ->orWhere('mobile_number', 'LIKE', '%' . $last10)
            ->first();
    }

    private function ensureReviewTestAccount(string $mobile): User
    {
        $account = $this->getReviewTestAccountForMobile($mobile);
        if (!$account) {
            throw new \InvalidArgumentException('Mobile number is not configured as a review test account.');
        }

        $user = $this->findUserByMobile($mobile);
        $userData = $this->onlyExistingColumns('users', array_merge(
            ['mobile_number' => $account['mobile_number']],
            $account['user']
        ));

        if ($user) {
            unset($userData['mobile_number']);
            $user->update($userData);
        } else {
            $user = User::create($userData);
        }

        $user->roles()->update(['is_active' => false]);
        UserRole::updateOrCreate(
            ['user_id' => $user->id, 'role_type' => $account['role']],
            ['is_active' => true]
        );

        if ($account['role'] === 'employer' && \Illuminate\Support\Facades\Schema::hasTable('employer_profiles')) {
            $profileData = $this->onlyExistingColumns('employer_profiles', array_merge(
                ['user_id' => $user->id],
                $account['employer_profile']
            ));
            \App\Models\EmployerProfile::updateOrCreate(['user_id' => $user->id], $profileData);
        }

        if ($account['role'] === 'chef' && \Illuminate\Support\Facades\Schema::hasTable('chef_profiles')) {
            $chefProfile = $account['chef_profile'];
            if (isset($chefProfile['availability_info']) && is_array($chefProfile['availability_info'])) {
                $chefProfile['availability_info'] = json_encode($chefProfile['availability_info']);
            }
            $profileData = $this->onlyExistingColumns('chef_profiles', array_merge(
                ['user_id' => $user->id],
                $chefProfile
            ));
            \App\Models\ChefProfile::updateOrCreate(['user_id' => $user->id], $profileData);
        }

        return $user->fresh(['roles', 'chefProfile', 'employerProfile']);
    }

    /**
     * Request OTP endpoint.
     */
    public function requestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|regex:/^[0-9+()\-\s]{7,20}$/',
            'country_code'   => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
            'extension'      => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
            'dial_code'      => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
            'phone_code'     => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
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

        $mobile = $this->normalizeMobileForLogin($request);
        $requestedRole = $request->role ?? $request->role_type ?? $request->login_role;
        $reviewAccount = $this->getReviewTestAccountForMobile($mobile);

        if ($reviewAccount) {
            $user = $this->ensureReviewTestAccount($mobile);

            return response()->json([
                'success' => true,
                'message' => 'OTP verified for app review test account. Use 000000.',
                'mobile' => $user->mobile_number,
                'static_otp' => self::REVIEW_TEST_OTP,
                'role' => $reviewAccount['role'],
                'is_review_test_account' => true,
            ]);
        }

        if ($requestedRole) {
            $existingRole = $this->checkRoleConflict($mobile, $requestedRole);
            if ($existingRole) {
                $displayExisting = $this->formatRoleDisplayName($existingRole);
                $displayRequested = $this->formatRoleDisplayName($requestedRole);
                return response()->json([
                    'success' => false,
                    'message' => "Account Role Conflict: Mobile number {$mobile} is already registered as '{$displayExisting}'. You cannot request OTP or log in as '{$displayRequested}'.",
                    'existing_role' => $displayExisting,
                    'requested_role' => $displayRequested,
                ], 400);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully. Use 123456 for testing.',
            'mobile' => $mobile,
        ]);
    }

    /**
     * Verify OTP endpoint.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number'     => 'required|string|regex:/^[0-9+()\-\s]{7,20}$/',
            'country_code'      => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
            'extension'         => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
            'dial_code'         => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
            'phone_code'        => 'nullable|string|regex:/^\+?[0-9]{1,4}$/',
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

        $mobile = $this->normalizeMobileForLogin($request);
        $reviewAccount = $this->getReviewTestAccountForMobile($mobile);

        if ($reviewAccount) {
            if ($request->otp !== self::REVIEW_TEST_OTP) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid OTP code provided.',
                ], 401);
            }
        } elseif ($request->otp !== '123456') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP code provided.',
            ], 401);
        }

        $requestedRole = $this->normalizeRole($request->role ?? $request->role_type ?? $request->login_role);

        // Fetch user
        $user = $reviewAccount ? $this->ensureReviewTestAccount($mobile) : $this->findUserByMobile($mobile);
        $isNewUser = false;

        if ($user) {
            // Check for Role Mismatch/Conflict on existing user
            $activeRole = $user->activeRole()->first();
            $existingRoleType = $activeRole ? $activeRole->role_type : ($user->roles()->first()?->role_type);
            $existingRoleType = $this->normalizeRole($existingRoleType);

            if (!$reviewAccount && $requestedRole && $existingRoleType && $existingRoleType !== $requestedRole) {
                $displayExisting = $this->formatRoleDisplayName($existingRoleType);
                $displayRequested = $this->formatRoleDisplayName($requestedRole);
                return response()->json([
                    'success' => false,
                    'message' => "Account Role Conflict: Mobile number {$mobile} is already registered as '{$displayExisting}'. You cannot log in or change role to '{$displayRequested}'.",
                    'existing_role' => $displayExisting,
                    'requested_role' => $displayRequested,
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
                'mobile_number' => $mobile,
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
        $targetRole = $reviewAccount['role'] ?? $requestedRole;
        $user->roles()->update(['is_active' => false]);
        $primaryRole = $targetRole ? $user->roles()->where('role_type', $targetRole)->first() : $user->roles()->first();
        if ($primaryRole) {
            $primaryRole->update(['is_active' => true]);
        } else {
            UserRole::create([
                'user_id' => $user->id,
                'role_type' => $targetRole ?? 'job_seeker',
                'is_active' => true,
            ]);
        }

        // Restrict multiple active logins for the same account:
        // Revoke all previous Sanctum tokens so any previous device login is automatically logged out
        $user->tokens()->delete();
        if (\Illuminate\Support\Facades\Schema::hasTable('user_device_tokens')) {
            try {
                \App\Models\UserDeviceToken::where('user_id', $user->id)->update(['is_active' => false]);
            } catch (\Throwable $e) {}
        }

        // Generate new single active Sanctum auth token
        $token = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token')->plainTextToken;

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
            'refreshToken' => $refreshToken,
            'refresh_token' => $refreshToken,
            'is_review_test_account' => (bool)$reviewAccount,
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

    private function formatRoleDisplayName(?string $role): string
    {
        if (!$role) return 'Talent';
        $r = strtolower(trim($role));
        if (in_array($r, ['employer', 'recruiter', 'hirer', 'hire_talent'])) {
            return 'Hire Talent';
        }
        if (in_array($r, ['chef', 'cook', 'job_seeker', 'jobseeker', 'talent', 'candidate'])) {
            return 'Talent';
        }
        if ($r === 'agency' || $r === 'referrer') {
            return 'Agency / Referrer';
        }
        return ucfirst(str_replace('_', ' ', $r));
    }

    private function checkRoleConflict(string $mobileNumber, string $requestedRole): ?string
    {
        $req = $this->normalizeRole($requestedRole);
        if (!$req) return null;

        $cleanMobile = preg_replace('/[^0-9]/', '', $mobileNumber);
        $last10 = strlen($cleanMobile) >= 10 ? substr($cleanMobile, -10) : $cleanMobile;

        $user = User::where('mobile_number', $mobileNumber)
            ->orWhere('mobile_number', $cleanMobile)
            ->orWhere('mobile_number', 'LIKE', '%' . $last10)
            ->first();

        if (!$user) {
            return null;
        }

        $existingRoles = [];
        if ($user->active_profile) {
            $existingRoles[] = $this->normalizeRole($user->active_profile);
        }
        if ($user->user_role) {
            $existingRoles[] = $this->normalizeRole($user->user_role);
        }

        $rolesFromDb = $user->roles()->pluck('role_type')->toArray();
        foreach ($rolesFromDb as $r) {
            if ($r) $existingRoles[] = $this->normalizeRole($r);
        }

        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('chef_profiles') && \Illuminate\Support\Facades\DB::table('chef_profiles')->where('user_id', $user->id)->exists()) {
                $existingRoles[] = 'chef';
            }
            if (\Illuminate\Support\Facades\Schema::hasTable('employer_profiles') && \Illuminate\Support\Facades\DB::table('employer_profiles')->where('user_id', $user->id)->exists()) {
                $existingRoles[] = 'employer';
            }
            if (\Illuminate\Support\Facades\Schema::hasTable('talent_profiles') && \Illuminate\Support\Facades\DB::table('talent_profiles')->where('user_id', $user->id)->exists()) {
                $existingRoles[] = 'job_seeker';
            }
            if (\Illuminate\Support\Facades\Schema::hasTable('job_seeker_profiles') && \Illuminate\Support\Facades\DB::table('job_seeker_profiles')->where('user_id', $user->id)->exists()) {
                $existingRoles[] = 'job_seeker';
            }
        } catch (\Throwable $th) {}

        $existingRoles = array_unique(array_filter($existingRoles));

        if (!empty($existingRoles) && !in_array($req, $existingRoles)) {
            return $existingRoles[0];
        }

        return null;
    }
}
