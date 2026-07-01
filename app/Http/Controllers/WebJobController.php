<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WebJobController extends Controller
{
    /**
     * Display the job post details page.
     */
    public function show(JobPost $job)
    {
        // Load the relationship creator
        $job->load('creator');

        $hasApplied = false;
        if (Auth::check()) {
            $hasApplied = JobApplication::where('applicant_id', Auth::id())
                ->where('job_post_id', $job->id)
                ->exists();
        }

        return view('jobs.show', compact('job', 'hasApplied'));
    }

    /**
     * Apply to a specific job post.
     */
    public function apply(Request $request, JobPost $job)
    {
        $user = Auth::user();

        // Check if already applied
        $exists = JobApplication::where('applicant_id', $user->id)
            ->where('job_post_id', $job->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied for this job.',
            ], 422);
        }

        // Create application
        JobApplication::create([
            'applicant_id' => $user->id,
            'job_post_id' => $job->id,
            'employer_id' => $job->created_by,
            'status' => 'new',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully!',
        ]);
    }

    /**
     * Show the job posting form.
     */
    public function create()
    {
        $user = Auth::user();

        // Check if active context is employer or agency
        $activeRole = $user->currentRoleContext();
        if (!$activeRole || ($activeRole->role_type !== 'employer' && $activeRole->role_type !== 'agency')) {
            return redirect()->route('profile')->with('error', 'Only active Employers or Agencies can access the Job Posting section. Please switch your profile context to Employer first.');
        }

        return view('jobs.create', compact('user', 'activeRole'));
    }

    /**
     * Create/Store a new job vacancy.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Security check
        $activeRole = $user->currentRoleContext();
        if (!$activeRole || ($activeRole->role_type !== 'employer' && $activeRole->role_type !== 'agency')) {
            return response()->json([
                'success' => false,
                'message' => 'Only active Employers or Agencies can post jobs.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:india,overseas,community',
            'company' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'company_logo_url' => 'nullable|url|max:500',
            'contact_info' => 'required|string|max:255',
            'description' => 'required|string',
            'experience_range' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'job_type' => 'required|string|max:255',
            'showcase_image_url' => 'nullable|url|max:500',
            'map_image_url' => 'nullable|url|max:500',
            'open_positions' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process requirements comma-separated to array
        $requirementsArray = [];
        if ($request->filled('requirements')) {
            $requirementsArray = array_filter(array_map('trim', explode(',', $request->requirements)));
        }

        // Process benefits comma-separated to array
        $benefitsArray = [];
        if ($request->filled('benefits')) {
            $benefitsArray = array_filter(array_map('trim', explode(',', $request->benefits)));
        }

        // Create job post (default approved so they can test it instantly)
        JobPost::create([
            'created_by' => $user->id,
            'title' => $request->title,
            'category' => $request->category,
            'company' => $request->company,
            'salary' => $request->salary,
            'location' => $request->location,
            'company_logo_url' => $request->company_logo_url,
            'contact_info' => $request->contact_info,
            'description' => $request->description,
            'experience_range' => $request->experience_range,
            'requirements' => $requirementsArray,
            'benefits' => $benefitsArray,
            'job_type' => $request->job_type,
            'showcase_image_url' => $request->showcase_image_url,
            'map_image_url' => $request->map_image_url,
            'open_positions' => $request->open_positions ?? 1,
            'status' => 'approved', // Auto-approved for frictionless prototype testing
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Job vacancy posted successfully and is now active!',
        ]);
    }

    /**
     * Toggle saving a job post.
     */
    public function toggleSave(Request $request, JobPost $job)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Check if already saved
        $savedJob = \App\Models\SavedJob::where('user_id', $user->id)
            ->where('job_post_id', $job->id)
            ->first();

        if ($savedJob) {
            $savedJob->delete();
            return response()->json([
                'success' => true,
                'saved' => false,
                'message' => 'Job removed from saved list.',
            ]);
        }

        \App\Models\SavedJob::create([
            'user_id' => $user->id,
            'job_post_id' => $job->id,
        ]);

        return response()->json([
            'success' => true,
            'saved' => true,
            'message' => 'Job saved to your favorites!',
        ]);
    }
}
