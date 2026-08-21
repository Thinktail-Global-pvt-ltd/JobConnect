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
    private function isJsonRequest(Request $request): bool
    {
        return $request->wantsJson() 
            || $request->ajax() 
            || $request->isJson() 
            || $request->is('api/*') 
            || $request->is('backend/api/*') 
            || $request->is('admin/users*')
            || str_contains($request->header('Accept', ''), 'application/json')
            || str_contains($request->header('Content-Type', ''), 'application/json');
    }

    /**
     * Display a list of all users.
     */
    public function index(Request $request)
    {
        $query = User::with(['roles', 'activeRole'])->withCount(['jobPosts', 'applications']);

        // Check columns safely to avoid 1054 Unknown Column SQL errors across local & live schemas
        $hasActiveProfile = \Illuminate\Support\Facades\Schema::hasColumn('users', 'active_profile');
        $hasActiveRole = \Illuminate\Support\Facades\Schema::hasColumn('users', 'active_role');
        $hasUserRole = \Illuminate\Support\Facades\Schema::hasColumn('users', 'user_role');

        $query->where(function ($q) use ($hasActiveProfile, $hasActiveRole, $hasUserRole) {
            $q->whereHas('roles', function ($rq) {
                $rq->whereIn('role_type', ['job_seeker', 'jobseeker', 'talent']);
            });

            if ($hasActiveProfile) {
                $q->orWhereIn('active_profile', ['job_seeker', 'jobseeker', 'talent']);
            }
            if ($hasActiveRole) {
                $q->orWhereIn('active_role', ['job_seeker', 'jobseeker', 'talent']);
            }
            if ($hasUserRole) {
                $q->orWhereIn('user_role', ['job_seeker', 'jobseeker', 'talent']);
            }

            $q->orWhereDoesntHave('roles');
        });

        // Optional Search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('mobile_number', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
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

        $rawUsers = $query->latest()->get();

        $users = $rawUsers->map(function ($user) {
            $rawPhoto = $user->profile_photo_path ?: $user->profile_photo;
            $photoUrl = $rawPhoto;
            if (!empty($rawPhoto)) {
                if (str_contains($rawPhoto, '178.16.138.159')) {
                    $sub = str_replace('http://178.16.138.159', '', $rawPhoto);
                    $sub = str_replace('https://178.16.138.159', '', $sub);
                    $photoUrl = url($sub);
                } elseif (!str_starts_with($rawPhoto, 'http://') && !str_starts_with($rawPhoto, 'https://')) {
                    $photoUrl = url('/' . ltrim($rawPhoto, '/'));
                }
            }

            $user->profile_photo_path = $photoUrl;
            $user->profile_photo = $photoUrl;
            $user->avatar = $photoUrl;
            return $user;
        });

        return response()->json([
            'success' => true,
            'users'   => $users,
            'total'   => $users->count()
        ]);
    }

    /**
     * Show single user profile details with all fields from users table.
     */
    public function show($id)
    {
        $user = User::with(['roles', 'socials', 'chefProfile', 'employerProfile'])
            ->withCount(['jobPosts', 'applications'])
            ->find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $rawPhoto = $user->profile_photo_path ?: $user->profile_photo;
        $photoUrl = $rawPhoto;
        if (!empty($rawPhoto)) {
            if (str_contains($rawPhoto, '178.16.138.159')) {
                $sub = str_replace('http://178.16.138.159', '', $rawPhoto);
                $sub = str_replace('https://178.16.138.159', '', $sub);
                $photoUrl = url($sub);
            } elseif (!str_starts_with($rawPhoto, 'http://') && !str_starts_with($rawPhoto, 'https://')) {
                $photoUrl = url('/' . ltrim($rawPhoto, '/'));
            }
        }

        $skills = [];
        if (is_array($user->skills)) {
            $skills = $user->skills;
        } elseif (is_string($user->skills) && !empty($user->skills)) {
            $skills = json_decode($user->skills, true) ?: array_values(array_filter(array_map('trim', explode(',', $user->skills))));
        }

        $userData = [
            'id'                  => $user->id,
            'full_name'           => $user->full_name ?: 'Not Provided',
            'mobile_number'       => $user->mobile_number ?: 'N/A',
            'email'               => $user->email ?: 'N/A',
            'gender'              => $user->gender ?: 'N/A',
            'country'             => $user->country ?: 'India',
            'city'                => $user->city ?: 'N/A',
            'location'            => implode(', ', array_filter([$user->city, $user->country])) ?: 'N/A',
            'experience_range'    => $user->experience_range ?: $user->experience_years ?: 'N/A',
            'preferred_role'      => $user->preferred_role ?: 'N/A',
            'current_employer'    => $user->current_employer ?: 'N/A',
            'selected_language'   => $user->selected_language ?: 'English',
            'availability_status' => $user->availability_status ?: ($user->is_available ? 'Available' : 'Unavailable'),
            'bio'                 => $user->bio ?: ($user->chefProfile ? $user->chefProfile->bio : null),
            'is_available'        => (bool) $user->is_available,
            'is_suspended'        => (bool) $user->is_suspended,
            'status'              => $user->is_suspended ? 'Suspended' : 'Active Account',
            'profile_photo_path'  => $photoUrl,
            'profile_photo'       => $photoUrl,
            'avatar'              => $photoUrl,
            'image'               => $photoUrl,
            'skills'              => $skills,
            'active_role'         => $user->active_role || $user->active_profile || 'job_seeker',
            'roles'               => $user->roles,
            'socials'             => $user->socials,
            'chef_profile'        => $user->chefProfile,
            'employer_profile'    => $user->employerProfile,
            'job_posts_count'     => $user->job_posts_count ?? 0,
            'applications_count'  => $user->applications_count ?? 0,
            'created_at'          => $user->created_at ? $user->created_at->toIso8601String() : null,
            'updated_at'          => $user->updated_at ? $user->updated_at->toIso8601String() : null,
        ];

        return response()->json([
            'success' => true,
            'user'    => $userData
        ]);
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
            $busName = optional($empProfile)->business_name ?: ($user->current_employer ?: ($user->full_name ?: 'Employer Company'));
            $contactName = optional($empProfile)->contact_person_name ?: ($user->full_name ?: 'N/A');
            $phoneNum = optional($empProfile)->business_mobile ?: ($user->mobile_number ?: 'N/A');
            $emailAddr = optional($empProfile)->business_email ?: ($user->email ?: '');
            $locationHq = optional($empProfile)->business_location ?: ($user->city ?: 'India');

            return [
                'id'                   => $user->id,
                'name'                 => $busName,
                'business_name'        => $busName,
                'contact'              => $contactName,
                'contact_person_name'  => $contactName,
                'phone'                => $phoneNum,
                'mobile_number'        => $phoneNum,
                'email'                => $emailAddr,
                'hq'                   => $locationHq,
                'business_location'    => $locationHq,
                'industry_segment'     => optional($empProfile)->industry_segment ?: 'Hospitality',
                'company_logo_path'    => optional($empProfile)->company_logo_path,
                'operational_locations'=> optional($empProfile)->operational_locations,
                'nominee_name'         => optional($empProfile)->nominee_name,
                'nominee_relationship' => optional($empProfile)->nominee_relationship,
                'nominee_mobile'       => optional($empProfile)->nominee_mobile,
                'is_completed'         => optional($empProfile)->is_completed ?? false,
                'posted_count'         => $user->job_posts_count ?? 0,
                'status'               => $user->is_suspended ? 'Suspended' : 'Active',
                'is_suspended'         => (bool) $user->is_suspended,
                'created_at'           => $user->created_at ? $user->created_at->toIso8601String() : null,
                'role_type'            => optional($user->roles->where('is_active', 1)->first())->role_type ?? 'employer',
                'employer_profile'     => $empProfile,
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
    public function showEmployer($user)
    {
        $userModel = $user instanceof User ? $user : User::find($user);

        if (!$userModel) {
            $empProfile = \App\Models\EmployerProfile::where('user_id', $user)->orWhere('id', $user)->first();
            if ($empProfile && $empProfile->user_id) {
                $userModel = User::find($empProfile->user_id);
            }
        }

        if (!$userModel) {
            return response()->json([
                'success' => false,
                'message' => "Employer profile ID #{$user} not found in database."
            ], 404);
        }

        $userModel->load(['employerProfile', 'roles']);

        $jobs = \App\Models\JobPost::where('created_by', $userModel->id)->latest()->get();

        $totalJobs = $jobs->count();
        $activeJobs = $jobs->where('status', 'approved')->count();
        $pendingJobs = $jobs->where('status', 'pending')->count();

        $empProfile = $userModel->employerProfile;

        $employerData = [
            'id'                  => $userModel->id,
            'name'                => optional($empProfile)->business_name ?: ($userModel->current_employer ?: ($userModel->full_name ?: 'Employer Company')),
            'business_name'       => optional($empProfile)->business_name ?: ($userModel->current_employer ?: ($userModel->full_name ?: 'Employer Company')),
            'contact'             => optional($empProfile)->contact_person_name ?: ($userModel->full_name ?: 'N/A'),
            'contact_person_name' => optional($empProfile)->contact_person_name ?: ($userModel->full_name ?: 'N/A'),
            'phone'               => optional($empProfile)->business_mobile ?: ($userModel->mobile_number ?: 'N/A'),
            'business_mobile'     => optional($empProfile)->business_mobile ?: ($userModel->mobile_number ?: 'N/A'),
            'email'               => optional($empProfile)->business_email ?: ($userModel->email ?: 'N/A'),
            'business_email'      => optional($empProfile)->business_email ?: ($userModel->email ?: 'N/A'),
            'hq'                  => optional($empProfile)->business_location ?: ($userModel->city ?: 'India'),
            'business_location'   => optional($empProfile)->business_location ?: ($userModel->city ?: 'India'),
            'industry_segment'    => optional($empProfile)->industry_segment ?: 'Hospitality',
            'preferred_language'  => optional($empProfile)->preferred_language ?: 'English',
            'company_logo_path'   => optional($empProfile)->company_logo_path,
            'operational_locations'=> optional($empProfile)->operational_locations,
            'nominee_name'        => optional($empProfile)->nominee_name,
            'nominee_relationship'=> optional($empProfile)->nominee_relationship,
            'nominee_mobile'      => optional($empProfile)->nominee_mobile,
            'is_completed'        => optional($empProfile)->is_completed ?? false,
            'status'              => $userModel->is_suspended ? 'Suspended' : 'Active',
            'is_suspended'        => (bool) $userModel->is_suspended,
            'created_at'          => $userModel->created_at ? $userModel->created_at->format('M Y') : 'Jan 2023',
            'total_jobs'          => $totalJobs,
            'active_jobs'         => $activeJobs,
            'pending_jobs'        => $pendingJobs,
            'employer_profile'    => $empProfile,
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
     * Store a new talent/jobseeker user in DB.
     */
    public function store(Request $request)
    {
        $mobile = $request->input('mobile_number') ?: $request->input('phone');
        $name = $request->input('full_name') ?: $request->input('name');

        if (!$mobile || !$name) {
            return response()->json([
                'success' => false,
                'message' => 'Mobile number and full name are required.'
            ], 422);
        }

        // Check duplicate
        $existing = User::where('mobile_number', $mobile)->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => "User with mobile number {$mobile} already exists."
            ], 400);
        }

        $user = User::create([
            'mobile_number'   => $mobile,
            'full_name'       => $name,
            'email'           => $request->input('email'),
            'city'            => $request->input('city') ?: 'India',
            'active_profile'  => 'job_seeker',
            'is_suspended'    => false,
        ]);

        \App\Models\UserRole::create([
            'user_id'   => $user->id,
            'role_type' => 'job_seeker',
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Talent user '{$user->full_name}' created successfully.",
            'user'    => $user
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
