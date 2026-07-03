<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerController extends Controller
{
    /**
     * Display the employer dashboard and jobs.
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return redirect()->route('login');
            }

            // Clean up incomplete/null name applications from the database
            \Illuminate\Support\Facades\DB::table('job_applications')
                ->whereNotIn('applicant_id', function($query) {
                    $query->select('id')
                          ->from('users')
                          ->whereNotNull('full_name')
                          ->where('full_name', '!=', '')
                          ->where('full_name', '!=', 'null');
                })
                ->delete();

            // Fetch job posts created by this user, eager loading applications, applicants, and chef profiles
            $jobs = JobPost::with(['applications.applicant.chefProfile'])
                ->where('created_by', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Auto-populate dummy applicants logic has been removed to prevent fake applications.

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
                    $applicant = $app->applicant;
                    $chefProfile = $applicant ? $applicant->chefProfile : null;

                    // Format skills array
                    $skills = [];
                    if ($applicant && is_array($applicant->skills)) {
                        $skills = $applicant->skills;
                    } elseif ($applicant && is_string($applicant->skills)) {
                        $skills = json_decode($applicant->skills, true) ?: [];
                    }

                    return [
                        'id' => $app->id,
                        'name' => $applicant ? $applicant->full_name : 'Unknown Candidate',
                        'mobile_number' => $applicant ? $applicant->mobile_number : '',
                        'status' => $app->status, // new, contacted, shortlisted, hired, rejected
                        'applied_date' => $app->created_at ? $app->created_at->format('j M Y') : 'N/A',
                        'city' => $applicant ? $applicant->city : 'N/A',
                        'experience_range' => $applicant ? $applicant->experience_range : 'N/A',
                        'current_employer' => $applicant ? $applicant->current_employer : 'N/A',
                        'skills' => $skills,
                        'bio' => $chefProfile ? $chefProfile->bio : null,
                        'cuisine_specialty' => $chefProfile ? $chefProfile->cuisine_specialty : null,
                    ];
                });

                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'status' => $status,
                    'location' => $job->location ?? 'N/A',
                    'date_posted' => $job->created_at ? $job->created_at->format('j F Y') : 'N/A',
                    'openings' => $job->open_positions ?? 1,
                    'type' => $job->job_type ?? 'Full-time',
                    'applicants' => $applicants,
                ];
            });

            if ($request->wantsJson() || $request->ajax() || $request->is('api/*')) {
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
        } catch (\Exception $e) {
            if ($request->wantsJson() || $request->ajax() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to load dashboard metrics.',
                    'error' => $e->getMessage()
                ], 500);
            }
            return response('Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created job post in storage.
     */
    public function storeJob(Request $request)
    {
        try {
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
                'date_posted' => $job->created_at ? $job->created_at->format('j F Y') : 'N/A',
                'openings' => $job->open_positions,
                'type' => $job->job_type,
                'applicants' => [],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy posted successfully!',
                'job' => $mappedJob,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to store job post.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Close the specified job posting.
     */
    public function closeJob($id)
    {
        try {
            $job = JobPost::where('created_by', Auth::id())->findOrFail($id);
            $job->update(['status' => 'closed']);

            return response()->json([
                'success' => true,
                'message' => "Job '{$job->title}' has been closed.",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to close job posting.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of a specific applicant (JobApplication).
     */
    public function updateApplicantStatus(Request $request, $id)
    {
        try {
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
                'applied_date' => $application->created_at ? $application->created_at->format('j M Y') : 'N/A',
            ];

            return response()->json([
                'success' => true,
                'message' => "Candidate status updated to {$application->status}.",
                'applicant' => $mappedApplicant,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update applicant status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
