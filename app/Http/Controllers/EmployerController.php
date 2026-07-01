<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerController extends Controller
{
    /**
     * Display the employer dashboard and jobs.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Fetch job posts created by this user, eager loading applications and their applicants (users)
        $jobs = JobPost::with(['applications.applicant'])
            ->where('created_by', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate counts
        // Note: active matches 'approved', pending matches 'pending', closed matches 'closed'
        $activeJobsCount = $jobs->where('status', 'approved')->count();
        $pendingJobsCount = $jobs->where('status', 'pending')->count();

        // Aggregate stats across active job posts
        $activeJobs = $jobs->where('status', 'approved');
        $totalApplicants = 0;
        $totalShortlisted = 0;
        $totalRejected = 0;
        $totalContacted = 0;

        foreach ($activeJobs as $job) {
            $totalApplicants += $job->applications->count();
            $totalShortlisted += $job->applications->where('status', 'shortlisted')->count();
            $totalRejected += $job->applications->where('status', 'rejected')->count();
            $totalContacted += $job->applications->where('status', 'contacted')->count();
        }

        // Map database status values to match frontend expected tabs (active, pending, closed)
        $mappedJobs = $jobs->map(function ($job) {
            $status = 'pending';
            if ($job->status === 'approved') {
                $status = 'active';
            } elseif ($job->status === 'closed') {
                $status = 'closed';
            }

            // Map application status fields as well
            $applicants = $job->applications->map(function ($app) {
                return [
                    'id' => $app->id,
                    'name' => $app->applicant ? $app->applicant->full_name : 'Unknown Candidate',
                    'status' => $app->status, // new, contacted, shortlisted, hired, rejected
                    'applied_date' => $app->created_at->format('j M Y'),
                ];
            });

            return [
                'id' => $job->id,
                'title' => $job->title,
                'status' => $status,
                'location' => $job->location ?? 'N/A',
                'date_posted' => $job->created_at->format('j F Y'),
                'openings' => $job->open_positions ?? 1,
                'type' => $job->job_type ?? 'Full-time',
                'applicants' => $applicants,
            ];
        });

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'metrics' => [
                    'total_applicants' => $totalApplicants,
                    'shortlisted' => $totalShortlisted,
                    'rejected' => $totalRejected,
                    'contacted' => $totalContacted,
                    'active_jobs_count' => $activeJobsCount,
                    'pending_jobs_count' => $pendingJobsCount,
                ],
                'jobs' => $mappedJobs,
            ]);
        }

        // Pass details of the employer contact info
        $employerName = $user->full_name;
        $companyName = $jobs->first() ? $jobs->first()->company : 'Grand Hyatt Dubai';

        return view('employer', [
            'jobs' => $mappedJobs,
            'employerName' => $employerName,
            'companyName' => $companyName,
            'avatarUrl' => $user->profile_photo_path ?? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120',
            'activeJobsCount' => $activeJobsCount,
            'pendingJobsCount' => $pendingJobsCount,
            'totalApplicants' => $totalApplicants,
            'totalShortlisted' => $totalShortlisted,
            'totalRejected' => $totalRejected,
            'totalContacted' => $totalContacted,
        ]);
    }

    /**
     * Store a newly created job post in storage.
     */
    public function storeJob(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'openings' => 'required|integer|min:1',
            'type' => 'required|string|max:100',
            'status' => 'required|string|in:active,pending,closed',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        $company = 'Grand Hyatt Dubai';
        $existingPost = JobPost::where('created_by', $user->id)->first();
        if ($existingPost) {
            $company = $existingPost->company;
        }

        $dbStatus = 'approved';
        if ($validated['status'] === 'pending') {
            $dbStatus = 'pending';
        } elseif ($validated['status'] === 'closed') {
            $dbStatus = 'closed';
        }

        $job = JobPost::create([
            'created_by' => $user->id,
            'title' => $validated['title'],
            'category' => 'india',
            'company' => $company,
            'location' => $validated['location'],
            'contact_info' => $user->email ?? 'recruitment@grandhyatt.com',
            'description' => 'Detailed description will be added soon.',
            'job_type' => $validated['type'],
            'open_positions' => $validated['openings'],
            'status' => $dbStatus,
        ]);

        $mappedJob = [
            'id' => $job->id,
            'title' => $job->title,
            'status' => $validated['status'],
            'location' => $job->location,
            'date_posted' => $job->created_at->format('j F Y'),
            'openings' => $job->open_positions,
            'type' => $job->job_type,
            'applicants' => [],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Job vacancy posted successfully!',
            'job' => $mappedJob,
        ]);
    }

    /**
     * Close the specified job posting.
     */
    public function closeJob($id)
    {
        $job = JobPost::where('created_by', Auth::id())->findOrFail($id);
        $job->update(['status' => 'closed']);

        return response()->json([
            'success' => true,
            'message' => "Job '{$job->title}' has been closed.",
        ]);
    }

    /**
     * Update the status of a specific applicant (JobApplication).
     */
    public function updateApplicantStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,pending,shortlisted,contacted,rejected',
        ]);

        // Find the application belonging to one of the logged-in user's job postings
        $application = JobApplication::where('employer_id', Auth::id())->findOrFail($id);
        
        $newStatus = $validated['status'];
        if ($newStatus === 'pending') {
            $newStatus = 'new'; // Map pending to 'new' inside database schema
        }

        $application->update(['status' => $newStatus]);

        // Return updated candidate details mapped for frontend
        $mappedApplicant = [
            'id' => $application->id,
            'name' => $application->applicant ? $application->applicant->full_name : 'Unknown Candidate',
            'status' => $application->status,
            'applied_date' => $application->created_at->format('j M Y'),
        ];

        return response()->json([
            'success' => true,
            'message' => "Candidate status updated to {$application->status}.",
            'applicant' => $mappedApplicant,
        ]);
    }
}
