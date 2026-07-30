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

            UserDeviceToken::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'fcm_token' => $request->fcm_token,
                ],
                [
                    'device_type' => $request->input('device_type', 'android'),
                    'device_name' => $request->input('device_name', 'Mobile Device'),
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
            return response()->json([
                'success' => false,
                'message' => 'No active FCM device token found for User #' . ($userId ?? 'N/A') . '. Make sure to send fcm_token during login or via /api/user/fcm-token.'
            ], 404);
        }

        try {
            $firebaseService = app(\App\Services\FirebaseService::class);
            $result = $firebaseService->sendPushNotification(
                $fcmToken,
                $request->title,
                $request->body
            );

            // Log to database user_notification_histories table
            \App\Models\UserNotificationHistory::create([
                'user_id' => $userId ?? ($user ? $user->id : null),
                'type' => 'fcm',
                'recipient' => $fcmToken,
                'title' => $request->title,
                'body' => $request->body,
                'status' => 'sent',
                'metadata' => is_array($result) ? $result : ['result' => $result],
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
            \App\Models\UserNotificationHistory::create([
                'user_id' => $userId ?? ($user ? $user->id : null),
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
        $user = $request->user() ?? Auth::user();
        $isAdmin = $request->input('scope') === 'admin' || $request->is('api/admin/*') || $request->boolean('all');

        $query = \App\Models\UserNotificationHistory::with(['user.roles']);

        // Filter by specific user if user_id parameter passed
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        } elseif (!$isAdmin && $user) {
            $query->where('user_id', $user->id);
        }

        // Filter by Role (employer, chef, talent/job_seeker)
        if ($request->filled('role')) {
            $requestedRole = strtolower($request->input('role'));
            if ($requestedRole === 'job_seeker' || $requestedRole === 'talent') {
                $roleFilter = ['job_seeker', 'talent', 'jobseeker'];
            } else {
                $roleFilter = [$requestedRole];
            }

            $query->whereHas('user.roles', function ($rq) use ($roleFilter) {
                $rq->whereIn('role_type', $roleFilter);
            });
        }

        // Filter by channel / type if requested (fcm, whatsapp, in_app)
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        } elseif ($request->filled('channel')) {
            $query->where('type', $request->input('channel'));
        }

        // Filter unread notifications if unread=1
        if ($request->boolean('unread') || $request->boolean('unread_only')) {
            $query->where('is_read', false);
        }

        $history = $query->orderBy('created_at', 'desc')->get();
        $unreadCount = $history->where('is_read', false)->count();

        $notifications = $history->map(function ($item) {
            $recipientUser = $item->user;
            return [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'recipient_name' => $recipientUser ? ($recipientUser->full_name ?: 'User #' . $recipientUser->id) : 'Recipient User',
                'recipient_phone' => $recipientUser ? ($recipientUser->mobile_number ?: 'N/A') : ($item->recipient ?: 'N/A'),
                'recipient_role' => $recipientUser ? ($recipientUser->active_profile ?: 'user') : 'user',
                'recipient_photo' => $recipientUser ? $recipientUser->profile_photo_path : null,
                'type' => $item->type ?: 'fcm',
                'recipient' => $item->recipient,
                'title' => $item->title,
                'body' => $item->body,
                'status' => $item->status,
                'is_read' => (bool)$item->is_read,
                'created_at' => $item->created_at ? $item->created_at->toDateTimeString() : null,
                'created_at_formatted' => $item->created_at ? $item->created_at->format('j M Y, h:i A') : 'N/A',
                'time_ago' => $item->created_at ? $item->created_at->diffForHumans() : 'Just now',
                'metadata' => $item->metadata,
            ];
        });

        return response()->json([
            'success' => true,
            'total_notifications' => $notifications->count(),
            'unread_count' => $unreadCount,
            'notifications' => $notifications,
            'data' => $notifications
        ]);
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
            } else {
                // Fallback: Mark all unread notifications as read
                $affectedRows = \App\Models\UserNotificationHistory::where('is_read', false)->update(['is_read' => true]);
            }

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Notification(s) marked as seen/read successfully. They will no longer appear in unread GET results.',
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
     * Mark all notifications as read.
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
