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
            // Auto-resolve deep link attributes if missing
            $event = $data['event'] ?? ($data['type'] ?? 'general');
            
            if (empty($data['screen'])) {
                if (in_array($event, ['profile_completion', 'complete_profile', 'profile_reminder']) || str_contains(strtolower($title), 'complete your profile')) {
                    $data['screen'] = 'profile_completion';
                } elseif (in_array($event, ['job_approved', 'job_alert', 'job_created', 'job_rejected']) || str_contains(strtolower($title), 'job')) {
                    $data['screen'] = 'job_detail';
                } elseif (in_array($event, ['candidate_shortlisted', 'employer_shortlisted_candidate', 'application_status_change']) || str_contains(strtolower($title), 'shortlisted') || str_contains(strtolower($title), 'application')) {
                    $data['screen'] = 'application_detail';
                } elseif (in_array($event, ['chef_approved', 'chef_booking']) || str_contains(strtolower($title), 'chef')) {
                    $data['screen'] = 'chef_detail';
                } else {
                    $data['screen'] = 'notifications';
                }
            }

            if (empty($data['deep_link'])) {
                if ($data['screen'] === 'profile_completion') {
                    $data['deep_link'] = 'jobrito://complete-profile';
                } elseif ($data['screen'] === 'job_detail' && !empty($data['job_id'])) {
                    $data['deep_link'] = 'jobrito://jobs/' . $data['job_id'];
                } elseif ($data['screen'] === 'application_detail' && !empty($data['application_id'])) {
                    $data['deep_link'] = 'jobrito://applications/' . $data['application_id'];
                } elseif ($data['screen'] === 'chef_detail' && !empty($data['chef_id'])) {
                    $data['deep_link'] = 'jobrito://chefs/' . $data['chef_id'];
                } else {
                    $data['deep_link'] = 'jobrito://notifications';
                }
            }

            if (empty($data['url'])) {
                $data['url'] = $data['deep_link'];
            }

            if (empty($data['click_action'])) {
                $data['click_action'] = 'FLUTTER_NOTIFICATION_CLICK';
            }

            if (empty($data['target_id'])) {
                $data['target_id'] = (string)($data['job_id'] ?? ($data['application_id'] ?? ($data['chef_id'] ?? '')));
            }

            $notification = Notification::create($title, $body);
            
            // Format all values in data payload as strings for FCM compliance
            $stringifiedData = [];
            foreach ($data as $key => $val) {
                $stringifiedData[$key] = is_array($val) ? json_encode($val) : (string)$val;
            }

            $message = CloudMessage::withTarget('token', $deviceToken)
                ->withNotification($notification)
                ->withData($stringifiedData);

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

                // Safely verify validUserId exists in users table to avoid FK constraint failure
                $validUserId = null;
                if ($userId && \App\Models\User::where('id', $userId)->exists()) {
                    $validUserId = $userId;
                } else {
                    $firstUser = \App\Models\User::first();
                    $validUserId = $firstUser ? $firstUser->id : null;
                }

                $type = isset($data['event']) ? $data['event'] : 'fcm';

                \App\Models\UserNotificationHistory::create([
                    'user_id' => $validUserId,
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
                $failedUserId = null;
                if (!empty($data['user_id']) && \App\Models\User::where('id', $data['user_id'])->exists()) {
                    $failedUserId = (int)$data['user_id'];
                } else {
                    $firstUser = \App\Models\User::first();
                    $failedUserId = $firstUser ? $firstUser->id : null;
                }

                \App\Models\UserNotificationHistory::create([
                    'user_id' => $failedUserId,
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
