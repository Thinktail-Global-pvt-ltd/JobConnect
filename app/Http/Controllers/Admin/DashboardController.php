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
        $employersCount = EmployerProfile::count();
        if ($employersCount === 0) {
            $employersCount = User::whereHas('roles', function($q) {
                $q->where('role_type', 'employer');
            })->count();
        }

        $referralsCount = JobPost::where('is_referral', true)->count();

        $pendingJobsCount = JobPost::where(function($q) {
            $q->whereIn('status', ['pending', 'Pending', 'draft', 'Draft', 'unread', 'Unread'])
              ->orWhereNull('status');
        })->count();

        $pendingChefsCount = ChefProfile::where(function($q) {
            $q->whereIn('approval_status', ['pending', 'Pending', 'draft', 'Draft', 'unread', 'Unread'])
              ->orWhereNull('approval_status');
        })->count();

        $stats = [
            'users_count' => User::count(),
            'users_total' => User::count(),
            'users_active' => User::active()->count(),
            'users_suspended' => User::where('is_suspended', true)->count(),
            
            'jobs_total' => JobPost::count(),
            'jobs_approved' => JobPost::approved()->count(),
            'jobs_pending' => $pendingJobsCount,
            'pending_jobs' => $pendingJobsCount,
            
            'chefs_total' => ChefProfile::count(),
            'chefs_approved' => ChefProfile::approved()->count(),
            'chefs_pending' => $pendingChefsCount,
            'pending_chefs' => $pendingChefsCount,
            
            'employers_count' => $employersCount,
            'referrals_count' => $referralsCount,
            
            'training_opportunities' => TrainingOpportunity::count(),
            'applications_count' => JobApplication::count(),
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
