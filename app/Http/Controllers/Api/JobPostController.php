<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPostController extends Controller
{
    /**
     * POST /api/jobs
     *
     * Create a new job post.
     *
     * Required fields:
     *   - title         (string)
     *   - category      (dubai | overseas | community)
     *   - company       (string)
     *   - contact_info  (string)
     *   - description   (string)
     *
     * Optional fields:
     *   - salary, location, company_logo_url, job_type, experience_range
     *   - requirements  (array)
     *   - benefits      (array)
     *   - open_positions(integer)
     *   - showcase_image_url, map_image_url
     *
     * Overseas-specific (required when category = overseas):
     *   - country, visa_assistance, accommodation_available, contract_duration
     *
     * Referral fields (new):
     *   - is_referral        (boolean, default false)
     *     When true the post is treated as a referral submission in the community feed.
     *   - submitted_by_role  (jobseeker | chef | employer | agency)
     *     Saved automatically from the authenticated user's role_type.
     *     Can also be sent explicitly by the client.
     *
     * Rate limit:
     *   Community / referral category posts are limited to 1 per 24 hours per user.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user && $request->bearerToken()) {
            $tokenStr = $request->bearerToken();
            if (str_contains($tokenStr, '|')) {
                $tokenId = explode('|', $tokenStr)[0];
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
        }

        if ($user) {
            $userRole = strtolower(trim($user->active_profile ?: ($user->user_role ?: '')));
            if ($request->filled('submitted_by_role')) {
                $userRole = strtolower(trim(str_replace('_', '', $request->input('submitted_by_role'))));
            }

            $isEmployer = in_array($userRole, ['employer', 'recruiter', 'hirer', 'agency', 'administrator', 'admin']);

            // Employers have UNLIMITED job creation. Chef & Jobseeker are limited to 5 jobs per day.
            if (!$isEmployer) {
                $maxDailyAllowed = 5;

                $todayJobsCount = JobPost::where('created_by', $user->id)
                    ->where('created_at', '>=', \Carbon\Carbon::today())
                    ->count();

                if ($todayJobsCount >= $maxDailyAllowed) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Daily posting limit reached: Chef and Jobseeker users can post a maximum of 5 jobs per day. Please try again tomorrow.',
                        'daily_limit' => $maxDailyAllowed,
                        'posted_today' => $todayJobsCount,
                    ], 429);
                }
            }
        }

        $validator = Validator::make($request->all(), [
            'title'                  => 'required|string|max:255',
            'category'               => 'required|string|max:50',
            'company'                => 'required|string|max:255',
            'contact_info'           => 'required|string',
            'description'            => 'required|string',

            // Optional generic fields
            'salary'                 => 'nullable|string|max:100',
            'salary_min'             => 'nullable|numeric|min:0',
            'salary_max'             => 'nullable|numeric|min:0',
            'salary_currency'        => 'nullable|string|max:10',
            'location'               => 'nullable|string|max:255',
            'company_logo_url'       => 'nullable|url',
            'job_type'               => 'nullable|string|max:100',
            'experience_range'       => 'nullable|string|max:100',
            'requirements'           => 'nullable|array',
            'requirements.*'         => 'string|max:255',
            'benefits'               => 'nullable|array',
            'benefits.*'             => 'string|max:255',
            'open_positions'         => 'nullable|integer|min:1',
            'showcase_image_url'     => 'nullable|url',
            'map_image_url'          => 'nullable|url',

            // Overseas & region-specific fields
            'country'                => 'nullable|string|max:100',
            'visa_assistance'        => 'nullable|boolean',
            'accommodation_available'=> 'nullable|boolean',
            'contract_duration'      => 'nullable|string|max:100',

            // Referral fields
            'is_referral'            => 'nullable|boolean',
            'contact_person'         => 'nullable|string|max:255',
            // Accept both: "job_seeker" (with underscore) and "jobseeker" (without)
            'submitted_by_role'      => 'nullable|string|in:jobseeker,job_seeker,chef,employer,agency',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Auto-detect submitted_by_role from the user's profile if not explicitly sent
        $rawRole = $request->submitted_by_role ?? $user->role_type ?? null;

        // Normalize: "job_seeker" → "jobseeker" for consistent DB storage
        $submittedByRole = $rawRole
            ? str_replace('_', '', strtolower(trim($rawRole)))
            : null;

        // Default status is pending, is_pinned is false
        $jobPost = JobPost::create(array_merge($validator->validated(), [
            'created_by'        => $user->id,
            'status'            => 'pending',
            'is_pinned'         => false,
            'submitted_by_role' => $submittedByRole,
        ]));

        // Dispatch FCM Push Notification & In-App Notification History entry
        try {
            \App\Services\NotificationTriggerService::notifyJobCreated($jobPost);
        } catch (\Throwable $ne) {
            \Illuminate\Support\Facades\Log::error('Job creation notification error: ' . $ne->getMessage());
        }

        return response()->json([
            'success'   => true,
            'message'   => 'Job post submitted successfully and is pending moderation.',
            'deep_link' => 'jobrito://job/' . $jobPost->id,
            'url'       => 'https://jobrito.com/job/' . $jobPost->id,
            'screen'    => 'job_detail',
            'target_id' => (string)$jobPost->id,
            'job_post'  => array_merge($jobPost->toArray(), [
                'deep_link' => 'jobrito://job/' . $jobPost->id,
                'url'       => 'https://jobrito.com/job/' . $jobPost->id,
                'screen'    => 'job_detail',
            ]),
        ], 201);
    }

    /**
     * POST /api/jobs/referrals
     *
     * Create a new referral job post.
     */
    public function storeReferral(Request $request)
    {
        $request->merge(['is_referral' => true]);
        return $this->store($request);
    }

    /**
     * GET /api/my-jobs
     *
     * Retrieve all job posts / referrals submitted by the authenticated user.
     * Optional filter:
     *   - is_referral  (boolean)  e.g. ?is_referral=true
     *   - status       (pending | approved | rejected)
     */
    public function myJobs(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            $token = $request->bearerToken();
            if ($token) {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                if (!$tokenObj && str_contains($token, '|')) {
                    $tokenId = explode('|', $token)[0];
                    $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                }
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
        }
        if (!$user && ($request->filled('user_id') || $request->filled('applicant_id') || $request->filled('id'))) {
            $uId = $request->input('user_id') ?: ($request->input('applicant_id') ?: $request->input('id'));
            $user = \App\Models\User::find($uId);
        }
        if (!$user) {
            $user = \Illuminate\Support\Facades\Auth::user();
        }
        if (!$user) {
            $user = \App\Models\User::first();
        }

        $activeRole = strtolower($user ? ($user->active_profile ?? 'job_seeker') : 'job_seeker');

        // 1. Fetch all Job Applications submitted by this user (Applicant)
        $applications = \App\Models\JobApplication::with(['jobPost.creator'])
            ->where('applicant_id', $user ? $user->id : 0)
            ->latest()
            ->get();

        $appliedJobs = $applications->map(function ($app) {
            $job = $app->jobPost;
            if (!$job) {
                return null;
            }

            return [
                'application_id'        => $app->id,
                'application_status'    => $app->status ?? 'new',
                'preferred_call_time'   => $app->preferred_call_time,
                'applied_at'            => $app->created_at ? $app->created_at->toDateTimeString() : null,
                'applied_at_formatted'  => $app->created_at ? $app->created_at->format('j M Y, h:i A') : null,
                'id'                    => $job->id,
                'title'                 => $job->title,
                'company'               => $job->company,
                'category'              => $job->category,
                'location'              => $job->location,
                'country'               => $job->country,
                'salary'                => $job->salary,
                'salary_min'            => $job->salary_min,
                'salary_max'            => $job->salary_max,
                'salary_currency'       => $job->salary_currency,
                'job_type'              => $job->job_type,
                'experience_range'      => $job->experience_range,
                'description'           => $job->description,
                'contact_info'          => $job->contact_info,
                'contact_person'        => $job->contact_person,
                'company_logo_url'      => $job->company_logo_url,
                'showcase_image_url'    => $job->showcase_image_url,
                'map_image_url'         => $job->map_image_url,
                'status'                => $job->status,
                'is_referral'           => (bool)$job->is_referral,
                'is_training'           => false,
                'applied'               => true,
                'is_applied'            => true,
                'has_applied'           => true,
                'submitted_by_role'     => $job->submitted_by_role,
                'posted_by_role'        => $job->posted_by_role,
                'created_at'            => $job->created_at ? $job->created_at->toDateTimeString() : null,
            ];
        })->filter()->values();

        // 2. Fetch Training Applications submitted by this user
        $appliedTrainingJobs = collect();
        if (\Illuminate\Support\Facades\Schema::hasTable('training_applications')) {
            $tApps = \App\Models\TrainingApplication::with(['trainingOpportunity'])
                ->where('applicant_id', $user ? $user->id : 0)
                ->latest()
                ->get();

            $appliedTrainingJobs = $tApps->map(function ($tApp) {
                $training = $tApp->trainingOpportunity;
                if (!$training && $tApp->training_id) {
                    $training = \App\Models\TrainingOpportunity::find($tApp->training_id);
                }
                $tId = $training ? $training->id : ($tApp->training_id ?: $tApp->id);

                return [
                    'application_id'        => $tApp->id,
                    'application_status'    => $tApp->status ?? 'applied',
                    'preferred_call_time'   => $tApp->preferred_call_time,
                    'applied_at'            => $tApp->created_at ? $tApp->created_at->toDateTimeString() : null,
                    'applied_at_formatted'  => $tApp->created_at ? $tApp->created_at->format('j M Y, h:i A') : null,
                    'id'                    => 'training_' . $tId,
                    'training_id'           => $tId,
                    'title'                 => $training ? ($training->program_name ?: ('Training Program #' . $tId)) : ('Training Program #' . $tId),
                    'company'               => $training ? ($training->provider_name ?: 'Jobrito Academy') : 'Jobrito Academy',
                    'category'              => 'training',
                    'location'              => $training ? ($training->location ?: 'India') : 'India',
                    'country'               => 'India',
                    'status'                => $training ? ($training->status ?: 'Published') : 'Published',
                    'is_training'           => true,
                    'applied'               => true,
                    'is_applied'            => true,
                    'has_applied'           => true,
                    'created_at'            => $tApp->created_at ? $tApp->created_at->toDateTimeString() : null,
                ];
            });
        }

        $allAppliedJobs = $appliedJobs->concat($appliedTrainingJobs);

        // 3. Fetch Job Posts created by this user
        $createdQuery = JobPost::where('created_by', $user ? $user->id : 0);
        if ($request->has('is_referral')) {
            $createdQuery->where('is_referral', filter_var($request->is_referral, FILTER_VALIDATE_BOOLEAN));
        }
        if ($request->filled('status') && $request->status === 'all') {
            // status=all → show everything
        } elseif ($request->filled('status') && $request->status !== 'all') {
            $createdQuery->where('status', $request->status);
        } else {
            $createdQuery->where('status', 'approved');
        }

        $createdJobs = $createdQuery->latest()->get();

        $pendingCreatedJobs = JobPost::where('created_by', $user ? $user->id : 0)
            ->where('status', 'pending')
            ->latest()->get();

        // Fetch details of users who saved any of this user's created jobs
        $createdJobIds = $createdJobs->pluck('id')->merge($pendingCreatedJobs->pluck('id'))->filter()->toArray();
        $savedByMap = [];
        $rawSavedCounts = [];
        if (!empty($createdJobIds) && \Illuminate\Support\Facades\Schema::hasTable('saved_jobs')) {
            try {
                $countsQuery = \Illuminate\Support\Facades\DB::table('saved_jobs')
                    ->whereIn('job_post_id', $createdJobIds)
                    ->select('job_post_id', \Illuminate\Support\Facades\DB::raw('count(*) as aggregate'))
                    ->groupBy('job_post_id')
                    ->pluck('aggregate', 'job_post_id')
                    ->toArray();

                foreach ($countsQuery as $jId => $cnt) {
                    $rawSavedCounts[$jId] = (int)$cnt;
                }

                $savedRecords = \Illuminate\Support\Facades\DB::table('saved_jobs')
                    ->leftJoin('users', 'saved_jobs.user_id', '=', 'users.id')
                    ->whereIn('saved_jobs.job_post_id', $createdJobIds)
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

        $mapCreatedJobItem = function ($job) use ($savedByMap, $rawSavedCounts) {
            $savedUsers = isset($savedByMap[$job->id]) ? $savedByMap[$job->id] : [];
            $savedCount = isset($rawSavedCounts[$job->id]) ? $rawSavedCounts[$job->id] : count($savedUsers);
            $jobArr = $job->toArray();
            $jobArr['total_saved_count']    = $savedCount;
            $jobArr['saves_count']          = $savedCount;
            $jobArr['saved_count']          = $savedCount;
            $jobArr['saved_by_users_count'] = $savedCount;
            $jobArr['saved_by_users']       = $savedUsers;
            $jobArr['saved_users']          = $savedUsers;
            $jobArr['saved_by']             = $savedUsers;

            return $jobArr;
        };

        $mappedCreatedJobs = $createdJobs->map($mapCreatedJobItem);
        $mappedPendingCreatedJobs = $pendingCreatedJobs->map($mapCreatedJobItem);

        $isJobSeekerOrChef = in_array($activeRole, ['chef', 'cook', 'job_seeker', 'jobseeker', 'talent']);
        $combinedJobs = $isJobSeekerOrChef
            ? $allAppliedJobs->concat($mappedCreatedJobs)
            : $mappedCreatedJobs->concat($allAppliedJobs);

        return response()->json([
            'success'                   => true,
            'user_role'                 => $activeRole,
            'total_applied_jobs'        => $allAppliedJobs->count(),
            'total_created_jobs'        => $createdJobs->count(),
            'total_pending_jobs'        => $pendingCreatedJobs->count(),
            'applied_jobs'              => $allAppliedJobs->values(),
            'created_jobs'              => $mappedCreatedJobs->values(),
            'pending_created_jobs'      => $mappedPendingCreatedJobs->values(),
            'jobs'                      => $combinedJobs->values(),
            'data'                      => $combinedJobs->values(),
        ]);
    }

    /**
     * GET /api/user/daily-applies
     * GET /api/user/apply-status
     * GET /api/user/applies-left
     * GET /api/jobs/apply-status
     *
     * Check how many job applications a user has completed today and whether they have applies remaining.
     */
    public function getDailyApplyStatus(Request $request)
    {
        $user = $request->user();

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

        if (!$user && ($request->filled('user_id') || $request->filled('id'))) {
            $targetId = $request->input('user_id') ?? $request->input('id');
            $user = \App\Models\User::find($targetId);
        }

        if (!$user) {
            $user = \App\Models\User::first();
        }

        $userId = $user ? $user->id : 0;
        $dailyLimit = (int) $request->input('limit', 5);

        // Count number of applications submitted by user today
        $appliedDoneToday = \App\Models\JobApplication::where('applicant_id', $userId)
            ->where('created_at', '>=', \Carbon\Carbon::today())
            ->count();

        $appliesLeft = max(0, $dailyLimit - $appliedDoneToday);
        $hasAppliesLeft = $appliedDoneToday < $dailyLimit;

        return response()->json([
            'success'            => true,
            'user_id'            => $userId,
            'user_name'          => $user ? ($user->full_name ?: ('User #' . $user->id)) : 'User',
            'user_role'          => $user ? ($user->active_profile ?? 'job_seeker') : 'job_seeker',
            'date'               => \Carbon\Carbon::today()->toDateString(),
            'applied_done_today' => $appliedDoneToday,
            'applies_count_today'=> $appliedDoneToday,
            'daily_limit'        => $dailyLimit,
            'applies_left_today' => $appliesLeft,
            'has_applies_left'   => (bool)$hasAppliesLeft,
            'is_applies_left'    => (bool)$hasAppliesLeft,
            'can_apply_today'    => (bool)$hasAppliesLeft,
        ], 200);
    }

    /**
     * GET /api/user/daily-posts
     * GET /api/user/post-status
     * GET /api/jobs/daily-count
     * GET /api/jobs/post-status
     *
     * Return count of jobs & referral posts created by user today and remaining posts allowed.
     */
    public function getDailyPostStatus(Request $request)
    {
        $user = $request->user();

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

        if (!$user && ($request->filled('user_id') || $request->filled('id'))) {
            $targetId = $request->input('user_id') ?? $request->input('id');
            $user = \App\Models\User::find($targetId);
        }

        if (!$user) {
            $user = \App\Models\User::first();
        }

        $userId = $user ? $user->id : 0;
        $activeRole = strtolower(trim($user ? ($user->active_profile ?: ($user->user_role ?: 'job_seeker')) : 'job_seeker'));
        $isEmployer = in_array($activeRole, ['employer', 'recruiter', 'hirer', 'agency', 'administrator', 'admin']);

        // Determine daily limit: Chef/Jobseeker is 5/day, Employer is UNLIMITED (999999)
        $defaultLimit = $isEmployer ? 999999 : 5;
        $dailyLimit = (int) $request->input('limit', $defaultLimit);

        // Count jobs created by user today
        $todayQuery = \App\Models\JobPost::where('created_by', $userId)
            ->where('created_at', '>=', \Carbon\Carbon::today());

        $totalPostedToday = (clone $todayQuery)->count();
        $normalJobsPostedToday = (clone $todayQuery)->where('is_referral', false)->count();
        $referralJobsPostedToday = (clone $todayQuery)->where('is_referral', true)->count();

        $postsLeft = $isEmployer ? 999999 : max(0, $dailyLimit - $totalPostedToday);
        $hasPostsLeft = $isEmployer ? true : ($totalPostedToday < $dailyLimit);

        return response()->json([
            'success'                    => true,
            'user_id'                    => $userId,
            'user_name'                  => $user ? ($user->full_name ?: ('User #' . $user->id)) : 'User',
            'user_role'                  => $activeRole,
            'date'                       => \Carbon\Carbon::today()->toDateString(),
            'total_jobs_posted_today'    => $totalPostedToday,
            'jobs_posted_today_count'    => $totalPostedToday,
            'normal_jobs_posted_today'   => $normalJobsPostedToday,
            'referral_jobs_posted_today' => $referralJobsPostedToday,
            'daily_post_limit'           => $dailyLimit,
            'daily_limit'                => $dailyLimit,
            'posts_left_today'           => $postsLeft,
            'has_posts_left'             => (bool)$hasPostsLeft,
            'can_post_today'             => (bool)$hasPostsLeft,
        ], 200);
    }

    /**
     * GET /api/applications/history
     * GET /api/user/applications/history
     *
     * Returns merged applications (Job Applications + Training Opportunity Applications) for the user.
     */
    public function getApplicationsHistory(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            $token = $request->bearerToken();
            if ($token) {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                if (!$tokenObj && str_contains($token, '|')) {
                    $tokenId = explode('|', $token)[0];
                    $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                }
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
        }
        if (!$user && ($request->filled('user_id') || $request->filled('applicant_id') || $request->filled('id'))) {
            $uId = $request->input('user_id') ?: ($request->input('applicant_id') ?: $request->input('id'));
            $user = \App\Models\User::find($uId);
        }
        if (!$user) {
            $user = \Illuminate\Support\Facades\Auth::user();
        }
        if (!$user) {
            $user = \App\Models\User::first();
        }

        $userId = $user ? $user->id : 0;

        // 1. Fetch Job Applications
        $jobApplications = \App\Models\JobApplication::with(['jobPost.creator.employerProfile'])
            ->where('applicant_id', $userId)
            ->latest()
            ->get();

        $mappedJobApps = $jobApplications->map(function ($app) {
            $job = $app->jobPost;
            if (!$job) return null;

            $creator = $job->creator ?: ($job->created_by ? \App\Models\User::with('employerProfile')->find($job->created_by) : null);
            $postedBy = null;
            if ($creator) {
                $empProfile = $creator->employerProfile ?: ($creator->employer_profile ?: null);
                $postedBy = [
                    'id'                  => $creator->id,
                    'user_id'             => $creator->id,
                    'name'                => $creator->full_name ?: ($creator->name ?: ($job->company ?: 'Employer')),
                    'full_name'           => $creator->full_name ?: ($creator->name ?: ($job->company ?: 'Employer')),
                    'business_name'       => $empProfile ? ($empProfile->business_name ?: $job->company) : ($job->company ?: 'Employer'),
                    'company'             => $job->company ?: ($empProfile ? $empProfile->business_name : 'Employer'),
                    'email'               => $creator->email ?: 'N/A',
                    'mobile_number'       => $creator->mobile_number ?: ($creator->phone ?: 'N/A'),
                    'phone'               => $creator->mobile_number ?: ($creator->phone ?: 'N/A'),
                    'city'                => $creator->city ?: ($job->location ?: 'India'),
                    'country'             => $creator->country ?: ($job->country ?: 'India'),
                    'role'                => $creator->active_profile ?: ($job->submitted_by_role ?: 'employer'),
                    'profile_photo_path'  => $creator->profile_photo_path ?: ($creator->profile_photo ?: null),
                    'profile_photo'       => $creator->profile_photo_path ?: ($creator->profile_photo ?: null),
                ];
            } else {
                $postedBy = [
                    'id'                  => null,
                    'user_id'             => null,
                    'name'                => $job->company ?: 'Jobrito Employer',
                    'full_name'           => $job->company ?: 'Jobrito Employer',
                    'business_name'       => $job->company ?: 'Jobrito Employer',
                    'company'             => $job->company ?: 'Jobrito Employer',
                    'email'               => 'support@jobrito.com',
                    'mobile_number'       => 'N/A',
                    'phone'               => 'N/A',
                    'city'                => $job->location ?: 'India',
                    'country'             => $job->country ?: 'India',
                    'role'                => $job->submitted_by_role ?: 'employer',
                    'profile_photo_path'  => null,
                    'profile_photo'       => null,
                ];
            }

            return [
                'application_id'        => (string)$app->id,
                'id'                    => $app->id,
                'job_post_id'           => $job->id,
                'job_id'                => $job->id,
                'status'                => $app->status ?? 'new',
                'application_status'    => $app->status ?? 'new',
                'preferred_call_time'   => $app->preferred_call_time,
                'applied_at'            => $app->created_at ? $app->created_at->toIso8601String() : null,
                'applied_at_formatted'  => $app->created_at ? $app->created_at->format('j M Y, h:i A') : null,
                'is_training'           => false,
                'type'                  => 'job',
                'title'                 => $job->title,
                'company'               => $job->company,
                'category'              => $job->category,
                'location'              => $job->location,
                'country'               => $job->country,
                'salary'                => $job->salary,
                'salary_min'            => $job->salary_min,
                'salary_max'            => $job->salary_max,
                'salary_currency'       => $job->salary_currency,
                'job_type'              => $job->job_type,
                'experience_range'      => $job->experience_range,
                'description'           => $job->description,
                'posted_by'             => $postedBy,
                'postedby'              => $postedBy,
                'posted_by_user'        => $postedBy,
                'created_at'            => $app->created_at ? $app->created_at->toIso8601String() : null,
            ];
        })->filter()->values();

        // 2. Fetch Training Opportunity Applications
        $mappedTrainingApps = collect();
        if (\Illuminate\Support\Facades\Schema::hasTable('training_applications')) {
            $tApps = \App\Models\TrainingApplication::with(['trainingOpportunity'])
                ->where('applicant_id', $userId)
                ->latest()
                ->get();

            $mappedTrainingApps = $tApps->map(function ($tApp) {
                $training = $tApp->trainingOpportunity;
                if (!$training && $tApp->training_id) {
                    $training = \App\Models\TrainingOpportunity::find($tApp->training_id);
                }
                $tId = $training ? $training->id : ($tApp->training_id ?: $tApp->id);

                $tPostedBy = [
                    'id'                  => null,
                    'user_id'             => null,
                    'name'                => $training ? ($training->provider_name ?: 'Jobrito Academy') : 'Jobrito Academy',
                    'full_name'           => $training ? ($training->provider_name ?: 'Jobrito Academy') : 'Jobrito Academy',
                    'business_name'       => $training ? ($training->provider_name ?: 'Jobrito Academy') : 'Jobrito Academy',
                    'company'             => $training ? ($training->provider_name ?: 'Jobrito Academy') : 'Jobrito Academy',
                    'email'               => 'academy@jobrito.com',
                    'mobile_number'       => 'N/A',
                    'phone'               => 'N/A',
                    'city'                => $training ? ($training->location ?: 'India') : 'India',
                    'country'             => 'India',
                    'role'                => 'training_provider',
                    'profile_photo_path'  => null,
                    'profile_photo'       => null,
                ];

                return [
                    'application_id'        => 'training_' . $tApp->id,
                    'id'                    => 'training_' . $tApp->id,
                    'raw_application_id'    => $tApp->id,
                    'training_id'           => $tId,
                    'job_post_id'           => 'training_' . $tId,
                    'job_id'                => 'training_' . $tId,
                    'status'                => $tApp->status ?? 'applied',
                    'application_status'    => $tApp->status ?? 'applied',
                    'preferred_call_time'   => $tApp->preferred_call_time,
                    'applied_at'            => $tApp->created_at ? $tApp->created_at->toIso8601String() : null,
                    'applied_at_formatted'  => $tApp->created_at ? $tApp->created_at->format('j M Y, h:i A') : null,
                    'is_training'           => true,
                    'type'                  => 'training',
                    'title'                 => $training ? ($training->program_name ?: ('Training Program #' . $tId)) : ('Training Program #' . $tId),
                    'company'               => $training ? ($training->provider_name ?: 'Jobrito Academy') : 'Jobrito Academy',
                    'category'              => 'training',
                    'location'              => $training ? ($training->location ?: 'India') : 'India',
                    'country'               => 'India',
                    'salary'                => 'Paid Stipend',
                    'salary_min'            => null,
                    'salary_max'            => null,
                    'salary_currency'       => 'INR',
                    'job_type'              => 'Training / Program',
                    'experience_range'      => 'Any',
                    'description'           => $training ? ($training->description ?: 'Specialized training program.') : 'Specialized training program.',
                    'posted_by'             => $tPostedBy,
                    'postedby'              => $tPostedBy,
                    'posted_by_user'        => $tPostedBy,
                    'created_at'            => $tApp->created_at ? $tApp->created_at->toIso8601String() : null,
                ];
            });
        }

        $allApplications = $mappedJobApps->concat($mappedTrainingApps)->sortByDesc('created_at')->values();

        return response()->json([
            'success'      => true,
            'total'        => $allApplications->count(),
            'applications' => $allApplications,
            'data'         => $allApplications,
        ]);
    }

    /**
     * POST /api/jobs/{id}/save
     * POST /api/jobs/save
     * POST /api/training/{id}/save
     *
     * Toggle save/unsave for Job Post OR Training Opportunity.
     */
    public function saveJobOrTraining(Request $request, $id = null)
    {
        try {
            $user = $request->user();
            if (!$user) {
                $token = $request->bearerToken();
                if ($token) {
                    $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                    if (!$tokenObj && str_contains($token, '|')) {
                        $tokenId = explode('|', $token)[0];
                        $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                    }
                    if ($tokenObj) {
                        $user = $tokenObj->tokenable;
                    }
                }
            }
            if (!$user && ($request->filled('user_id') || $request->filled('applicant_id'))) {
                $uId = $request->input('user_id') ?: $request->input('applicant_id');
                $user = \App\Models\User::find($uId);
            }
            if (!$user) {
                $user = \Illuminate\Support\Facades\Auth::user();
            }
            if (!$user) {
                $user = \App\Models\User::first();
            }

            $userId = $user ? $user->id : 0;
            $targetId = $id ?: ($request->input('job_id') ?: ($request->input('job_post_id') ?: ($request->input('training_id') ?: $request->input('id'))));

            $isTraining = false;
            $trainingId = null;
            $jobPostId = null;

            $targetIdStr = (string)$targetId;
            if (str_starts_with($targetIdStr, 'referral_')) {
                $targetIdStr = str_replace('referral_', '', $targetIdStr);
            } elseif (str_starts_with($targetIdStr, 'job_')) {
                $targetIdStr = str_replace('job_', '', $targetIdStr);
            }

            if (str_starts_with((string)$targetId, 'training_')) {
                $isTraining = true;
                $trainingId = (int) str_replace('training_', '', (string)$targetId);
            } elseif ($request->boolean('is_training') || $request->input('type') === 'training' || $request->filled('training_id')) {
                $isTraining = true;
                $trainingId = (int) ($request->input('training_id') ?: $targetIdStr);
            } else {
                $cleanId = (int)$targetIdStr;
                if (\Illuminate\Support\Facades\Schema::hasTable('training_opportunities')) {
                    $tObj = \App\Models\TrainingOpportunity::find($cleanId);
                    if ($tObj && !\App\Models\JobPost::find($cleanId)) {
                        $isTraining = true;
                        $trainingId = $tObj->id;
                    }
                }
                if (!$isTraining) {
                    $jobPostId = $cleanId;
                }
            }

            // Ensure schema is updated to allow null job_post_id and training_id column
            if (\Illuminate\Support\Facades\Schema::hasTable('saved_jobs')) {
                try {
                    \Illuminate\Support\Facades\DB::statement('ALTER TABLE saved_jobs MODIFY job_post_id BIGINT UNSIGNED NULL');
                } catch (\Throwable $e) {}

                if (!\Illuminate\Support\Facades\Schema::hasColumn('saved_jobs', 'training_id')) {
                    try {
                        \Illuminate\Support\Facades\Schema::table('saved_jobs', function (\Illuminate\Database\Schema\Blueprint $table) {
                            $table->unsignedBigInteger('training_id')->nullable()->after('job_post_id');
                        });
                    } catch (\Throwable $e) {}
                }
            }

            if ($isTraining) {
                $existing = \Illuminate\Support\Facades\DB::table('saved_jobs')
                    ->where('user_id', $userId)
                    ->where('training_id', $trainingId)
                    ->first();

                if ($existing) {
                    \Illuminate\Support\Facades\DB::table('saved_jobs')->where('id', $existing->id)->delete();
                    return response()->json([
                        'success'     => true,
                        'saved'       => false,
                        'is_training' => true,
                        'message'     => 'Training opportunity removed from saved list.',
                    ]);
                } else {
                    \Illuminate\Support\Facades\DB::table('saved_jobs')->insert([
                        'user_id'     => $userId,
                        'job_post_id' => null,
                        'training_id' => $trainingId,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                    return response()->json([
                        'success'     => true,
                        'saved'       => true,
                        'is_training' => true,
                        'message'     => 'Training opportunity saved to your favorites!',
                    ]);
                }
            } else {
                $existing = \Illuminate\Support\Facades\DB::table('saved_jobs')
                    ->where('user_id', $userId)
                    ->where('job_post_id', $jobPostId)
                    ->first();

                if ($existing) {
                    \Illuminate\Support\Facades\DB::table('saved_jobs')->where('id', $existing->id)->delete();
                    return response()->json([
                        'success'     => true,
                        'saved'       => false,
                        'is_training' => false,
                        'message'     => 'Job removed from saved list.',
                    ]);
                } else {
                    \Illuminate\Support\Facades\DB::table('saved_jobs')->insert([
                        'user_id'     => $userId,
                        'job_post_id' => $jobPostId,
                        'training_id' => null,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                    return response()->json([
                        'success'     => true,
                        'saved'       => true,
                        'is_training' => false,
                        'message'     => 'Job saved to your favorites!',
                    ]);
                }
            }
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Save failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/jobs/saved
     * GET /api/user/saved-jobs
     * GET /api/saved-jobs
     *
     * Returns saved Jobs AND saved Training Opportunities in unified structure.
     */
    public function getSavedJobs(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            $token = $request->bearerToken();
            if ($token) {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                if (!$tokenObj && str_contains($token, '|')) {
                    $tokenId = explode('|', $token)[0];
                    $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                }
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
        }
        if (!$user && ($request->filled('user_id') || $request->filled('applicant_id'))) {
            $uId = $request->input('user_id') ?: $request->input('applicant_id');
            $user = \App\Models\User::find($uId);
        }
        if (!$user) {
            $user = \App\Models\User::first();
        }

        $userId = $user ? $user->id : 0;

        if (\Illuminate\Support\Facades\Schema::hasTable('saved_jobs')) {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('saved_jobs', 'training_id')) {
                try {
                    \Illuminate\Support\Facades\Schema::table('saved_jobs', function (\Illuminate\Database\Schema\Blueprint $table) {
                        $table->unsignedBigInteger('training_id')->nullable()->after('job_post_id');
                    });
                } catch (\Throwable $e) {}
            }
        }

        try {
            // 1. Fetch IDs of jobs and training programs already APPLIED by this user
            $appliedJobIds = [];
            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('job_applications')) {
                    $appliedJobIds = \Illuminate\Support\Facades\DB::table('job_applications')
                        ->where('applicant_id', $userId)
                        ->pluck('job_post_id')
                        ->filter()
                        ->map(function ($id) { return (int)$id; })
                        ->toArray();
                }
            } catch (\Throwable $th) {}

            $appliedTrainingIds = [];
            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('training_applications')) {
                    $appliedTrainingIds = \Illuminate\Support\Facades\DB::table('training_applications')
                        ->where('user_id', $userId)
                        ->pluck('training_id')
                        ->filter()
                        ->map(function ($id) { return (int)$id; })
                        ->toArray();
                }
            } catch (\Throwable $th) {}

            // 2. Fetch saved records
            $savedRecords = \Illuminate\Support\Facades\DB::table('saved_jobs')
                ->where('user_id', $userId)
                ->latest()
                ->get();

            $jobIds = $savedRecords->pluck('job_post_id')->filter()->values();
            $trainingIds = $savedRecords->pluck('training_id')->filter()->values();

            $jobPosts = \App\Models\JobPost::with('creator')->whereIn('id', $jobIds)->get()->keyBy('id');
            $trainingOpps = collect();
            if ($trainingIds->count() > 0 && \Illuminate\Support\Facades\Schema::hasTable('training_opportunities')) {
                $trainingOpps = \App\Models\TrainingOpportunity::whereIn('id', $trainingIds)->get()->keyBy('id');
            }

            $unifiedSaved = $savedRecords->map(function ($rec) use ($jobPosts, $trainingOpps, $appliedJobIds, $appliedTrainingIds) {
                if ($rec->job_post_id && isset($jobPosts[$rec->job_post_id])) {
                    $job = $jobPosts[$rec->job_post_id];
                    $hasApplied = in_array((int)$job->id, $appliedJobIds);
                    $creator = null;
                    try { $creator = $job->creator; } catch (\Throwable $th) {}

                    $postedByName = !empty($job->company) ? $job->company : ($creator && !empty($creator->full_name) ? $creator->full_name : (!empty($job->contact_person) ? $job->contact_person : 'Employer'));

                    $creatorRole = 'employer';
                    try {
                        if (!empty($job->submitted_by_role)) {
                            $creatorRole = $job->submitted_by_role;
                        } elseif ($creator && !empty($creator->active_profile)) {
                            $creatorRole = $creator->active_profile;
                        }
                    } catch (\Throwable $th) {}

                    $creatorPhoto = null;
                    try {
                        $creatorPhoto = $creator ? ($creator->profile_photo_url ?? ($creator->profile_photo_path ?? null)) : null;
                        if (!$creatorPhoto && !empty($job->company_logo_url)) {
                            $creatorPhoto = $job->company_logo_url;
                        }
                    } catch (\Throwable $th) {}

                    $isReferral = (bool)$job->is_referral || 
                                  $job->category === 'community' || 
                                  in_array(strtolower(trim($creatorRole)), ['chef', 'cook', 'job_seeker', 'jobseeker', 'talent', 'candidate']);

                    return [
                        'saved_id'              => $rec->id,
                        'id'                    => $job->id,
                        'job_post_id'           => $job->id,
                        'job_id'                => $job->id,
                        'title'                 => $job->title,
                        'company'               => $job->company,
                        'category'              => $job->category,
                        'location'              => $job->location,
                        'country'               => $job->country,
                        'salary'                => $job->salary,
                        'salary_min'            => $job->salary_min,
                        'salary_max'            => $job->salary_max,
                        'salary_currency'       => $job->salary_currency,
                        'job_type'              => $job->job_type,
                        'experience_range'      => $job->experience_range,
                        'description'           => $job->description,
                        'is_referral'           => $isReferral,
                        'is_referral_job'       => $isReferral,
                        'posted_by_role'        => $creatorRole,
                        'submitted_by_role'     => $job->submitted_by_role ?: $creatorRole,
                        '_type'                 => $isReferral ? 'referral_job' : 'job',
                        'applied'               => $hasApplied,
                        'is_applied'            => $hasApplied,
                        'has_applied'           => $hasApplied,
                        'is_training'           => false,
                        'is_saved'              => true,
                        'saved'                 => true,
                        'saved_at'              => $rec->created_at ? \Carbon\Carbon::parse($rec->created_at)->toIso8601String() : null,
                        'created_by'            => $job->created_by,
                        'job_posted_by'         => $postedByName,
                        'posted_by'             => [
                            'id'                => $creator?->id ?? $job->created_by,
                            'full_name'         => $creator?->full_name ?? $postedByName,
                            'name'              => $postedByName,
                            'company'           => $job->company ?? null,
                            'role'              => $creatorRole,
                            'mobile_number'     => $creator?->mobile_number ?? $job->contact_info ?? null,
                            'profile_photo_url' => $creatorPhoto,
                        ],
                    ];
                } elseif ($rec->training_id && isset($trainingOpps[$rec->training_id])) {
                    // If user HAS ALREADY APPLIED to this training, exclude it from saved jobs response!
                    if (in_array((int)$rec->training_id, $appliedTrainingIds)) {
                        return null;
                    }

                    $training = $trainingOpps[$rec->training_id];
                    $providerName = !empty($training->provider_name) ? $training->provider_name : 'Jobrito Academy';
                    return [
                        'saved_id'              => $rec->id,
                        'id'                    => 'training_' . $training->id,
                        'training_id'           => $training->id,
                        'job_post_id'           => 'training_' . $training->id,
                        'job_id'                => 'training_' . $training->id,
                        'title'                 => $training->program_name ?: ('Training Program #' . $training->id),
                        'company'               => $providerName,
                        'category'              => 'training',
                        'location'              => $training->location ?: 'India',
                        'country'               => 'India',
                        'salary'                => 'Paid Stipend',
                        'salary_min'            => null,
                        'salary_max'            => null,
                        'salary_currency'       => 'INR',
                        'job_type'              => 'Training / Program',
                        'experience_range'      => 'Any',
                        'description'           => $training->description ?: 'Specialized training program.',
                        'is_training'           => true,
                        'is_saved'              => true,
                        'saved'                 => true,
                        'saved_at'              => $rec->created_at ? \Carbon\Carbon::parse($rec->created_at)->toIso8601String() : null,
                        'created_by'            => null,
                        'job_posted_by'         => $providerName,
                        'posted_by'             => [
                            'id'                => null,
                            'full_name'         => $providerName,
                            'name'              => $providerName,
                            'company'           => $providerName,
                            'role'              => 'training_provider',
                            'mobile_number'     => null,
                            'profile_photo_url' => null,
                        ],
                    ];
                }
                return null;
            })->filter()->values();

            return response()->json([
                'success'    => true,
                'total'      => $unifiedSaved->count(),
                'saved_jobs' => $unifiedSaved,
                'jobs'       => $unifiedSaved,
                'data'       => $unifiedSaved,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('getSavedJobs failed: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'success'    => true,
                'total'      => 0,
                'saved_jobs' => [],
                'jobs'       => [],
                'data'       => [],
            ]);
        }
    }
}
