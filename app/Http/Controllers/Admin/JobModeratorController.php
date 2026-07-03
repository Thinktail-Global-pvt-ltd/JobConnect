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
        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        // Optional filter by category
        if ($request->has('category') && in_array($request->category, ['india', 'overseas', 'community'])) {
            $query->where('category', $request->category);
        }

        $jobs = $query->latest()->paginate(15);

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'jobs' => $jobs->items(),
                'pagination' => [
                    'total' => $jobs->total(),
                    'per_page' => $jobs->perPage(),
                    'current_page' => $jobs->currentPage(),
                    'last_page' => $jobs->lastPage(),
                ]
            ]);
        }

        return view('admin.jobs', compact('jobs'));
    }

    /**
     * Approve a job post.
     */
    public function approve(JobPost $job)
    {
        $job->update(['status' => 'approved']);

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "Job posting '{$job->title}' has been approved successfully."
            ]);
        }

        return redirect()->back()->with('success', "Job posting '{$job->title}' has been approved successfully.");
    }

    /**
     * Reject a job post.
     */
    public function reject(JobPost $job)
    {
        $job->update(['status' => 'rejected']);

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

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
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
