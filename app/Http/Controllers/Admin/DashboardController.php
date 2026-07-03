<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Models\JobPost;
use App\Models\TrainingOpportunity;
use App\Models\User;
use App\Models\JobApplication;

class DashboardController extends Controller
{
    /**
     * Display the overall stats dashboard.
     */
    public function index()
    {
        $stats = [
            'users_count' => User::count(),
            'users_active' => User::active()->count(),
            'users_suspended' => User::where('is_suspended', true)->count(),
            
            'jobs_total' => JobPost::count(),
            'jobs_approved' => JobPost::approved()->count(),
            'jobs_pending' => JobPost::pending()->count(),
            
            'chefs_total' => ChefProfile::count(),
            'chefs_approved' => ChefProfile::approved()->count(),
            'chefs_pending' => ChefProfile::pending()->count(),
            
            'training_opportunities' => TrainingOpportunity::count(),
            'applications_count' => JobApplication::count(),
        ];

        // Fetch recent pending job posts for quick action dashboard overview
        $pendingJobs = JobPost::pending()->with('creator')->latest()->take(5)->get();

        // Fetch recent pending chef profiles
        $pendingChefs = ChefProfile::pending()->with('user')->latest()->take(5)->get();

        // Build a dynamic recent activity feed
        $activities = collect();

        // 1. Recent job postings
        $recentJobs = JobPost::with('creator')->latest()->take(3)->get();
        foreach ($recentJobs as $job) {
            $creatorName = $job->creator->full_name ?? 'Employer';
            $activities->push((object)[
                'title' => 'New job post submitted',
                'description' => "{$creatorName} submitted a new listing: '{$job->title}' at '{$job->company}'",
                'time' => $job->created_at ? $job->created_at->diffForHumans() : 'recently',
                'badge_color' => 'bg-blue-50 text-blue-600',
                'icon' => '💼'
            ]);
        }

        // 2. Recent chef profiles
        $recentChefs = ChefProfile::with('user')->latest()->take(3)->get();
        foreach ($recentChefs as $chef) {
            if ($chef->user) {
                $chefName = $chef->user->full_name ?? 'Chef';
                $activities->push((object)[
                    'title' => 'Chef profile submitted',
                    'description' => "Chef {$chefName} completed their onboarding with specialty: '{$chef->cuisine_specialty}'",
                    'time' => $chef->created_at ? $chef->created_at->diffForHumans() : 'recently',
                    'badge_color' => 'bg-emerald-50 text-emerald-600',
                    'icon' => '👨‍🍳'
                ]);
            }
        }

        // 3. Recent applications
        $recentApps = JobApplication::with(['applicant', 'jobPost'])->latest()->take(3)->get();
        foreach ($recentApps as $app) {
            if ($app->applicant && $app->jobPost) {
                $applicantName = $app->applicant->full_name ?? 'Candidate';
                $activities->push((object)[
                    'title' => 'New application received',
                    'description' => "{$applicantName} applied for '{$app->jobPost->title}' listing",
                    'time' => $app->created_at ? $app->created_at->diffForHumans() : 'recently',
                    'badge_color' => 'bg-indigo-50 text-indigo-600',
                    'icon' => '📝'
                ]);
            }
        }

        // Sort by time or randomize order/limit to 5
        $feed = $activities->shuffle()->take(5);

        return view('admin.dashboard', compact('stats', 'pendingJobs', 'pendingChefs', 'feed'));
    }
}
