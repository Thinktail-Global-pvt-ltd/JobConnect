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
     * Inserts data across 3 tables: users, user_roles, and employer_profiles.
     */
    public function store(Request $request)
    {
        // Flexible key extraction from frontend modal variations
        $businessName = $request->input('business_name') ?? $request->input('name') ?? $request->input('company') ?? 'New Employer Ltd';
        $fullName = $request->input('full_name') ?? $request->input('contact') ?? $request->input('contact_person') ?? 'Employer Contact';
        $mobileNumber = $request->input('mobile_number') ?? $request->input('mobile') ?? $request->input('phone') ?? ('9' . rand(100000000, 999999999));
        $email = $request->input('email') ?? $request->input('business_email') ?: null;
        $location = $request->input('business_location') ?? $request->input('hq') ?? $request->input('city') ?? 'India';

        $industrySegment = $request->input('industry_segment', 'Hospitality / F&B');
        $prefLang = $request->input('preferred_language', 'en');

        // Use DB Transaction to ensure atomic inserts into all 3 tables
        $user = \Illuminate\Support\Facades\DB::transaction(function () use ($businessName, $fullName, $mobileNumber, $email, $location, $industrySegment, $prefLang) {
            // 1. Create or update User in `users` table
            $userObj = User::updateOrCreate(
                ['mobile_number' => $mobileNumber],
                [
                    'full_name' => $fullName,
                    'email' => $email,
                    'city' => $location,
                    'current_employer' => $businessName,
                ]
            );

            // 2. Assign active employer role in `user_roles` table
            \App\Models\UserRole::updateOrCreate(
                ['user_id' => $userObj->id, 'role_type' => 'employer'],
                ['is_active' => true]
            );

            // 3. Create or update profile in `employer_profiles` table
            \App\Models\EmployerProfile::updateOrCreate(
                ['user_id' => $userObj->id],
                [
                    'business_name'        => $businessName,
                    'industry_segment'     => $industrySegment,
                    'contact_person_name'  => $fullName,
                    'business_location'    => $location,
                    'business_mobile'      => $mobileNumber,
                    'business_email'       => $email,
                    'preferred_language'   => $prefLang,
                    'nominee_name'         => $fullName,
                    'nominee_relationship' => 'Self / Owner',
                    'nominee_mobile'       => $mobileNumber,
                    'is_completed'         => true,
                ]
            );

            return $userObj;
        });

        return response()->json([
            'success' => true,
            'message' => "Employer account for '{$businessName}' created successfully across users, user_roles, and employer_profiles tables!",
            'user' => [
                'id' => $user->id,
                'name' => $businessName,
                'contact' => $fullName,
                'phone' => $mobileNumber,
                'email' => $email,
                'hq' => $location,
                'posted_count' => 0,
                'status' => 'Active',
                'created_at' => $user->created_at,
            ]
        ], 201);
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
