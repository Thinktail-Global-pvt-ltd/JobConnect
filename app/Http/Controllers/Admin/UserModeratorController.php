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

        $users = $query->latest()->paginate(15);

        return view('admin.users', compact('users'));
    }

    /**
     * Suspend a user.
     */
    public function suspend(User $user)
    {
        $user->update(['is_suspended' => true]);
        
        // Revoke all existing Sanctum auth tokens to log them out immediately
        $user->tokens()->delete();

        return redirect()->back()->with('success', "User account {$user->mobile_number} has been suspended successfully.");
    }

    /**
     * Activate a user.
     */
    public function activate(User $user)
    {
        $user->update(['is_suspended' => false]);

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

        return redirect()->back()->with('success', "User account {$userName} has been permanently deleted from the database.");
    }
}
