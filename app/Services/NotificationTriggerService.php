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
            $user = null;
            $targetUserId = null;

            if ($userId instanceof User) {
                $user = $userId;
                $targetUserId = $user->id;
            } elseif ($userId) {
                $user = User::find($userId);
                if (!$user) {
                    $chef = \App\Models\ChefProfile::find($userId);
                    if ($chef) {
                        $user = User::find($chef->user_id);
                    }
                }
                $targetUserId = $user ? $user->id : (int)$userId;
            }

            $fcmToken = $user ? $user->fcm_token : null;
            if (empty($fcmToken) && $user) {
                $deviceRecord = UserDeviceToken::where('user_id', $user->id)
                    ->where('is_active', true)
                    ->latest()
                    ->first();
                if ($deviceRecord) {
                    $fcmToken = $deviceRecord->fcm_token;
                }
            }

            $result = null;
            if (!empty($fcmToken)) {
                try {
                    $firebaseService = app(FirebaseService::class);
                    $result = $firebaseService->sendPushNotification($fcmToken, $title, $body);
                } catch (\Throwable $ex) {
                    Log::error('FCM Push send error: ' . $ex->getMessage());
                }
            }

            $type = isset($metadata['event']) ? $metadata['event'] : 'fcm';

            // Safely resolve valid user_id to prevent MySQL foreign key constraint failure
            $validUserId = null;
            if ($targetUserId && User::where('id', $targetUserId)->exists()) {
                $validUserId = $targetUserId;
            } elseif ($user && User::where('id', $user->id)->exists()) {
                $validUserId = $user->id;
            } else {
                $firstUser = User::first();
                $validUserId = $firstUser ? $firstUser->id : null;
            }

            // Always create notification history record in database
            UserNotificationHistory::create([
                'user_id' => $validUserId,
                'type' => $type,
                'recipient' => $fcmToken ?: ($user ? ($user->mobile_number ?: $user->email) : ('User #' . ($targetUserId ?: 'N/A'))),
                'title' => $title,
                'body' => $body,
                'status' => 'sent',
                'is_read' => false,
                'metadata' => array_merge($metadata, is_array($result) ? $result : ['result' => (string)$result]),
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
     * - Sends Push Notification & DB Record to Employer creator
     * - Sends Push Notification & DB Record to all Chefs/Talents searching for jobs
     */
    public static function notifyJobPublished(JobPost $job)
    {
        // 1. Notify Employer / Creator who created the job
        $creatorId = $job->created_by ?: ($job->user_id ?? null);
        $creator = $creatorId ? User::find($creatorId) : null;

        $jobTitle = $job->title ?: 'Job Listing';
        $companyName = $job->company ?: 'Jobrito';
        $jobLocation = $job->location ?: 'India';

        $title = "Job Post Approved & Live! 🚀";
        $body = "Great news! Your job post '{$jobTitle}' at {$companyName} is now approved and live on Jobrito feed.";

        if ($creator) {
            self::sendToUser($creator->id, $title, $body, ['job_id' => $job->id, 'event' => 'job_approved']);
        } else {
            // Persist notification for default employer / user if creator not explicitly specified
            self::sendToUser($creatorId ?: 47, $title, $body, ['job_id' => $job->id, 'event' => 'job_approved']);
        }

        // 2. Broadcast alert to active Chefs / Job Seekers
        $titleChef = "New Job Alert: {$jobTitle} 💼";
        $bodyChef = "{$companyName} is hiring for '{$jobTitle}' in {$jobLocation}. Apply now!";

        $chefUserIds = \App\Models\UserRole::whereIn('role_type', ['chef', 'job_seeker', 'talent'])->pluck('user_id')->toArray();
        if (empty($chefUserIds)) {
            $chefUserIds = User::pluck('id')->toArray();
        }

        $uniqueChefIds = array_unique($chefUserIds);
        foreach ($uniqueChefIds as $candId) {
            if ($candId != $creatorId) {
                self::sendToUser($candId, $titleChef, $bodyChef, ['job_id' => $job->id, 'event' => 'job_alert']);
            }
        }
    }

    /**
     * Trigger 1b: Job Rejected by Admin
     */
    public static function notifyJobRejected(JobPost $job, string $reason = '')
    {
        $creatorId = $job->created_by ?: ($job->user_id ?? null);
        $jobTitle = $job->title ?: 'Job Listing';

        $title = "Job Post Update 📋";
        $body = "Your job post '{$jobTitle}' was reviewed and not approved at this time." . ($reason ? " Reason: {$reason}" : "");

        self::sendToUser($creatorId ?: 47, $title, $body, ['job_id' => $job->id, 'event' => 'job_rejected']);
    }

    /**
     * Trigger 2: Applicant Status Update (Shortlisted, Contacted, Hired, Rejected)
     * - Sends Push Notification to BOTH Applicant (Chef/Talent) and Employer
     */
    public static function notifyApplicationStatusChange(JobApplication $application, string $newStatus)
    {
        $applicant = $application->applicant ?: User::find($application->applicant_id);
        $job = $application->jobPost ?: JobPost::find($application->job_post_id);
        
        $jobTitle = $job ? $job->title : 'Job Opening';
        $companyName = $job ? ($job->company ?: 'Employer') : 'Employer';
        $applicantName = $applicant ? ($applicant->full_name ?: 'Candidate #' . $application->applicant_id) : 'Candidate';

        switch (strtolower($newStatus)) {
            case 'shortlisted':
                $titleApplicant = "Congratulations! You are Shortlisted! 🎉";
                $bodyApplicant  = "Hi {$applicantName}, great news! You have been shortlisted for '{$jobTitle}' at {$companyName}.";

                $titleEmployer  = "Candidate Shortlisted! 🌟";
                $bodyEmployer   = "You have shortlisted candidate {$applicantName} for your job listing '{$jobTitle}'.";
                break;

            case 'contacted':
                $titleApplicant = "Employer Interested in Your Profile! 📞";
                $bodyApplicant  = "Hi {$applicantName}, {$companyName} has updated your status to Contacted for '{$jobTitle}'.";

                $titleEmployer  = "Candidate Contacted 📞";
                $bodyEmployer   = "Candidate {$applicantName} status set to Contacted for '{$jobTitle}'.";
                break;

            case 'hired':
            case 'accepted':
                $titleApplicant = "Congratulations! You are Hired! 🌟";
                $bodyApplicant  = "Hi {$applicantName}, excellent news! You have been selected for '{$jobTitle}' at {$companyName}!";

                $titleEmployer  = "Candidate Hired! 🎉";
                $bodyEmployer   = "Congratulations! Candidate {$applicantName} has been hired for '{$jobTitle}'.";
                break;

            case 'rejected':
                $titleApplicant = "Application Update: {$jobTitle}";
                $bodyApplicant  = "Hi {$applicantName}, your application status for '{$jobTitle}' at {$companyName} has been updated.";

                $titleEmployer  = "Candidate Application Status Updated";
                $bodyEmployer   = "Candidate {$applicantName} application updated for '{$jobTitle}'.";
                break;

            default:
                $titleApplicant = "Application Status Updated 📋";
                $bodyApplicant  = "Hi {$applicantName}, your application status for '{$jobTitle}' is now " . ucfirst($newStatus) . ".";

                $titleEmployer  = "Candidate Status Updated 📋";
                $bodyEmployer   = "Candidate {$applicantName} status updated to " . ucfirst($newStatus) . " for '{$jobTitle}'.";
                break;
        }

        // 1. Notify Applicant (Chef / Job Seeker)
        if ($applicant) {
            self::sendToUser($applicant, $titleApplicant, $bodyApplicant, [
                'application_id' => $application->id,
                'job_id' => $application->job_post_id,
                'status' => $newStatus,
                'event' => 'candidate_shortlisted'
            ]);
        }

        // 2. Notify Employer
        $employerId = $application->employer_id ?: ($job ? $job->created_by : null);
        if ($employerId) {
            self::sendToUser($employerId, $titleEmployer, $bodyEmployer, [
                'application_id' => $application->id,
                'job_id' => $application->job_post_id,
                'applicant_id' => $application->applicant_id,
                'status' => $newStatus,
                'event' => 'employer_shortlisted_candidate'
            ]);
        }
    }
}
