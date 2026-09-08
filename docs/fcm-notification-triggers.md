# FCM Notification Triggers

This document lists the Firebase Cloud Messaging notifications currently triggered by API or web route hits in this Laravel application.

## Shared Send Flow

All automated notification triggers use `App\Services\NotificationTriggerService::sendToUser()` either directly or through helper methods.

Send behavior:

- Resolves the target user from a `User` model, `user_id`, or matching `ChefProfile` id.
- Collects tokens from `users.fcm_token` and active rows in `user_device_tokens`.
- Sends each token through `App\Services\FirebaseService::sendPushNotification()`.
- Writes notification history to `user_notification_histories`.

Default FCM payload behavior in `FirebaseService`:

- Adds `click_action: FLUTTER_NOTIFICATION_CLICK`.
- Adds `content_available: true`.
- Adds `priority: high`.
- Auto-fills `screen`, `deep_link`, `url`, and `target_id` when missing.
- Uses APNs alert config for iOS and high-priority Android notification config.

## API Endpoints That Store FCM Tokens

### Save FCM Token

Routes:

- `POST /api/user/fcm-token`
- `POST /api/user/fcm-token` inside authenticated Sanctum group

Controller:

- `App\Http\Controllers\FirebaseController::saveFcmToken`

Purpose:

- Stores the latest token on `users.fcm_token`.
- Creates or updates `user_device_tokens` with `device_type`, `device_name`, and `is_active = true`.

This endpoint does not shoot a push notification.

## API Endpoints That Shoot FCM Notifications

### 1. Job Created / Submitted

Routes:

- `POST /api/jobs`
- `POST /api/jobs/store`
- `POST /api/jobs/referrals`

Controller:

- `App\Http\Controllers\Api\JobPostController::store`

Trigger method:

- `NotificationTriggerService::notifyJobCreated($jobPost)`

Recipient:

- Job creator / employer.

Title:

- `Job Post Created Successfully 🎉`

Body:

- `Your job post '{job_title}' at {company} has been created and is waiting for admin approval.`

Payload:

- `event: job_created`
- `status: pending`
- `screen: job_detail`
- `job_id`
- `target_id`
- `deep_link: jobrito://job/{job_id}`
- `url: https://jobrito.com/job/{job_id}`
- `click_action: FLUTTER_NOTIFICATION_CLICK`

Source files:

- `app/Http/Controllers/Api/JobPostController.php`
- `app/Services/NotificationTriggerService.php`

### 2. Job Application Submitted

Routes:

- `GET|POST /api/jobs/{job}/apply`
- `GET|POST /api/training/{job}/apply`
- `GET|POST /api/training-opportunities/{job}/apply`
- `POST /api/jobs/{job}/apply`

Controllers:

- `App\Http\Controllers\WebJobController::apply`
- Route closure in `routes/api.php`

Trigger method:

- `NotificationTriggerService::sendToUser($employerId, ...)`

Recipient:

- Employer / job creator.

Title:

- `New Candidate Application 💼`

Body:

- `Hi! {applicant_name} applied for your job listing '{job_title}'.`

Payload:

- `event: application_received`
- `job_id`
- `application_id`
- `applicant_id`

Source files:

- `app/Http/Controllers/WebJobController.php`
- `routes/api.php`

### 3. Job Approved / Published By Admin

Routes:

- `POST /admin/jobs/{job}/approve`
- `POST /api/admin/jobs/{job}/approve`
- `POST /backend/api/admin/jobs/{job}/approve`
- Related web/admin aliases that call `JobModeratorController::approve`

Controller:

- `App\Http\Controllers\Admin\JobModeratorController::approve`

Trigger method:

- `NotificationTriggerService::notifyJobPublished($jobModel)`

Recipients:

- Employer / job creator.
- All users with `user_roles.role_type` in `chef`, `job_seeker`, or `talent`, excluding the creator.
- If no matching role rows exist, it falls back to all users.

Employer title:

- `Job Post Approved & Live! 🚀`

Employer body:

- `Great news! Your job post '{job_title}' at {company} is now approved and live on Jobrito feed.`

Candidate title:

- `New Job Alert: {job_title} 💼`

Candidate body:

- `{company} is hiring for '{job_title}' in {location}. Apply now!`

Payload:

- `event: job_approved`
- `role: employer` or `role: chef`
- `screen: job_detail`
- `job_id`
- `target_id`
- `deep_link: jobrito://job/{job_id}`
- `url: https://jobrito.com/job/{job_id}`
- `click_action: FLUTTER_NOTIFICATION_CLICK`

Source files:

- `app/Http/Controllers/Admin/JobModeratorController.php`
- `app/Services/NotificationTriggerService.php`

### 4. Referral Approved By Admin

Route:

- `POST /admin/referrals/{id}/approve`

Controller:

- `App\Http\Controllers\Admin\ReferralController::approve`

Trigger method:

- `NotificationTriggerService::notifyJobPublished($referral)`

Recipients and payload:

- Same as Job Approved / Published By Admin.

Source files:

- `app/Http/Controllers/Admin/ReferralController.php`
- `app/Services/NotificationTriggerService.php`

### 5. Job Rejected By Admin

Routes:

- `POST /admin/jobs/{job}/reject`
- `POST /api/admin/jobs/{job}/reject`
- `POST /backend/api/admin/jobs/{job}/reject`
- Related web/admin aliases that call `JobModeratorController::reject`

Controller:

- `App\Http\Controllers\Admin\JobModeratorController::reject`

Trigger method:

- `NotificationTriggerService::notifyJobRejected($job)`

Recipient:

- Employer / job creator. If no creator is resolved, the code falls back to user id `47`.

Title:

- `Job Post Update 📋`

Body:

- `Your job post '{job_title}' was reviewed and not approved at this time.`
- If a reason is passed: `Reason: {reason}` is appended.

Payload:

- `event: job_rejected`
- `screen: job_detail`
- `job_id`
- `target_id`
- `deep_link: jobrito://job/{job_id}`
- `url: https://jobrito.com/job/{job_id}`
- `click_action: FLUTTER_NOTIFICATION_CLICK`

Source files:

- `app/Http/Controllers/Admin/JobModeratorController.php`
- `app/Services/NotificationTriggerService.php`

### 6. Applicant Status Changed By Employer

Routes:

- `POST /api/employer/applicants/{id}/status`
- `POST /api/applicants/{id}/status`
- `POST /api/employer/applicants/{id}/status` inside authenticated web/API group
- `POST /api/applicants/{id}/status` inside authenticated web/API group

Controller:

- `App\Http\Controllers\EmployerController::updateApplicantStatus`

Trigger method:

- `NotificationTriggerService::notifyApplicationStatusChange($application, $newStatus)`

Recipients:

- Applicant / candidate.
- Employer.

Statuses handled:

- `shortlisted`
- `contacted`
- `hired`
- `accepted`
- `rejected`
- Any other status falls back to a generic status update message.

Applicant messages:

- `shortlisted`: `Congratulations! You are Shortlisted! 🎉`
- `contacted`: `Employer Interested in Your Profile! 📞`
- `hired` / `accepted`: `Congratulations! You are Hired! 🌟`
- `rejected`: `Application Update: {job_title}`
- default: `Application Status Updated 📋`

Employer messages:

- `shortlisted`: `Candidate Shortlisted! 🌟`
- `contacted`: `Candidate Contacted 📞`
- `hired` / `accepted`: `Candidate Hired! 🎉`
- `rejected`: `Candidate Application Status Updated`
- default: `Candidate Status Updated 📋`

Payload:

- `event: candidate_shortlisted`
- `status: {new_status}`
- `screen: application_detail`
- `application_id`
- `job_id`
- `target_id`
- `applicant_id` on employer notification
- `deep_link: jobrito://job/{job_id}/applicants`
- `url: https://jobrito.com/job/{job_id}/applicants`
- `click_action: FLUTTER_NOTIFICATION_CLICK`

Note:

- The `event` is always currently stored as `candidate_shortlisted`, even for contacted, hired, rejected, and default status changes.

Source files:

- `app/Http/Controllers/EmployerController.php`
- `app/Services/NotificationTriggerService.php`

### 7. Chef Profile Approved / Published By Admin

Routes:

- `POST /admin/chefs/{chef}/approve`
- `POST /api/admin/chefs/{chef}/approve`
- `POST /backend/api/admin/chefs/{chef}/approve`
- Related web/admin aliases that call `ChefModeratorController::approve`

Controller:

- `App\Http\Controllers\Admin\ChefModeratorController::approve`

Trigger method:

- `NotificationTriggerService::sendToUser($chef->user_id, ...)`

Recipient:

- Chef profile owner.

Title:

- `Chef Profile Approved! 🎉`

Body:

- `Congratulations! Your Chef profile has been approved by admin. Employers can now view & book you on Jobrito!`

Payload:

- No explicit metadata is passed by this controller.
- `FirebaseService` will auto-resolve default screen/deep-link behavior only if a token send happens through `FirebaseService`.
- `NotificationTriggerService` history type defaults to `fcm` because no `event` metadata is passed.

Source files:

- `app/Http/Controllers/Admin/ChefModeratorController.php`
- `app/Services/NotificationTriggerService.php`

### 8. Manual / Test Push Notification

Routes:

- `GET|POST /api/test/send-notification`
- `GET|POST /api/user/send-notification`

Controller:

- `App\Http\Controllers\FirebaseController::sendTestNotification`

Recipient:

- Direct `fcm_token`, provided `user_id`, or both.

Required request fields:

- `title`
- `body`
- Either `user_id` or `fcm_token`

Payload:

- Uses the complete request body as FCM data payload.
- If no active token is found for the user, it still creates a `user_notification_histories` row with `status: failed_no_token`.

Special behavior:

- If the request contains `trigger_reminders`, `action=send_reminders`, or matching raw content, this endpoint runs the profile-completion reminder job instead of sending the test notification.

Source files:

- `app/Http/Controllers/FirebaseController.php`

### 9. Profile Completion Reminder Triggered By API

Routes:

- `GET|POST /api/scheduler/send-profile-reminders`
- Also reachable through `/api/test/send-notification` and `/api/user/send-notification` when reminder trigger parameters are present.

Controller:

- `App\Http\Controllers\FirebaseController::triggerProfileCompletionReminders`

Command:

- `send:profile-completion-reminders`

Recipient:

- Active users with profile completeness below `100%`.
- Optional role filter via `role`.

Deduplication:

- Skips users who received a profile completion reminder in the last 24 hours.

Title:

- `Complete Your Profile ({completeness}% Done) 🚀`

Body:

- Chef: `Hi {name}, your Chef profile is {completeness}% complete. Complete your profile now to get 5x more hiring & booking calls!`
- Employer: `Hi {name}, your Employer profile is {completeness}% complete. Complete your profile to attract top culinary talents & chefs!`
- Talent/default: `Hi {name}, your profile is {completeness}% complete. Complete it now to get discovered by recruiters!`

Payload:

- `event: profile_completion`
- `type: profile_completion`
- `screen: profile_completion`
- `deep_link: jobrito://complete-profile/{chef|employer}`
- `url: https://jobrito.com/complete-profile/{chef|employer}`
- `click_action: FLUTTER_NOTIFICATION_CLICK`
- `user_id`
- `completeness`
- `role`

Source files:

- `app/Http/Controllers/FirebaseController.php`
- `app/Console/Commands/SendProfileCompletionReminders.php`

## API Endpoints That Read Or Update Notification History

These endpoints do not shoot FCM pushes, but they manage notification history.

### Notification History

Routes:

- `GET|POST /api/user/notifications`
- `GET|POST /api/notifications`
- `GET|POST /api/notifications/all`
- `GET|POST /api/fcm/notifications`
- `GET|POST /api/admin/notifications`
- `GET|POST /admin/notifications`
- `GET|POST /api/admin/notifications`

Controller:

- `App\Http\Controllers\FirebaseController::getNotificationHistory`

### Mark Notifications Read

Routes:

- `GET|POST|PUT /api/notifications/mark-read`
- `GET|POST|PUT /api/notifications/read`
- `GET|POST|PUT /api/notifications/seen`
- `GET|POST|PUT /api/fcm/notifications/read`
- `GET|POST|PUT /api/fcm/notifications/seen`
- `GET|POST|PUT /api/fcm/notifications/mark-read`
- `GET|POST|PUT /api/fcm/notifications/mark-all-read`
- `GET|POST|PUT /api/user/notifications/read`
- `GET|POST|PUT /api/notifications/mark-all-read`
- `GET|POST /notifications/mark-read`
- `GET|POST /notifications/mark-all-read`

Controller:

- `App\Http\Controllers\FirebaseController::markRead`
- `App\Http\Controllers\FirebaseController::markAllRead`

## Known Implementation Notes

- `NotificationTriggerService::sendToUser()` creates a history row after looping over all tokens, but uses the last `$fcmToken` value as `recipient`. If a user has multiple tokens, individual sends are also logged inside `FirebaseService`, so duplicate history rows can occur.
- `FirebaseController::notifyUser()` references `$fcmToken` when creating history, but that variable is not defined in the method. This helper did not appear in the audited API trigger paths, but it is a bug if used later.
- Chef approval sends no explicit `event`, `screen`, `deep_link`, or `target_id` metadata.
- Applicant status change uses `event: candidate_shortlisted` for every status, including contacted, hired, and rejected.
- Some routes exist both in `routes/api.php` and `routes/web.php`, so the same trigger may be reachable through multiple aliases.
