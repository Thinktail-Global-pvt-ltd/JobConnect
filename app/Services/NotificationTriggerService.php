<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserDeviceToken;
use App\Models\UserNotificationHistory;
use App\Models\JobPost;
use App\Models\JobApplication;
use Illuminate\Support\Facades\Log;

class NotificationTriggerService
{
    /**
     * Send Push Notification helper method.
     */
    public static function sendToUser($userId, string $title, string $body, array $metadata = [])
    {
        try {
            $user = $userId instanceof User ? $userId : User::find($userId);
            if (!$user) {
                return false;
            }

            $fcmToken = $user->fcm_token;
            if (empty($fcmToken)) {
                $deviceRecord = UserDeviceToken::where('user_id', $user->id)
                    ->where('is_active', true)
                    ->latest()
                    ->first();
                if ($deviceRecord) {
                    $fcmToken = $deviceRecord->fcm_token;
                }
            }

            if (empty($fcmToken)) {
                // Log attempt when token is missing for user traceability
                UserNotificationHistory::create([
                    'user_id' => $user->id,
                    'type' => isset($metadata['event']) ? $metadata['event'] : 'system',
                    'recipient' => $user->mobile_number ?: ($user->email ?: 'system'),
                    'title' => $title,
                    'body' => $body,
                    'status' => 'sent',
                    'is_read' => false,
                    'metadata' => array_merge($metadata, ['note' => 'In-app notification persisted']),
                ]);
                return false;
            }

            $firebaseService = app(FirebaseService::class);
            $result = $firebaseService->sendPushNotification($fcmToken, $title, $body);

            UserNotificationHistory::create([
                'user_id' => $user->id,
                'type' => 'fcm',
                'recipient' => $fcmToken,
                'title' => $title,
                'body' => $body,
                'status' => 'sent',
                'metadata' => array_merge($metadata, is_array($result) ? $result : ['result' => $result]),
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('NotificationTriggerService Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Trigger 0: Job Created / Submitted by Employer
     * - Sends Push Notification & In-App Notification to Employer creator
     */
    public static function notifyJobCreated(JobPost $job)
    {
        $creator = $job->creator ?: User::find($job->created_by);
        if ($creator) {
            $title = "Job Post Created Successfully 🎉";
            $body = "Your job post '{$job->title}' at {$job->company} has been created and is waiting for admin approval.";
            self::sendToUser($creator, $title, $body, [
                'job_id' => $job->id,
                'event' => 'job_created',
                'status' => 'pending'
            ]);
        }
    }

    /**
     * Trigger 1: Job Published / Approved by Admin
     * - Sends Push Notification to Employer creator
     * - Sends Push Notification to relevant active Chefs/Talents searching for jobs
     */
    public static function notifyJobPublished(JobPost $job)
    {
        // 1. Notify Employer who created the job
        $creator = $job->creator ?: User::find($job->created_by);
        if ($creator) {
            $title = "Job Post Approved & Live! 🚀";
            $body = "Great news! Your job post '{$job->title}' at {$job->company} is now approved and live on JobConnect feed.";
            self::sendToUser($creator, $title, $body, ['job_id' => $job->id, 'event' => 'job_approved']);
        }

        // 2. Notify Chefs / Job Seekers (Broadcast alert to active chefs/job seekers)
        $titleChef = "New Job Alert: {$job->title} 💼";
        $bodyChef = "{$job->company} is hiring for '{$job->title}' in {$job->location}. Apply now!";
        
        $activeCandidates = User::active()
            ->where('id', '!=', $job->created_by)
            ->whereNotNull('fcm_token')
            ->take(20)
            ->get();

        foreach ($activeCandidates as $candidate) {
            self::sendToUser($candidate, $titleChef, $bodyChef, ['job_id' => $job->id, 'event' => 'job_alert']);
        }
    }

    /**
     * Trigger 2: Applicant Status Update (Shortlisted, Contacted, Hired, Rejected)
     * - Sends Push Notification to the Applicant
     */
    public static function notifyApplicationStatusChange(JobApplication $application, string $newStatus)
    {
        $applicant = $application->applicant;
        if (!$applicant) {
            return;
        }

        $jobTitle = $application->jobPost ? $application->jobPost->title : 'Job Opening';
        $companyName = $application->jobPost ? $application->jobPost->company : 'Employer';
        $applicantName = $applicant->full_name ?: 'Candidate';

        switch (strtolower($newStatus)) {
            case 'shortlisted':
                $title = "Congratulations! You are Shortlisted! 🎉";
                $body = "Hi {$applicantName}, great news! You have been shortlisted for '{$jobTitle}' at {$companyName}.";
                break;
            case 'contacted':
                $title = "Employer Interested in Your Profile! 📞";
                $body = "Hi {$applicantName}, {$companyName} has updated your status to Contacted for '{$jobTitle}'.";
                break;
            case 'hired':
            case 'accepted':
                $title = "Congratulations! You are Hired! 🌟";
                $body = "Hi {$applicantName}, excellent news! You have been selected for '{$jobTitle}' at {$companyName}!";
                break;
            case 'rejected':
                $title = "Application Update: {$jobTitle}";
                $body = "Hi {$applicantName}, your application for '{$jobTitle}' at {$companyName} has been updated.";
                break;
            default:
                $title = "Application Status Updated 📋";
                $body = "Hi {$applicantName}, your application status for '{$jobTitle}' is now " . ucfirst($newStatus) . ".";
                break;
        }

        self::sendToUser($applicant, $title, $body, [
            'application_id' => $application->id,
            'job_id' => $application->job_post_id,
            'status' => $newStatus,
            'event' => 'application_status_updated'
        ]);
    }
}
