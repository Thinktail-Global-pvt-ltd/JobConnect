<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;

class ChefModeratorController extends Controller
{
    /**
     * Helper to auto-sync and fetch all chef records (combining user_roles & chef_profiles).
     */
    private function syncAndGetChefProfiles()
    {
        try {
            // 1. Get all user IDs from user_roles table where role_type = 'chef'
            $chefUserIds = UserRole::where('role_type', 'chef')->pluck('user_id')->toArray();

            // 2. Safely check if users table has active_profile column
            $userChefIds = [];
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'active_profile')) {
                $userChefIds = User::where('active_profile', 'chef')->pluck('id')->toArray();
            }

            $existingProfileIds = ChefProfile::pluck('user_id')->toArray();

            $allChefIds = array_values(array_unique(array_merge($chefUserIds, $userChefIds, $existingProfileIds)));

            if (!empty($allChefIds)) {
                $missingUserIds = array_diff($allChefIds, $existingProfileIds);
                foreach ($missingUserIds as $userId) {
                    if (User::where('id', $userId)->exists()) {
                        ChefProfile::create([
                            'user_id' => $userId,
                            'cuisine_specialty' => 'Multi-Cuisine',
                            'bio' => 'Professional Chef',
                            'approval_status' => 'approved',
                        ]);
                    }
                }

                // Only auto-approve newly created profiles (those with no status set)
                // Do NOT override existing 'pending' or 'rejected' statuses set by admin actions
                if (!empty($missingUserIds)) {
                    ChefProfile::whereIn('user_id', $missingUserIds)
                        ->whereNull('approval_status')
                        ->update(['approval_status' => 'approved']);
                }
            }

            return ChefProfile::with(['user.socials'])->latest()->get();
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('syncAndGetChefProfiles Error: ' . $e->getMessage());
            return ChefProfile::with(['user.socials'])->latest()->get();
        }
    }

    /**
     * List all chef profiles for Blade view.
     */
    public function index(Request $request)
    {
        return $this->apiIndex($request);
    }

    /**
     * Get JSON list of all onboarded chefs for API / React admin.
     */
    public function apiIndex(Request $request)
    {
        try {
            $authUser = request()->user();
            if (!$authUser && request()->bearerToken()) {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken(request()->bearerToken());
                if ($tokenObj) {
                    $authUser = $tokenObj->tokenable;
                }
            }

            $viewedChefUserIds = [];
            if ($authUser) {
                if (\Illuminate\Support\Facades\Schema::hasTable('chef_profile_views')) {
                    $views = \Illuminate\Support\Facades\DB::table('chef_profile_views')
                        ->where('employer_id', $authUser->id)
                        ->get();
                    $viewedChefUserIds = $views->pluck('chef_id')->filter()->map(fn($v) => (int)$v)->toArray();
                }

                if (\Illuminate\Support\Facades\Schema::hasTable('job_applications')) {
                    $appViewedUserIds = \Illuminate\Support\Facades\DB::table('job_applications')
                        ->where('employer_id', $authUser->id)
                        ->where(function($q) {
                            $q->where('is_viewed', true)->orWhere('status', 'viewed');
                        })
                        ->pluck('applicant_id')
                        ->filter()
                        ->map(fn($v) => (int)$v)
                        ->toArray();

                    $viewedChefUserIds = array_unique(array_merge($viewedChefUserIds, $appViewedUserIds));
                }
            }

            $profiles = $this->syncAndGetChefProfiles();

            $allChefs = $profiles->map(function ($chef) use ($viewedChefUserIds) {
                $user = $chef->user ?: User::with('socials')->find($chef->user_id);

                $chefUserId = (int)($chef ? $chef->user_id : 0);
                $chefProfileId = (int)($chef ? $chef->id : 0);
                $isViewed = in_array($chefUserId, $viewedChefUserIds) || in_array($chefProfileId, $viewedChefUserIds);

                $availability = [];
                if ($chef->availability_info) {
                    $availability = is_array($chef->availability_info)
                        ? $chef->availability_info
                        : (json_decode($chef->availability_info, true) ?: []);
                }

                $fullName = ($user && $user->full_name) ? $user->full_name : ('Chef #' . $chef->user_id);
                $email = $user ? ($user->email ?: null) : null;
                $mobile = $user ? ($user->mobile_number ?: null) : null;
                $gender = $user ? ($user->gender ?: null) : null;
                $city = $user ? ($user->city ?: null) : null;
                $country = $user ? ($user->country ?: null) : null;
                $preferredRole = $user ? ($user->preferred_role ?: null) : null;
                $currentEmployer = $user ? ($user->current_employer ?: null) : null;
                $exp = $user ? ($user->experience_range ?: $user->experience_years ?: null) : null;
                $photoPath = $user ? ($user->profile_photo_path ?: $user->profile_photo ?: null) : null;
                if (!$photoPath && $chef) {
                    $photoPath = $chef->profile_photo ?: $chef->profile_photo_path ?: $chef->avatar ?: $chef->photo_url ?: null;
                }
                $photoUrl = $photoPath;
                if (!empty($photoPath)) {
                    if (str_contains($photoPath, '178.16.138.159')) {
                        $sub = str_replace('http://178.16.138.159', '', $photoPath);
                        $sub = str_replace('https://178.16.138.159', '', $sub);
                        $photoUrl = url($sub);
                    } elseif (!str_starts_with($photoPath, 'http://') && !str_starts_with($photoPath, 'https://')) {
                        $photoUrl = url('/' . ltrim($photoPath, '/'));
                    }
                }

                $skills = [];
                if ($user) {
                    if (is_array($user->skills)) {
                        $skills = $user->skills;
                    } elseif (is_string($user->skills) && !empty($user->skills)) {
                        $skills = json_decode($user->skills, true) ?: array_values(array_filter(array_map('trim', explode(',', $user->skills))));
                    }
                }

                $availabilityStatus = $user ? ($user->availability_status ?: null) : null;
                $isAvailable = $user ? (bool)$user->is_available : true;
                $selectedLanguage = $user ? ($user->selected_language ?: null) : null;

                $socialsObj = $user ? $user->socials : null;
                $socialsData = $socialsObj ? [
                    'instagram' => $socialsObj->instagram ?: null,
                    'linkedin'  => $socialsObj->linkedin ?: null,
                    'facebook'  => $socialsObj->facebook ?: null,
                    'twitter'   => $socialsObj->twitter ?: null,
                    'youtube'   => $socialsObj->youtube ?: null,
                    'website'   => $socialsObj->website ?: null,
                ] : null;

                $ageVal = $user ? ($user->age ?: ($chef->age ?: ($availability['age'] ?? null))) : ($chef->age ?: ($availability['age'] ?? null));

                return [
                    'id' => $chef->id,
                    'user_id' => $chef->user_id,
                    'is_viewed' => (bool)$isViewed,
                    'viewed' => (bool)$isViewed,
                    'full_name' => $fullName,
                    'name' => $fullName,
                    'email' => $email,
                    'mobile_number' => $mobile,
                    'phone' => $mobile,
                    'gender' => $gender,
                    'age' => $ageVal,
                    'city' => $city,
                    'country' => $country,
                    'preferred_role' => $preferredRole,
                    'current_employer' => $currentEmployer,
                    'profile_photo_path' => $photoUrl,
                    'profile_photo' => $photoUrl,
                    'photo_url' => $photoUrl,
                    'avatar' => $photoUrl,
                    'avatar_url' => $photoUrl,
                    'experience_range' => $exp,
                    'experience' => $exp,
                    'cuisine_specialty' => $chef->cuisine_specialty ?: null,
                    'specialties' => $chef->cuisine_specialty ?: null,
                    'operational_expertise' => $chef->operational_experties ?: ($chef->operational_expertise ?: null),
                    'operational_experties' => $chef->operational_experties ?: ($chef->operational_expertise ?: null),
                    'regional_experience' => $user ? ($user->country ?: ($user->city ?: 'Both (Global & Domestic)')) : 'Both (Global & Domestic)',
                    'employment_preference' => $user ? ($user->preferred_role ?: 'Full-time / Permanent') : 'Full-time / Permanent',
                    'bio' => $chef->bio ?: null,
                    'calendly_link' => $chef->calendly_link ?: null,
                    'calendly' => !empty($chef->calendly_link),
                    'approval_status' => $chef->approval_status ?: 'pending',
                    'status' => $chef->approval_status ?: 'pending',
                    'availability_info' => $availability,
                    'availability_status' => $availabilityStatus ?: ($isAvailable ? 'Available' : 'Unavailable'),
                    'is_available' => $isAvailable,
                    'selected_language' => $selectedLanguage ?: 'English',
                    'languages' => $selectedLanguage ?: 'English',
                    'skills' => !empty($skills) ? $skills : null,
                    'socials' => $socialsData,
                    'created_at' => $user && $user->created_at ? $user->created_at->toIso8601String() : ($chef->created_at ? $chef->created_at->toIso8601String() : null),
                    'updated_at' => $chef->updated_at ? $chef->updated_at->toIso8601String() : null,
                ];
            });

            $chefList = $allChefs->values();
            $totalCount = $chefList->count();
            $approvedCount = $chefList->where('approval_status', 'approved')->count();
            $pendingCount = $chefList->where('approval_status', '!=', 'approved')->count();
            $calendlyCount = $chefList->filter(fn($c) => !empty($c['calendly_link']))->count();
            $calendlySync = $totalCount > 0 ? round(($calendlyCount / $totalCount) * 100) : 0;

            return response()->json([
                'success' => true,
                'status' => 'success',
                'total' => $totalCount,
                'total_all' => $totalCount,
                'total_chefs' => $totalCount,
                'total_applications' => $totalCount,
                'pending_count' => $pendingCount,
                'approved_count' => $approvedCount,
                'active_count' => $approvedCount,
                'published_count' => $approvedCount,
                'active_published_chefs' => $approvedCount,
                'stats' => [
                    'total' => $totalCount,
                    'pending' => $pendingCount,
                    'approved' => $approvedCount,
                    'active' => $approvedCount,
                    'published' => $approvedCount,
                    'calendly_sync' => $calendlySync
                ],
                'chefs' => $chefList,
                'profiles' => $chefList,
                'items' => $chefList,
                'data' => $chefList,
                'results' => $chefList,
            ], 200);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('apiIndex Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load chefs: ' . $e->getMessage(),
                'total' => 0,
                'chefs' => [],
                'data' => []
            ], 200);
        }
    }

    /**
     * Approve a chef profile.
     */
    public function approve($id, Request $request)
    {
        $chef = ChefProfile::where('id', $id)->orWhere('user_id', $id)->first();
        if (!$chef) {
            $chef = ChefProfile::create(['user_id' => $id, 'approval_status' => 'approved']);
        } else {
            $chef->update(['approval_status' => 'approved']);
        }

        if ($chef->user_id) {
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'approval_status')) {
                User::where('id', $chef->user_id)->update(['approval_status' => 'approved']);
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_approved')) {
                User::where('id', $chef->user_id)->update(['is_approved' => true]);
            }
        }

        // Shoot FCM Push Notification to Chef safely
        try {
            if ($chef && $chef->user_id) {
                \App\Services\NotificationTriggerService::sendToUser(
                    $chef->user_id,
                    "Chef Profile Approved! 🎉",
                    "Congratulations! Your Chef profile has been approved by admin. Employers can now view & book you on Jobrito!"
                );
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('FCM Approval Notification Error: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Chef approved and published successfully.']);
    }

    /**
     * Unpublish a chef profile (reverts approval_status to pending).
     */
    public function unpublish($id, Request $request)
    {
        $chef = ChefProfile::where('id', $id)->orWhere('user_id', $id)->first();
        if (!$chef) {
            $chef = ChefProfile::create(['user_id' => $id, 'approval_status' => 'rejected']);
        } else {
            $chef->update(['approval_status' => 'rejected']);
        }

        if ($chef->user_id) {
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'approval_status')) {
                User::where('id', $chef->user_id)->update(['approval_status' => 'rejected']);
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_approved')) {
                User::where('id', $chef->user_id)->update(['is_approved' => false]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Chef unpublished/rejected successfully.']);
    }

    /**
     * Reject a chef profile.
     */
    public function reject($id, Request $request)
    {
        $chef = ChefProfile::where('id', $id)->orWhere('user_id', $id)->first();
        if (!$chef) {
            $chef = ChefProfile::create(['user_id' => $id, 'approval_status' => 'rejected']);
        } else {
            $chef->update(['approval_status' => 'rejected']);
        }

        if ($chef->user_id) {
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'approval_status')) {
                User::where('id', $chef->user_id)->update(['approval_status' => 'rejected']);
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_approved')) {
                User::where('id', $chef->user_id)->update(['is_approved' => false]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Chef rejected successfully.']);
    }

    /**
     * Schedule an appointment between a chef and an employer.
     */
    public function scheduleAppointment(Request $request)
    {
        $validated = $request->validate([
            'chef_id' => 'required|exists:users,id',
            'employer_id' => 'required|exists:users,id',
            'meeting_date' => 'required|string',
            'meeting_time' => 'required|string',
            'purpose' => 'nullable|string|max:1000',
        ]);

        \App\Models\Appointment::create([
            'chef_id' => $validated['chef_id'],
            'employer_id' => $validated['employer_id'],
            'meeting_date' => $validated['meeting_date'],
            'meeting_time' => $validated['meeting_time'],
            'purpose' => $validated['purpose'] ?? 'Coordinated by Administrator',
            'status' => 'confirmed',
        ]);

        return redirect()->back()->with('success', "Appointment scheduled successfully.");
    }

    /**
     * Store/Onboard a new chef profile (Handles modal & API requests).
     */
    public function store(Request $request)
    {
        try {
            $fullName = $request->input('full_name') ?? $request->input('name') ?? $request->input('chef_name') ?? 'Chef';
            $city = $request->input('city') ?? 'India';
            $expRange = $request->input('experience_range') ?? $request->input('experience') ?? '1-3 Years';
            $cuisine = $request->input('cuisine_specialty') ?? $request->input('cuisine_specialties') ?? $request->input('specialties') ?? $request->input('cuisine') ?? 'Multi-Cuisine';
            $mobile = $request->input('mobile_number') ?? $request->input('mobile') ?? $request->input('phone') ?? ('9' . rand(100000000, 999999999));
            $email = $request->input('email') ?: ('chef.' . time() . rand(100, 999) . '@hospitality.com');
            $preferredRole = $request->input('preferred_role') ?? $request->input('role') ?? 'Executive Chef';
            $bio = $request->input('bio') ?? $request->input('summary') ?? 'Professional Chef';
            $calendly = $request->input('calendly_link') ?? $request->input('calendly') ?? '';

            // Find existing user by email or mobile, or create new user
            $user = User::where('email', $email)
                ->orWhere('mobile_number', $mobile)
                ->first();

            if (!$user) {
                $user = User::create([
                    'email' => $email,
                    'full_name' => $fullName,
                    'mobile_number' => $mobile,
                    'city' => $city,
                    'experience_range' => $expRange,
                    'preferred_role' => $preferredRole,
                    'is_available' => true,
                    'availability_status' => 'Available',
                    'skills' => is_array($request->skills) ? $request->skills : array_filter(array_map('trim', explode(',', $request->skills ?? ''))),
                ]);
            } else {
                $user->update([
                    'full_name' => $fullName,
                    'city' => $city,
                    'experience_range' => $expRange,
                    'preferred_role' => $preferredRole,
                    'is_available' => true,
                    'availability_status' => 'Available',
                ]);
            }

            UserRole::updateOrCreate(
                ['user_id' => $user->id, 'role_type' => 'chef'],
                ['is_active' => true]
            );

            $profile = ChefProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'cuisine_specialty' => $cuisine,
                    'bio' => $bio,
                    'calendly_link' => $calendly,
                    'availability_info' => json_encode([
                        'languages' => is_array($request->languages) ? $request->languages : array_filter(array_map('trim', explode(',', $request->languages ?? 'English,Hindi'))),
                        'regional_experience' => ['Pan-India'],
                        'location_preference' => $request->input('location_preference', 'Both'),
                        'employment_preference' => ['Permanent'],
                        'availability_status' => 'Available',
                        'is_available' => true,
                    ]),
                    'approval_status' => 'approved',
                ]
            );

            if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Chef profile onboarded and published successfully!',
                    'chef' => [
                        'id' => $profile->id,
                        'user_id' => $user->id,
                        'full_name' => $user->full_name,
                        'name' => $user->full_name,
                        'email' => $user->email,
                        'mobile_number' => $user->mobile_number,
                        'city' => $user->city,
                        'experience_range' => $user->experience_range,
                        'experience' => $user->experience_range,
                        'cuisine_specialty' => $profile->cuisine_specialty,
                        'specialties' => $profile->cuisine_specialty,
                        'bio' => $profile->bio,
                        'calendly_link' => $profile->calendly_link,
                        'approval_status' => 'approved',
                        'status' => 'approved',
                    ]
                ], 200);
            }

            return redirect('/admin/chefs')->with('success', "Chef {$user->full_name} onboarded and published successfully!");
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ChefModeratorController store Error: ' . $e->getMessage());
            if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
                return response()->json(['success' => false, 'message' => 'Error onboarding chef: ' . $e->getMessage()], 500);
            }
            return redirect()->back()->withErrors(['error' => 'Error onboarding chef: ' . $e->getMessage()]);
        }
    }
}
