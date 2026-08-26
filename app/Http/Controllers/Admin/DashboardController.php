<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Models\JobPost;
use App\Models\TrainingOpportunity;
use App\Models\User;
use App\Models\JobApplication;
use App\Models\EmployerProfile;

class DashboardController extends Controller
{
    /**
     * Display the overall stats dashboard.
     */
    public function index()
    {
        $usersTotal = User::count();
        $chefsCount = ChefProfile::count();
        $employersCount = EmployerProfile::count();
        $talentCount = max(0, $usersTotal - ($chefsCount + $employersCount));

        $chefsApproved = ChefProfile::approved()->count();
        $pendingChefsCount = ChefProfile::where(function($q) {
            $q->whereIn('approval_status', ['pending', 'Pending', 'draft', 'Draft', 'unread', 'Unread'])
              ->orWhereNull('approval_status');
        })->count();

        $referralsTotal = JobPost::where('is_referral', true)->count();
        $referralsActive = JobPost::where('is_referral', true)->where('status', 'approved')->count();
        $referralsPinned = JobPost::where('is_referral', true)->where('is_pinned', true)->count();
        $referralsWithApps = JobPost::where('is_referral', true)->has('applications')->count();

        $pendingJobsCount = JobPost::where(function($q) {
            $q->whereIn('status', ['pending', 'Pending', 'draft', 'Draft', 'unread', 'Unread'])
              ->orWhereNull('status');
        })->count();

        // Job Breakdown by role
        $jobsEmpActive = JobPost::where('status', 'approved')
            ->where(function($q) {
                $q->whereIn('submitted_by_role', ['employer', 'admin', 'administrator'])
                  ->orWhereHas('creator', function($c) {
                      $c->whereIn('active_profile', ['employer', 'admin', 'administrator'])
                        ->orWhereIn('user_role', ['employer', 'admin', 'administrator']);
                  });
            })->count();

        $jobsEmpPending = JobPost::whereIn('status', ['pending', 'draft', 'unread'])
            ->where(function($q) {
                $q->whereIn('submitted_by_role', ['employer', 'admin', 'administrator'])
                  ->orWhereHas('creator', function($c) {
                      $c->whereIn('active_profile', ['employer', 'admin', 'administrator'])
                        ->orWhereIn('user_role', ['employer', 'admin', 'administrator']);
                  });
            })->count();

        $jobsChefActive = JobPost::where('status', 'approved')
            ->where(function($q) {
                $q->where('submitted_by_role', 'chef')
                  ->orWhereHas('creator', function($c) {
                      $c->where('active_profile', 'chef')
                        ->orWhere('user_role', 'chef');
                  });
            })->count();

        $jobsChefPending = JobPost::whereIn('status', ['pending', 'draft', 'unread'])
            ->where(function($q) {
                $q->where('submitted_by_role', 'chef')
                  ->orWhereHas('creator', function($c) {
                      $c->where('active_profile', 'chef')
                        ->orWhere('user_role', 'chef');
                  });
            })->count();

        $jobsTalentActive = JobPost::where('status', 'approved')
            ->where(function($q) {
                $q->whereIn('submitted_by_role', ['job_seeker', 'jobseeker', 'candidate', 'talent'])
                  ->orWhereHas('creator', function($c) {
                      $c->whereIn('active_profile', ['job_seeker', 'jobseeker', 'candidate', 'talent'])
                        ->orWhereIn('user_role', ['job_seeker', 'jobseeker', 'candidate', 'talent']);
                  });
            })->count();

        $jobsTalentPending = JobPost::whereIn('status', ['pending', 'draft', 'unread'])
            ->where(function($q) {
                $q->whereIn('submitted_by_role', ['job_seeker', 'jobseeker', 'candidate', 'talent'])
                  ->orWhereHas('creator', function($c) {
                      $c->whereIn('active_profile', ['job_seeker', 'jobseeker', 'candidate', 'talent'])
                        ->orWhereIn('user_role', ['job_seeker', 'jobseeker', 'candidate', 'talent']);
                  });
            })->count();

        // Applications breakdown
        $appsTotal = JobApplication::count();
        $appsNew = JobApplication::whereIn('status', ['new', 'unread'])->count();
        $appsApplied = JobApplication::whereIn('status', ['applied', 'pending'])->count();
        $appsContacted = JobApplication::whereIn('status', ['contacted', 'shortlisted', 'hired', 'viewed'])->count();

        // Training Programs
        $trainingTotal = TrainingOpportunity::count();
        $trainingIndia = TrainingOpportunity::where('location', 'LIKE', '%India%')->count();
        $trainingOverseas = TrainingOpportunity::where(function($q) {
            $q->where('location', 'LIKE', '%Overseas%')
              ->orWhere('location', 'LIKE', '%Dubai%')
              ->orWhere('location', 'LIKE', '%Saudi%')
              ->orWhere('location', 'LIKE', '%Qatar%')
              ->orWhere('location', 'LIKE', '%Kuwait%')
              ->orWhere('location', 'LIKE', '%Bahrain%');
        })->count();

        $stats = [
            'users_count' => $usersTotal,
            'users_total' => $usersTotal,
            'users_active' => User::active()->count(),
            'users_suspended' => User::where('is_suspended', true)->count(),
            
            'chef_count' => $chefsCount,
            'chefs_count' => $chefsCount,
            'chefs_total' => $chefsCount,
            'chefs_approved' => $chefsApproved,
            'chefs_pending' => $pendingChefsCount,
            'pending_chefs' => $pendingChefsCount,
            
            'employer_count' => $employersCount,
            'employers_count' => $employersCount,

            'talent_count' => $talentCount,
            
            'jobs_total' => JobPost::count(),
            'jobs_active' => JobPost::approved()->count(),
            'jobs_approved' => JobPost::approved()->count(),
            'jobs_pending' => $pendingJobsCount,
            'pending_jobs' => $pendingJobsCount,

            'jobs_emp_active' => $jobsEmpActive,
            'jobs_emp_pending' => $jobsEmpPending,
            'jobs_chef_active' => $jobsChefActive,
            'jobs_chef_pending' => $jobsChefPending,
            'jobs_talent_active' => $jobsTalentActive,
            'jobs_talent_pending' => $jobsTalentPending,

            'applications_total' => $appsTotal,
            'applications_count' => $appsTotal,
            'applications_new' => $appsNew,
            'applications_applied' => $appsApplied,
            'applications_contacted' => $appsContacted,

            'referrals_count' => $referralsTotal,
            'posts_active' => $referralsActive,
            'posts_pinned' => $referralsPinned,
            'posts_with_apps' => $referralsWithApps,

            'training_opportunities' => $trainingTotal,
            'training_india' => $trainingIndia,
            'training_overseas' => $trainingOverseas,
            'pending_apps' => JobApplication::whereIn('status', ['new', 'pending'])->count(),
            'pending_training' => TrainingOpportunity::whereIn('status', ['draft', 'pending'])->count(),
        ];

        // Fetch recent pending job posts for quick action dashboard overview
        $pendingJobs = JobPost::pending()->with('creator')->latest()->take(5)->get();

        // Fetch recent pending chef profiles
        $pendingChefs = ChefProfile::pending()->with('user')->latest()->take(5)->get();

        // Build a dynamic recent activity feed
        $activities = collect();

        // 1. Recent job postings
        $recentJobs = JobPost::with('creator')->latest()->take(5)->get();
        foreach ($recentJobs as $job) {
            $creatorName = $job->creator->full_name ?? ($job->company ?: 'Employer');
            $activities->push((object)[
                'title' => 'New job post submitted',
                'description' => "{$creatorName} submitted a new listing: '{$job->title}'",
                'timestamp' => $job->created_at ? $job->created_at->timestamp : 0,
                'time' => $job->created_at ? $job->created_at->diffForHumans() : 'recently',
                'badge_color' => 'bg-blue-50 text-blue-600',
                'icon' => '💼'
            ]);
        }

        // 2. Recent chef profiles
        $recentChefs = ChefProfile::with('user')->latest()->take(5)->get();
        foreach ($recentChefs as $chef) {
            if ($chef->user) {
                $chefName = $chef->user->full_name ?? 'Chef';
                $activities->push((object)[
                    'title' => 'Chef profile submitted',
                    'description' => "Chef {$chefName} completed onboarding for '{$chef->cuisine_specialty}'",
                    'timestamp' => $chef->created_at ? $chef->created_at->timestamp : 0,
                    'time' => $chef->created_at ? $chef->created_at->diffForHumans() : 'recently',
                    'badge_color' => 'bg-emerald-50 text-emerald-600',
                    'icon' => '👨‍🍳'
                ]);
            }
        }

        // 3. Recent applications
        $recentApps = JobApplication::with(['applicant', 'jobPost'])->latest()->take(5)->get();
        foreach ($recentApps as $app) {
            if ($app->applicant && $app->jobPost) {
                $applicantName = $app->applicant->full_name ?? 'Candidate';
                $activities->push((object)[
                    'title' => 'New application received',
                    'description' => "{$applicantName} applied for '{$app->jobPost->title}' listing",
                    'timestamp' => $app->created_at ? $app->created_at->timestamp : 0,
                    'time' => $app->created_at ? $app->created_at->diffForHumans() : 'recently',
                    'badge_color' => 'bg-indigo-50 text-indigo-600',
                    'icon' => '📝'
                ]);
            }
        }

        // Sort by timestamp DESC
        $feed = $activities->sortByDesc('timestamp')->values()->take(5);

        if (request()->wantsJson() || request()->ajax() || request()->isJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'stats' => $stats,
                'pendingJobs' => $pendingJobs,
                'pendingChefs' => $pendingChefs,
                'feed' => $feed
            ]);
        }

        return view('admin.dashboard', compact('stats', 'pendingJobs', 'pendingChefs', 'feed'));
    }
}
