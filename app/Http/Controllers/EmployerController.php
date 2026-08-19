<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerController extends Controller
{
    /**
     * Display the employer dashboard and jobs.
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return redirect()->route('login');
            }

            // Clean up incomplete/null name applications from the database
            \Illuminate\Support\Facades\DB::table('job_applications')
                ->whereNotIn('applicant_id', function($query) {
                    $query->select('id')
                          ->from('users')
                          ->whereNotNull('full_name')
                          ->where('full_name', '!=', '')
                          ->where('full_name', '!=', 'null');
                })
                ->delete();

            // Fetch job posts created by this user, eager loading applications, applicants, and chef profiles
            // Fetch job posts created by this user, eager loading applications, applicants, chef profiles, and socials
            $jobs = JobPost::with(['applications.applicant.chefProfile', 'applications.applicant.socials'])
                ->where('created_by', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Auto-populate dummy applicants logic has been removed to prevent fake applications.

            // Calculate counts
            // Note: active matches 'approved', pending matches 'pending', closed matches 'closed'
            $activeJobsCount = $jobs->where('status', 'approved')->count();
            $pendingJobsCount = $jobs->where('status', 'pending')->count();

            // Aggregate stats across active job posts
            $activeJobs = $jobs->where('status', 'approved');
            $totalApplicants = 0;
            $totalShortlisted = 0;
            $totalRejected = 0;
            $totalContacted = 0;

            foreach ($activeJobs as $job) {
                $totalApplicants += $job->applications->count();
                $totalShortlisted += $job->applications->where('status', 'shortlisted')->count();
                $totalRejected += $job->applications->where('status', 'rejected')->count();
                $totalContacted += $job->applications->where('status', 'contacted')->count();
            }

            // Fetch details of users who saved these jobs
            $allJobIds = $jobs->pluck('id')->filter()->toArray();
            $savedByMap = [];
            if (!empty($allJobIds) && \Illuminate\Support\Facades\Schema::hasTable('saved_jobs')) {
                try {
                    $savedRecords = \Illuminate\Support\Facades\DB::table('saved_jobs')
                        ->join('users', 'saved_jobs.user_id', '=', 'users.id')
                        ->whereIn('saved_jobs.job_post_id', $allJobIds)
                        ->select(
                            'saved_jobs.job_post_id',
                            'saved_jobs.id as saved_id',
                            'saved_jobs.created_at as saved_at',
                            'users.id as user_id',
                            'users.full_name',
                            'users.name',
                            'users.mobile_number',
                            'users.profile_photo_path',
                            'users.active_profile',
                            'users.user_role',
                            'users.city'
                        )
                        ->get();

                    foreach ($savedRecords as $sRec) {
                        $jId = $sRec->job_post_id;
                        if (!isset($savedByMap[$jId])) {
                            $savedByMap[$jId] = [];
                        }

                        $photoUrl = null;
                        if (!empty($sRec->profile_photo_path)) {
                            if (str_starts_with($sRec->profile_photo_path, 'http://') || str_starts_with($sRec->profile_photo_path, 'https://')) {
                                $photoUrl = $sRec->profile_photo_path;
                            } else {
                                $photoUrl = url('/' . ltrim($sRec->profile_photo_path, '/'));
                            }
                        }

                        $savedByMap[$jId][] = [
                            'saved_id'           => $sRec->saved_id,
                            'user_id'            => $sRec->user_id,
                            'id'                 => $sRec->user_id,
                            'full_name'          => $sRec->full_name ?: ($sRec->name ?: ('User #' . $sRec->user_id)),
                            'name'               => $sRec->full_name ?: ($sRec->name ?: ('User #' . $sRec->user_id)),
                            'mobile_number'      => $sRec->mobile_number,
                            'role'               => $sRec->active_profile ?: ($sRec->user_role ?: 'job_seeker'),
                            'active_role'        => $sRec->active_profile ?: ($sRec->user_role ?: 'job_seeker'),
                            'profile_photo_path' => $photoUrl,
                            'profile_photo_url'  => $photoUrl,
                            'city'               => $sRec->city,
                            'saved_at'           => $sRec->saved_at ? \Carbon\Carbon::parse($sRec->saved_at)->toIso8601String() : null,
                            'saved_at_formatted' => $sRec->saved_at ? \Carbon\Carbon::parse($sRec->saved_at)->format('j M Y, h:i A') : null,
                        ];
                    }
                } catch (\Throwable $th) {}
            }

            // Map database status values to match frontend expected tabs (active, pending, closed)
            $mappedJobs = $jobs->map(function ($job) use ($savedByMap) {
                $status = 'pending';
                if ($job->status === 'approved') {
                    $status = 'active';
                } elseif ($job->status === 'closed') {
                    $status = 'closed';
                }

                // Map application status fields as well
                $applicants = $job->applications->map(function ($app) {
                    $applicant = $app->applicant;
                    $chefProfile = $applicant ? $applicant->chefProfile : null;
                    $socials = $applicant ? $applicant->socials : null;

                    // Format skills array
                    $skills = [];
                    if ($applicant && is_array($applicant->skills)) {
                        $skills = $applicant->skills;
                    } elseif ($applicant && is_string($applicant->skills)) {
                        $skills = json_decode($applicant->skills, true) ?: [];
                    }

                    $appliedAt = $app->created_at ? $app->created_at->toIso8601String() : null;
                    $createdAtRaw = $app->created_at ? $app->created_at->toDateTimeString() : null;
                    $appliedDate = $app->created_at ? $app->created_at->format('j M Y') : 'N/A';
                    $appliedTime = $app->created_at ? $app->created_at->format('h:i A') : 'N/A';
                    $appliedDateTime = $app->created_at ? $app->created_at->format('j M Y, h:i A') : 'N/A';
                    $appliedTimeAgo = $app->created_at ? $app->created_at->diffForHumans() : 'N/A';
                    $appliedTimestamp = $app->created_at ? $app->created_at->timestamp : 0;

                    $chefData = null;
                    if ($chefProfile) {
                        $availability = [];
                        if ($chefProfile->availability_info) {
                            $availability = is_array($chefProfile->availability_info) 
                                ? $chefProfile->availability_info 
                                : (json_decode($chefProfile->availability_info, true) ?: []);
                        }

                        $chefData = [
                            'id' => $chefProfile->id,
                            'user_id' => $chefProfile->user_id,
                            'cuisine_specialty' => $chefProfile->cuisine_specialty ?: 'Multi-Cuisine',
                            'specialties' => $chefProfile->cuisine_specialty ?: 'Multi-Cuisine',
                            'bio' => $chefProfile->bio ?: '',
                            'calendly_link' => $chefProfile->calendly_link ?: '',
                            'approval_status' => $chefProfile->approval_status ?: 'approved',
                            'availability_info' => $availability,
                        ];
                    }

                    $othersList = [];
                    if ($socials && $socials->others) {
                        $othersList = is_array($socials->others) ? $socials->others : (json_decode($socials->others, true) ?: []);
                    }

                    $socialsData = $socials ? [
                        'instagram' => $socials->instagram ?: '',
                        'linkedin'  => $socials->linkedin ?: '',
                        'facebook'  => $socials->facebook ?: '',
                        'twitter'   => $socials->twitter ?: '',
                        'youtube'   => $socials->youtube ?: '',
                        'website'   => $socials->website ?: '',
                        'github'    => $socials->github ?: '',
                        'others'    => $othersList,
                    ] : null;

                    $country = $applicant ? ($applicant->country ?: null) : null;
                    $city = $applicant ? ($applicant->city ?: null) : null;
                    $experienceRange = $applicant ? ($applicant->experience_range ?: $applicant->experience_years ?: null) : null;
                    $photoPath = $applicant ? $applicant->profile_photo_path : null;
                    $photoUrl = null;
                    if (!empty($photoPath)) {
                        if (str_starts_with($photoPath, 'http://') || str_starts_with($photoPath, 'https://')) {
                            $photoUrl = $photoPath;
                        } else {
                            $photoUrl = url('/' . ltrim($photoPath, '/'));
                        }
                    }

                    if ($chefData) {
                        $chefData['profile_photo_path'] = $photoUrl;
                        $chefData['profile_photo'] = $photoUrl;
                        $chefData['photo_url'] = $photoUrl;
                        $chefData['avatar'] = $photoUrl;
                        $chefData['avatar_url'] = $photoUrl;
                    }

                    return [
                        'id' => $app->id,
                        'application_id' => $app->id,
                        'job_post_id' => $app->job_post_id,
                        'applicant_id' => $app->applicant_id,
                        'name' => $applicant ? ($applicant->full_name ?: null) : null,
                        'full_name' => $applicant ? ($applicant->full_name ?: null) : null,
                        'email' => $applicant ? ($applicant->email ?: null) : null,
                        'mobile_number' => $applicant ? ($applicant->mobile_number ?: null) : null,
                        'gender' => $applicant ? ($applicant->gender ?: null) : null,
                        'country' => $country,
                        'city' => $city,
                        'job_location' => $applicant ? ($applicant->city ?: null) : null,
                        'preference' => $applicant ? ($applicant->preferred_role ?: null) : null,
                        'status' => $app->status, // new, contacted, shortlisted, hired, rejected
                        'preferred_call_time' => $app->preferred_call_time,
                        'created_at' => $createdAtRaw,
                        'applied_date' => $appliedDate,
                        'applied_time' => $appliedTime,
                        'applied_date_time' => $appliedDateTime,
                        'applied_at' => $appliedAt,
                        'applied_time_ago' => $appliedTimeAgo,
                        'applied_timestamp' => $appliedTimestamp,
                        'experience_range' => $experienceRange,
                        'experience_years' => $experienceRange,
                        'preferred_role' => $applicant ? ($applicant->preferred_role ?: null) : null,
                        'current_employer' => $applicant ? ($applicant->current_employer ?: null) : null,
                        'profile_photo_path' => $photoUrl,
                        'profile_photo' => $photoUrl,
                        'photo_url' => $photoUrl,
                        'avatar' => $photoUrl,
                        'avatar_url' => $photoUrl,
                        'availability_status' => $applicant ? ($applicant->availability_status ?: null) : null,
                        'is_available' => $applicant ? (bool)$applicant->is_available : true,
                        'selected_language' => $applicant ? ($applicant->selected_language ?: null) : null,
                        'user_role' => $applicant ? ($applicant->active_profile ?? 'job_seeker') : 'job_seeker',
                        'active_role' => $applicant ? ($applicant->active_profile ?? 'job_seeker') : 'job_seeker',
                        'active_profile' => $applicant ? ($applicant->active_profile ?? 'job_seeker') : 'job_seeker',
                        'skills' => $skills,
                        'bio' => $chefProfile ? $chefProfile->bio : null,
                        'cuisine_specialty' => $chefProfile ? $chefProfile->cuisine_specialty : null,
                        'specialties' => $chefProfile ? $chefProfile->cuisine_specialty : null,
                        'calendly_link' => $chefProfile ? $chefProfile->calendly_link : null,
                        'chef_profile' => $chefData,
                        'chef_profile_details' => $chefData,
                        'socials' => $socialsData,
                        'user' => $applicant ? [
                            'id' => $applicant->id,
                            'full_name' => $applicant->full_name,
                            'name' => $applicant->full_name,
                            'email' => $applicant->email,
                            'mobile_number' => $applicant->mobile_number,
                            'gender' => $applicant->gender,
                            'country' => $country,
                            'city' => $city,
                            'job_location' => $applicant->city,
                            'preference' => $applicant->preferred_role,
                            'experience_range' => $experienceRange,
                            'experience_years' => $experienceRange,
                            'preferred_role' => $applicant->preferred_role,
                            'current_employer' => $applicant->current_employer,
                            'profile_photo_path' => $photoUrl,
                            'profile_photo' => $photoUrl,
                            'photo_url' => $photoUrl,
                            'avatar' => $photoUrl,
                            'avatar_url' => $photoUrl,
                            'availability_status' => $applicant->availability_status ?: null,
                            'is_available' => (bool)$applicant->is_available,
                            'selected_language' => $applicant->selected_language,
                            'active_profile' => $applicant->active_profile ?? 'job_seeker',
                            'active_role' => $applicant->active_role ?? 'job_seeker',
                            'user_role' => $applicant->user_role ?? 'job_seeker',
                            'skills' => $skills,
                            'chef_profile' => $chefData,
                            'socials' => $socialsData,
                        ] : null
                    ];
                });

                $savedUsers = isset($savedByMap[$job->id]) ? $savedByMap[$job->id] : [];
                $savedCount = count($savedUsers);

                return [
                    'id'                   => $job->id,
                    'title'                => $job->title,
                    'status'               => $status,
                    'location'             => $job->location ?? 'N/A',
                    'date_posted'          => $job->created_at ? $job->created_at->format('j F Y') : 'N/A',
                    'openings'             => $job->open_positions ?? 1,
                    'type'                 => $job->job_type ?? 'Full-time',
                    'total_saved_count'    => $savedCount,
                    'saves_count'          => $savedCount,
                    'saved_count'          => $savedCount,
                    'saved_by_users_count' => $savedCount,
                    'saved_by_users'       => $savedUsers,
                    'saved_users'          => $savedUsers,
                    'saved_by'             => $savedUsers,
                    'applicants'           => $applicants,
                ];
            });

            if ($request->wantsJson() || $request->ajax() || $request->is('api/*')) {
                return response()->json([
                    'success' => true,
                    'metrics' => [
                        'total_applicants' => $totalApplicants,
                        'shortlisted' => $totalShortlisted,
                        'rejected' => $totalRejected,
                        'contacted' => $totalContacted,
                        'active_jobs_count' => $activeJobsCount,
                        'pending_jobs_count' => $pendingJobsCount,
                    ],
                    'jobs' => $mappedJobs,
                ]);
            }

            // Pass details of the employer contact info
            $employerName = $user->full_name;
            $companyName = $jobs->first() ? $jobs->first()->company : 'Grand Hyatt Dubai';

            return view('employer', [
                'jobs' => $mappedJobs,
                'employerName' => $employerName,
                'companyName' => $companyName,
                'avatarUrl' => $user->profile_photo_path ?? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120',
                'activeJobsCount' => $activeJobsCount,
                'pendingJobsCount' => $pendingJobsCount,
                'totalApplicants' => $totalApplicants,
                'totalShortlisted' => $totalShortlisted,
                'totalRejected' => $totalRejected,
                'totalContacted' => $totalContacted,
            ]);
        } catch (\Exception $e) {
            if ($request->wantsJson() || $request->ajax() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to load dashboard metrics.',
                    'error' => $e->getMessage()
                ], 500);
            }
            return response('Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created job post in storage.
     */
    public function storeJob(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'openings' => 'required|integer|min:1',
                'type' => 'required|string|max:100',
                'status' => 'required|string|in:active,pending,closed',
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
            }

            $company = 'Grand Hyatt Dubai';
            $existingPost = JobPost::where('created_by', $user->id)->first();
            if ($existingPost) {
                $company = $existingPost->company;
            }

            // Always start as pending — admin must approve before job goes live
            $dbStatus = 'pending';
            if ($validated['status'] === 'closed') {
                $dbStatus = 'closed';
            }

            $job = JobPost::create([
                'created_by' => $user->id,
                'title' => $validated['title'],
                'category' => 'dubai',
                'company' => $company,
                'location' => $validated['location'],
                'contact_info' => $user->email ?? 'recruitment@grandhyatt.com',
                'description' => 'Detailed description will be added soon.',
                'job_type' => $validated['type'],
                'open_positions' => $validated['openings'],
                'status' => $dbStatus,
            ]);

            $mappedJob = [
                'id' => $job->id,
                'title' => $job->title,
                'status' => $validated['status'],
                'location' => $job->location,
                'date_posted' => $job->created_at ? $job->created_at->format('j F Y') : 'N/A',
                'openings' => $job->open_positions,
                'type' => $job->job_type,
                'applicants' => [],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy posted successfully!',
                'job' => $mappedJob,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to store job post.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Close the specified job posting.
     */
    public function closeJob($id)
    {
        try {
            $job = JobPost::where('created_by', Auth::id())->findOrFail($id);
            $job->update(['status' => 'closed']);

            return response()->json([
                'success' => true,
                'message' => "Job '{$job->title}' has been closed.",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to close job posting.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of a specific applicant (JobApplication).
     */
    public function updateApplicantStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:new,pending,shortlisted,contacted,hired,rejected',
            ]);

            $application = JobApplication::find($id);
            if (!$application) {
                return response()->json([
                    'success' => false,
                    'message' => "Job application #{$id} not found."
                ], 404);
            }
            
            $newStatus = $validated['status'];
            if ($newStatus === 'pending') {
                $newStatus = 'new';
            }

            $application->update(['status' => $newStatus]);

            // Shoot automatic FCM Push Notification & In-App Notification to Applicant Candidate
            try {
                \App\Services\NotificationTriggerService::notifyApplicationStatusChange($application, $newStatus);
            } catch (\Throwable $ne) {
                \Illuminate\Support\Facades\Log::error('Application status notification error: ' . $ne->getMessage());
            }

            $applicantUser = $application->applicant ?: \App\Models\User::find($application->applicant_id);

            $mappedApplicant = [
                'id' => $application->id,
                'name' => $applicantUser ? ($applicantUser->full_name ?: 'Candidate #' . $applicantUser->id) : 'Candidate #' . $application->applicant_id,
                'status' => $application->status,
                'applied_date' => $application->created_at ? $application->created_at->format('j M Y') : 'N/A',
            ];

            return response()->json([
                'success' => true,
                'message' => "Candidate status updated to {$application->status} and notification sent to applicant.",
                'applicant' => $mappedApplicant,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('updateApplicantStatus Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update applicant status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
