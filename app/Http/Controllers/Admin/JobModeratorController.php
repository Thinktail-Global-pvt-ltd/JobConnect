<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;

class JobModeratorController extends Controller
{
    /**
     * List all jobs.
     */
    public function index(Request $request)
    {
        $query = JobPost::with('creator');

        // Optional filter by status
        if ($request->filled('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        // Optional filter by category
        if ($request->filled('category')) {
            $cat = strtolower(trim($request->category));
            if (in_array($cat, ['community', 'referrals', 'referral'])) {
                $query->where(function($q) {
                    $q->where('category', 'community')
                      ->orWhere('is_referral', true);
                });
            } elseif (in_array($cat, ['india', 'overseas'])) {
                $query->where('category', $cat);
            }
        }

        $jobs = $query->latest()->get();

        $stats = [
            'total'    => JobPost::count(),
            'pending'  => JobPost::where('status', 'pending')->count(),
            'approved' => JobPost::where('status', 'approved')->count(),
            'rejected' => JobPost::where('status', 'rejected')->count(),
            'pinned'   => JobPost::where('is_pinned', true)->count(),
        ];

        if (request()->wantsJson() || request()->ajax() || request()->isJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'jobs'    => $jobs,
                'stats'   => $stats,
                'total'   => $jobs->count()
            ]);
        }

        return view('admin.jobs', compact('jobs'));
    }

    /**
     * Approve a job post.
     */
    public function approve($job)
    {
        $jobModel = $job instanceof JobPost ? $job : JobPost::find($job);
        if (!$jobModel) {
            return response()->json(['success' => false, 'message' => 'Job posting not found.'], 404);
        }

        $jobModel->update(['status' => 'approved']);

        // Shoot FCM Push Notifications & In-App Notification to Employer & Candidates
        try {
            \App\Services\NotificationTriggerService::notifyJobPublished($jobModel);
        } catch (\Throwable $ne) {
            \Illuminate\Support\Facades\Log::error('Job approval notification error: ' . $ne->getMessage());
        }

        if (request()->wantsJson() || request()->ajax() || request()->isJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => "Job posting '{$jobModel->title}' has been approved successfully."
            ]);
        }

        return redirect()->back()->with('success', "Job posting '{$jobModel->title}' has been approved successfully.");
    }

    /**
     * Reject a job post.
     */
    public function reject(JobPost $job)
    {
        $job->update(['status' => 'rejected']);

        try {
            \App\Services\NotificationTriggerService::notifyJobRejected($job);
        } catch (\Throwable $ne) {
            \Illuminate\Support\Facades\Log::error('Job rejection notification error: ' . $ne->getMessage());
        }

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "Job posting '{$job->title}' has been rejected."
            ]);
        }

        return redirect()->back()->with('success', "Job posting '{$job->title}' has been rejected.");
    }

    /**
     * Toggle the pinned status of a job post.
     */
    public function togglePin(JobPost $job)
    {
        $job->update(['is_pinned' => !$job->is_pinned]);

        $statusMessage = $job->is_pinned ? "pinned to the top of feed" : "unpinned from top";

        if (request()->wantsJson() || request()->ajax() || request()->isJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'is_pinned' => (bool)$job->is_pinned,
                'job' => $job,
                'message' => "Job posting '{$job->title}' has been {$statusMessage}."
            ]);
        }

        return redirect()->back()->with('success', "Job posting '{$job->title}' has been {$statusMessage}.");
    }

    /**
     * Show a specific job post details for review.
     */
    public function show(JobPost $job)
    {
        $job->load('creator');

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'job' => $job
            ]);
        }

        return view('admin.job_detail', compact('job'));
    }
}
