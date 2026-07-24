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
    Route::get('/my-jobs', [JobPostController::class, 'myJobs']);
    Route::post('/chefs', [ChefProfileController::class, 'store']);
    Route::post('/chef/onboarding/save', [\App\Http\Controllers\ChefOnboardingController::class, 'save']);
    Route::get('/chef/dashboard', [ChefProfileController::class, 'dashboardStats']);

    // Chef Connect Appointment Routes
    Route::post('/appointments/book', [AppointmentController::class, 'book']);
    Route::get('/chef/appointments', [AppointmentController::class, 'chefAppointmentsList']);
    Route::get('/employer/appointments', [AppointmentController::class, 'employerAppointmentsList']);
});

// Public Candidate / Chef Connect Discovery Routes
Route::get('/employer/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::get('/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::get('/admin/chefs', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'apiIndex']);
Route::post('/admin/chefs/{chef}/approve', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'approve']);
Route::post('/admin/chefs/{chef}/reject', [\App\Http\Controllers\Admin\ChefModeratorController::class, 'reject']);

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
