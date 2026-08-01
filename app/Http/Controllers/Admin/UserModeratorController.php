<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserModeratorController extends Controller
{
    /**
     * Display a list of all users.
     */
    public function index(Request $request)
    {
        $query = User::with(['roles', 'activeRole'])->withCount(['jobPosts', 'applications']);

        // Strictly filter: users with an ACTIVE job_seeker role (user_roles.is_active = 1)
        $query->whereHas('roles', function ($rq) {
            $rq->whereIn('role_type', ['job_seeker', 'jobseeker', 'talent'])
               ->where('is_active', 1);
        });

        // Optional Search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('mobile_number', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Optional Tab filter
        if ($request->has('tab')) {
            if ($request->tab === 'active') {
                $query->where('is_suspended', false);
            } elseif ($request->tab === 'suspended') {
                $query->where('is_suspended', true);
            }
        }

        $users = $query->latest()->get();

        if (request()->wantsJson() || request()->ajax() || request()->isJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'users' => $users,
                'total' => $users->count()
            ]);
        }

        return view('admin.users', compact('users'));
    }

    /**
     * Display employers list (users with active employer role).
    /**
     * Display employers list (users with active employer role).
     * Fetches combined data from users table and employer_profiles table.
     */
    public function employers(Request $request)
    {
        $query = User::with(['roles', 'employerProfile'])
            ->withCount(['jobPosts'])
            ->whereHas('roles', function ($rq) {
                $rq->whereIn('role_type', ['employer', 'agency'])
                   ->where('is_active', 1);
            });

        // Search filter across users and employer_profiles tables
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('mobile_number', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%")
                  ->orWhere('current_employer', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhereHas('employerProfile', function ($epq) use ($search) {
                      $epq->where('business_name', 'like', "%{$search}%")
                          ->orWhere('contact_person_name', 'like', "%{$search}%")
                          ->orWhere('business_mobile', 'like', "%{$search}%")
                          ->orWhere('business_email', 'like', "%{$search}%")
                          ->orWhere('business_location', 'like', "%{$search}%");
                  });
            });
        }

        // Tab filter
        if ($request->tab === 'active') {
            $query->where('is_suspended', false);
        } elseif ($request->tab === 'suspended') {
            $query->where('is_suspended', true);
        }

        $employers = $query->latest()->get()->map(function ($user) {
            $empProfile = $user->employerProfile;

            return [
                'id'            => $user->id,
                'name'          => optional($empProfile)->business_name ?: ($user->current_employer ?: ($user->full_name ?: 'Employer Company')),
                'contact'       => optional($empProfile)->contact_person_name ?: ($user->full_name ?: 'N/A'),
                'phone'         => optional($empProfile)->business_mobile ?: ($user->mobile_number ?: 'N/A'),
                'email'         => optional($empProfile)->business_email ?: ($user->email ?: ''),
                'hq'            => optional($empProfile)->business_location ?: ($user->city ?: 'India'),
                'posted_count'  => $user->job_posts_count ?? 0,
                'status'        => $user->is_suspended ? 'Suspended' : 'Active',
                'is_suspended'  => (bool) $user->is_suspended,
                'created_at'    => $user->created_at,
                'role_type'     => optional($user->roles->where('is_active', 1)->first())->role_type ?? 'employer',
            ];
        });

        return response()->json([
            'success'   => true,
            'employers' => $employers,
            'total'     => $employers->count(),
        ]);
    }

    /**
     * Get single employer details with real DB stats and posted jobs.
     */
    public function showEmployer(User $user)
    {
        $user->load(['employerProfile', 'roles']);

        $jobs = \App\Models\JobPost::where('created_by', $user->id)->latest()->get();

        $totalJobs = $jobs->count();
        $activeJobs = $jobs->where('status', 'approved')->count();
        $pendingJobs = $jobs->where('status', 'pending')->count();

        $empProfile = $user->employerProfile;

        $employerData = [
            'id'            => $user->id,
            'name'          => optional($empProfile)->business_name ?: ($user->current_employer ?: ($user->full_name ?: 'Employer Company')),
            'contact'       => optional($empProfile)->contact_person_name ?: ($user->full_name ?: 'N/A'),
            'phone'         => optional($empProfile)->business_mobile ?: ($user->mobile_number ?: 'N/A'),
            'email'         => optional($empProfile)->business_email ?: ($user->email ?: 'N/A'),
            'hq'            => optional($empProfile)->business_location ?: ($user->city ?: 'India'),
            'status'        => $user->is_suspended ? 'Suspended' : 'Active',
            'is_suspended'  => (bool) $user->is_suspended,
            'created_at'    => $user->created_at ? $user->created_at->format('M Y') : 'Jan 2023',
            'total_jobs'    => $totalJobs,
            'active_jobs'   => $activeJobs,
            'pending_jobs'  => $pendingJobs,
            'jobs'          => $jobs->map(function ($j) {
                return [
                    'id'           => $j->id,
                    'title'        => $j->title,
                    'date'         => $j->created_at ? $j->created_at->format('M d, Y') : 'N/A',
                    'status'       => $j->status === 'approved' ? 'Active' : ($j->status === 'pending' ? 'Pending Approval' : 'Closed'),
                    'status_color' => $j->status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : ($j->status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-slate-50 text-slate-500 border-slate-100'),
                ];
            }),
        ];

        return response()->json([
            'success'  => true,
            'employer' => $employerData,
        ]);
    }

    /**
     * Suspend a user.
     */
    public function suspend(User $user)
    {
        $user->update(['is_suspended' => true]);
        
        // Revoke all existing Sanctum auth tokens to log them out immediately
        $user->tokens()->delete();

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "User account {$user->mobile_number} has been suspended successfully."
            ]);
        }

        return redirect()->back()->with('success', "User account {$user->mobile_number} has been suspended successfully.");
    }

    /**
     * Activate a user.
     */
    public function activate(User $user)
    {
        $user->update(['is_suspended' => false]);

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "User account {$user->mobile_number} has been activated successfully."
            ]);
        }

        return redirect()->back()->with('success', "User account {$user->mobile_number} has been activated successfully.");
    }

    /**
     * Get JSON list of job posts created by the user.
     */
    public function postedJobsList(User $user)
    {
        $jobs = $user->jobPosts()->with(['applications.applicant'])->latest()->get();
        return response()->json([
            'success' => true,
            'jobs' => $jobs
        ]);
    }

    /**
     * Get JSON list of jobs applied to by the user.
     */
    public function appliedJobsList(User $user)
    {
        $applications = $user->applications()
            ->with('jobPost')
            ->latest()
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'status' => $app->status,
                    'applied_at' => $app->created_at ? $app->created_at->format('d M Y') : 'Unknown Date',
                    'job_post' => $app->jobPost
                ];
            });

        return response()->json([
            'success' => true,
            'applications' => $applications
        ]);
    }

    /**
     * Hard delete a user and all their associated data from the database.
     */
    public function destroy(User $user)
    {
        $userName = $user->full_name ?? $user->mobile_number;
        $user->delete(); // This deletes the user, cascading down to related tables

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "User account {$userName} has been permanently deleted from the database."
            ]);
        }

        return redirect()->back()->with('success', "User account {$userName} has been permanently deleted from the database.");
    }
}
