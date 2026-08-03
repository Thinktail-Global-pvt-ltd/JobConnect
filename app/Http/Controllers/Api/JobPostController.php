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
            $userRole = strtolower($user->active_profile ?? 'job_seeker');
            if ($request->filled('submitted_by_role')) {
                $userRole = strtolower(str_replace('_', '', $request->input('submitted_by_role')));
            }

            $isEmployer = in_array($userRole, ['employer', 'agency', 'administrator', 'admin']);
            $maxDailyAllowed = $isEmployer ? 5 : 1;

            $todayJobsCount = JobPost::where('created_by', $user->id)
                ->where('created_at', '>=', \Carbon\Carbon::today())
                ->count();

            if ($todayJobsCount >= $maxDailyAllowed) {
                if ($isEmployer) {
                    $msg = 'Daily posting limit reached: Employers can post a maximum of 5 jobs per day. Please try again tomorrow.';
                } else {
                    $msg = 'Daily posting limit reached: Chef and Jobseeker users can only post 1 referral job per day. Please try again tomorrow.';
                }

                return response()->json([
                    'success' => false,
                    'message' => $msg,
                    'daily_limit' => $maxDailyAllowed,
                    'posted_today' => $todayJobsCount,
                ], 429);
            }
        }

        $validator = Validator::make($request->all(), [
            'title'                  => 'required|string|max:255',
            'category'               => 'required|string|in:dubai,overseas,community',
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
            'job_type'               => 'nullable|string|in:Full-time,Part-time,Contract,Internship,Freelance',
            'experience_range'       => 'nullable|string|max:100',
            'requirements'           => 'nullable|array',
            'requirements.*'         => 'string|max:255',
            'benefits'               => 'nullable|array',
            'benefits.*'             => 'string|max:255',
            'open_positions'         => 'nullable|integer|min:1',
            'showcase_image_url'     => 'nullable|url',
            'map_image_url'          => 'nullable|url',

            // Overseas-specific fields
            'country'                => 'nullable|required_if:category,overseas|string|max:100',
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
            'success'  => true,
            'message'  => 'Job post submitted successfully and is pending moderation.',
            'job_post' => $jobPost,
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
                'submitted_by_role'     => $job->submitted_by_role,
                'posted_by_role'        => $job->posted_by_role,
                'created_at'            => $job->created_at ? $job->created_at->toDateTimeString() : null,
            ];
        })->filter()->values();

        // 2. Fetch Job Posts created by this user
        // DEFAULT: Only show admin-approved created jobs (so employer sees only live jobs)
        // Pass ?status=all to see everything, ?status=pending to see pending ones
        $createdQuery = JobPost::where('created_by', $user ? $user->id : 0);
        if ($request->has('is_referral')) {
            $createdQuery->where('is_referral', filter_var($request->is_referral, FILTER_VALIDATE_BOOLEAN));
        }
        if ($request->filled('status') && $request->status === 'all') {
            // status=all → show everything (no status filter)
        } elseif ($request->filled('status') && $request->status !== 'all') {
            // explicit status passed (pending, closed, etc.) → filter by it
            $createdQuery->where('status', $request->status);
        } else {
            // No status param → default: only show admin-approved jobs
            $createdQuery->where('status', 'approved');
        }

        $createdJobs = $createdQuery->latest()->get();

        // Also fetch pending/rejected created jobs separately (for employer dashboard tracking)
        $pendingCreatedJobs = JobPost::where('created_by', $user ? $user->id : 0)
            ->where('status', 'pending')
            ->latest()->get();

        // Standard unified jobs array (Applied jobs first for Jobseeker/Chef, Created jobs first for Employer)
        $isJobSeekerOrChef = in_array($activeRole, ['chef', 'cook', 'job_seeker', 'jobseeker', 'talent']);
        $combinedJobs = $isJobSeekerOrChef
            ? $appliedJobs->concat($createdJobs)
            : $createdJobs->concat($appliedJobs);

        return response()->json([
            'success'                   => true,
            'user_role'                 => $activeRole,
            'total_applied_jobs'        => $appliedJobs->count(),
            'total_created_jobs'        => $createdJobs->count(),
            'total_pending_jobs'        => $pendingCreatedJobs->count(),
            'applied_jobs'              => $appliedJobs,
            'created_jobs'              => $createdJobs,          // Admin-approved only (default)
            'pending_created_jobs'      => $pendingCreatedJobs,   // Awaiting admin approval
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
        $activeRole = strtolower($user ? ($user->active_profile ?? 'job_seeker') : 'job_seeker');

        // Determine daily limit: 1 for Chef/Jobseeker, 5 for Employer (or query override)
        $isEmployer = ($activeRole === 'employer');
        $defaultLimit = $isEmployer ? 5 : 1;
        $dailyLimit = (int) $request->input('limit', $defaultLimit);

        // Count jobs created by user today
        $todayQuery = \App\Models\JobPost::where('created_by', $userId)
            ->where('created_at', '>=', \Carbon\Carbon::today());

        $totalPostedToday = (clone $todayQuery)->count();
        $normalJobsPostedToday = (clone $todayQuery)->where('is_referral', false)->count();
        $referralJobsPostedToday = (clone $todayQuery)->where('is_referral', true)->count();

        $postsLeft = max(0, $dailyLimit - $totalPostedToday);
        $hasPostsLeft = $totalPostedToday < $dailyLimit;

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
}
