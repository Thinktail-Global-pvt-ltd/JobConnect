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

            // Send Push Notification
            $status = 'failed';
            $meta = [];
            if (!empty($fcmToken)) {
                try {
                    $result = $firebaseService->sendPushNotification($fcmToken, $title, $body);
                    $status = 'sent';
                    $meta = is_array($result) ? $result : ['result' => $result];
                    $sentCount++;
                } catch (\Throwable $e) {
                    $status = 'failed';
                    $meta = ['error' => $e->getMessage()];
                    $failedCount++;
                }
            } else {
                $status = 'failed_no_token';
                $meta = ['reason' => 'No active FCM token found for user'];
                $failedCount++;
            }

            // Log entry into database notification history table
            UserNotificationHistory::create([
                'user_id' => $user->id,
                'type' => 'fcm',
                'recipient' => $fcmToken ?: 'no_token',
                'title' => $title,
                'body' => $body,
                'status' => $status,
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
