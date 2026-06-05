<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Models\JobPost;
use App\Models\TrainingOpportunity;
use App\Models\User;

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
        ];

        // Fetch recent pending job posts for quick action dashboard overview
        $pendingJobs = JobPost::pending()->with('creator')->latest()->take(5)->get();

        // Fetch recent pending chef profiles
        $pendingChefs = ChefProfile::pending()->with('user')->latest()->take(5)->get();

        return view('admin.dashboard', compact('stats', 'pendingJobs', 'pendingChefs'));
    }
}
