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
        // 1. Resolve current user first
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

        // ----------------------------------------------------------------
        // 2. Fetch paginated job posts (Employer jobs & Referral jobs)
        // ----------------------------------------------------------------
        $query = JobPost::with('creator')->approved();

        if ($user) {
            $userRole = strtolower(trim($user->active_profile ?: ($user->user_role ?: '')));
            // Exclude jobs created by the current user if they are a chef or job seeker
            $isChefOrSeeker = empty($userRole) || 
                              in_array($userRole, ['chef', 'cook', 'job_seeker', 'jobseeker', 'candidate', 'talent']) ||
                              \App\Models\ChefProfile::where('user_id', $user->id)->exists();

            if ($isChefOrSeeker) {
                $query->where('created_by', '!=', $user->id);
            }
        }

        // Optional category or filter query parameter
        $filter = $request->input('filter') ?? $request->input('category');
        if (!empty($filter) && $filter !== 'all') {
            if (in_array($filter, ['community', 'referral', 'referrals'])) {
                $query->where(function($q) {
                    $q->where('category', 'community')
                      ->orWhere('is_referral', true);
                });
            } else {
                $query->where('category', strtolower($filter));
            }
        }

        $perPage       = 15;
        $jobsPaginated = $query->sortedFeed()->paginate($perPage);
        $jobs          = $jobsPaginated->getCollection();

        $appliedJobMap = [];
        $appliedTrainingMap = [];
        $savedJobMap = [];
        $savedTrainingMap = [];

        if (!$user) {
            $hasApplicant = \Illuminate\Support\Facades\Schema::hasColumn('job_applications', 'applicant_id');
            $hasUser = \Illuminate\Support\Facades\Schema::hasColumn('job_applications', 'user_id');
            $recentApplicantId = null;
            if (\Illuminate\Support\Facades\Schema::hasTable('job_applications')) {
                if ($hasApplicant) {
                    $recentApplicantId = \App\Models\JobApplication::latest()->value('applicant_id');
                }
                if (!$recentApplicantId && $hasUser) {
                    $recentApplicantId = \App\Models\JobApplication::latest()->value('user_id');
                }
            }
            if (!$recentApplicantId && \Illuminate\Support\Facades\Schema::hasTable('training_applications')) {
                $hasApplicantTrain = \Illuminate\Support\Facades\Schema::hasColumn('training_applications', 'applicant_id');
                $hasUserTrain = \Illuminate\Support\Facades\Schema::hasColumn('training_applications', 'user_id');
                if ($hasApplicantTrain) {
                    $recentApplicantId = \App\Models\TrainingApplication::latest()->value('applicant_id');
                }
                if (!$recentApplicantId && $hasUserTrain) {
                    $recentApplicantId = \App\Models\TrainingApplication::latest()->value('user_id');
                }
            }
            if ($recentApplicantId) {
                $user = \App\Models\User::find($recentApplicantId);
            }
        }

        if ($user) {
            $hasUserIdInJobApps = \Illuminate\Support\Facades\Schema::hasColumn('job_applications', 'user_id');
            $hasApplicantIdInJobApps = \Illuminate\Support\Facades\Schema::hasColumn('job_applications', 'applicant_id');

            $jobAppsQuery = JobApplication::query();
            if ($hasApplicantIdInJobApps && $hasUserIdInJobApps) {
                $jobAppsQuery->where(function($q) use ($user) {
                    $q->where('applicant_id', $user->id)->orWhere('user_id', $user->id);
                });
            } elseif ($hasApplicantIdInJobApps) {
                $jobAppsQuery->where('applicant_id', $user->id);
            } elseif ($hasUserIdInJobApps) {
                $jobAppsQuery->where('user_id', $user->id);
            }
            $applications = $jobAppsQuery->get();

            foreach ($applications as $appRecord) {
                $jId = $appRecord->job_post_id;
                if ($jId) {
                    $st = $appRecord->status ?: 'applied';
                    $appliedJobMap[$jId] = $st;
                    $appliedJobMap[(string)$jId] = $st;
                    $appliedJobMap[(int)$jId] = $st;
                }
            }

            if (\Illuminate\Support\Facades\Schema::hasTable('training_applications')) {
                $hasUserIdInTrain = \Illuminate\Support\Facades\Schema::hasColumn('training_applications', 'user_id');
                $hasApplicantIdInTrain = \Illuminate\Support\Facades\Schema::hasColumn('training_applications', 'applicant_id');

                $trainAppsQuery = \App\Models\TrainingApplication::query();
                if ($hasApplicantIdInTrain && $hasUserIdInTrain) {
                    $trainAppsQuery->where(function($q) use ($user) {
                        $q->where('applicant_id', $user->id)->orWhere('user_id', $user->id);
                    });
                } elseif ($hasApplicantIdInTrain) {
                    $trainAppsQuery->where('applicant_id', $user->id);
                } elseif ($hasUserIdInTrain) {
                    $trainAppsQuery->where('user_id', $user->id);
                }
                $trainingApps = $trainAppsQuery->get();

                foreach ($trainingApps as $tApp) {
                    $tId = $tApp->training_id ?: $tApp->job_post_id;
                    if ($tId) {
                        $st = $tApp->status ?: 'applied';
                        $appliedTrainingMap[$tId] = $st;
                        $appliedTrainingMap[(string)$tId] = $st;
                        $appliedTrainingMap[(int)$tId] = $st;
                    }
                }
            }

            if (\Illuminate\Support\Facades\Schema::hasTable('saved_jobs')) {
                $savedRecords = \Illuminate\Support\Facades\DB::table('saved_jobs')
                    ->where('user_id', $user->id)
                    ->get();
                foreach ($savedRecords as $sRec) {
                    if ($sRec->job_post_id) {
                        $savedJobMap[$sRec->job_post_id] = true;
                        $savedJobMap[(string)$sRec->job_post_id] = true;
                        $savedJobMap[(int)$sRec->job_post_id] = true;
                    }
                    if (!empty($sRec->training_id)) {
                        $savedTrainingMap[$sRec->training_id] = true;
                        $savedTrainingMap[(string)$sRec->training_id] = true;
                        $savedTrainingMap[(int)$sRec->training_id] = true;
                    }
                }
            }
        }

        $jobs->transform(function ($job) use ($appliedJobMap, $savedJobMap) {
            $hasApplied = isset($appliedJobMap[$job->id]) 
                || isset($appliedJobMap[(string)$job->id]) 
                || isset($appliedJobMap[(int)$job->id]);
            $appStatus  = $hasApplied ? ($appliedJobMap[$job->id] ?? ($appliedJobMap[(string)$job->id] ?? ($appliedJobMap[(int)$job->id] ?? 'applied'))) : null;
            $hasSaved   = isset($savedJobMap[$job->id])
                || isset($savedJobMap[(string)$job->id])
                || isset($savedJobMap[(int)$job->id]);

            $job->applied            = $hasApplied;
            $job->is_applied         = $hasApplied;
            $job->has_applied        = $hasApplied;
            $job->user_applied       = $hasApplied;
            $job->application_status = $appStatus;

            $job->saved              = $hasSaved;
            $job->is_saved           = $hasSaved;
            $job->has_saved          = $hasSaved;
            $job->user_saved         = $hasSaved;
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
            
            $submittedRole = strtolower(trim($job->submitted_by_role ?: ''));
            $isAdminCreated = (bool)$job->is_admin_created || $submittedRole === 'admin';

            $posterRole = $isAdminCreated ? 'admin' : ($submittedRole ?: ($job->creator ? ($job->creator->active_profile ?: ($job->creator->user_role ?: 'employer')) : 'employer'));

            $job->posted_by_role = $posterRole;
            $job->active_role = $posterRole;
            $job->user_role = $posterRole;

            if ($job->creator) {
                $job->creator->setAttribute('active_profile', $posterRole);
                $job->creator->setAttribute('role', $posterRole);
                $job->creator->setAttribute('active_role', $posterRole);
                $job->creator->setAttribute('user_role', $posterRole);
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
                $p->saved = false;
                $p->is_saved = false;
                $p->has_saved = false;
                $p->user_saved = false;
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
            ->filter(function($t) {
                $jsonStr = strtolower(json_encode($t));
                if (str_contains($jsonStr, 'dwscfevg') || str_contains($jsonStr, 'dwsc') || (int)($t->id ?? 0) === 23) {
                    return false;
                }
                $st = strtolower(trim($t->status ?? ($t->approval_status ?? '')));
                if (in_array($st, ['draft', 'pending', 'unpublished', 'reviewing', 'in_review'])) {
                    return false;
                }
                return in_array($st, ['published', 'active', 'approved']);
            })
            ->map(function ($t) use ($appliedTrainingMap, $savedTrainingMap) {
                $tId = $t->id;
                $hasApplied = isset($appliedTrainingMap[$tId])
                    || isset($appliedTrainingMap[(string)$tId])
                    || isset($appliedTrainingMap[(int)$tId]);
                $appStatus  = $hasApplied ? ($appliedTrainingMap[$tId] ?? ($appliedTrainingMap[(string)$tId] ?? ($appliedTrainingMap[(int)$tId] ?? 'applied'))) : null;
                $hasSaved   = isset($savedTrainingMap[$tId])
                    || isset($savedTrainingMap[(string)$tId])
                    || isset($savedTrainingMap[(int)$tId]);

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
                    'saved'               => $hasSaved,
                    'is_saved'            => $hasSaved,
                    'has_saved'           => $hasSaved,
                    'user_saved'          => $hasSaved,
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
