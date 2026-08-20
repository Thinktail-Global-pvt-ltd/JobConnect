<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserModeratorController;
use App\Http\Controllers\Admin\EmployerModeratorController;
use App\Http\Controllers\Admin\JobModeratorController;
use App\Http\Controllers\Admin\ChefModeratorController;
use App\Http\Controllers\Admin\TrainingController;
use App\Http\Controllers\Admin\ReferralController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\WebAuthController;
use App\Http\Controllers\WebRoleController;
use App\Http\Controllers\WebProfileController;
use App\Http\Controllers\WebHomeController;
use App\Http\Controllers\WebJobController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\ChefOnboardingController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\FirebaseController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Root Feed Page Route (View)
Route::get('/', [WebHomeController::class, 'index'])->name('home');

// Direct 100% Public JSON API Endpoints for Admin Panels (matching sidebar-stats pattern)
Route::match(['get', 'post'], '/api/admin/chefs', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\ChefModeratorController)->apiIndex($request);
});
Route::match(['get', 'post'], '/backend/api/admin/chefs', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\ChefModeratorController)->apiIndex($request);
});
Route::match(['get', 'post'], '/api/admin/users', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\UserModeratorController)->index($request);
});
Route::match(['get', 'post'], '/backend/api/admin/users', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\UserModeratorController)->index($request);
});
Route::match(['get', 'post'], '/api/admin/employers', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\EmployerModeratorController)->index($request);
});
Route::match(['get', 'post'], '/backend/api/admin/employers', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\EmployerModeratorController)->index($request);
});
Route::match(['get', 'post'], '/api/admin/jobs', function(\Illuminate\Http\Request $request) {
    if ($request->isMethod('post')) {
        return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
    }
    return (new \App\Http\Controllers\Admin\JobModeratorController)->index($request);
});
Route::match(['get', 'post'], '/backend/api/admin/jobs', function(\Illuminate\Http\Request $request) {
    if ($request->isMethod('post')) {
        return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
    }
    return (new \App\Http\Controllers\Admin\JobModeratorController)->index($request);
});
Route::match(['get', 'post'], '/api/admin/jobs/save', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
});
Route::match(['get', 'post'], '/backend/api/admin/jobs/save', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
});
Route::match(['get', 'post'], '/api/admin/jobs/store', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
});
Route::match(['get', 'post'], '/backend/api/admin/jobs/store', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
});
Route::match(['get', 'post'], '/api/admin/jobs/create', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
});
Route::match(['get', 'post'], '/backend/api/admin/jobs/create', function(\Illuminate\Http\Request $request) {
    return (new \App\Http\Controllers\Admin\JobModeratorController)->store($request);
});
Route::match(['get', 'post'], '/api/employer/chefs', function() {
    return (new \App\Http\Controllers\ChefProfileController)->employerFeed();
});
Route::match(['get', 'post'], '/backend/api/employer/chefs', function() {
    return (new \App\Http\Controllers\ChefProfileController)->employerFeed();
});

// Backend API Prefix Route Group (enables /backend/api/... endpoints directly)
Route::prefix('backend/api')->middleware('api')->group(function () {
    require __DIR__ . '/api.php';
});

// GitHub Auto-Deployment Webhook Route (API)
Route::post('/webhook/deploy', [WebhookController::class, 'deploy'])->name('webhook.deploy');

// ==========================================
// Guest Routes (Views and APIs)
// ==========================================

// Guest Views (HTML)
Route::middleware('guest')->group(function () {
    Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login');
    Route::get('/verify-otp', [WebAuthController::class, 'showVerify'])->name('verify-otp');
});

// Guest APIs (JSON)
Route::prefix('api')->group(function () {
    Route::post('/login', [WebAuthController::class, 'submitLogin'])->name('login.submit');
    Route::post('/verify-otp', [WebAuthController::class, 'submitVerify'])->name('verify-otp.submit');
});

// ==========================================
// Secured Routes (Views and APIs)
// ==========================================

// Secured Views (HTML)
Route::middleware('auth')->group(function () {
    Route::get('/logout', [WebAuthController::class, 'logout'])->name('logout');
    Route::get('/profile', [WebProfileController::class, 'index'])->name('profile');
    Route::get('/profile/firebase-test', [FirebaseController::class, 'showTestPage'])->name('profile.firebase-test');
    Route::get('/profile/personal', [WebProfileController::class, 'editPersonal'])->name('profile.personal.edit');
    Route::get('/profile/applications', [WebProfileController::class, 'applications'])->name('profile.applications');
    Route::get('/profile/saved', [WebProfileController::class, 'savedJobs'])->name('profile.saved');
    Route::get('/employer/onboarding', [WebProfileController::class, 'onboarding'])->name('employer.onboarding');
    Route::get('/chef/onboarding', [ChefOnboardingController::class, 'show'])->name('chef.onboarding');
    Route::get('/jobs/create', [WebJobController::class, 'create'])->name('jobs.create');
    Route::get('/jobs/{job}', [WebJobController::class, 'show'])->name('jobs.show');
    
    // Employer Dashboard Web View
    Route::get('/employer_dashboard', [EmployerController::class, 'index'])->name('employer.dashboard');

    // Appointment Booking Routes
    Route::post('/appointments/book', [AppointmentController::class, 'book'])->name('appointments.book');
    Route::get('/chef/appointments', [AppointmentController::class, 'chefAppointmentsList'])->name('chef.appointments');
    Route::get('/employer/appointments', [AppointmentController::class, 'employerAppointmentsList'])->name('employer.appointments');
    Route::get('/employer/chefs', [AppointmentController::class, 'registeredChefsList'])->name('employer.chefs');
});

Route::middleware('auth:sanctum,web')->prefix('api')->group(function () {
    Route::post('/profile/update', [WebProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/calendly/save', [WebProfileController::class, 'saveCalendlyLink'])->name('api.profile.calendly.save');
    Route::get('/profile/saved', [WebProfileController::class, 'getSavedJobsJson'])->name('api.profile.saved');
    Route::get('/profile/applications', [WebProfileController::class, 'getApplications'])->name('api.profile.applications');
    
    // Role Switching & Activation Routes
    Route::post('/profile/switch-role', [WebRoleController::class, 'switchRole'])->name('profile.switch-role');
    Route::post('/profile/toggle-role', [WebRoleController::class, 'toggleRole'])->name('profile.toggle-role');
    Route::post('/profile/become-employer', [WebRoleController::class, 'becomeEmployer'])->name('profile.become-employer');
    Route::post('/profile/become-agency', [WebRoleController::class, 'becomeAgency'])->name('profile.become-agency');
    Route::post('/profile/become-admin', [WebRoleController::class, 'becomeAdmin'])->name('profile.become-admin');
    Route::post('/profile/become-chef', [WebRoleController::class, 'becomeChef'])->name('profile.become-chef');
    
    Route::post('/jobs/{job}/apply', [WebJobController::class, 'apply'])->name('jobs.apply');
    Route::post('/jobs/{job}/save', [WebJobController::class, 'toggleSave'])->name('jobs.save');
    Route::post('/jobs/store', [WebJobController::class, 'store'])->name('jobs.store');
    Route::post('/employer/onboarding/save', [WebProfileController::class, 'saveOnboarding'])->name('api.employer.onboarding.save');
    Route::post('/chef/onboarding/save', [ChefOnboardingController::class, 'save'])->name('api.chef.onboarding.save');
    Route::post('/logout', [WebAuthController::class, 'apiLogout'])->name('api.logout');
    
    // Employer Dashboard APIs
    Route::get('/employer_dashboard', [EmployerController::class, 'index'])->name('api.employer.dashboard');
    Route::post('/jobs/{id}/close', [EmployerController::class, 'closeJob'])->name('employer.jobs.close');
    Route::post('/applicants/{id}/status', [EmployerController::class, 'updateApplicantStatus'])->name('employer.applicants.status');
    Route::post('/employer/jobs/store', [EmployerController::class, 'storeJob'])->name('employer.jobs.store');
});

// ==========================================
// Admin Panel Authentication & Protected Routes Group
// ==========================================
if (!function_exists('getAdminPassword')) {
    function getAdminPassword() {
        $path = storage_path('app/admin_credentials.json');
        if (file_exists($path)) {
            $data = json_decode(file_get_contents($path), true);
            if (!empty($data['password'])) {
                return $data['password'];
            }
        }
        return '123456';
    }
}

Route::get('/admin/login', function () {
    if (session('admin_authenticated')) {
        return redirect('/admin/dashboard');
    }
    return view('admin.login');
})->name('admin.login');

Route::post('/admin/login', function (\Illuminate\Http\Request $request) {
    $id = trim($request->input('admin_id'));
    $password = trim($request->input('password'));

    $validPassword = getAdminPassword();

    if ($id === 'jobconnect_admin' && $password === $validPassword) {
        session(['admin_authenticated' => true, 'admin_user_id' => 'jobconnect_admin']);
        return redirect('/admin/dashboard');
    }
    return back()->withErrors(['error' => 'Invalid Admin ID or Password.']);
});

Route::post('/admin/change-password', function (\Illuminate\Http\Request $request) {
    try {
        $currentPassword = trim($request->input('current_password'));
        $newPassword = trim($request->input('new_password'));
        $confirmPassword = trim($request->input('confirm_password'));

        if (empty($newPassword)) {
            return response()->json(['success' => false, 'message' => 'New password cannot be empty.'], 400);
        }
        if ($newPassword !== $confirmPassword) {
            return response()->json(['success' => false, 'message' => 'New password and confirm password do not match.'], 400);
        }

        $storedPassword = getAdminPassword();
        if ($currentPassword !== $storedPassword) {
            return response()->json(['success' => false, 'message' => 'Current password is incorrect.'], 400);
        }

        $path = storage_path('app/admin_credentials.json');
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }
        file_put_contents($path, json_encode([
            'admin_id' => 'jobconnect_admin',
            'password' => $newPassword,
            'updated_at' => now()->toIso8601String()
        ], JSON_PRETTY_PRINT));

        return response()->json([
            'success' => true,
            'message' => 'Admin password updated successfully! Please use your new password next time you log in.'
        ]);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

Route::get('/admin/logout', function () {
    session()->forget(['admin_authenticated', 'admin_user_id']);
    return redirect('/admin/login');
});

Route::prefix('admin')->group(function () {
    // Redirect admin root to dashboard
    Route::get('/', function () {
        return redirect('/admin/dashboard');
    });

    // Dashboard Route
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // User Moderator Routes
    Route::get('/users', [UserModeratorController::class, 'index']);
    Route::post('/users/{user}/suspend', [UserModeratorController::class, 'suspend']);
    Route::post('/users/{user}/activate', [UserModeratorController::class, 'activate']);
    Route::delete('/users/{user}', [UserModeratorController::class, 'destroy']);
    Route::get('/users/{user}/posted-jobs', [UserModeratorController::class, 'postedJobsList']);
    Route::get('/users/{user}/applied-jobs', [UserModeratorController::class, 'appliedJobsList']);

    // Employer Moderator Routes
    Route::get('/employers', [EmployerModeratorController::class, 'index']);
    Route::post('/employers', [EmployerModeratorController::class, 'store']);
    Route::post('/employers/{user}/suspend', [EmployerModeratorController::class, 'suspend']);
    Route::post('/employers/{user}/activate', [EmployerModeratorController::class, 'activate']);

    // Job Moderator Routes
    Route::get('/jobs', [JobModeratorController::class, 'index']);
    Route::post('/jobs', [JobModeratorController::class, 'store']);
    Route::get('/jobs/{job}', [JobModeratorController::class, 'show']);
    Route::match(['get', 'post'], '/jobs/{job}/update', [JobModeratorController::class, 'update']);
    Route::post('/jobs/{job}/approve', [JobModeratorController::class, 'approve']);
    Route::post('/jobs/{job}/reject', [JobModeratorController::class, 'reject']);
    Route::post('/jobs/{job}/toggle-pin', [JobModeratorController::class, 'togglePin']);

    // Chef Moderator Routes
    Route::get('/chefs', [ChefModeratorController::class, 'index']);
    Route::post('/chefs/{chef}/approve', [ChefModeratorController::class, 'approve']);
    Route::post('/chefs/{chef}/reject', [ChefModeratorController::class, 'reject']);
    Route::post('/chefs/schedule-appointment', [ChefModeratorController::class, 'scheduleAppointment']);

    // Training Programs CRUD Routes
    Route::get('/training', [TrainingController::class, 'index']);
    Route::post('/training', [TrainingController::class, 'store']);
    Route::put('/training/{program}', [TrainingController::class, 'update']);
    Route::delete('/training/{program}', [TrainingController::class, 'destroy']);

    // Referral Moderation Routes
    Route::get('/referrals', [ReferralController::class, 'index']);
    Route::post('/referrals/{id}/approve', [ReferralController::class, 'approve']);
    Route::post('/referrals/{id}/reject', [ReferralController::class, 'reject']);
    Route::delete('/referrals/{id}', [ReferralController::class, 'destroy']);

    // Admin Community Post (Feed Injection) Routes
    Route::get('/community-posts', [AdminPostController::class, 'index']);
    Route::post('/community-posts', [AdminPostController::class, 'store']);
    Route::put('/community-posts/{id}', [AdminPostController::class, 'update']);
    Route::delete('/community-posts/{id}', [AdminPostController::class, 'destroy']);
    Route::post('/community-posts/{id}/publish', [AdminPostController::class, 'publish']);

    // Admin Job & Training Applications List Route
    Route::get('/applications', function(\Illuminate\Http\Request $request) {
        try {
            // 1. Fetch Job Applications
            $jobQuery = \App\Models\JobApplication::with(['applicant.chefProfile', 'jobPost']);
            if ($request->filled('status') && in_array($request->status, ['new', 'contacted', 'shortlisted', 'hired', 'rejected'])) {
                $jobQuery->where('status', $request->status);
            }
            $jobApps = $jobQuery->orderBy('created_at', 'desc')->orderBy('id', 'desc')->get();

            $jobMapped = $jobApps->map(function($app) {
                $applicant = $app->applicant;
                $job = $app->jobPost;

                $fullName = $applicant ? ($applicant->full_name ?: ('Candidate #' . $applicant->id)) : ('Candidate #' . $app->applicant_id);
                $email = $applicant ? ($applicant->email ?: '') : '';
                $mobile = $applicant ? ($applicant->mobile_number ?: '') : '';
                $city = $applicant ? ($applicant->city ?: 'N/A') : 'N/A';
                $experience = $applicant ? ($applicant->experience_range ?: 'N/A') : 'N/A';

                $jobTitle = $job ? ($job->title ?: ('Job Listing #' . $app->job_post_id)) : ('Job Listing #' . $app->job_post_id);
                $company = $job ? ($job->company ?: 'Employer') : 'Employer';

                return [
                    'id' => 'job_app_' . $app->id,
                    'real_id' => $app->id,
                    'applicant_id' => $app->applicant_id,
                    'job_post_id' => $app->job_post_id,
                    'training_id' => null,
                    'employer_id' => $app->employer_id,
                    'status' => $app->status ?: 'new',
                    'is_training' => false,
                    'type' => 'job',
                    'type_label' => 'Job Listing',
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
                        'real_id' => $job ? $job->id : $app->job_post_id,
                        'title' => $jobTitle,
                        'company' => $company,
                        'location' => $job ? ($job->location ?: 'India') : 'India',
                        'category' => $job ? ($job->category ?: 'dubai') : 'dubai',
                        'is_training' => false,
                        'type_label' => 'Job Listing',
                    ]
                ];
            });

            // 2. Fetch Training Applications (if training_applications table exists)
            $trainingMapped = collect();
            if (\Illuminate\Support\Facades\Schema::hasTable('training_applications')) {
                $trainingQuery = \App\Models\TrainingApplication::with(['applicant.chefProfile', 'trainingOpportunity']);
                if ($request->filled('status') && in_array($request->status, ['new', 'contacted', 'shortlisted', 'hired', 'rejected'])) {
                    $trainingQuery->where('status', $request->status);
                }
                $trainingApps = $trainingQuery->orderBy('created_at', 'desc')->orderBy('id', 'desc')->get();

                $trainingMapped = $trainingApps->map(function($app) {
                    $applicant = $app->applicant;
                    $training = $app->trainingOpportunity;
                    if (!$training && $app->training_id) {
                        $training = \App\Models\TrainingOpportunity::find($app->training_id);
                    }

                    $fullName = $applicant ? ($applicant->full_name ?: ('Candidate #' . $applicant->id)) : ('Candidate #' . $app->applicant_id);
                    $email = $applicant ? ($applicant->email ?: '') : '';
                    $mobile = $applicant ? ($applicant->mobile_number ?: '') : '';
                    $city = $applicant ? ($applicant->city ?: 'N/A') : 'N/A';
                    $experience = $applicant ? ($applicant->experience_range ?: 'N/A') : 'N/A';

                    $programTitle = $training ? ($training->program_name ?: ('Training Opportunity #' . $app->training_id)) : ('Training Opportunity #' . ($app->training_id ?: $app->id));
                    $provider = $training ? ($training->provider_name ?: 'Jobrito Academy') : 'Jobrito Academy';
                    $trainingIdVal = $training ? $training->id : ($app->training_id ?: $app->id);

                    return [
                        'id' => 'training_app_' . $app->id,
                        'real_id' => $app->id,
                        'applicant_id' => $app->applicant_id,
                        'job_post_id' => 'training_' . $trainingIdVal,
                        'training_id' => $trainingIdVal,
                        'employer_id' => $app->employer_id ?: 17,
                        'status' => $app->status ?: 'new',
                        'is_training' => true,
                        'type' => 'training',
                        'type_label' => 'Training Opportunity',
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
                            'id' => 'training_' . $trainingIdVal,
                            'real_id' => $trainingIdVal,
                            'title' => $programTitle,
                            'company' => $provider,
                            'location' => $training ? ($training->location ?: 'India') : 'India',
                            'category' => 'training',
                            'is_training' => true,
                            'type_label' => 'Training Opportunity',
                        ]
                    ];
                });
            }

            // 3. Merge and Sort chronologically
            $merged = $jobMapped->concat($trainingMapped)->sort(function($a, $b) {
                return strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? ''));
            })->values();

            return response()->json([
                'success' => true,
                'total' => $merged->count(),
                'applications' => $merged
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Admin applications list error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    });

    // Admin Manual Test Application Routes
    Route::match(['get', 'post'], '/applications/test-apply', function(\Illuminate\Http\Request $request) {
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

            $app->load(['applicant.chefProfile', 'jobPost', 'job_post']);

            $candidateName = $user->full_name ?: ('User #' . $user->id);
            return response()->json([
                'success' => true,
                'message' => "Test application submitted successfully for candidate '{$candidateName}'.",
                'application' => $app
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit test application: ' . $e->getMessage()
            ], 500);
        }
    });

    Route::get('/test-apply-options', function() {
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
});

// PUBLIC API FALLBACKS (FOR REACT SPA WITHOUT COOKIE AUTH SESSION)
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

// Admin Sidebar Live Counter Stats Endpoint (Unpublished / Unapproved counts)
Route::match(['get', 'post'], '/admin/sidebar-stats', function() {
    try {
        $unpubJobs = \App\Models\JobPost::where(function($q) {
            $q->where('status', '!=', 'approved')
              ->orWhereNull('status');
        })->count();

        $unpubTalent = \App\Models\User::where(function($q) {
            $q->whereIn('active_profile', ['job_seeker', 'talent', 'jobseeker'])
              ->orWhereIn('user_role', ['job_seeker', 'talent', 'jobseeker'])
              ->orWhereHas('roles', fn($r) => $r->whereIn('role_type', ['job_seeker', 'talent', 'jobseeker']));
        })->where(function($q) {
            $q->where('approval_status', '!=', 'approved')
              ->orWhereNull('approval_status')
              ->orWhere('status', '!=', 'approved');
        })->count();

        $unpubEmployers = \App\Models\User::where(function($q) {
            $q->whereIn('active_profile', ['employer', 'agency', 'hirer'])
              ->orWhereIn('user_role', ['employer', 'agency', 'hirer'])
              ->orWhereHas('roles', fn($r) => $r->whereIn('role_type', ['employer', 'agency', 'hirer']));
        })->where(function($q) {
            $q->where('approval_status', '!=', 'approved')
              ->orWhereNull('approval_status')
              ->orWhere('status', '!=', 'approved');
        })->count();

        $unpubChefs = \Illuminate\Support\Facades\DB::table('chef_profiles')
            ->where(function($q) {
                $q->where('approval_status', '!=', 'approved')
                  ->orWhereNull('approval_status');
            })
            ->count();

        $unpubCommunity = \App\Models\AdminPost::where(function($q) {
            $q->where('status', '!=', 'approved')
              ->orWhereNull('status');
        })->count();

        $unpubTraining = \Illuminate\Support\Facades\DB::table('training_opportunities')
            ->where(function($q) {
                $q->where(\Illuminate\Support\Facades\DB::raw('LOWER(status)'), '!=', 'approved')
                  ->orWhereNull('status');
            })
            ->count();

        $unpubApplications = \Illuminate\Support\Facades\DB::table('job_applications')
            ->whereIn('status', ['new', 'pending', 'submitted'])
            ->count();

        $totalUnpublishedUsers = $unpubTalent + $unpubEmployers + $unpubChefs;

        return response()->json([
            'success' => true,
            'counts' => [
                'users'        => $totalUnpublishedUsers,
                'talent'       => $unpubTalent,
                'employers'    => $unpubEmployers,
                'chefs'        => $unpubChefs,
                'jobs'         => $unpubJobs,
                'community'    => $unpubCommunity,
                'training'     => $unpubTraining,
                'applications' => $unpubApplications,
                'enquiries'    => 0,
            ]
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => true,
            'counts' => [
                'users'        => 0,
                'talent'       => 0,
                'employers'    => 0,
                'chefs'        => 0,
                'jobs'         => 0,
                'community'    => 0,
                'training'     => 0,
                'applications' => 0,
                'enquiries'    => 0,
            ]
        ]);
    }
});

Route::match(['get', 'post'], '/api/admin/sidebar-stats', function() {
    return redirect('/admin/sidebar-stats');
});

Route::match(['get', 'post', 'patch', 'put'], '/admin/training-opportunities/{id}/toggle-pin', function($id) {
    return toggleTrainingPinRecord($id);
});
Route::match(['get', 'post', 'patch', 'put'], '/api/admin/training-opportunities/{id}/toggle-pin', function($id) {
    return toggleTrainingPinRecord($id);
});

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

// Admin Training Opportunities Endpoints in web.php
Route::match(['get', 'post'], '/admin/training-opportunities', function() {
    return getWebTrainingOpportunities();
});

Route::match(['get', 'post'], '/api/admin/training-opportunities', function() {
    return getWebTrainingOpportunities();
});

Route::match(['get', 'post'], '/admin/training-opportunities/create', function(\Illuminate\Http\Request $request) {
    return createWebTrainingOpportunityRecord($request);
});

Route::match(['get', 'post'], '/api/admin/training-opportunities/create', function(\Illuminate\Http\Request $request) {
    return createWebTrainingOpportunityRecord($request);
});

if (!function_exists('createWebTrainingOpportunityRecord')) {
function createWebTrainingOpportunityRecord(\Illuminate\Http\Request $request) {
    try {
        $programName = $request->input('name') ?? $request->input('program_name');
        $providerName = $request->input('curriculum') ?? $request->input('provider_name') ?? 'JobConnect Curricula';
        $location = $request->input('countries') ?? $request->input('location');
        $duration = $request->input('duration') ?? '12 Months';
        $status = $request->input('status') ?? 'Published';
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

        // Format description as comma-separated values of non-empty details
        $descParts = [];
        if (!empty(trim($employerDetails))) {
            $descParts[] = trim($employerDetails);
        }
        if (!empty(trim($skillsCovered))) {
            $descParts[] = trim($skillsCovered);
        }
        if (!empty(trim($benefits))) {
            $descParts[] = trim($benefits);
        }
        if (!empty(trim($placementOpportunities))) {
            $descParts[] = trim($placementOpportunities);
        }

        if (!empty($descParts)) {
            $description = implode(', ', $descParts);
        } else {
            $description = $request->input('description') ?? 'Professional hospitality placement and specialized training curriculum.';
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

if (!function_exists('getWebTrainingOpportunities')) {
function getWebTrainingOpportunities() {
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
}
}

// Admin User Store Endpoints in web.php
Route::match(['get', 'post'], '/admin/users/create', [\App\Http\Controllers\Admin\UserModeratorController::class, 'store']);
Route::match(['get', 'post'], '/api/admin/users/create', [\App\Http\Controllers\Admin\UserModeratorController::class, 'store']);
Route::post('/admin/users', [\App\Http\Controllers\Admin\UserModeratorController::class, 'store']);
Route::post('/api/admin/users', [\App\Http\Controllers\Admin\UserModeratorController::class, 'store']);

// Admin Employer Store Endpoints in web.php
Route::match(['get', 'post'], '/admin/employers/create', [\App\Http\Controllers\Admin\EmployerModeratorController::class, 'store']);
Route::match(['get', 'post'], '/api/admin/employers/create', [\App\Http\Controllers\Admin\EmployerModeratorController::class, 'store']);
Route::post('/admin/employers', [\App\Http\Controllers\Admin\EmployerModeratorController::class, 'store']);
Route::post('/api/admin/employers', [\App\Http\Controllers\Admin\EmployerModeratorController::class, 'store']);

// Admin Enquiries Endpoints in web.php
Route::match(['get', 'post'], '/admin/enquiries', function(\Illuminate\Http\Request $request) {
    try {
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
                }
            }
        }
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

Route::match(['get', 'post'], '/admin/enquiries/create', function(\Illuminate\Http\Request $request) {
    try {
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
                }
            }
        }
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

Route::match(['get', 'post'], '/admin/enquiries/{id}/status', function($id, \Illuminate\Http\Request $request) {
    try {
        $status = $request->input('status', 'Contacted');
        \Illuminate\Support\Facades\DB::table('enquiries')
            ->where('id', $id)
            ->update(['status' => $status, 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Enquiry status updated.']);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

// Admin Notification Endpoints in web.php
Route::match(['get', 'post'], '/admin/notifications', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);
Route::match(['get', 'post'], '/api/admin/notifications', [\App\Http\Controllers\FirebaseController::class, 'getNotificationHistory']);
Route::match(['get', 'post'], '/notifications/mark-read', [\App\Http\Controllers\FirebaseController::class, 'markRead']);
Route::match(['get', 'post'], '/notifications/mark-all-read', [\App\Http\Controllers\FirebaseController::class, 'markAllRead']);

// Public Admin Chef Endpoints matching /api/admin/notifications pattern
Route::match(['get', 'post'], '/api/admin/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::match(['get', 'post'], '/api/admin/chefs/create', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'store']);
Route::match(['get', 'post'], '/api/admin/chefs/{chef}/approve', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'approve']);
Route::match(['get', 'post'], '/api/admin/chefs/{chef}/unpublish', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'unpublish']);
Route::match(['get', 'post'], '/api/admin/chefs/{chef}/reject', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'reject']);
Route::match(['get', 'post'], '/api/employer/chefs', [\App\Http\Controllers\ChefProfileController::class, 'employerFeed']);

