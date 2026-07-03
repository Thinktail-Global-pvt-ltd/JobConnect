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

// Secured Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Multi-profile Management Switcher Route
    Route::post('/auth/toggle-profile', [AuthController::class, 'toggleProfile']);

    // User Profile Routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/language', [ProfileController::class, 'updateLanguage']);
    Route::get('/user/socials', [UserSocialController::class, 'show']);
    Route::post('/user/socials', [UserSocialController::class, 'update']);

    // Unified Sorted Single Feed Route
    Route::get('/feed', [FeedController::class, 'index']);

    // Submission Routes
    Route::post('/jobs', [JobPostController::class, 'store']);
    Route::get('/my-jobs', [JobPostController::class, 'myJobs']);
    Route::post('/chefs', [ChefProfileController::class, 'store']);
    Route::get('/chef/dashboard', [ChefProfileController::class, 'dashboardStats']);

    // Chef Connect Appointment Routes
    Route::post('/appointments/book', [AppointmentController::class, 'book']);
    Route::get('/chef/appointments', [AppointmentController::class, 'chefAppointmentsList']);
    Route::get('/employer/appointments', [AppointmentController::class, 'employerAppointmentsList']);
    Route::get('/employer/chefs', [AppointmentController::class, 'registeredChefsList']);
});
