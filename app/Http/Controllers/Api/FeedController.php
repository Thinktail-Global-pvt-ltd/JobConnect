<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminPost;
use App\Models\JobApplication;
use App\Models\JobPost;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    /**
     * GET /api/feed
     *
     * Returns a unified, paginated feed that interleaves:
     *   - Approved job posts (pinned first, then newest)
     *   - Admin community posts injected every N job items
     *     (N = admin_post.inject_every, default 2)
     *
     * Each item has a `_type` field:
     *   - "job"        → regular job post
     *   - "admin_post" → community announcement injected by admin
     *
     * Query params:
     *   - category  : india | overseas | community  (optional filter on jobs)
     *   - page      : pagination page number
     */
    public function index(Request $request)
    {
        if (function_exists('opcache_reset')) {
            @opcache_reset();
        }
        // ----------------------------------------------------------------
        // 1.  Fetch paginated job posts (Employer jobs & Referral jobs)
        // ----------------------------------------------------------------
        $query = JobPost::with('creator')->approved();

        // Optional category or filter query parameter
        $filter = $request->input('filter') ?? $request->input('category');
        if (!empty($filter) && $filter !== 'all') {
            if (in_array($filter, ['community', 'referral', 'referrals'])) {
                $query->where(function($q) {
                    $q->where('category', 'community')
                      ->orWhere('is_referral', true);
                });
            } else if (in_array($filter, ['india', 'overseas'])) {
                $query->where('category', $filter);
            }
        }

        $perPage       = 15;
        $jobsPaginated = $query->sortedFeed()->paginate($perPage);
        $jobs          = $jobsPaginated->getCollection();

        // ----------------------------------------------------------------
        // 2.  Mark which jobs the current user has applied to
        // ----------------------------------------------------------------
        $user = $request->user();
        if (!$user && $request->bearerToken()) {
            $tokenStr = $request->bearerToken();
            if (str_contains($tokenStr, '|')) {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            } else {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
        }
        if (!$user) {
            $user = \Illuminate\Support\Facades\Auth::user();
        }

        $appliedJobMap = [];
        if ($user) {
            $applications = JobApplication::where('applicant_id', $user->id)->get();
            foreach ($applications as $appRecord) {
                $appliedJobMap[$appRecord->job_post_id] = $appRecord->status ?: 'applied';
            }
        }

        $jobs->transform(function ($job) use ($appliedJobMap) {
            $hasApplied = isset($appliedJobMap[$job->id]);
            $appStatus  = $hasApplied ? $appliedJobMap[$job->id] : null;

            $job->applied            = $hasApplied;
            $job->is_applied         = $hasApplied;
            $job->has_applied        = $hasApplied;
            $job->user_applied       = $hasApplied;
            $job->application_status = $appStatus;
            $job->_type              = $job->is_referral ? 'referral_job' : 'job';

            // Normalize and parse currency
            $curr = $job->salary_currency;
            if (empty($curr) && !empty($job->salary)) {
                if (str_contains($job->salary, 'AED')) $curr = 'AED';
                elseif (str_contains($job->salary, 'INR') || str_contains($job->salary, '₹')) $curr = 'INR';
                elseif (str_contains($job->salary, '$') || str_contains($job->salary, 'USD')) $curr = 'USD';
                elseif (str_contains($job->salary, '£') || str_contains($job->salary, 'GBP')) $curr = 'GBP';
                elseif (str_contains($job->salary, '€') || str_contains($job->salary, 'EUR')) $curr = 'EUR';
                else $curr = 'INR';
            }
            $job->salary_currency = $curr ?: 'INR';
            $job->currency = $job->salary_currency;
            
            $posterRole = $job->submitted_by_role ?: ($job->creator ? $job->creator->active_profile : 'employer');
            $job->posted_by_role = $posterRole;

            if ($job->creator) {
                $job->creator->active_profile = $posterRole;
                $job->creator->role = $posterRole;
            }

            return $job;
        });

        // ----------------------------------------------------------------
        // 3.  Fetch published admin posts (ordered newest first)
        //     We use inject_every to know how frequently to inject each post.
        //     Default inject_every = 2 → insert after every 2 job items.
        // ----------------------------------------------------------------
        $adminPosts = AdminPost::with('creator')->published()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                $p->_type  = 'admin_post';
                $p->applied = false;
                $p->posted_by_role = 'administrator';
                if ($p->creator) {
                    $p->creator->active_profile = 'administrator';
                    $p->creator->role = 'administrator';
                }
                return $p;
            });

        // ----------------------------------------------------------------
        // 4.  Interleave: inject admin posts into the job list
        //
        //     Algorithm:
        //       - Walk through jobs
        //       - Keep a job counter
        //       - Keep an admin post pointer
        //       - Every `inject_every` jobs, splice the next admin post in
        //
        //     If multiple admin posts exist with different inject_every values,
        //     each uses its own counter independently.
        //     For simplicity (and most real-world use), we rotate through all
        //     admin posts every avg(inject_every) jobs.
        // ----------------------------------------------------------------
        $merged     = [];
        $jobCounter = 0;
        $adminIndex = 0;
        $totalAdmin = count($adminPosts);

        // Default injection interval = 2 jobs per 1 admin post
        $injectEvery = $totalAdmin > 0
            ? (int) round($adminPosts->avg('inject_every'))
            : 999;

        foreach ($jobs as $job) {
            $merged[] = $job;
            $jobCounter++;

            // After every $injectEvery jobs, inject the next admin post (cycling)
            if ($totalAdmin > 0 && $jobCounter % $injectEvery === 0) {
                $merged[]   = $adminPosts[$adminIndex % $totalAdmin];
                $adminIndex++;
            }
        }

        // ----------------------------------------------------------------
        // 5.  Return response preserving pagination meta
        // ----------------------------------------------------------------
        return response()->json([
            'success' => true,
            'feed'    => [
                'data'          => $merged,
                'current_page'  => $jobsPaginated->currentPage(),
                'last_page'     => $jobsPaginated->lastPage(),
                'per_page'      => $jobsPaginated->perPage(),
                'total'         => $jobsPaginated->total(),
                'next_page_url' => $jobsPaginated->nextPageUrl(),
                'prev_page_url' => $jobsPaginated->previousPageUrl(),
            ],
            'admin_posts_injected' => $adminIndex,
        ]);
    }
}

// Inline null-check helper (same as before)
function in_null($val): bool
{
    return $val === null || $val === 'null' || $val === '';
}
