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
        $rawEmployers = $query->latest()->get();

        $employers = $rawEmployers->map(function ($user) {
            $empProfile = $user->employerProfile;
            $busName = optional($empProfile)->business_name ?: ($user->current_employer ?: ($user->full_name ?: 'Employer Company'));
            $contactName = optional($empProfile)->contact_person_name ?: ($user->full_name ?: 'N/A');
            $phoneNum = optional($empProfile)->business_mobile ?: ($user->mobile_number ?: 'N/A');
            $emailAddr = optional($empProfile)->business_email ?: ($user->email ?: '');
            $locationHq = optional($empProfile)->business_location ?: ($user->city ?: 'India');

            $rawPhoto = $user->profile_photo_path ?: optional($empProfile)->company_logo_url;
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
                'posted_count'         => $user->job_posts_count ?? 0,
                'status'               => $user->is_suspended ? 'Suspended' : 'Active',
                'is_suspended'         => (bool) $user->is_suspended,
                'created_at'           => $user->created_at ? $user->created_at->toIso8601String() : null,
                'profile_photo_path'   => $photoUrl,
                'profile_photo'        => $photoUrl,
                'company_logo_url'     => $photoUrl,
                'role_type'            => optional($user->roles->where('is_active', 1)->first())->role_type ?? 'employer',
                'employer_profile'     => $empProfile,
            ];
        });

        return response()->json([
            'success' => true,
            'total' => $employers->count(),
            'employers' => $employers
        ]);
    }

    /**
     * Show single employer detail by ID.
     */
    public function show($id)
    {
        $user = User::with(['employerProfile', 'jobPosts'])->find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Employer user not found'], 404);
        }

        $empProfile = $user->employerProfile;
        $busName = optional($empProfile)->business_name ?: ($user->current_employer ?: ($user->full_name ?: 'Employer Company'));
        $contactName = optional($empProfile)->contact_person_name ?: ($user->full_name ?: 'N/A');
        $phoneNum = optional($empProfile)->business_mobile ?: ($user->mobile_number ?: 'N/A');
        $emailAddr = optional($empProfile)->business_email ?: ($user->email ?: '');
        $locationHq = optional($empProfile)->business_location ?: ($user->city ?: 'India');

        $rawPhoto = $user->profile_photo_path ?: optional($empProfile)->company_logo_url;
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

        // Fetch employer job posts using explicit DB query matching user_id, created_by, employer_id, company, and contact_person
        $busNameClean = trim($busName);
        $contactClean = trim($contactName);
        $fullNameClean = trim($user->full_name ?? '');

        $hasUserIdCol = \Illuminate\Support\Facades\Schema::hasColumn('job_posts', 'user_id');
        $hasEmployerIdCol = \Illuminate\Support\Facades\Schema::hasColumn('job_posts', 'employer_id');
        $hasCreatedByCol = \Illuminate\Support\Facades\Schema::hasColumn('job_posts', 'created_by');

        $jobsQuery = \Illuminate\Support\Facades\DB::table('job_posts')
            ->select('job_posts.*')
            ->where(function($q) use ($user, $hasUserIdCol, $hasEmployerIdCol, $hasCreatedByCol) {
                if ($hasCreatedByCol) {
                    $q->orWhere('job_posts.created_by', $user->id);
                }
                if ($hasUserIdCol) {
                    $q->orWhere('job_posts.user_id', $user->id);
                }
                if ($hasEmployerIdCol) {
                    $q->orWhere('job_posts.employer_id', $user->id);
                }
            })
            ->where(function($q) {
                $q->whereNull('job_posts.submitted_by_role')
                  ->orWhere('job_posts.submitted_by_role', '!=', 'admin');
            })
            ->where(function($q) {
                $q->whereNull('job_posts.is_admin_created')
                  ->orWhere('job_posts.is_admin_created', 0)
                  ->orWhere('job_posts.is_admin_created', false);
            });

        $allEmployerJobs = $jobsQuery->orderBy('job_posts.id', 'desc')->get();

        $mappedJobs = $allEmployerJobs->map(function ($j) {
            $statusVal = strtolower($j->status ?: 'pending');
            $cDate = $j->created_at ? \Carbon\Carbon::parse($j->created_at) : null;
            return [
                'id'                   => $j->id,
                'title'                => $j->title ?: 'Job Listing #' . $j->id,
                'job_title'            => $j->title ?: 'Job Listing #' . $j->id,
                'company'              => $j->company ?: 'Employer',
                'location'             => $j->location ?: 'India',
                'category'             => $j->category ?: 'india',
                'salary'               => $j->salary ?: (isset($j->salary_min) ? ($j->salary_min . ' - ' . $j->salary_max) : 'Competitive'),
                'status'               => $statusVal,
                'is_approved'          => in_array($statusVal, ['approved', 'published', 'active']),
                'created_at'           => $cDate ? $cDate->toIso8601String() : null,
                'posted_date'          => $cDate ? $cDate->format('M d, Y') : 'Recently',
                'created_at_formatted' => $cDate ? $cDate->format('M d, Y') : 'Recently',
            ];
        });

        $totalJobsCount = $mappedJobs->count();
        $activeJobsCount = $mappedJobs->filter(fn($j) => in_array($j['status'], ['approved', 'published', 'active']))->count();
        $pendingJobsCount = $mappedJobs->filter(fn($j) => !in_array($j['status'], ['approved', 'published', 'active']))->count();

        return response()->json([
            'success' => true,
            'employer' => [
                'id'                  => $user->id,
                'user_id'             => $user->id,
                'name'                => $busName,
                'business_name'       => $busName,
                'contact'             => $contactName,
                'contact_person_name' => $contactName,
                'phone'               => $phoneNum,
                'mobile_number'       => $phoneNum,
                'email'               => $emailAddr,
                'hq'                  => $locationHq,
                'business_location'   => $locationHq,
                'city'                => $user->city ?: optional($empProfile)->business_location,
                'country'             => $user->country ?: 'India',
                'industry_segment'    => optional($empProfile)->industry_segment ?: 'Hospitality / F&B',
                'preferred_language'  => optional($empProfile)->preferred_language ?: ($user->selected_language ?: 'English'),
                'operational_locations' => optional($empProfile)->operational_locations ?: [],
                'nominee_name'        => optional($empProfile)->nominee_name ?: null,
                'nominee_relationship'=> optional($empProfile)->nominee_relationship ?: null,
                'nominee_mobile'      => optional($empProfile)->nominee_mobile ?: null,
                'is_completed'        => optional($empProfile)->is_completed ?? true,
                'active_profile'      => $user->active_profile ?: ($user->active_role ?: 'employer'),
                'total_jobs'          => $totalJobsCount,
                'active_jobs'         => $activeJobsCount,
                'pending_jobs'        => $pendingJobsCount,
                'status'              => $user->is_suspended ? 'Suspended' : 'Active',
                'is_suspended'        => (bool) $user->is_suspended,
                'created_at'          => $user->created_at ? $user->created_at->toIso8601String() : null,
                'profile_photo_path'  => $photoUrl,
                'profile_photo'       => $photoUrl,
                'company_logo_url'    => $photoUrl,
                'jobs'                => $mappedJobs->values(),
                'user_data'           => [
                    'id'                => $user->id,
                    'full_name'         => $user->full_name ?: $user->name,
                    'email'             => $user->email,
                    'mobile_number'     => $user->mobile_number,
                    'city'              => $user->city,
                    'country'           => $user->country,
                    'selected_language' => $user->selected_language,
                    'active_profile'    => $user->active_profile,
                    'created_at'        => $user->created_at ? $user->created_at->toIso8601String() : null,
                ],
                'employer_profile'    => $empProfile,
            ]
        ]);
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
            // Find existing user by email or mobile_number to avoid unique key errors
            $userObj = null;
            if (!empty($email)) {
                $userObj = User::where('email', $email)->first();
            }
            if (!$userObj && !empty($mobileNumber)) {
                $userObj = User::where('mobile_number', $mobileNumber)->first();
            }

            if ($userObj) {
                $userObj->update([
                    'full_name' => $fullName ?: $userObj->full_name,
                    'email' => $email ?: $userObj->email,
                    'city' => $location ?: $userObj->city,
                    'current_employer' => $businessName ?: $userObj->current_employer,
                ]);
            } else {
                $userObj = User::create([
                    'mobile_number' => $mobileNumber,
                    'full_name' => $fullName,
                    'email' => $email,
                    'city' => $location,
                    'current_employer' => $businessName,
                ]);
            }

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
