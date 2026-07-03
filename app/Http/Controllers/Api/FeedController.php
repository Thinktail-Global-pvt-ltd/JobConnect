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
        // ----------------------------------------------------------------
        // 1.  Fetch paginated job posts
        // ----------------------------------------------------------------
        $query = JobPost::with('creator')->approved();

        // Optional category filter
        if ($request->filled('category') && !in_null($request->category)) {
            $category = $request->category;
            if (in_array($category, ['india', 'overseas', 'community'])) {
                $query->where('category', $category);
            }
        }

        $perPage     = 15;
        $jobsPaginated = $query->sortedFeed()->paginate($perPage);
        $jobs          = $jobsPaginated->getCollection();

        // ----------------------------------------------------------------
        // 2.  Mark which jobs the current user has applied to
        // ----------------------------------------------------------------
        $user = $request->user();
        $appliedJobIds = [];
        if ($user) {
            $appliedJobIds = JobApplication::where('applicant_id', $user->id)
                ->pluck('job_post_id')
                ->toArray();
        }

        $jobs->transform(function ($job) use ($appliedJobIds) {
            $job->applied = in_array($job->id, $appliedJobIds);
            $job->_type   = 'job';
            return $job;
        });

        // ----------------------------------------------------------------
        // 3.  Fetch published admin posts (ordered newest first)
        //     We use inject_every to know how frequently to inject each post.
        //     Default inject_every = 2 → insert after every 2 job items.
        // ----------------------------------------------------------------
        $adminPosts = AdminPost::published()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                $p->_type  = 'admin_post';
                $p->applied = false;
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
