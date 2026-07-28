<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\JobPost;
use Illuminate\Http\Request;

class EmployerModeratorController extends Controller
{
    /**
     * Display a dynamic list of all employer users without pagination.
     */
    public function index(Request $request)
    {
        $query = User::where(function ($q) {
            $q->whereHas('roles', function ($rq) {
                $rq->whereIn('role_type', ['employer', 'agency']);
            })
            ->orWhereHas('employerProfile');
        })
        ->with(['employerProfile', 'jobPosts', 'roles', 'activeRole'])
        ->withCount('jobPosts');

        // Optional search filter (Company, Contact Person, Phone, Email)
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('mobile_number', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('employerProfile', function ($epq) use ($search) {
                      $epq->where('business_name', 'like', "%{$search}%")
                         ->orWhere('contact_person_name', 'like', "%{$search}%")
                         ->orWhere('business_location', 'like', "%{$search}%");
                  });
            });
        }

        // Optional tab status filter
        if ($request->filled('tab')) {
            if ($request->tab === 'active') {
                $query->where('is_suspended', false);
            } elseif ($request->tab === 'suspended') {
                $query->where('is_suspended', true);
            }
        }

        // Fetch ALL employer users dynamically without pagination
        $employers = $query->latest()->get();

        // Dynamic Growth Overview Statistics
        $totalActiveEmployers = User::where('is_suspended', false)
            ->where(function ($q) {
                $q->whereHas('roles', function ($rq) {
                    $rq->whereIn('role_type', ['employer', 'agency']);
                })->orWhereHas('employerProfile');
            })->count();

        $totalNewPostings = JobPost::count();
        $pendingVerificationCount = User::where('is_suspended', false)
            ->whereHas('employerProfile', function ($epq) {
                $epq->where('is_completed', false);
            })->count();

        if ($request->wantsJson() || $request->ajax() || $request->isJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'total' => $employers->count(),
                'employers' => $employers
            ]);
        }

        return view('admin.employers', compact(
            'employers',
            'totalActiveEmployers',
            'totalNewPostings',
            'pendingVerificationCount'
        ));
    }

    /**
     * Store / Onboard a new employer account directly from Admin Console.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mobile_number' => 'required|string|unique:users,mobile_number',
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'business_name' => 'required|string|max:255',
            'business_location' => 'nullable|string|max:255',
        ]);

        // Create User Record
        $user = User::create([
            'mobile_number' => $validated['mobile_number'],
            'full_name' => $validated['full_name'],
            'email' => $validated['email'] ?? null,
            'city' => $validated['business_location'] ?? 'Mumbai',
            'current_employer' => $validated['business_name'],
        ]);

        // Assign active employer role in user_roles
        \App\Models\UserRole::updateOrCreate(
            ['user_id' => $user->id, 'role_type' => 'employer'],
            ['is_active' => true]
        );

        // Create associated EmployerProfile
        \App\Models\EmployerProfile::create([
            'user_id' => $user->id,
            'business_name' => $validated['business_name'],
            'contact_person_name' => $validated['full_name'],
            'business_location' => $validated['business_location'] ?? 'Mumbai',
            'business_mobile' => $validated['mobile_number'],
            'business_email' => $validated['email'] ?? null,
            'is_completed' => true,
        ]);

        if ($request->wantsJson() || $request->ajax() || $request->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "Employer account for '{$validated['business_name']}' created successfully!",
                'user' => $user->load('employerProfile')
            ]);
        }

        return redirect()->back()->with('success', "Employer account for '{$validated['business_name']}' created successfully!");
    }

    /**
     * Suspend an employer account.
     */
    public function suspend(User $user)
    {
        $user->update(['is_suspended' => true]);
        $user->tokens()->delete();

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "Employer account {$user->full_name} has been suspended."
            ]);
        }

        return redirect()->back()->with('success', "Employer account '{$user->full_name}' has been suspended.");
    }

    /**
     * Activate an employer account.
     */
    public function activate(User $user)
    {
        $user->update(['is_suspended' => false]);

        if (request()->wantsJson() || request()->ajax() || request()->isJson()) {
            return response()->json([
                'success' => true,
                'message' => "Employer account {$user->full_name} has been activated."
            ]);
        }

        return redirect()->back()->with('success', "Employer account '{$user->full_name}' has been activated.");
    }
}
