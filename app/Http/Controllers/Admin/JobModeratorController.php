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
            } elseif (in_array($cat, ['dubai', 'overseas'])) {
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

    /**
     * Store a new job post directly into job_posts table.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title'     => 'required|string|max:255',
                'location'  => 'required|string|max:255',
            ]);

            $adminUser = auth()->user() 
                ?: (\App\Models\User::whereIn('user_role', ['admin', 'super_admin'])->first() 
                ?: \App\Models\User::first());

            $userId = $adminUser ? $adminUser->id : (\App\Models\User::value('id') ?: 1);

            $category = strtolower(trim($request->input('category', 'india')));
            if (!in_array($category, ['india', 'overseas', 'community'])) {
                $category = 'india';
            }

            $salaryMin = $request->filled('salary_min') ? floatval($request->salary_min) : null;
            $salaryMax = $request->filled('salary_max') ? floatval($request->salary_max) : null;
            $salaryCurrency = $request->input('salary_currency', 'INR');

            $salaryStr = $request->input('salary');
            if (!$salaryStr) {
                if ($salaryMin && $salaryMax) {
                    $salaryStr = "{$salaryCurrency} {$salaryMin} - {$salaryMax}";
                } elseif ($salaryMin) {
                    $salaryStr = "{$salaryCurrency} {$salaryMin}";
                } else {
                    $salaryStr = "Best in Industry";
                }
            }

            $contactPerson = $request->input('contact_person') ?: ($adminUser ? ($adminUser->full_name ?: $adminUser->name) : 'Hiring Manager');
            $contactInfo   = $request->input('contact_info') ?: ($adminUser ? ($adminUser->email ?: $adminUser->mobile_number) : 'contact@jobrito.com');
            $description   = $request->input('description') ?: "Job Opportunity for {$request->input('title')} in {$request->input('location')}. Apply now on Jobrito.";

            $job = JobPost::create([
                'created_by'                => $userId,
                'title'                     => $request->input('title'),
                'company'                   => $request->input('company') ?: 'Jobrito Partner',
                'location'                  => $request->input('location'),
                'category'                  => $category,
                'salary'                    => $salaryStr,
                'salary_min'                => $salaryMin,
                'salary_max'                => $salaryMax,
                'salary_currency'           => $salaryCurrency,
                'experience_range'          => $request->input('experience_range', '1-3 Years'),
                'job_type'                  => $request->input('job_type', 'Full-Time'),
                'open_positions'            => intval($request->input('open_positions', 1)),
                'description'               => $description,
                'contact_person'            => $contactPerson,
                'contact_info'              => $contactInfo,
                'status'                    => $request->input('status', 'approved'),
                'is_pinned'                 => filter_var($request->input('is_pinned', false), FILTER_VALIDATE_BOOLEAN),
                'is_referral'               => filter_var($request->input('is_referral', false), FILTER_VALIDATE_BOOLEAN),
                'submitted_by_role'         => 'employer',
                'country'                   => $request->input('country') ?: 'India',
                'visa_assistance'           => filter_var($request->input('visa_assistance', false), FILTER_VALIDATE_BOOLEAN),
                'accommodation_available'   => filter_var($request->input('accommodation_available', false), FILTER_VALIDATE_BOOLEAN),
            ]);

            if (request()->wantsJson() || request()->ajax() || request()->isJson() || request()->is('api/*')) {
                return response()->json([
                    'success' => true,
                    'message' => "Job posting '{$job->title}' created successfully!",
                    'job'     => $job
                ], 201);
            }

            return redirect()->back()->with('success', "Job posting '{$job->title}' created successfully!");
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Admin store job failed: ' . $e->getMessage());

            if (request()->wantsJson() || request()->ajax() || request()->isJson() || request()->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create job posting: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to create job posting: ' . $e->getMessage());
        }
    }
}
