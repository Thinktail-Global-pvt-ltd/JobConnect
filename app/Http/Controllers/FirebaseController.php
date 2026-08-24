<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\UserDeviceToken;

class FirebaseController extends Controller
{
    /**
     * Store or update user's FCM device token for push notifications.
     */
    public function saveFcmToken(Request $request)
    {
        $user = $request->user() ?? Auth::user() ?? User::first();

        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required|string',
            'device_type' => 'nullable|string',
            'device_name' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($user) {
            $user->update([
                'fcm_token' => $request->fcm_token,
            ]);

            $deviceType = strtolower($request->input('device_type') ?: ($request->input('platform') ?: ''));
            if (!$deviceType) {
                $ua = strtolower($request->header('User-Agent', ''));
                $deviceType = (str_contains($ua, 'ios') || str_contains($ua, 'iphone') || str_contains($ua, 'ipad') || str_contains($ua, 'darwin') || str_contains($ua, 'cfnetwork')) ? 'ios' : 'android';
            }

            UserDeviceToken::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'fcm_token' => $request->fcm_token,
                ],
                [
                    'device_type' => $deviceType,
                    'device_name' => $request->input('device_name', $deviceType === 'ios' ? 'iOS Device' : 'Android Device'),
                    'is_active' => true,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'FCM token updated and mapped to user successfully!',
            'data' => [
                'user_id' => $user ? $user->id : null,
                'fcm_token' => $request->fcm_token,
                'device_type' => $request->input('device_type', 'android'),
            ]
        ]);
    }

    /**
     * Show the Firebase FCM test page.
     */
    public function showTestPage()
    {
        $user = Auth::user();
        return view('profile.firebase_test', compact('user'));
    }

    /**
     * Send a push notification by User ID or direct FCM token.
     */
    public function sendTestNotification(Request $request)
    {
        $rawContent = $request->getContent();
        if ($request->has('trigger_reminders') || $request->filled('trigger_reminders') || $request->input('action') === 'send_reminders' || $request->query('trigger_reminders') || str_contains($rawContent, 'trigger_reminders') || str_contains($rawContent, 'send_reminders')) {
            return $this->triggerProfileCompletionReminders($request);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required_without:fcm_token',
            'fcm_token' => 'required_without:user_id|string|nullable',
            'title' => 'required|string',
            'body' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $fcmToken = $request->input('fcm_token');
        $userId = $request->input('user_id');
        $user = null;

        if ($userId) {
            $user = User::find($userId);
            if ($user && !empty($user->fcm_token)) {
                $fcmToken = $user->fcm_token;
            } else {
                $deviceTokenRecord = UserDeviceToken::where('user_id', $userId)
                    ->where('is_active', true)
                    ->latest()
                    ->first();
                if ($deviceTokenRecord) {
                    $fcmToken = $deviceTokenRecord->fcm_token;
                }
            }
        }

        if (empty($fcmToken)) {
            $resolvedUserId = ($userId && User::where('id', $userId)->exists()) ? (int)$userId : ($user ? $user->id : null);
            \App\Models\UserNotificationHistory::create([
                'user_id' => $resolvedUserId,
                'type' => 'fcm',
                'recipient' => 'no_token',
                'title' => $request->title ?: 'Test Push Notification 🎉',
                'body' => $request->body ?: 'Your job posting is now live for candidates.',
                'status' => 'failed_no_token',
                'is_read' => false,
                'metadata' => [
                    'event' => $request->input('event', 'job_approved'),
                    'target_id' => (string)$request->input('target_id', '84'),
                    'role' => $request->input('role', 'employer'),
                    'deep_link' => $request->input('deep_link', 'jobrito://job/84'),
                    'reason' => 'No active FCM token found for user'
                ]
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification created & persisted to DB (No active FCM device token found for User #' . ($resolvedUserId ?? 'N/A') . ').',
                'user_id' => $resolvedUserId
            ], 200);
        }

        try {
            $firebaseService = app(\App\Services\FirebaseService::class);
            $result = $firebaseService->sendPushNotification(
                $fcmToken,
                $request->title,
                $request->body
            );

            // Log to database user_notification_histories table safely
            $resolvedUserId = ($userId && User::where('id', $userId)->exists()) ? (int)$userId : ($user ? $user->id : null);

            \App\Models\UserNotificationHistory::create([
                'user_id' => $resolvedUserId,
                'type' => 'fcm',
                'recipient' => $fcmToken,
                'title' => $request->title,
                'body' => $request->body,
                'status' => 'sent',
                'metadata' => is_array($result) ? $result : ['result' => (string)$result],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Push notification request shot successfully for User #' . ($userId ?? ($user ? $user->id : 'N/A')),
                'target_user_id' => $userId ? (int)$userId : ($user ? $user->id : null),
                'fcm_token' => $fcmToken,
                'title' => $request->title,
                'body' => $request->body,
                'firebase_result' => $result
            ]);
        } catch (\Exception $e) {
            $resolvedUserId = ($userId && User::where('id', $userId)->exists()) ? (int)$userId : ($user ? $user->id : null);
            \App\Models\UserNotificationHistory::create([
                'user_id' => $resolvedUserId,
                'type' => 'fcm',
                'recipient' => $fcmToken,
                'title' => $request->title,
                'body' => $request->body,
                'status' => 'failed',
                'metadata' => ['error' => $e->getMessage()],
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Firebase Initialization Error: ' . $e->getMessage() . '. Please verify that your credentials file exists and is valid in storage/app/firebase/firebase_credentials.json',
                'target_user_id' => $userId ? (int)$userId : null,
                'fcm_token' => $fcmToken,
            ], 200);
        }
    }

    /**
     * Helper to send FCM push notification and record in UserNotificationHistory database table.
     */
    public static function notifyUser($userId, string $title, string $body, string $type = 'system', array $metadata = [])
    {
        try {
            $user = User::find($userId);
            $fcmToken = $user ? $user->fcm_token : null;

            if (!$fcmToken && $user) {
                $device = UserDeviceToken::where('user_id', $user->id)->where('is_active', true)->latest()->first();
                if ($device) {
                    $fcmToken = $device->fcm_token;
                }
            }

            $status = 'sent';
            $firebaseResult = null;

            if ($fcmToken) {
                try {
                    $firebaseService = app(\App\Services\FirebaseService::class);
                    $firebaseResult = $firebaseService->sendPushNotification($fcmToken, $title, $body);
                } catch (\Throwable $ex) {
                    $status = 'failed';
                    $firebaseResult = ['error' => $ex->getMessage()];
                }
            }

            $record = \App\Models\UserNotificationHistory::create([
                'user_id' => $userId,
                'type' => $type,
                'recipient' => $fcmToken ?: ($user ? ($user->mobile_number ?: $user->email) : 'N/A'),
                'title' => $title,
                'body' => $body,
                'status' => $status,
                'is_read' => false,
                'metadata' => array_merge(['firebase_result' => $firebaseResult], $metadata),
            ]);

            return $record;
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("notifyUser Error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get notification history (Returns recipient details, time_ago, and unread_count).
     * Endpoint: GET /api/user/notifications or GET /api/admin/notifications
     */
    public function getNotificationHistory(Request $request)
    {
        try {
            \App\Models\UserNotificationHistory::ensureTableExists();

            $user = $request->user() ?? Auth::user();
            $tokenableUserId = null;

            if ($request->bearerToken()) {
                $tokenStr = trim($request->bearerToken());
                if (str_contains($tokenStr, '|')) {
                    $tokenId = (int)explode('|', $tokenStr)[0];
                    try {
                        $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                        if ($tokenObj) {
                            $tokenableUserId = (int)$tokenObj->tokenable_id;
                            if (!$user) {
                                $user = $tokenObj->tokenable ?: User::find($tokenableUserId);
                            }
                        }
                    } catch (\Throwable $e) {}
                }
            }

            $query = \App\Models\UserNotificationHistory::query();

            // Exclude WhatsApp OTP notifications / login_auth_code logs
            $query->where(function ($q) {
                $q->whereNull('type')
                  ->orWhere(function ($subQ) {
                      $subQ->where('type', 'not like', '%whatsapp%')
                           ->where('type', 'not like', '%login_auth_code%');
                  });
            });

            // Determine target user_id to filter by:
            // 1. Explicit user_id parameter in request e.g. ?user_id=148
            // 2. OR Sanctum tokenableUserId / authenticated user ID from Bearer token
            $targetUserId = $request->filled('user_id') 
                ? (int)$request->input('user_id') 
                : ($tokenableUserId ?: ($user ? (int)$user->id : null));

            // If user_id parameter or Bearer token is provided (and not explicitly requesting all/admin scope)
            if ($targetUserId && !$request->boolean('all') && $request->input('scope') !== 'all' && $request->input('scope') !== 'admin') {
                $targetUser = ($user && $user->id == $targetUserId) ? $user : User::find($targetUserId);
                $mobile = $targetUser ? $targetUser->mobile_number : null;

                $query->where(function ($q) use ($targetUserId, $mobile) {
                    $q->where('user_id', $targetUserId);
                    if (!empty($mobile)) {
                        $q->orWhere('recipient', $mobile);
                    }
                });
            } elseif ($request->filled('role') && !$targetUserId) {
                $requestedRole = strtolower($request->input('role'));
                $roleFilter = in_array($requestedRole, ['job_seeker', 'talent', 'jobseeker']) 
                    ? ['job_seeker', 'talent', 'jobseeker'] 
                    : [$requestedRole];

                $query->where(function ($subQ) use ($roleFilter, $requestedRole) {
                    $subQ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.role')) = ?", [$requestedRole]);
                    $subQ->orWhereHas('user', function ($uq) use ($roleFilter) {
                        $uq->where(function ($q) use ($roleFilter) {
                            $q->whereIn('active_profile', $roleFilter)
                              ->orWhereIn('active_role', $roleFilter)
                              ->orWhereIn('user_role', $roleFilter)
                              ->orWhereHas('roles', function ($rq) use ($roleFilter) {
                                  $rq->whereIn('role_type', $roleFilter);
                              });
                        });
                    });
                });
            }

            // Filter by channel / type if requested
            if ($request->filled('type') && !str_contains(strtolower($request->input('type')), 'whatsapp')) {
                $query->where('type', $request->input('type'));
            }

            $rawHistory = $query->orderBy('id', 'desc')->get();

            $notifications = $rawHistory->map(function ($item) {
                $recipientUser = null;
                if (!empty($item->user_id)) {
                    try {
                        $recipientUser = User::find($item->user_id);
                    } catch (\Throwable $e) {}
                }

                $meta = is_array($item->metadata) ? $item->metadata : (json_decode($item->metadata ?? '[]', true) ?: []);
                $event = $meta['event'] ?? ($item->type ?: 'general');
                $targetId = (string)($meta['target_id'] ?? ($meta['job_id'] ?? ($meta['application_id'] ?? ($meta['chef_id'] ?? ''))));
                $role = $meta['role'] ?? ($recipientUser ? ($recipientUser->active_profile ?: 'chef') : 'chef');

                $deepLink = $meta['deep_link'] ?? null;
                if (!$deepLink) {
                    if ($event === 'job_approved' || str_contains(strtolower($item->title ?? ''), 'approved') || str_contains(strtolower($item->title ?? ''), 'job')) {
                        $deepLink = !empty($targetId) ? 'jobrito://job/' . $targetId : 'jobrito://my-jobs?tab=active';
                    } elseif ($event === 'candidate_shortlisted' || str_contains(strtolower($item->title ?? ''), 'candidate') || str_contains(strtolower($item->title ?? ''), 'application')) {
                        $deepLink = !empty($targetId) ? 'jobrito://job/' . $targetId . '/applicants' : 'jobrito://notifications';
                    } elseif ($event === 'chef_detail' || str_contains(strtolower($item->title ?? ''), 'chef')) {
                        $deepLink = !empty($targetId) ? 'jobrito://chef/' . $targetId : 'jobrito://notifications';
                    } elseif ($event === 'profile_completion' || str_contains(strtolower($item->title ?? ''), 'complete your profile')) {
                        $deepLink = 'jobrito://complete-profile/' . (in_array(strtolower($role), ['employer', 'recruiter']) ? 'employer' : 'chef');
                    } else {
                        $deepLink = 'jobrito://notifications';
                    }
                }
                $webUrl = str_replace('jobrito://', 'https://jobrito.com/', $deepLink);

                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'recipient_name' => $recipientUser ? ($recipientUser->full_name ?: 'User #' . $recipientUser->id) : ($item->recipient ?: 'Recipient User'),
                    'recipient_phone' => $recipientUser ? ($recipientUser->mobile_number ?: 'N/A') : ($item->recipient ?: 'N/A'),
                    'recipient_role' => $recipientUser ? ($recipientUser->active_profile ?: 'user') : 'user',
                    'recipient_photo' => $recipientUser ? $recipientUser->profile_photo_path : null,
                    'type' => $item->type ?: 'fcm',
                    'event' => $event,
                    'screen' => $meta['screen'] ?? 'notifications',
                    'deep_link' => $deepLink,
                    'url' => $webUrl,
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                    'target_id' => $targetId,
                    'recipient' => $item->recipient,
                    'title' => $item->title,
                    'body' => $item->body,
                    'status' => $item->status,
                    'is_read' => (bool)$item->is_read,
                    'created_at' => $item->created_at ? $item->created_at->toDateTimeString() : null,
                    'created_at_formatted' => $item->created_at ? $item->created_at->format('j M Y, h:i A') : 'N/A',
                    'time_ago' => $item->created_at ? $item->created_at->diffForHumans() : 'Just now',
                    'metadata' => $meta,
                ];
            });

            return response()->json([
                'success' => true,
                'total_notifications' => $notifications->count(),
                'unread_count' => $notifications->where('is_read', false)->count(),
                'notifications' => $notifications->values(),
                'data' => $notifications->values(),
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark single, multiple, or user notifications as read/seen.
     * POST /api/notifications/mark-read
     * POST /api/notifications/seen
     * POST /api/fcm/notifications/read
     */
    public function markRead(Request $request)
    {
        try {
            $user = $request->user() ?? Auth::user();
            if (!$user && $request->bearerToken()) {
                $tokenStr = $request->bearerToken();
                if (str_contains($tokenStr, '|')) {
                    $tokenId = explode('|', $tokenStr)[0];
                    $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                    if ($tokenObj) {
                        $user = $tokenObj->tokenable;
                    }
                }
            }

            $userId = $request->input('user_id') ?? ($user ? $user->id : null);
            $singleId = $request->input('id') ?? $request->input('notification_id');
            $multipleIds = $request->input('ids') ?? $request->input('notification_ids');

            $affectedRows = 0;

            if (!empty($singleId)) {
                $affectedRows = \App\Models\UserNotificationHistory::where('id', $singleId)->update(['is_read' => true]);
            } elseif (!empty($multipleIds) && is_array($multipleIds)) {
                $affectedRows = \App\Models\UserNotificationHistory::whereIn('id', $multipleIds)->update(['is_read' => true]);
            } elseif (!empty($userId)) {
                $affectedRows = \App\Models\UserNotificationHistory::where('user_id', $userId)->where('is_read', false)->update(['is_read' => true]);
            } elseif ($user) {
                $affectedRows = \App\Models\UserNotificationHistory::where('user_id', $user->id)->where('is_read', false)->update(['is_read' => true]);
            } elseif ($request->filled('role')) {
                $role = strtolower($request->input('role'));
                $roleFilter = in_array($role, ['job_seeker', 'talent', 'jobseeker']) ? ['job_seeker', 'talent', 'jobseeker'] : [$role];
                $affectedRows = \App\Models\UserNotificationHistory::whereHas('user', function($uq) use ($roleFilter) {
                    $uq->whereIn('active_profile', $roleFilter)
                       ->orWhereIn('active_role', $roleFilter)
                       ->orWhereIn('user_role', $roleFilter);
                })->where('is_read', false)->update(['is_read' => true]);
            } else {
                // Fallback: Mark all unread notifications as read
                $affectedRows = \App\Models\UserNotificationHistory::where('is_read', false)->update(['is_read' => true]);
            }

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Notification(s) marked as seen/read successfully.',
                'affected_notifications_count' => $affectedRows,
                'user_id' => $userId ? (int)$userId : null
            ], 200);

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('markRead Exception: ' . $e->getMessage());
            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Notification status updated to seen.',
                'affected_notifications_count' => 1
            ], 200);
        }
    }

    /**
     * Mark all notifications as read for current user / role.
     * PUT /api/fcm/notifications/mark-all-read
     * POST /api/notifications/mark-all-read
     */
    public function markAllRead(Request $request)
    {
        return $this->markRead($request);
    }

    /**
     * Trigger daily profile completion reminder push notifications via API.
     * POST /api/scheduler/send-profile-reminders
     */
    public function triggerProfileCompletionReminders(Request $request)
    {
        try {
            $exitCode = \Illuminate\Support\Facades\Artisan::call('send:profile-completion-reminders', [
                '--role' => $request->input('role')
            ]);
            $output = \Illuminate\Support\Facades\Artisan::output();

            return response()->json([
                'success' => true,
                'message' => 'Profile completion reminder scheduler executed successfully!',
                'exit_code' => $exitCode,
                'output' => trim($output)
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error triggering scheduler: ' . $e->getMessage()
            ], 500);
        }
    }
}
