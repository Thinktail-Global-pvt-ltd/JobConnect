<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChefProfileController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\JobPostController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserSocialController;
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
    Route::put('/profile', [ProfileController::class, 'update']);
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
    Route::get('/my-jobs', [JobPostController::class, 'myJobs']);
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
Route::post('/admin/users/{user}/suspend', [\App\Http\Controllers\Admin\UserModeratorController::class, 'suspend']);
Route::post('/admin/users/{user}/activate', [\App\Http\Controllers\Admin\UserModeratorController::class, 'activate']);
Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserModeratorController::class, 'destroy']);
Route::get('/admin/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::get('/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::post('/admin/chefs/create', function(\Illuminate\Http\Request $request) {
    try {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'experience_range' => 'required|string|max:255',
            'cuisine_specialty' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error: ' . implode(', ', $validator->errors()->all()),
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email ?: ('chef.' . time() . rand(100, 999) . '@hospitality.com');
        $mobile = $request->mobile_number ?: ('9' . rand(100000000, 999999999));

        // Find or create user, avoiding duplicate key exception on mobile or email
        $user = \App\Models\User::where('email', $email)->orWhere('mobile_number', $mobile)->first();

        if (!$user) {
            $user = \App\Models\User::create([
                'email' => $email,
                'full_name' => $request->full_name,
                'mobile_number' => $mobile,
                'city' => $request->city,
                'experience_range' => $request->experience_range,
                'preferred_role' => $request->preferred_role ?? 'Executive Chef',
                'skills' => is_array($request->skills) ? $request->skills : array_filter(array_map('trim', explode(',', $request->skills ?? ''))),
            ]);
        } else {
            $user->update([
                'full_name' => $request->full_name,
                'city' => $request->city,
                'experience_range' => $request->experience_range,
                'preferred_role' => $request->preferred_role ?? 'Executive Chef',
            ]);
        }

        \App\Models\UserRole::updateOrCreate(
            ['user_id' => $user->id, 'role_type' => 'chef'],
            ['is_active' => true]
        );

        $profile = \App\Models\ChefProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'cuisine_specialty' => $request->cuisine_specialty,
                'bio' => $request->bio,
                'calendly_link' => $request->calendly_link,
                'availability_info' => json_encode([
                    'languages' => is_array($request->languages) ? $request->languages : explode(',', $request->languages ?? 'English,Hindi'),
                    'regional_experience' => is_array($request->regional_experience) ? $request->regional_experience : ['Pan-India'],
                    'location_preference' => $request->location_preference ?? 'Both',
                    'employment_preference' => is_array($request->employment_preference) ? $request->employment_preference : ['Permanent'],
                    'availability_status' => $request->availability ?? 'Full-time',
                ]),
                'approval_status' => $request->approval_status ?? 'approved',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Chef profile created successfully!',
            'chef' => [
                'id' => $profile->id,
                'user_id' => $user->id,
                'full_name' => $user->full_name,
                'name' => $user->full_name,
                'email' => $user->email,
                'mobile_number' => $user->mobile_number,
                'city' => $user->city,
                'experience_range' => $user->experience_range,
                'cuisine_specialty' => $profile->cuisine_specialty,
                'specialties' => $profile->cuisine_specialty,
                'bio' => $profile->bio,
                'calendly_link' => $profile->calendly_link,
                'approval_status' => $profile->approval_status,
                'status' => $profile->approval_status,
            ]
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error onboarding chef: ' . $e->getMessage()
        ], 500);
    }
});
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
    $trainings = \App\Models\TrainingOpportunity::orderByDesc('is_pinned')->latest()->get();
    
    if ($trainings->isEmpty()) {
        $initials = [
            ['program_name' => 'Advanced Culinary Arts - London', 'provider_name' => 'Michelin Prep', 'location' => 'UK, Ireland', 'duration' => '12 Months', 'status' => 'Published', 'is_pinned' => true, 'created_at' => now()],
            ['program_name' => 'Hospitality Leadership - Dubai', 'provider_name' => 'Operations Mgmt', 'location' => 'UAE, Qatar', 'duration' => '24 Months', 'status' => 'Active', 'is_pinned' => false, 'created_at' => now()->subDays(2)],
            ['program_name' => 'Luxury Resort Management', 'provider_name' => 'Guest Experience', 'location' => 'Maldives, Seychelles', 'duration' => '18 Months', 'status' => 'Draft', 'is_pinned' => false, 'created_at' => now()->subDays(5)],
            ['program_name' => 'Sommelier Certification', 'provider_name' => 'Wine Science', 'location' => 'France, Italy', 'duration' => '6 Months', 'status' => 'Reviewing', 'is_pinned' => false, 'created_at' => now()->subDays(10)],
        ];
        foreach ($initials as $init) {
            \App\Models\TrainingOpportunity::create($init);
        }
        $trainings = \App\Models\TrainingOpportunity::orderByDesc('is_pinned')->latest()->get();
    }

    $allCountries = [];
    foreach ($trainings as $t) {
        if ($t->location) {
            $parts = array_map('trim', explode(',', $t->location));
            foreach ($parts as $p) {
                if ($p && !in_array($p, $allCountries)) $allCountries[] = $p;
            }
        }
    }

    return response()->json([
        'success' => true,
        'programs' => $trainings->map(function($t) {
            return [
                'id' => $t->id,
                'name' => $t->program_name,
                'curriculum' => $t->provider_name ?? 'Hospitality Curricula',
                'countries' => array_map('trim', explode(',', $t->location ?? 'Overseas')),
                'duration' => $t->duration ?? '12 Months',
                'status' => ucfirst($t->status ?? 'Published'),
                'is_pinned' => (bool)$t->is_pinned,
                'date' => $t->created_at ? $t->created_at->format('M d, Y') : 'Recently',
            ];
        }),
        'stats' => [
            'total' => $trainings->count(),
            'active' => $trainings->filter(fn($t) => in_array(strtolower($t->status), ['published', 'active']))->count(),
            'pending' => $trainings->filter(fn($t) => in_array(strtolower($t->status), ['draft', 'reviewing', 'pending']))->count(),
            'pinned' => $trainings->filter(fn($t) => (bool)$t->is_pinned)->count(),
            'countries_count' => count($allCountries),
            'countries_list' => $allCountries,
        ]
    ]);
});

Route::post('/admin/training-opportunities/create', function(\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'curriculum' => 'nullable|string|max:255',
        'countries' => 'required|string|max:255',
        'duration' => 'required|string|max:255',
        'status' => 'nullable|string',
        'is_pinned' => 'nullable|boolean',
    ]);

    $t = \App\Models\TrainingOpportunity::create([
        'program_name' => $validated['name'],
        'provider_name' => $validated['curriculum'] ?? 'JobConnect Curricula',
        'location' => $validated['countries'],
        'duration' => $validated['duration'],
        'status' => $validated['status'] ?? 'Published',
        'is_pinned' => $request->boolean('is_pinned'),
    ]);

    return response()->json(['success' => true, 'message' => 'Training program created successfully.', 'program' => $t], 201);
});

Route::post('/admin/training-opportunities/{id}/status', function($id, \Illuminate\Http\Request $request) {
    $t = \App\Models\TrainingOpportunity::findOrFail($id);
    $t->update(['status' => $request->status]);
    return response()->json(['success' => true, 'message' => "Program status updated to {$request->status}."]);
});

Route::post('/admin/training-opportunities/{id}/toggle-pin', function($id) {
    $t = \App\Models\TrainingOpportunity::findOrFail($id);
    $t->is_pinned = !$t->is_pinned;
    $t->save();
    return response()->json(['success' => true, 'is_pinned' => (bool)$t->is_pinned, 'message' => 'Training pin status updated successfully.']);
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
            'post_type'  => 'Job Listing (' . ucfirst($job->category ?? 'india') . ')',
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

use App\Http\Controllers\Api\ChefProfileViewController;

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

// Account Deletion Route
Route::match(['delete', 'post'], '/profile/delete', [ProfileController::class, 'deleteAccount']);

// FCM Push & WhatsApp Notification History Routes
Route::post('/user/fcm-token', [\App\Http\Controllers\FirebaseController::class, 'saveFcmToken']);
Route::match(['get', 'post'], '/test/send-notification', [\App\Http\Controllers\FirebaseController::class, 'sendTestNotification']);
Route::match(['get', 'post'], '/user/send-notification', [\App\Http\Controllers\FirebaseController::class, 'sendTestNotification']);
Route::match(['get', 'post'], '/user/notifications', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);

// Profile Completeness Routes
Route::get('/profile/completeness', [ProfileController::class, 'getCompleteness']);
Route::get('/chef/profile/completeness', [ProfileController::class, 'getChefCompleteness']);
Route::get('/chef/completeness', [ProfileController::class, 'getChefCompleteness']);
Route::get('/employer/profile/completeness', [ProfileController::class, 'getEmployerCompleteness']);
Route::get('/employer/completeness', [ProfileController::class, 'getEmployerCompleteness']);
Route::get('/talent/profile/completeness', [ProfileController::class, 'getTalentCompleteness']);

// Daily Profile Completion Notification Scheduler Trigger Route
Route::match(['get', 'post'], '/scheduler/send-profile-reminders', [\App\Http\Controllers\FirebaseController::class, 'triggerProfileCompletionReminders']);

// Candidate Status & Shortlisting Routes
Route::match(['get', 'post'], '/employer/applicants/{id}/status', [EmployerController::class, 'updateApplicantStatus']);
Route::match(['get', 'post'], '/applicants/{id}/status', [EmployerController::class, 'updateApplicantStatus']);

// Admin Job Applications List Route
Route::get('/admin/applications', function(\Illuminate\Http\Request $request) {
    try {
        $query = \App\Models\JobApplication::with(['applicant.chefProfile', 'jobPost', 'job_post']);

        if ($request->filled('status') && in_array($request->status, ['new', 'contacted', 'shortlisted', 'hired', 'rejected'])) {
            $query->where('status', $request->status);
        }

        $apps = $query->orderBy('created_at', 'desc')->orderBy('id', 'desc')->get();

        $mapped = $apps->map(function($app) {
            $applicant = $app->applicant;
            $job = $app->job_post ?: ($app->jobPost ?: null);

            $fullName = $applicant ? ($applicant->full_name ?: ('Candidate #' . $applicant->id)) : ('Candidate #' . $app->applicant_id);
            $email = $applicant ? ($applicant->email ?: '') : '';
            $mobile = $applicant ? ($applicant->mobile_number ?: '') : '';
            $city = $applicant ? ($applicant->city ?: 'N/A') : 'N/A';
            $experience = $applicant ? ($applicant->experience_range ?: 'N/A') : 'N/A';

            $jobTitle = $job ? ($job->title ?: ('Job Listing #' . $app->job_post_id)) : ('Job Listing #' . $app->job_post_id);
            $company = $job ? ($job->company ?: 'Employer') : 'Employer';

            return [
                'id' => $app->id,
                'applicant_id' => $app->applicant_id,
                'job_post_id' => $app->job_post_id,
                'employer_id' => $app->employer_id,
                'status' => $app->status ?: 'new',
                'created_at' => $app->created_at ? $app->created_at->toIso8601String() : null,
                'applicant' => [
                    'id' => $applicant ? $applicant->id : $app->applicant_id,
                    'full_name' => $fullName,
                    'name' => $fullName,
                    'email' => $email,
                    'mobile_number' => $mobile,
                    'city' => $city,
                    'experience_range' => $experience,
                    'preferred_role' => $applicant ? ($applicant->preferred_role ?: '') : '',
                    'current_employer' => $applicant ? ($applicant->current_employer ?: '') : '',
                    'skills' => ($applicant && is_array($applicant->skills)) ? $applicant->skills : ($applicant && is_string($applicant->skills) ? (json_decode($applicant->skills, true) ?: []) : []),
                    'profile_photo_path' => $applicant ? $applicant->profile_photo_path : null,
                ],
                'job_post' => [
                    'id' => $job ? $job->id : $app->job_post_id,
                    'title' => $jobTitle,
                    'company' => $company,
                    'location' => $job ? ($job->location ?: 'India') : 'India',
                    'category' => $job ? ($job->category ?: 'india') : 'india',
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'total' => $mapped->count(),
            'applications' => $mapped
        ]);
    } catch (\Throwable $e) {
        \Illuminate\Support\Facades\Log::error('Admin applications list error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
});

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
                'category' => $j->category ?: 'india'
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
