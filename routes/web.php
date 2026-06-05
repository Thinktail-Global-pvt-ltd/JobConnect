<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserModeratorController;
use App\Http\Controllers\Admin\JobModeratorController;
use App\Http\Controllers\Admin\ChefModeratorController;
use App\Http\Controllers\Admin\TrainingController;
use App\Http\Controllers\WebAuthController;
use App\Http\Controllers\WebRoleController;
use App\Http\Controllers\WebProfileController;
use App\Http\Controllers\WebHomeController;
use App\Http\Controllers\WebJobController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Root Feed Page Route
Route::get('/', [WebHomeController::class, 'index'])->name('home');

// GitHub Auto-Deployment Webhook Route
Route::post('/webhook/deploy', [WebhookController::class, 'deploy'])->name('webhook.deploy');

// Guest Prototype Auth Routes
Route::middleware('guest')->prefix('api')->group(function () {
    Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [WebAuthController::class, 'submitLogin'])->name('login.submit');
    Route::get('/verify-otp', [WebAuthController::class, 'showVerify'])->name('verify-otp');
    Route::post('/verify-otp', [WebAuthController::class, 'submitVerify'])->name('verify-otp.submit');
});

// Secured Prototype Routes
Route::middleware('auth')->group(function () {
    Route::get('/logout', [WebAuthController::class, 'logout'])->name('logout');

    Route::get('/profile', [WebProfileController::class, 'index'])->name('profile');
    Route::get('/profile/personal', [WebProfileController::class, 'editPersonal'])->name('profile.personal.edit');
    Route::post('/profile/personal', [WebProfileController::class, 'updatePersonal'])->name('profile.personal.update');
    Route::get('/profile/applications', [WebProfileController::class, 'applications'])->name('profile.applications');
    Route::post('/profile/update', [WebProfileController::class, 'update'])->name('profile.update');
    
    // Role Switching & Activation Routes
    Route::post('/profile/switch-role', [WebRoleController::class, 'switchRole'])->name('profile.switch-role');
    Route::post('/profile/toggle-role', [WebRoleController::class, 'toggleRole'])->name('profile.toggle-role');
    Route::post('/profile/become-employer', [WebRoleController::class, 'becomeEmployer'])->name('profile.become-employer');
    Route::post('/profile/become-agency', [WebRoleController::class, 'becomeAgency'])->name('profile.become-agency');
    Route::post('/profile/become-admin', [WebRoleController::class, 'becomeAdmin'])->name('profile.become-admin');
    Route::post('/profile/become-chef', [WebRoleController::class, 'becomeChef'])->name('profile.become-chef');
    Route::get('/jobs/create', [WebJobController::class, 'create'])->name('jobs.create');
    Route::get('/jobs/{job}', [WebJobController::class, 'show'])->name('jobs.show');
    Route::post('/jobs/{job}/apply', [WebJobController::class, 'apply'])->name('jobs.apply');
    Route::post('/jobs/store', [WebJobController::class, 'store'])->name('jobs.store');
});

// Admin Panel Framework Routing Group
Route::prefix('admin')->group(function () {
    // Dashboard Route
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // User Moderator Routes
    Route::get('/users', [UserModeratorController::class, 'index']);
    Route::post('/users/{user}/suspend', [UserModeratorController::class, 'suspend']);
    Route::post('/users/{user}/activate', [UserModeratorController::class, 'activate']);

    // Job Moderator Routes
    Route::get('/jobs', [JobModeratorController::class, 'index']);
    Route::post('/jobs/{job}/approve', [JobModeratorController::class, 'approve']);
    Route::post('/jobs/{job}/reject', [JobModeratorController::class, 'reject']);
    Route::post('/jobs/{job}/toggle-pin', [JobModeratorController::class, 'togglePin']);

    // Chef Moderator Routes
    Route::get('/chefs', [ChefModeratorController::class, 'index']);
    Route::post('/chefs/{chef}/approve', [ChefModeratorController::class, 'approve']);
    Route::post('/chefs/{chef}/reject', [ChefModeratorController::class, 'reject']);

    // Training Programs CRUD Routes
    Route::get('/training', [TrainingController::class, 'index']);
    Route::post('/training', [TrainingController::class, 'store']);
    Route::put('/training/{program}', [TrainingController::class, 'update']);
    Route::delete('/training/{program}', [TrainingController::class, 'destroy']);
});
