<?php

namespace App\Services;

use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FirebaseService
{
    protected Messaging $messaging;

    public function __construct(Messaging $messaging)
    {
        $this->messaging = $messaging;
    }

    /**
     * Send a push notification to a specific device FCM token and log to DB.
     */
    public function sendPushNotification(string $deviceToken, string $title, string $body, array $data = []): array
    {
        try {
            $notification = Notification::create($title, $body);
            $message = CloudMessage::withTarget('token', $deviceToken)
                ->withNotification($notification);

            if (!empty($data)) {
                $message = $message->withData($data);
            }

            $this->messaging->send($message);

            // Always persist to user_notification_histories database table
            try {
                $userId = null;
                if (!empty($data['user_id'])) {
                    $userId = (int)$data['user_id'];
                }
                if (!$userId) {
                    $deviceRecord = \App\Models\UserDeviceToken::where('fcm_token', $deviceToken)->latest()->first();
                    if ($deviceRecord) {
                        $userId = $deviceRecord->user_id;
                    }
                }
                if (!$userId) {
                    $userRecord = \App\Models\User::where('fcm_token', $deviceToken)->first();
                    if ($userRecord) {
                        $userId = $userRecord->id;
                    }
                }

                $type = isset($data['event']) ? $data['event'] : 'fcm';

                \App\Models\UserNotificationHistory::create([
                    'user_id' => $userId ?: 1,
                    'type' => $type,
                    'recipient' => $deviceToken,
                    'title' => $title,
                    'body' => $body,
                    'status' => 'sent',
                    'is_read' => false,
                    'metadata' => $data,
                ]);
            } catch (\Throwable $dbe) {
                \Illuminate\Support\Facades\Log::error('FirebaseService DB Log Error: ' . $dbe->getMessage());
            }

            return [
                'success' => true,
                'message' => 'Notification sent successfully!',
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('FCM Notification Error: ' . $e->getMessage());

            try {
                \App\Models\UserNotificationHistory::create([
                    'user_id' => isset($data['user_id']) ? (int)$data['user_id'] : 1,
                    'type' => isset($data['event']) ? $data['event'] : 'fcm',
                    'recipient' => $deviceToken,
                    'title' => $title,
                    'body' => $body,
                    'status' => 'failed',
                    'is_read' => false,
                    'metadata' => array_merge($data, ['error' => $e->getMessage()]),
                ]);
            } catch (\Throwable $dbe) {}

            return [
                'success' => false,
                'message' => 'Failed to send notification: ' . $e->getMessage(),
            ];
        }
    }
}
