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
     *   - category  : dubai | overseas | community  (optional filter on jobs)
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
            } else if (in_array($filter, ['dubai', 'overseas'])) {
                $query->where('category', $filter);
            }
        }

        $perPage       = 15;
        $jobsPaginated = $query->sortedFeed()->paginate($perPage);
        $jobs          = $jobsPaginated->getCollection();

        // ----------------------------------------------------------------
        // 2.  Mark which jobs and training opportunities the current user has applied to
        // ----------------------------------------------------------------
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
        if (!$user) {
            $user = \Illuminate\Support\Facades\Auth::user();
        }
        if (!$user && ($request->filled('user_id') || $request->filled('applicant_id') || $request->filled('id'))) {
            $uId = $request->input('user_id') ?: ($request->input('applicant_id') ?: $request->input('id'));
            $user = \App\Models\User::find($uId);
        }

        $appliedJobMap = [];
        $appliedTrainingMap = [];

        if ($user) {
            $applications = JobApplication::where('applicant_id', $user->id)->get();
            foreach ($applications as $appRecord) {
                $appliedJobMap[$appRecord->job_post_id] = $appRecord->status ?: 'applied';
            }

            $trainingApps = \App\Models\TrainingApplication::where('applicant_id', $user->id)->get();
            foreach ($trainingApps as $tApp) {
                if ($tApp->training_id) {
                    $appliedTrainingMap[$tApp->training_id] = $tApp->status ?: 'applied';
                }
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
        // 3. Fetch published admin community posts & training opportunities
        // ----------------------------------------------------------------
        $adminPosts = AdminPost::with('creator')->published()
            ->orderByDesc('is_pinned')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                $p->_type  = 'admin_post';
                $p->applied = false;
                $p->is_applied = false;
                $p->has_applied = false;
                $p->posted_by_role = 'administrator';
                if ($p->creator) {
                    $p->creator->active_profile = 'administrator';
                    $p->creator->role = 'administrator';
                }
                return $p;
            });

        $trainingOpportunities = \App\Models\TrainingOpportunity::orderByDesc('is_pinned')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($t) use ($appliedTrainingMap) {
                $hasApplied = isset($appliedTrainingMap[$t->id]);
                $appStatus  = $hasApplied ? $appliedTrainingMap[$t->id] : null;

                return [
                    'id'                  => $t->id,
                    'program_name'        => $t->program_name,
                    'title'               => $t->program_name,
                    'provider_name'       => $t->provider_name,
                    'company'             => $t->provider_name,
                    'employer_details'    => $t->employer_details,
                    'skills_covered'      => $t->skills_covered,
                    'benefits'            => $t->benefits,
                    'placement_opportunities' => $t->placement_opportunities,
                    'description'         => $t->description,
                    'contact_information' => $t->contact_information,
                    'location'            => $t->location,
                    'duration'            => $t->duration ?? '12 Months',
                    'status'              => $t->status ?? 'Published',
                    'is_pinned'           => (bool) $t->is_pinned,
                    '_type'               => 'training_opportunity',
                    'category'            => 'training',
                    'applied'             => $hasApplied,
                    'is_applied'          => $hasApplied,
                    'has_applied'         => $hasApplied,
                    'user_applied'        => $hasApplied,
                    'application_status'  => $appStatus ?: ($hasApplied ? 'applied' : null),
                    'created_at'          => $t->created_at ? $t->created_at->toIso8601String() : now()->toIso8601String(),
                ];
            });

        // ----------------------------------------------------------------
        // 4. Interleave & sort: Pinned items first, then chronological feed
        // ----------------------------------------------------------------
        $merged = [];
        $jobCounter = 0;
        $adminIndex = 0;
        $totalAdmin = count($adminPosts);

        $injectEvery = $totalAdmin > 0
            ? (int) round($adminPosts->avg('inject_every'))
            : 999;

        foreach ($jobs as $job) {
            $merged[] = $job;
            $jobCounter++;

            if ($totalAdmin > 0 && $jobCounter % $injectEvery === 0) {
                $merged[] = $adminPosts[$adminIndex % $totalAdmin];
                $adminIndex++;
            }
        }

        // Add training opportunities into feed
        foreach ($trainingOpportunities as $tOp) {
            $merged[] = $tOp;
        }

        // Sort all items: Pinned first (is_pinned = true), then by creation date
        usort($merged, function ($a, $b) {
            $aPinned = is_array($a) ? ($a['is_pinned'] ?? false) : ($a->is_pinned ?? false);
            $bPinned = is_array($b) ? ($b['is_pinned'] ?? false) : ($b->is_pinned ?? false);

            if ($aPinned !== $bPinned) {
                return $bPinned <=> $aPinned;
            }

            $aDate = is_array($a) ? ($a['created_at'] ?? '') : ($a->created_at ?? '');
            $bDate = is_array($b) ? ($b['created_at'] ?? '') : ($b->created_at ?? '');

            return strcmp((string) $bDate, (string) $aDate);
        });

        // ----------------------------------------------------------------
        // 5. Return unified feed response
        // ----------------------------------------------------------------
        return response()->json([
            'success' => true,
            'feed'    => [
                'data'          => array_values($merged),
                'current_page'  => $jobsPaginated->currentPage(),
                'last_page'     => $jobsPaginated->lastPage(),
                'per_page'      => $jobsPaginated->perPage(),
                'total'         => count($merged),
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
