<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserModeratorController;
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
    Route::post('/profile/personal', [WebProfileController::class, 'updatePersonal'])->name('profile.personal.update');
    Route::post('/profile/update', [WebProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/calendly/save', [WebProfileController::class, 'saveCalendlyLink'])->name('api.profile.calendly.save');
    Route::post('/user/fcm-token', [FirebaseController::class, 'saveFcmToken'])->name('api.user.fcm-token');
    Route::post('/test/send-notification', [FirebaseController::class, 'sendTestNotification'])->name('api.test.send-notification');
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
// Admin Panel Framework Routing Group (Views/APIs)
// ==========================================
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

    // Job Moderator Routes
    Route::get('/jobs', [JobModeratorController::class, 'index']);
    Route::get('/jobs/{job}', [JobModeratorController::class, 'show']);
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
});
