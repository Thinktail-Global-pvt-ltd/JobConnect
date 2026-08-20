<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\ProfileProgressService;
use App\Services\FirebaseService;
use App\Models\UserNotificationHistory;
use App\Models\UserDeviceToken;
use Illuminate\Support\Facades\Log;

class SendProfileCompletionReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:profile-completion-reminders {--role= : Filter by role type (chef, employer, talent)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily profile completion push notifications to users with incomplete profiles (<100%)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting profile completion reminder notification dispatch...');
        
        $roleFilter = $this->option('role');
        $users = User::active()->get();
        $sentCount = 0;
        $failedCount = 0;
        $processedCount = 0;

        $firebaseService = app(FirebaseService::class);

        foreach ($users as $user) {
            $processedCount++;
            
            // Determine active role
            $activeRole = $user->active_profile ?: 'talent';
            if ($roleFilter && strtolower($roleFilter) !== strtolower($activeRole)) {
                continue;
            }

            // Calculate completeness score based on role
            $completeness = 0;
            if ($activeRole === 'chef') {
                $compData = ProfileProgressService::calculateChef($user);
                $completeness = $compData['percentage'];
            } elseif ($activeRole === 'employer') {
                $compData = ProfileProgressService::calculateEmployer($user);
                $completeness = $compData['percentage'];
            } else {
                $compData = ProfileProgressService::calculateTalent($user);
                $completeness = $compData['percentage'];
            }

            // Skip if profile is already 100% complete
            if ($completeness >= 100) {
                continue;
            }

            // DEDUPLICATION CHECK: Prevent multiple popups for the same user in 24 hours
            $alreadySentToday = UserNotificationHistory::where('user_id', $user->id)
                ->where(function($q) {
                    $q->where('type', 'profile_completion')
                      ->orWhere('type', 'complete_profile')
                      ->orWhere('title', 'like', '%Complete Your Profile%');
                })
                ->where('created_at', '>=', now()->subHours(24))
                ->exists();

            if ($alreadySentToday) {
                $this->line("Skipped User #{$user->id} (Reminder already sent in last 24 hours)");
                continue;
            }

            // Build customized title & body message based on role & missing percentage
            $userName = !empty($user->full_name) ? $user->full_name : 'User';
            $title = "Complete Your Profile (" . $completeness . "% Done) 🚀";
            
            if ($activeRole === 'chef') {
                $body = "Hi " . $userName . ", your Chef profile is " . $completeness . "% complete. Complete your profile now to get 5x more hiring & booking calls!";
            } elseif ($activeRole === 'employer') {
                $body = "Hi " . $userName . ", your Employer profile is " . $completeness . "% complete. Complete your profile to attract top culinary talents & chefs!";
            } else {
                $body = "Hi " . $userName . ", your profile is " . $completeness . "% complete. Complete it now to get discovered by recruiters!";
            }

            // Get FCM Token
            $fcmToken = $user->fcm_token;
            if (empty($fcmToken)) {
                $deviceTokenRecord = UserDeviceToken::where('user_id', $user->id)
                    ->where('is_active', true)
                    ->latest()
                    ->first();
                if ($deviceTokenRecord) {
                    $fcmToken = $deviceTokenRecord->fcm_token;
                }
            }

            // Deep link payload for mobile app
            $payload = [
                'event' => 'profile_completion',
                'type' => 'profile_completion',
                'screen' => 'profile_completion',
                'deep_link' => 'jobrito://complete-profile',
                'url' => 'jobrito://complete-profile',
                'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                'user_id' => (string)$user->id,
                'completeness' => (string)$completeness,
                'role' => (string)$activeRole,
            ];

            // Send Push Notification
            $status = 'failed';
            $meta = $payload;
            if (!empty($fcmToken)) {
                try {
                    $result = $firebaseService->sendPushNotification($fcmToken, $title, $body, $payload);
                    $status = 'sent';
                    $meta = array_merge($payload, is_array($result) ? $result : ['result' => $result]);
                    $sentCount++;
                } catch (\Throwable $e) {
                    $status = 'failed';
                    $meta = array_merge($payload, ['error' => $e->getMessage()]);
                    $failedCount++;
                }
            } else {
                $status = 'failed_no_token';
                $meta = array_merge($payload, ['reason' => 'No active FCM token found for user']);
                $failedCount++;
            }

            // Log entry into database notification history table with type profile_completion
            UserNotificationHistory::create([
                'user_id' => $user->id,
                'type' => 'profile_completion',
                'recipient' => $fcmToken ?: 'no_token',
                'title' => $title,
                'body' => $body,
                'status' => $status,
                'is_read' => false,
                'metadata' => $meta,
            ]);

            $this->line("User #{$user->id} ({$user->mobile_number}) - Role: {$activeRole} - Completeness: {$completeness}% - Status: {$status}");
        }

        $summaryMsg = "Completed profile completion reminders! Processed: {$processedCount}, Sent: {$sentCount}, Failed/Skipped: {$failedCount}";
        $this->info($summaryMsg);
        Log::info($summaryMsg);

        return Command::SUCCESS;
    }
}
