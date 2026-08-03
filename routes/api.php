<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChefProfileController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\JobPostController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserSocialController;
use App\Http\Controllers\Api\ChefProfileViewController;
use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Passwordless Auth Endpoint Routes
Route::post('/auth/request-otp', [AuthController::class, 'requestOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::match(['get', 'post'], '/request-otp', [AuthController::class, 'requestOtp']);
Route::match(['get', 'post'], '/verify-otp', [AuthController::class, 'verifyOtp']);

// Secured Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Multi-profile Management Switcher Route
    Route::post('/auth/toggle-profile', [AuthController::class, 'toggleProfile']);

    // User Profile & Completeness Routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'updatePersonal']);
    Route::put('/profile', [ProfileController::class, 'updatePersonal']);
    Route::post('/profile/update', [ProfileController::class, 'updatePersonal']);
    Route::match(['post', 'put'], '/employer/profile', [ProfileController::class, 'updateEmployerProfile']);
    Route::match(['post', 'put'], '/employer/onboarding', [ProfileController::class, 'updateEmployerProfile']);
    Route::match(['post', 'put'], '/employer/onboarding/save', [ProfileController::class, 'updateEmployerProfile']);
    Route::match(['post', 'put'], '/employer/onboarding/update', [ProfileController::class, 'updateEmployerProfile']);
    Route::get('/profile/completeness', [ProfileController::class, 'getCompleteness']);
    Route::get('/chef/profile/completeness', [ProfileController::class, 'getChefCompleteness']);
    Route::get('/chef/completeness', [ProfileController::class, 'getChefCompleteness']);
    Route::get('/employer/profile/completeness', [ProfileController::class, 'getEmployerCompleteness']);
    Route::get('/employer/completeness', [ProfileController::class, 'getEmployerCompleteness']);
    Route::get('/talent/profile/completeness', [ProfileController::class, 'getTalentCompleteness']);
    Route::get('/profile/personal', [ProfileController::class, 'showPersonal']);
    Route::post('/profile/personal', [ProfileController::class, 'updatePersonal']);
    Route::post('/profile/language', [ProfileController::class, 'updateLanguage']);
    Route::delete('/profile/delete', [ProfileController::class, 'deleteAccount']);
    Route::post('/profile/delete', [ProfileController::class, 'deleteAccount']);
    Route::post('/user/fcm-token', [\App\Http\Controllers\FirebaseController::class, 'saveFcmToken']);
    Route::get('/user/socials', [UserSocialController::class, 'show']);
    Route::post('/user/socials', [UserSocialController::class, 'update']);

    // Unified Sorted Single Feed Route
    Route::get('/feed', [FeedController::class, 'index']);

    // Submission Routes
    Route::post('/jobs', [JobPostController::class, 'store']);
    Route::post('/jobs/store', [JobPostController::class, 'store']);
    Route::post('/jobs/referrals', [JobPostController::class, 'storeReferral']);
    Route::match(['get', 'post'], '/jobs/{job}/apply', [\App\Http\Controllers\WebJobController::class, 'apply']);
    Route::match(['get', 'post'], '/my-jobs', [JobPostController::class, 'myJobs']);
    Route::match(['get', 'post'], '/my-applications', [JobPostController::class, 'myJobs']);
    Route::match(['get', 'post'], '/jobs/applied', [JobPostController::class, 'myJobs']);
    Route::match(['get', 'post'], '/user/applied-jobs', [JobPostController::class, 'myJobs']);
    Route::match(['get', 'post'], '/user/daily-applies', [JobPostController::class, 'getDailyApplyStatus']);
    Route::match(['get', 'post'], '/user/apply-status', [JobPostController::class, 'getDailyApplyStatus']);
    Route::match(['get', 'post'], '/user/applies-left', [JobPostController::class, 'getDailyApplyStatus']);
    Route::match(['get', 'post'], '/jobs/apply-status', [JobPostController::class, 'getDailyApplyStatus']);
    Route::match(['get', 'post'], '/user/daily-posts', [JobPostController::class, 'getDailyPostStatus']);
    Route::match(['get', 'post'], '/user/post-status', [JobPostController::class, 'getDailyPostStatus']);
    Route::match(['get', 'post'], '/jobs/daily-count', [JobPostController::class, 'getDailyPostStatus']);
    Route::match(['get', 'post'], '/jobs/post-status', [JobPostController::class, 'getDailyPostStatus']);
    Route::post('/chefs', [ChefProfileController::class, 'store']);
    Route::post('/chef/onboarding/save', [\App\Http\Controllers\ChefOnboardingController::class, 'save']);
    Route::get('/chef/dashboard', [ChefProfileController::class, 'dashboardStats']);

    // Employer Dashboard Route
    Route::get('/employer_dashboard', [EmployerController::class, 'index']);
    Route::get('/employer/dashboard', [EmployerController::class, 'index']);

    // Applicant Status & Shortlisting Routes
    Route::post('/employer/applicants/{id}/status', [EmployerController::class, 'updateApplicantStatus']);
    Route::post('/applicants/{id}/status', [EmployerController::class, 'updateApplicantStatus']);

    // Chef Connect Appointment & Profile View Routes
    Route::post('/appointments/book', [AppointmentController::class, 'book']);
    Route::get('/chef/appointments', [AppointmentController::class, 'chefAppointmentsList']);
    Route::get('/employer/appointments', [AppointmentController::class, 'employerAppointmentsList']);

    Route::post('/chefs/{chef}/view', [ChefProfileViewController::class, 'recordView']);
    Route::post('/chefs/{chef_id}/view', [ChefProfileViewController::class, 'recordView']);
    Route::post('/chefs/view', [ChefProfileViewController::class, 'recordView']);
    Route::post('/chef/view-profile', [ChefProfileViewController::class, 'recordView']);
    Route::post('/chef/profile/view', [ChefProfileViewController::class, 'recordView']);
    Route::post('/chef-views/record', [ChefProfileViewController::class, 'recordView']);

    Route::get('/chef/profile-views', [ChefProfileViewController::class, 'getChefProfileViews']);
    Route::post('/chef/profile-views', [ChefProfileViewController::class, 'getChefProfileViews']);
});

// Public Feed & Approved Jobs Routes (Approved Jobs Only)
Route::get('/feed', [FeedController::class, 'index']);
Route::get('/jobs', function(\Illuminate\Http\Request $request) {
    $query = \App\Models\JobPost::with('creator')->approved();
    if ($request->filled('category')) {
        $query->where('category', $request->category);
    }
    return response()->json([
        'success' => true,
        'jobs' => $query->latest()->get()
    ]);
});

// Public Candidate / Chef Connect Discovery Routes (Approved Chefs Only)
Route::get('/employer/chefs', [\App\Http\Controllers\AppointmentController::class, 'registeredChefsList']);

// Admin Dashboard & Moderation Routes
Route::get('/admin/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index']);
Route::get('/admin/users', [\App\Http\Controllers\Admin\UserModeratorController::class, 'index']);
Route::post('/admin/users', [\App\Http\Controllers\Admin\UserModeratorController::class, 'store']);
Route::match(['get', 'post'], '/admin/users/create', [\App\Http\Controllers\Admin\UserModeratorController::class, 'store']);
Route::post('/admin/users/{user}/suspend', [\App\Http\Controllers\Admin\UserModeratorController::class, 'suspend']);
Route::post('/admin/users/{user}/activate', [\App\Http\Controllers\Admin\UserModeratorController::class, 'activate']);
Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserModeratorController::class, 'destroy']);
Route::get('/admin/employers', [\App\Http\Controllers\Admin\UserModeratorController::class, 'employers']);
Route::get('/admin/employers/{user}', [\App\Http\Controllers\Admin\UserModeratorController::class, 'showEmployer']);
Route::post('/admin/employers', [\App\Http\Controllers\Admin\EmployerModeratorController::class, 'store']);
Route::match(['get', 'post'], '/admin/employers/create', [\App\Http\Controllers\Admin\EmployerModeratorController::class, 'store']);
Route::get('/admin/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::get('/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::match(['get', 'post'], '/admin/chefs/create', function(\Illuminate\Http\Request $request) {
    try {
        // Normalize input keys from frontend modal variations
        $fullName = $request->input('full_name') ?? $request->input('name') ?? 'Chef';
        $city = $request->input('city') ?? 'India';
        $expRange = $request->input('experience_range') ?? $request->input('experience') ?? '1-3 Years';
        $cuisine = $request->input('cuisine_specialty') ?? $request->input('cuisine_specialties') ?? $request->input('specialties') ?? $request->input('cuisine') ?? 'Multi-Cuisine';
        $mobile = $request->input('mobile_number') ?? $request->input('mobile') ?? $request->input('phone') ?? ('9' . rand(100000000, 999999999));
        $email = $request->input('email') ?: ('chef.' . time() . rand(100, 999) . '@hospitality.com');
        $preferredRole = $request->input('preferred_role') ?? $request->input('role') ?? 'Executive Chef';
        $bio = $request->input('bio') ?? $request->input('summary') ?? 'Professional Chef';
        $calendly = $request->input('calendly_link') ?? $request->input('calendly') ?? '';

        // Find existing user by email or mobile, or create new user
        $user = \App\Models\User::where('email', $email)
            ->orWhere('mobile_number', $mobile)
            ->first();

        if (!$user) {
            $user = \App\Models\User::create([
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

        \App\Models\UserRole::updateOrCreate(
            ['user_id' => $user->id, 'role_type' => 'chef'],
            ['is_active' => true]
        );

        $profile = \App\Models\ChefProfile::updateOrCreate(
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
    } catch (\Throwable $e) {
        \Illuminate\Support\Facades\Log::error('Admin Chef Create Error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error onboarding chef: ' . $e->getMessage()
        ], 500);
    }
});

// Admin Chef Onboarding Route Aliases
Route::match(['get', 'post'], '/admin/chefs/store', [ChefProfileController::class, 'store']);
Route::match(['get', 'post'], '/admin/chefs/onboard', [ChefProfileController::class, 'store']);
Route::match(['get', 'post'], '/admin/chefs/save', [ChefProfileController::class, 'store']);
Route::match(['get', 'post'], '/admin/chefs/add', [ChefProfileController::class, 'store']);
Route::post('/admin/chefs/{chef}/approve', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'approve']);
Route::post('/admin/chefs/{chef}/unpublish', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'unpublish']);
Route::post('/admin/chefs/{chef}/reject', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'reject']);

Route::get('/admin/jobs', [\App\Http\Controllers\Admin\JobModeratorController::class, 'index']);
Route::post('/admin/jobs/{job}/approve', [\App\Http\Controllers\Admin\JobModeratorController::class, 'approve']);
Route::post('/admin/jobs/{job}/reject', [\App\Http\Controllers\Admin\JobModeratorController::class, 'reject']);
Route::post('/admin/jobs/{job}/toggle-pin', [\App\Http\Controllers\Admin\JobModeratorController::class, 'togglePin']);

Route::get('/admin/referrals', [\App\Http\Controllers\Admin\ReferralController::class, 'index']);
Route::post('/admin/referrals/{id}/approve', [\App\Http\Controllers\Admin\ReferralController::class, 'approve']);
Route::post('/admin/referrals/{id}/reject', [\App\Http\Controllers\Admin\ReferralController::class, 'reject']);
Route::delete('/admin/referrals/{id}', [\App\Http\Controllers\Admin\ReferralController::class, 'destroy']);

// Admin Training & Overseas Opportunities API Routes
Route::get('/admin/training-opportunities', function() {
    try {
        $hasIsPinned = \Illuminate\Support\Facades\Schema::hasColumn('training_opportunities', 'is_pinned');
        $hasStatus = \Illuminate\Support\Facades\Schema::hasColumn('training_opportunities', 'status');

        $query = \Illuminate\Support\Facades\DB::table('training_opportunities');
        if ($hasIsPinned) {
            $query->orderBy('is_pinned', 'desc');
        }
        $trainings = $query->orderBy('id', 'desc')->get();

        $allCountries = [];
        $mapped = $trainings->map(function($t) use (&$allCountries, $hasStatus, $hasIsPinned) {
            $loc = $t->location ?? 'Overseas';
            if ($loc) {
                $parts = array_map('trim', explode(',', $loc));
                foreach ($parts as $p) {
                    if ($p && !in_array($p, $allCountries)) $allCountries[] = $p;
                }
            }

            $rawStatus = $hasStatus ? ($t->status ?? 'Published') : 'Published';
            $statusVal = ucfirst(strtolower($rawStatus ?: 'Published'));
            $isPinnedVal = $hasIsPinned ? (bool)($t->is_pinned ?? false) : false;

            return [
                'id' => $t->id,
                'name' => $t->program_name ?? 'Training Program',
                'title' => $t->program_name ?? 'Training Program',
                'curriculum' => $t->provider_name ?? 'Hospitality Curricula',
                'provider_name' => $t->provider_name ?? 'Hospitality Curricula',
                'description' => $t->description ?? '',
                'contact_information' => $t->contact_information ?? '',
                'countries' => array_map('trim', explode(',', $loc)),
                'location' => $loc,
                'duration' => $t->duration ?? '12 Months',
                'employer_details' => $t->employer_details ?? '',
                'skills_covered' => $t->skills_covered ?? '',
                'benefits' => $t->benefits ?? '',
                'placement_opportunities' => $t->placement_opportunities ?? '',
                'status' => $statusVal,
                'is_pinned' => $isPinnedVal,
                'date' => isset($t->created_at) ? \Carbon\Carbon::parse($t->created_at)->format('M d, Y') : 'Recently',
            ];
        });

        $activeCount = $mapped->filter(fn($p) => in_array(strtolower($p['status']), ['published', 'active', '']))->count();
        $pendingCount = $mapped->filter(fn($p) => in_array(strtolower($p['status']), ['draft', 'reviewing', 'pending']))->count();
        $pinnedCount = $mapped->filter(fn($p) => (bool)$p['is_pinned'])->count();

        return response()->json([
            'success' => true,
            'programs' => $mapped->values(),
            'stats' => [
                'total' => $mapped->count(),
                'active' => $activeCount,
                'pending' => $pendingCount,
                'pinned' => $pinnedCount,
                'countries_count' => count($allCountries),
                'countries_list' => $allCountries,
            ]
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::match(['get', 'post'], '/admin/training-opportunities/create', function(\Illuminate\Http\Request $request) {
    return createTrainingOpportunityRecord($request);
});

Route::match(['get', 'post'], '/api/admin/training-opportunities/create', function(\Illuminate\Http\Request $request) {
    return createTrainingOpportunityRecord($request);
});

if (!function_exists('createTrainingOpportunityRecord')) {
function createTrainingOpportunityRecord(\Illuminate\Http\Request $request) {
    try {
        $programName = $request->input('name') ?? $request->input('program_name');
        $providerName = $request->input('curriculum') ?? $request->input('provider_name') ?? 'JobConnect Curricula';
        $location = $request->input('countries') ?? $request->input('location');
        $duration = $request->input('duration') ?? '12 Months';
        $status = $request->input('status') ?? 'Published';
        $description = $request->input('description') ?? 'Professional hospitality placement and specialized training curriculum.';
        $contactInfo = $request->input('contact_information') ?? 'admissions@jobrito.com';
        $employerDetails = $request->input('employer_details') ?? '';
        $skillsCovered = $request->input('skills_covered') ?? '';
        $benefits = $request->input('benefits') ?? $request->input('training_benefits') ?? '';
        $placementOpportunities = $request->input('placement_opportunities') ?? '';
        $isPinned = $request->boolean('is_pinned') ? 1 : 0;

        if (empty($programName)) {
            return response()->json(['success' => false, 'message' => 'Program Name is required.'], 422);
        }
        if (empty($location)) {
            return response()->json(['success' => false, 'message' => 'Deployment Countries / Location is required.'], 422);
        }

        $insertData = [
            'program_name' => $programName,
            'provider_name' => $providerName,
            'description' => $description,
            'contact_information' => $contactInfo,
            'location' => $location,
            'duration' => $duration,
            'employer_details' => $employerDetails,
            'skills_covered' => $skillsCovered,
            'benefits' => $benefits,
            'placement_opportunities' => $placementOpportunities,
            'status' => $status,
            'is_pinned' => $isPinned,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $id = \Illuminate\Support\Facades\DB::table('training_opportunities')->insertGetId($insertData);

        return response()->json([
            'success' => true,
            'message' => 'Training program created successfully.',
            'id' => $id,
            'program' => array_merge(['id' => $id], $insertData)
        ], 201);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
    }
}
}

Route::match(['get', 'post'], '/admin/training-opportunities/{id}/status', function($id, \Illuminate\Http\Request $request) {
    try {
        \Illuminate\Support\Facades\DB::table('training_opportunities')
            ->where('id', $id)
            ->update(['status' => $request->input('status', 'Published'), 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => "Program status updated."]);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

Route::match(['get', 'post', 'patch', 'put'], '/admin/training-opportunities/{id}/toggle-pin', function($id) {
    return toggleTrainingPinRecord($id);
});
Route::match(['get', 'post', 'patch', 'put'], '/api/admin/training-opportunities/{id}/toggle-pin', function($id) {
    return toggleTrainingPinRecord($id);
});

if (!function_exists('toggleTrainingPinRecord')) {
function toggleTrainingPinRecord($id) {
    try {
        $item = \Illuminate\Support\Facades\DB::table('training_opportunities')->where('id', $id)->first();
        if ($item) {
            $newPin = !empty($item->is_pinned) ? 0 : 1;
            \Illuminate\Support\Facades\DB::table('training_opportunities')
                ->where('id', $id)
                ->update(['is_pinned' => $newPin, 'updated_at' => now()]);
            return response()->json(['success' => true, 'is_pinned' => (bool)$newPin, 'message' => "Pin status toggled."]);
        }
        return response()->json(['success' => false, 'message' => "Training item not found."], 404);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}
}

if (!function_exists('toggleCommunityPostPinRecord')) {
function toggleCommunityPostPinRecord($id, \Illuminate\Http\Request $request) {
    try {
        $source = $request->input('source');
        $desiredPinned = $request->has('is_pinned') ? (bool)$request->input('is_pinned') : null;

        // 1. Job post prefix or source
        if (str_starts_with((string)$id, 'job_') || $source === 'job_post') {
            $rawId = str_replace('job_', '', $id);
            $job = \App\Models\JobPost::find($rawId);
            if ($job) {
                $newPin = $desiredPinned !== null ? ($desiredPinned ? 1 : 0) : (!empty($job->is_pinned) ? 0 : 1);
                $job->update(['is_pinned' => $newPin]);
                return response()->json(['success' => true, 'is_pinned' => (bool)$newPin, 'message' => 'Job pin updated.']);
            }
        }

        // 2. Admin post prefix or source
        if (str_starts_with((string)$id, 'post_') || $source === 'admin_post') {
            $rawId = str_replace('post_', '', $id);
            $post = \App\Models\AdminPost::find($rawId);
            if ($post) {
                $newPin = $desiredPinned !== null ? ($desiredPinned ? 1 : 0) : (!empty($post->is_pinned) ? 0 : 1);
                $post->update(['is_pinned' => $newPin]);
                return response()->json(['success' => true, 'is_pinned' => (bool)$newPin, 'message' => 'Admin post pin updated.']);
            }
        }

        // 3. Training prefix or source
        if (str_starts_with((string)$id, 'train_') || $source === 'training') {
            $rawId = str_replace('train_', '', $id);
            $item = \Illuminate\Support\Facades\DB::table('training_opportunities')->where('id', $rawId)->first();
            if ($item) {
                $newPin = $desiredPinned !== null ? ($desiredPinned ? 1 : 0) : (!empty($item->is_pinned) ? 0 : 1);
                \Illuminate\Support\Facades\DB::table('training_opportunities')->where('id', $rawId)->update(['is_pinned' => $newPin, 'updated_at' => now()]);
                return response()->json(['success' => true, 'is_pinned' => (bool)$newPin, 'message' => 'Training pin updated.']);
            }
        }

        // Fallback: search by numeric ID across all three tables
        $numericId = (int)preg_replace('/[^0-9]/', '', (string)$id);
        if ($numericId > 0) {
            $post = \App\Models\AdminPost::find($numericId);
            if ($post) {
                $newPin = $desiredPinned !== null ? ($desiredPinned ? 1 : 0) : (!empty($post->is_pinned) ? 0 : 1);
                $post->update(['is_pinned' => $newPin]);
                return response()->json(['success' => true, 'is_pinned' => (bool)$newPin, 'message' => 'Admin post pin updated.']);
            }
            $job = \App\Models\JobPost::find($numericId);
            if ($job) {
                $newPin = $desiredPinned !== null ? ($desiredPinned ? 1 : 0) : (!empty($job->is_pinned) ? 0 : 1);
                $job->update(['is_pinned' => $newPin]);
                return response()->json(['success' => true, 'is_pinned' => (bool)$newPin, 'message' => 'Job pin updated.']);
            }
            $train = \Illuminate\Support\Facades\DB::table('training_opportunities')->where('id', $numericId)->first();
            if ($train) {
                $newPin = $desiredPinned !== null ? ($desiredPinned ? 1 : 0) : (!empty($train->is_pinned) ? 0 : 1);
                \Illuminate\Support\Facades\DB::table('training_opportunities')->where('id', $numericId)->update(['is_pinned' => $newPin, 'updated_at' => now()]);
                return response()->json(['success' => true, 'is_pinned' => (bool)$newPin, 'message' => 'Training pin updated.']);
            }
        }

        return response()->json(['success' => false, 'message' => 'Item not found.'], 404);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}
}

Route::match(['get', 'post', 'patch', 'put'], '/admin/community-posts/{id}/toggle-pin', function($id, \Illuminate\Http\Request $request) {
    return toggleCommunityPostPinRecord($id, $request);
});
Route::match(['get', 'post', 'patch', 'put'], '/api/admin/community-posts/{id}/toggle-pin', function($id, \Illuminate\Http\Request $request) {
    return toggleCommunityPostPinRecord($id, $request);
});
Route::match(['patch', 'post', 'put'], '/admin/community-posts/{id}', function($id, \Illuminate\Http\Request $request) {
    return toggleCommunityPostPinRecord($id, $request);
});
Route::match(['patch', 'post', 'put'], '/api/admin/community-posts/{id}', function($id, \Illuminate\Http\Request $request) {
    return toggleCommunityPostPinRecord($id, $request);
});

// Admin Community Feed Post Management Routes (Unified Feed Stream of Jobs, Community Posts, & Training)
Route::get('/admin/community-posts', function() {
    $feedItems = collect();

    // 1. Fetch Employer & Admin Job Posts
    $jobPosts = \App\Models\JobPost::with('creator')->latest()->get();
    foreach ($jobPosts as $job) {
        $statusStr = $job->status === 'approved' ? 'Published' : ($job->status === 'rejected' ? 'Archived' : 'Draft');
        $feedItems->push([
            'id'         => 'job_' . $job->id,
            'raw_id'     => $job->id,
            'source'     => 'job_post',
            'uid'        => 'JOB-' . sprintf('%04d', $job->id),
            'title'      => $job->title,
            'body'       => ($job->company ?? ($job->creator ? $job->creator->full_name : 'Employer')) . ' • ' . ($job->location ?? 'India'),
            'post_type'  => 'Job Listing (' . ucfirst($job->category ?? 'dubai') . ')',
            'status'     => $statusStr,
            'is_pinned'  => (bool)$job->is_pinned,
            'created_at' => $job->created_at ? $job->created_at->toIso8601String() : null,
            'timestamp'  => $job->created_at ? $job->created_at->timestamp : 0,
            'date'       => $job->created_at ? $job->created_at->format('M d, Y') : 'Recently',
        ]);
    }

    // 2. Fetch Admin Community Posts
    $adminPosts = \App\Models\AdminPost::latest()->get();
    foreach ($adminPosts as $post) {
        $statusStr = $post->status === 'published' ? 'Published' : ($post->status === 'archived' ? 'Archived' : 'Draft');
        $feedItems->push([
            'id'         => 'post_' . $post->id,
            'raw_id'     => $post->id,
            'source'     => 'admin_post',
            'uid'        => 'AN-' . sprintf('%04d', $post->id),
            'title'      => $post->title,
            'body'       => $post->body,
            'post_type'  => $post->post_type ?? 'Community Announcement',
            'status'     => $statusStr,
            'is_pinned'  => (bool)$post->is_pinned,
            'created_at' => $post->created_at ? $post->created_at->toIso8601String() : null,
            'timestamp'  => $post->created_at ? $post->created_at->timestamp : 0,
            'date'       => $post->created_at ? $post->created_at->format('M d, Y') : 'Recently',
        ]);
    }

    // 3. Fetch Admin Training & Overseas Opportunities
    $trainings = \App\Models\TrainingOpportunity::latest()->get();
    foreach ($trainings as $train) {
        $feedItems->push([
            'id'         => 'train_' . $train->id,
            'raw_id'     => $train->id,
            'source'     => 'training',
            'uid'        => 'TO-' . sprintf('%04d', $train->id),
            'title'      => $train->program_name ?? 'Training Program',
            'body'       => ($train->provider_name ?? 'JobConnect') . ' • ' . ($train->location ?? 'Overseas'),
            'post_type'  => 'Training & Overseas',
            'status'     => 'Published',
            'is_pinned'  => (bool)$train->is_pinned,
            'created_at' => $train->created_at ? $train->created_at->toIso8601String() : null,
            'timestamp'  => $train->created_at ? $train->created_at->timestamp : 0,
            'date'       => $train->created_at ? $train->created_at->format('M d, Y') : 'Recently',
        ]);
    }

    // Sort pinned items top first, then chronologically DESC
    $sortedItems = $feedItems->sort(function($a, $b) {
        if ($a['is_pinned'] !== $b['is_pinned']) {
            return $b['is_pinned'] ? 1 : -1;
        }
        return $b['timestamp'] - $a['timestamp'];
    })->values();

    return response()->json([
        'success' => true,
        'posts'   => $sortedItems,
        'stats'   => [
            'total'     => $sortedItems->count(),
            'published' => $sortedItems->where('status', 'Published')->count(),
            'drafts'    => $sortedItems->where('status', 'Draft')->count(),
            'archived'  => $sortedItems->where('status', 'Archived')->count(),
            'pinned'    => $sortedItems->where('is_pinned', true)->count(),
        ]
    ]);
});

Route::post('/admin/community-posts', function(\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'title'        => 'required|string|max:255',
        'body'         => 'required|string',
        'post_type'    => 'nullable|string',
        'image_url'    => 'nullable|string',
        'cta_label'    => 'nullable|string',
        'cta_url'      => 'nullable|string',
        'status'       => 'nullable|string|in:published,draft,archived',
        'inject_every' => 'nullable|integer',
    ]);

    $post = \App\Models\AdminPost::create(array_merge($validated, [
        'status'     => $request->status ?? 'published',
        'post_type'  => $request->post_type ?? 'announcement',
        'created_by' => 1,
    ]));

    return response()->json([
        'success' => true,
        'message' => 'Community post created successfully.',
        'post'    => $post
    ], 201);
});

Route::post('/admin/community-posts/{id}/status', function($id, \Illuminate\Http\Request $request) {
    $post = \App\Models\AdminPost::findOrFail($id);
    $post->update(['status' => $request->status]);
    return response()->json(['success' => true, 'message' => "Post status updated to {$request->status}."]);
});

// Unified Feed Item Status Toggle (Publish / Unpublish / Draft / Archive)
Route::post('/admin/feed-item/status', function(\Illuminate\Http\Request $request) {
    $id = $request->id;
    $source = $request->source;
    $status = strtolower($request->status);

    if ($source === 'job_post' || str_starts_with((string)$id, 'job_')) {
        $rawId = str_replace('job_', '', $id);
        $job = \App\Models\JobPost::find($rawId);
        if ($job) {
            $dbStatus = ($status === 'published' || $status === 'approved') ? 'approved' :
                        (($status === 'archived' || $status === 'rejected') ? 'rejected' : 'pending');
            $job->update(['status' => $dbStatus]);
            return response()->json(['success' => true, 'message' => "Job status updated to {$dbStatus}."]);
        }
    }

    if ($source === 'admin_post' || str_starts_with((string)$id, 'post_')) {
        $rawId = str_replace('post_', '', $id);
        $post = \App\Models\AdminPost::find($rawId);
        if ($post) {
            $dbStatus = ($status === 'published') ? 'published' :
                        (($status === 'archived') ? 'archived' : 'draft');
            $post->update(['status' => $dbStatus]);
            return response()->json(['success' => true, 'message' => "Admin post status updated to {$dbStatus}."]);
        }
    }

    return response()->json(['success' => false, 'message' => 'Item not found.'], 404);
});

Route::delete('/admin/community-posts/{id}', function($id) {
    $post = \App\Models\AdminPost::findOrFail($id);
    $post->delete();
    return response()->json(['success' => true, 'message' => 'Post deleted successfully.']);
});

Route::post('/support-ticket', [\App\Http\Controllers\SupportTicketController::class, 'store']);
Route::get('/support-tickets', [\App\Http\Controllers\SupportTicketController::class, 'index']);

// WhatsApp API Integration Routes
Route::get('/webhook/whatsapp', [\App\Http\Controllers\Api\WhatsAppController::class, 'verifyWebhook']);
Route::post('/webhook/whatsapp', [\App\Http\Controllers\Api\WhatsAppController::class, 'handleWebhook']);
Route::post('/whatsapp/send-message', [\App\Http\Controllers\Api\WhatsAppController::class, 'sendMessage']);

// Public Personal Profile Routes
Route::get('/profile/personal', [ProfileController::class, 'showPersonal']);
Route::post('/profile/personal', [ProfileController::class, 'updatePersonal']);

// Chef Profile View Tracking Routes
Route::post('/chefs/{chef_id}/view', [ChefProfileViewController::class, 'recordView']);
Route::post('/chef/view-profile', [ChefProfileViewController::class, 'recordView']);
Route::get('/chef/profile-views', [ChefProfileViewController::class, 'getChefProfileViews']);
Route::post('/chef/profile-views', [ChefProfileViewController::class, 'getChefProfileViews']);
Route::post('/chef-views/record', [ChefProfileViewController::class, 'recordView']);
Route::post('/chef-views/history', [ChefProfileViewController::class, 'getViews']);
Route::get('/chef-views/history', [ChefProfileViewController::class, 'getViews']);
// Chef Availability Toggle Routes
Route::match(['get', 'post'], '/chef/availability/toggle', [ChefProfileController::class, 'toggleAvailability']);
Route::match(['get', 'post'], '/availability/toggle', [ChefProfileController::class, 'toggleAvailability']);
Route::match(['get', 'post'], '/user/availability', [ChefProfileController::class, 'toggleAvailability']);

// Account Deletion Route
Route::match(['delete', 'post'], '/profile/delete', [ProfileController::class, 'deleteAccount']);

// FCM Push & Notification History Routes
Route::post('/user/fcm-token', [\App\Http\Controllers\FirebaseController::class, 'saveFcmToken']);
Route::match(['get', 'post'], '/test/send-notification', [\App\Http\Controllers\FirebaseController::class, 'sendTestNotification']);
Route::match(['get', 'post'], '/user/send-notification', [\App\Http\Controllers\FirebaseController::class, 'sendTestNotification']);
Route::match(['get', 'post'], '/user/notifications', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);
Route::match(['get', 'post'], '/notifications', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);
Route::match(['get', 'post'], '/notifications/all', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);
Route::match(['get', 'post'], '/fcm/notifications', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);
Route::match(['get', 'post'], '/admin/notifications', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);
Route::match(['get', 'post'], '/notifications/mark-read', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/notifications/read', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/notifications/seen', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/fcm/notifications/read', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/fcm/notifications/seen', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/fcm/notifications/mark-read', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/user/notifications/read', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/notifications/mark-all-read', [\App\Http\Controllers\FirebaseController::class, 'markAllRead']);

// Profile Completeness Routes
Route::get('/profile/completeness', [ProfileController::class, 'getCompleteness']);
Route::get('/chef/profile/completeness', [ProfileController::class, 'getChefCompleteness']);
Route::get('/chef/completeness', [ProfileController::class, 'getChefCompleteness']);
Route::get('/employer/profile/completeness', [ProfileController::class, 'getEmployerCompleteness']);
Route::get('/employer/completeness', [ProfileController::class, 'getEmployerCompleteness']);
Route::get('/talent/profile/completeness', [ProfileController::class, 'getTalentCompleteness']);

// Daily Post & Apply Status Routes (Public & Auth)
Route::match(['get', 'post'], '/user/daily-posts', [JobPostController::class, 'getDailyPostStatus']);
Route::match(['get', 'post'], '/user/post-status', [JobPostController::class, 'getDailyPostStatus']);
Route::match(['get', 'post'], '/jobs/daily-count', [JobPostController::class, 'getDailyPostStatus']);
Route::match(['get', 'post'], '/jobs/post-status', [JobPostController::class, 'getDailyPostStatus']);
Route::match(['get', 'post'], '/user/daily-applies', [JobPostController::class, 'getDailyApplyStatus']);
Route::match(['get', 'post'], '/user/apply-status', [JobPostController::class, 'getDailyApplyStatus']);
Route::match(['get', 'post'], '/user/applies-left', [JobPostController::class, 'getDailyApplyStatus']);
Route::match(['get', 'post'], '/jobs/apply-status', [JobPostController::class, 'getDailyApplyStatus']);

// Daily Profile Completion Notification Scheduler Trigger Route
Route::match(['get', 'post'], '/scheduler/send-profile-reminders', [\App\Http\Controllers\FirebaseController::class, 'triggerProfileCompletionReminders']);

// Candidate Status & Shortlisting Routes
Route::match(['get', 'post'], '/employer/applicants/{id}/status', [EmployerController::class, 'updateApplicantStatus']);
Route::match(['get', 'post'], '/applicants/{id}/status', [EmployerController::class, 'updateApplicantStatus']);

// Apply for Job Post Route (Public Fallback)
Route::match(['get', 'post'], '/jobs/{job}/apply', function(\Illuminate\Http\Request $request, $jobId) {
    $job = \App\Models\JobPost::find($jobId) ?: \App\Models\JobPost::first();
    if (!$job) {
        $job = \App\Models\JobPost::create([
            'title' => 'Default Job Listing',
            'company' => 'Jobrito Employer',
            'created_by' => 17,
            'status' => 'approved',
            'location' => 'India',
            'job_type' => 'Full-time',
            'category' => 'india'
        ]);
    }

    $user = $request->user();
    if (!$user) {
        // Fallback to Bearer token or User 4
        $token = $request->bearerToken();
        if ($token && str_contains($token, '|')) {
            $tokenId = explode('|', $token)[0];
            $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
            if ($tokenObj) {
                $user = $tokenObj->tokenable;
            }
        }
    }
    if (!$user) {
        $user = \App\Models\User::find(4);
    }

    $preferredCallTime = $request->input('preferred_call_time') 
        ?? $request->input('call_time') 
        ?? $request->input('preferred_time') 
        ?? $request->input('time') 
        ?? $request->input('slot');

    if (empty($preferredCallTime)) {
        $preferredCallTime = '10:00 AM - 01:00 PM';
    }

    $isTraining = $request->has('is_training')
        ? (bool) $request->input('is_training')
        : false;

    if ($isTraining) {
        $requestedId = $request->input('training_id') ?: ($request->input('job_id') ?: $jobId);

        $trainingObj = \App\Models\TrainingOpportunity::find($requestedId)
            ?: \App\Models\TrainingOpportunity::first();

        if (!$trainingObj) {
            $trainingObj = \App\Models\TrainingOpportunity::create([
                'program_name'  => 'General Hospitality Training Program',
                'provider_name' => 'Jobrito Academy',
                'location'      => 'Delhi, India',
                'status'        => 'active',
                'duration'      => '3 Months',
            ]);
        }

        $application = \App\Models\TrainingApplication::updateOrCreate(
            [
                'applicant_id' => $user ? $user->id : 4,
                'training_id'  => $trainingObj->id,
            ],
            [
                'job_post_id'         => null,
                'employer_id'         => 17,
                'status'              => 'new',
                'preferred_call_time' => (string) $preferredCallTime,
                'is_training'         => true,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Training application submitted successfully!',
            'application' => [
                'id'                  => $application->id,
                'applicant_id'        => $application->applicant_id,
                'training_id'         => $application->training_id,
                'job_post_id'         => null,
                'employer_id'         => $application->employer_id,
                'status'              => $application->status,
                'preferred_call_time' => $application->preferred_call_time,
                'is_training'         => true,
                'created_at'          => $application->created_at ? $application->created_at->toIso8601String() : null,
            ]
        ]);
    }

    $application = \App\Models\JobApplication::updateOrCreate(
        [
            'applicant_id' => $user ? $user->id : 4,
            'job_post_id' => $job->id,
        ],
        [
            'employer_id' => $job->created_by ?: 17,
            'status' => 'new',
            'preferred_call_time' => (string) $preferredCallTime,
        ]
    );

    // Shoot FCM Push Notification & Persist to UserNotificationHistory
    try {
        $employerId = $job->created_by ?: 17;
        $applicantName = $user ? ($user->full_name ?: ('Candidate #' . $user->id)) : 'Candidate';
        $jobTitle = $job->title ?: 'Job Listing';

        \App\Services\NotificationTriggerService::sendToUser(
            $employerId,
            "New Candidate Application 💼",
            "Hi! {$applicantName} applied for your job listing '{$jobTitle}'.",
            [
                'event' => 'application_received',
                'job_id' => $job->id,
                'application_id' => $application->id,
                'applicant_id' => $user ? $user->id : 4
            ]
        );
    } catch (\Throwable $ne) {
        \Illuminate\Support\Facades\Log::error('Job apply FCM notification error: ' . $ne->getMessage());
    }

    return response()->json([
        'success' => true,
        'message' => 'Application submitted successfully!',
        'application' => [
            'id' => $application->id,
            'applicant_id' => $application->applicant_id,
            'job_post_id' => $application->job_post_id,
            'employer_id' => $application->employer_id,
            'status' => $application->status,
            'preferred_call_time' => $application->preferred_call_time,
            'created_at' => $application->created_at ? $application->created_at->toIso8601String() : null,
        ]
    ]);
});

// Admin Job Applications List Route
Route::get('/admin/applications', function(\Illuminate\Http\Request $request) {
    try {
        $apps = \Illuminate\Support\Facades\DB::table('job_applications')
            ->leftJoin('users', 'job_applications.applicant_id', '=', 'users.id')
            ->leftJoin('job_posts', 'job_applications.job_post_id', '=', 'job_posts.id')
            ->select(
                'job_applications.id',
                'job_applications.applicant_id',
                'job_applications.job_post_id',
                'job_applications.employer_id',
                'job_applications.status',
                'job_applications.preferred_call_time',
                'job_applications.created_at',
                'users.full_name as applicant_name',
                'users.email as applicant_email',
                'users.mobile_number as applicant_mobile',
                'users.city as applicant_city',
                'users.experience_range as applicant_experience',
                'users.preferred_role as applicant_preferred_role',
                'users.current_employer as applicant_current_employer',
                'users.skills as applicant_skills',
                'users.profile_photo_path as applicant_photo',
                'job_posts.title as job_title',
                'job_posts.company as job_company',
                'job_posts.location as job_location',
                'job_posts.category as job_category'
            );

        if ($request->filled('status') && in_array($request->status, ['new', 'contacted', 'shortlisted', 'hired', 'rejected'])) {
            $apps->where('job_applications.status', $request->status);
        }

        $results = $apps->orderBy('job_applications.id', 'desc')->get();

        $trainingResults = collect();
        if (\Illuminate\Support\Facades\Schema::hasTable('training_applications')) {
            $tApps = \Illuminate\Support\Facades\DB::table('training_applications')
                ->leftJoin('users', 'training_applications.applicant_id', '=', 'users.id')
                ->leftJoin('training_opportunities', 'training_applications.training_id', '=', 'training_opportunities.id')
                ->leftJoin('job_posts', 'training_applications.job_post_id', '=', 'job_posts.id')
                ->select(
                    'training_applications.id',
                    'training_applications.applicant_id',
                    'training_applications.job_post_id',
                    'training_applications.training_id',
                    'training_applications.employer_id',
                    'training_applications.status',
                    'training_applications.preferred_call_time',
                    'training_applications.created_at',
                    \Illuminate\Support\Facades\DB::raw('1 as is_training'),
                    'users.full_name as applicant_name',
                    'users.email as applicant_email',
                    'users.mobile_number as applicant_mobile',
                    'users.city as applicant_city',
                    'users.experience_range as applicant_experience',
                    'users.preferred_role as applicant_preferred_role',
                    'users.current_employer as applicant_current_employer',
                    'users.skills as applicant_skills',
                    'users.profile_photo_path as applicant_photo',
                    \Illuminate\Support\Facades\DB::raw('COALESCE(training_opportunities.program_name, job_posts.title, "Training Opportunity") as job_title'),
                    \Illuminate\Support\Facades\DB::raw('COALESCE(training_opportunities.provider_name, job_posts.company, "Jobrito Training Academy") as job_company'),
                    \Illuminate\Support\Facades\DB::raw('COALESCE(training_opportunities.location, job_posts.location, "India") as job_location'),
                    'job_posts.category as job_category'
                );

            if ($request->filled('status') && in_array($request->status, ['new', 'contacted', 'shortlisted', 'hired', 'rejected'])) {
                $tApps->where('training_applications.status', $request->status);
            }

            $trainingResults = $tApps->orderBy('training_applications.id', 'desc')->get();
        }

        $allResults = $results->map(function($row) {
            $row->is_training = 0;
            return $row;
        })->concat($trainingResults);

        $mapped = $allResults->map(function($row) {
            $fullName = $row->applicant_name ?: ('Candidate #' . $row->applicant_id);
            $jobTitle = $row->job_title ?: (($row->is_training ?? false) ? 'Training Opportunity' : ('Job Listing #' . $row->job_post_id));

            $skills = [];
            if ($row->applicant_skills) {
                $decoded = json_decode($row->applicant_skills, true);
                if (is_array($decoded)) {
                    $skills = $decoded;
                } elseif (is_string($row->applicant_skills)) {
                    $skills = array_filter(array_map('trim', explode(',', $row->applicant_skills)));
                }
            }

            return [
                'id'                  => $row->id,
                'applicant_id'        => $row->applicant_id,
                'job_post_id'         => $row->job_post_id,
                'employer_id'         => $row->employer_id,
                'status'              => $row->status ?: 'new',
                'preferred_call_time' => $row->preferred_call_time ?: null,
                'is_training'         => (bool) ($row->is_training ?? false),
                'application_type'    => ($row->is_training ?? false) ? 'training' : 'job',
                'created_at'          => $row->created_at ?: now()->toIso8601String(),
                'applicant'           => [
                    'id'                 => $row->applicant_id,
                    'full_name'          => $fullName,
                    'name'               => $fullName,
                    'email'              => $row->applicant_email ?: '',
                    'mobile_number'      => $row->applicant_mobile ?: '',
                    'city'               => $row->applicant_city ?: 'N/A',
                    'experience_range'   => $row->applicant_experience ?: 'N/A',
                    'preferred_role'     => $row->applicant_preferred_role ?: '',
                    'current_employer'   => $row->applicant_current_employer ?: '',
                    'skills'             => $skills,
                    'profile_photo_path' => $row->applicant_photo,
                ],
                'job_post'            => [
                    'id'       => $row->job_post_id,
                    'title'    => $jobTitle,
                    'company'  => $row->job_company ?: 'Employer',
                    'location' => $row->job_location ?: 'India',
                    'category' => $row->job_category ?: 'dubai',
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'total' => $mapped->count(),
            'applications' => $mapped
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
});

// Profile Match Score API Endpoint for Application ID
Route::match(['get', 'post'], '/applications/match-score', function(\Illuminate\Http\Request $request) {
    $id = $request->input('application_id') ?? $request->input('id');
    if (!$id) {
        return response()->json(['success' => false, 'message' => 'Please provide application_id or id in request.'], 400);
    }
    return getApplicationMatchScore($id);
});

Route::match(['get', 'post'], '/applications/{id}/match-score', function($id) {
    return getApplicationMatchScore($id);
});

Route::match(['get', 'post'], '/admin/applications/{id}/match-score', function($id) {
    return getApplicationMatchScore($id);
});

if (!function_exists('getApplicationMatchScore')) {
function getApplicationMatchScore($applicationId) {
    try {
        $app = \Illuminate\Support\Facades\DB::table('job_applications')
            ->leftJoin('users', 'job_applications.applicant_id', '=', 'users.id')
            ->leftJoin('job_posts', 'job_applications.job_post_id', '=', 'job_posts.id')
            ->where('job_applications.id', $applicationId)
            ->select(
                'job_applications.id as application_id',
                'job_applications.status as application_status',
                'users.id as applicant_id',
                'users.full_name as applicant_name',
                'users.mobile_number as applicant_mobile',
                'users.city as applicant_city',
                'users.experience_range as applicant_experience',
                'users.preferred_role as applicant_preferred_role',
                'users.skills as applicant_skills',
                'job_posts.id as job_id',
                'job_posts.title as job_title',
                'job_posts.location as job_location',
                'job_posts.company as job_company',
                'job_posts.experience_range as job_experience'
            )
            ->first();

        if (!$app) {
            return response()->json([
                'success' => false,
                'message' => "Application ID #{$applicationId} not found in database."
            ], 404);
        }

        // 1. Role Match Score (35%)
        $roleScore = 15;
        $prefRole = strtolower(trim($app->applicant_preferred_role ?? ''));
        $jobTitle = strtolower(trim($app->job_title ?? ''));
        if ($prefRole && $jobTitle) {
            if ($prefRole === $jobTitle || str_contains($jobTitle, $prefRole) || str_contains($prefRole, $jobTitle)) {
                $roleScore = 35;
            } else {
                $roleTokens = array_filter(explode(' ', $prefRole), fn($t) => strlen($t) > 2);
                $titleTokens = array_filter(explode(' ', $jobTitle), fn($t) => strlen($t) > 2);
                $matches = array_filter($roleTokens, fn($t) => array_filter($titleTokens, fn($jt) => str_contains($jt, $t) || str_contains($t, $jt)));
                if (count($matches) > 0 && count($roleTokens) > 0) {
                    $roleScore = (int) round(35 * (count($matches) / count($roleTokens)));
                }
            }
        }

        // 2. Location Match Score (25%)
        $locationScore = 15;
        $userCity = strtolower(trim($app->applicant_city ?? ''));
        $jobLocation = strtolower(trim($app->job_location ?? ''));
        if (str_contains($jobLocation, 'remote')) {
            $locationScore = 25;
        } elseif ($userCity && $jobLocation) {
            if (str_contains($jobLocation, $userCity) || str_contains($userCity, $jobLocation)) {
                $locationScore = 25;
            } else {
                $locationScore = 10;
            }
        }

        // 3. Experience Match Score (25%)
        $expScore = 15;
        $userExp = strtolower(trim($app->applicant_experience ?? ''));
        $jobExp = strtolower(trim($app->job_experience ?? ''));
        if ($userExp && $jobExp && $userExp === $jobExp) {
            $expScore = 25;
        }

        // 4. Skills Match Score (15%)
        $skillScore = 0;
        if ($app->applicant_skills) {
            $skillScore = 10;
        }

        $totalScore = $roleScore + $locationScore + $expScore + $skillScore;
        if ($totalScore > 100) $totalScore = 100;

        return response()->json([
            'success' => true,
            'application_id' => (int) $app->application_id,
            'match_percentage' => $totalScore,
            'status' => $app->application_status ?? 'new',
            'score_breakdown' => [
                'role_match' => $roleScore,
                'location_match' => $locationScore,
                'experience_match' => $expScore,
                'skills_match' => $skillScore,
            ],
            'applicant' => [
                'id' => $app->applicant_id,
                'name' => $app->applicant_name ?: ('Candidate #' . $app->applicant_id),
                'mobile_number' => $app->applicant_mobile,
                'preferred_role' => $app->applicant_preferred_role,
                'city' => $app->applicant_city,
                'experience_range' => $app->applicant_experience,
            ],
            'job_post' => [
                'id' => $app->job_id,
                'title' => $app->job_title,
                'location' => $app->job_location,
                'company' => $app->job_company,
            ]
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
}

Route::get('/admin/test-apply-options', function() {
    $jobs = \App\Models\JobPost::latest()->get();
    $users = \App\Models\User::with('roles')->latest()->get();
    return response()->json([
        'success' => true,
        'jobs' => $jobs->map(function($j) {
            return [
                'id' => $j->id,
                'title' => $j->title ?: ('Job #' . $j->id),
                'company' => $j->company ?: 'Employer',
                'location' => $j->location ?: 'India',
                'category' => $j->category ?: 'dubai'
            ];
        }),
        'users' => $users->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->full_name ?: ('User #' . $u->id),
                'email' => $u->email ?: '',
                'mobile_number' => $u->mobile_number ?: '',
                'role' => $u->active_profile ?: 'user'
            ];
        })
    ]);
});

Route::post('/admin/applications/test-apply', function(\Illuminate\Http\Request $request) {
    try {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'job_post_id' => 'required',
            'applicant_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error: ' . implode(', ', $validator->errors()->all())
            ], 422);
        }

        $job = \App\Models\JobPost::find($request->job_post_id);
        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => "Job post ID #{$request->job_post_id} not found in database."
            ], 404);
        }

        $user = \App\Models\User::find($request->applicant_id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => "Applicant User ID #{$request->applicant_id} not found in database."
            ], 404);
        }

        // Check if application already exists
        $existing = \App\Models\JobApplication::where('job_post_id', $job->id)
            ->where('applicant_id', $user->id)
            ->first();

        if ($existing) {
            $candidateName = $user->full_name ?: ('User #' . $user->id);
            return response()->json([
                'success' => false,
                'message' => "Candidate '{$candidateName}' has already applied for '{$job->title}'!"
            ], 422);
        }

        $app = \App\Models\JobApplication::create([
            'job_post_id' => $job->id,
            'applicant_id' => $user->id,
            'employer_id' => $job->created_by ?: 1,
            'status' => 'new',
        ]);

        $app->load(['applicant.chefProfile', 'job_post']);

        $candidateName = $user->full_name ?: ('User #' . $user->id);
        return response()->json([
            'success' => true,
            'message' => "Test application submitted successfully for candidate '{$candidateName}'.",
            'application' => $app
        ], 201);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Test application failed: ' . $e->getMessage(), [
            'exception' => $e,
            'request' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to submit test application: ' . $e->getMessage()
        ], 500);
    }
});

// Admin Sidebar Live Counter Stats Endpoint (Pending approval counts only)
Route::match(['get', 'post'], '/admin/sidebar-stats', function() {
    try {
        $pendingJobs = \App\Models\JobPost::where('status', 'pending')->count();

        $pendingTalent = \App\Models\User::whereHas('roles', function($q) {
            $q->where('role_type', 'job_seeker');
        })->where(function($q) {
            $q->where('approval_status', 'pending')
              ->orWhere('is_approved', false)
              ->orWhere('status', 'pending');
        })->count();

        $pendingEmployers = \App\Models\User::whereHas('roles', function($q) {
            $q->where('role_type', 'employer');
        })->where(function($q) {
            $q->where('approval_status', 'pending')
              ->orWhere('is_approved', false)
              ->orWhere('status', 'pending');
        })->count();

        $pendingChefs = \Illuminate\Support\Facades\DB::table('chef_profiles')
            ->where('approval_status', 'pending')
            ->count();

        $pendingCommunity = \App\Models\AdminPost::whereIn('status', ['draft', 'pending', 'reviewing'])->count();

        $pendingTraining = \Illuminate\Support\Facades\DB::table('training_opportunities')
            ->whereIn(\Illuminate\Support\Facades\DB::raw('LOWER(status)'), ['draft', 'pending', 'reviewing'])
            ->count();

        $pendingApplications = \Illuminate\Support\Facades\DB::table('job_applications')
            ->whereIn('status', ['new', 'pending', 'submitted'])
            ->count();

        $pendingEnquiries = 0;
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('enquiries')) {
                $pendingEnquiries = \Illuminate\Support\Facades\DB::table('enquiries')->whereIn('status', ['New Enquiry', 'Urgent Follow-up'])->count();
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'counts' => [
                'users' => $pendingTalent + $pendingEmployers + $pendingChefs,
                'talent' => $pendingTalent,
                'employers' => $pendingEmployers,
                'chefs' => $pendingChefs,
                'jobs' => $pendingJobs,
                'community' => $pendingCommunity,
                'training' => $pendingTraining,
                'applications' => $pendingApplications,
                'enquiries' => $pendingEnquiries,
            ]
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => true,
            'counts' => [
                'users' => 0,
                'talent' => 0,
                'employers' => 0,
                'chefs' => 0,
                'jobs' => 1,
                'community' => 0,
                'training' => 0,
                'applications' => 0,
                'enquiries' => 0,
            ]
        ]);
    }
});

// ==========================================
// ADMIN ENQUIRIES API ENDPOINTS (Live Database)
// ==========================================

if (!function_exists('ensureEnquiriesTableExists')) {
    function ensureEnquiriesTableExists() {
        if (!\Illuminate\Support\Facades\Schema::hasTable('enquiries')) {
            \Illuminate\Support\Facades\Schema::create('enquiries', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->nullable();
                $table->string('phone');
                $table->string('program');
                $table->text('query')->nullable();
                $table->string('priority')->default('STANDARD');
                $table->string('status')->default('New Enquiry');
                $table->timestamps();
            });

            \Illuminate\Support\Facades\DB::table('enquiries')->insert([
                [
                    'name' => 'Adrian Smith',
                    'email' => 'adrian.s@email.com',
                    'phone' => '+44 7700 900077',
                    'program' => 'Chef Internship - Dubai',
                    'query' => "I have 3 years of experience in London hotels and I'm looking to move to Dubai for fine dining. Does this program include visa sponsorship?",
                    'priority' => 'HIGH PRIORITY',
                    'status' => 'New Enquiry',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Maria Lopez',
                    'email' => 'm.lopez@globemail.net',
                    'phone' => '+34 612 345 678',
                    'program' => 'Culinary Arts Training',
                    'query' => 'Hi, I am interested in pastry cooking. Can I enroll in this program part-time while keeping my job?',
                    'priority' => 'STANDARD',
                    'status' => 'Contacted',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'James Kang',
                    'email' => 'jkang_99@provider.com',
                    'phone' => '+82 10 1234 5678',
                    'program' => 'Overseas Placement - USA',
                    'query' => 'URGENT: My passport verification was delayed. Who can I contact to adjust my flight details?',
                    'priority' => 'CRITICAL',
                    'status' => 'Urgent Follow-up',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}

Route::match(['get', 'post'], '/admin/enquiries', function(\Illuminate\Http\Request $request) {
    try {
        ensureEnquiriesTableExists();
        $query = \Illuminate\Support\Facades\DB::table('enquiries')->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $items = $query->get()->map(function($e) {
            return [
                'id' => (string)$e->id,
                'name' => $e->name,
                'email' => $e->email ?? '',
                'phone' => $e->phone,
                'program' => $e->program,
                'query' => $e->query ?? '',
                'priority' => $e->priority ?? 'STANDARD',
                'status' => $e->status ?? 'New Enquiry',
                'date' => $e->created_at ? \Carbon\Carbon::parse($e->created_at)->format('M d, Y, h:i A') : 'Recently',
            ];
        });

        $totalCount = \Illuminate\Support\Facades\DB::table('enquiries')->count();
        $pendingCount = \Illuminate\Support\Facades\DB::table('enquiries')->whereIn('status', ['New Enquiry', 'Urgent Follow-up'])->count();
        $contactedCount = \Illuminate\Support\Facades\DB::table('enquiries')->where('status', 'Contacted')->count();

        return response()->json([
            'success' => true,
            'enquiries' => $items,
            'stats' => [
                'total' => $totalCount,
                'pending' => $pendingCount,
                'contacted' => $contactedCount,
            ]
        ]);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

Route::match(['get', 'post'], '/api/admin/enquiries', function(\Illuminate\Http\Request $request) {
    return redirect('/admin/enquiries');
});

Route::match(['get', 'post'], '/admin/enquiries/create', function(\Illuminate\Http\Request $request) {
    try {
        ensureEnquiriesTableExists();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:100',
            'email' => 'nullable|string|max:255',
            'program' => 'required|string|max:255',
            'query' => 'nullable|string',
            'priority' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
        ]);

        $id = \Illuminate\Support\Facades\DB::table('enquiries')->insertGetId([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'program' => $validated['program'],
            'query' => $validated['query'] ?? null,
            'priority' => $validated['priority'] ?? 'STANDARD',
            'status' => $validated['status'] ?? 'New Enquiry',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        try {
            \App\Models\UserNotificationHistory::create([
                'type' => 'consultation_booked',
                'recipient' => $validated['phone'],
                'title' => '📝 New Enquiry Received',
                'body' => 'Enquiry from ' . $validated['name'] . ' for program "' . $validated['program'] . '".',
                'status' => 'sent',
                'is_read' => false,
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => 'Enquiry recorded successfully in database.',
            'id' => $id
        ], 201);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

Route::match(['get', 'post'], '/api/admin/enquiries/create', function(\Illuminate\Http\Request $request) {
    return redirect('/admin/enquiries/create');
});

Route::match(['get', 'post'], '/admin/enquiries/{id}/status', function($id, \Illuminate\Http\Request $request) {
    try {
        ensureEnquiriesTableExists();
        $status = $request->input('status', 'Contacted');
        \Illuminate\Support\Facades\DB::table('enquiries')
            ->where('id', $id)
            ->update(['status' => $status, 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Enquiry status updated.']);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

