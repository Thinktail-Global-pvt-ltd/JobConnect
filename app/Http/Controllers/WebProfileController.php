<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WebProfileController extends Controller
{
    /**
     * Show profile page with progress percentage and active roles switcher.
     */
    public function index()
    {
        $user = Auth::user()->load(['roles', 'chefProfile', 'employerProfile', 'jobPosts.applications.applicant']);
        
        // Formulate activated and available roles lists
        $userRoles = $user->roles->pluck('role_type')->toArray();
        $activeRole = $user->currentRoleContext();

        // Load all registered chefs with profiles for discovery tab
        $registeredChefs = \App\Models\User::whereHas('roles', function($q) {
                $q->where('role_type', 'chef');
            })
            ->whereHas('chefProfile')
            ->with('chefProfile')
            ->latest()
            ->get()
            ->map(function ($chef) {
                // Decode availability info JSON
                $availability = null;
                if ($chef->chefProfile && $chef->chefProfile->availability_info) {
                    $availability = json_decode($chef->chefProfile->availability_info, true);
                }
                $chef->decoded_availability = $availability ?: [
                    'languages' => [],
                    'regional_experience' => [],
                    'location_preference' => 'Both',
                    'employment_preference' => [],
                    'availability_status' => 'Available Immediately'
                ];
                return $chef;
            });

        return view('profile', compact('user', 'userRoles', 'activeRole', 'registeredChefs'));
    }

    /**
     * Update user details to boost completeness score.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . ($user ? $user->id : 0),
            'profile_photo_path' => 'nullable',
            'city' => 'nullable|string|max:255',
            'experience_range' => 'nullable|string|max:255',
            'preferred_role' => 'nullable|string|max:255',
            'current_employer' => 'nullable|string|max:255',
            'skills' => 'nullable|string', // Comma separated, will convert to array
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $photoPath = $request->input('profile_photo_path');
        if ($request->hasFile('profile_photo_path')) {
            $file = $request->file('profile_photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $photoPath = url('uploads/' . $filename);
        }

        if ($photoPath) {
            \Illuminate\Support\Facades\Cache::put('latest_profile_photo', $photoPath, 86400);
        }

        // Process skills string to array
        $skillsArray = [];
        if ($request->filled('skills')) {
            $skillsArray = array_filter(array_map('trim', explode(',', $request->skills)));
        }

        if ($user) {
            $user->update([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'profile_photo_path' => $photoPath ?? $user->profile_photo_path,
                'city' => $request->city,
                'experience_range' => $request->experience_range,
                'preferred_role' => $request->preferred_role,
                'current_employer' => $request->current_employer,
                'skills' => $skillsArray,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile information updated! Your profile progress has been recalculated.',
            'profile_photo_path' => $photoPath ?? ($user ? $user->profile_photo_path : null),
        ]);
    }

    /**
     * Show personal information form on its own separate page.
     */
    public function editPersonal()
    {
        $user = Auth::user();
        return view('profile.personal', compact('user'));
    }

    /**
     * Update personal and professional details.
     */
    public function updatePersonal(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . ($user ? $user->id : 0),
            'profile_photo_path' => 'nullable',
            'city' => 'nullable|string|max:255',
            'experience_range' => 'nullable|string|max:255',
            'preferred_role' => 'nullable|string|max:255',
            'current_employer' => 'nullable|string|max:255',
            'skills' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $photoPath = $request->input('profile_photo_path');
        if ($request->hasFile('profile_photo_path')) {
            $file = $request->file('profile_photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $photoPath = url('uploads/' . $filename);
        }

        // Process skills string to array
        $skillsArray = [];
        if ($request->filled('skills')) {
            $skillsArray = array_filter(array_map('trim', explode(',', $request->skills)));
        }

        if ($user) {
            $user->update([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'profile_photo_path' => $photoPath ?? $user->profile_photo_path,
                'city' => $request->city,
                'experience_range' => $request->experience_range,
                'preferred_role' => $request->preferred_role,
                'current_employer' => $request->current_employer,
                'skills' => $skillsArray,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile information updated successfully!',
            'profile_photo_path' => $photoPath ?? ($user ? $user->profile_photo_path : null),
        ]);
    }

    /**
     * Show the user's job applications on a separate page.
     */
    public function applications()
    {
        $user = Auth::user();
        $applications = $user->applications()->with('jobPost')->orderBy('created_at', 'desc')->get();
        return view('profile.applications', compact('user', 'applications'));
    }

    public function getApplications(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $applications = $user->applications()
            ->with('jobPost')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'user_id' => $user->id,
            'mobile_number' => $user->mobile_number,
            'applications' => $applications,
        ]);
    }

    /**
     * Show the user's saved/favorite jobs on a separate page.
     */
    public function savedJobs()
    {
        $user = Auth::user();
        $savedJobs = $user->savedJobPosts()
            ->with('creator')
            ->orderBy('saved_jobs.created_at', 'desc')
            ->get();
            
        // We also want to pass appliedJobIds to easily show "Applied" status
        $appliedJobIds = \App\Models\JobApplication::where('applicant_id', $user->id)
            ->pluck('job_post_id');

        return view('profile.saved', compact('user', 'savedJobs', 'appliedJobIds'));
    }

    /**
     * Get user's saved/favorite jobs as JSON.
     */
    public function getSavedJobsJson(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $savedJobs = $user->savedJobPosts()
            ->with('creator')
            ->orderBy('saved_jobs.created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'user_id' => $user->id,
            'mobile_number' => $user->mobile_number,
            'saved_jobs' => $savedJobs,
        ]);
    }

    /**
     * Show the Employer Onboarding Wizard view.
     */
    public function onboarding()
    {
        $user = Auth::user();
        
        // Ensure user has Employer or Agency context active
        $activeRole = $user->currentRoleContext();
        if (!$activeRole || ($activeRole->role_type !== 'employer' && $activeRole->role_type !== 'agency')) {
            return redirect()->route('profile')->with('error', 'Please switch your role to Employer first.');
        }

        // Get existing onboarding profile details if any
        $profile = $user->employerProfile;

        return view('auth.employer-onboarding', compact('user', 'profile'));
    }

    /**
     * Save the final Employer Onboarding profile data.
     */
    public function saveOnboarding(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'business_name' => 'required|string|max:255',
            'industry_segment' => 'required|string|max:255',
            'business_location' => 'required|string|max:255',
            'contact_person_name' => 'required|string|max:255',
            'business_mobile' => 'required|string|max:20',
            'business_email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'preferred_language' => 'required|string|max:50',
            'company_logo' => 'nullable|image|max:5120', // PNG, JPG up to 5MB
            'operational_locations' => 'required|array',
            'operational_locations.*' => 'required|string|max:500',
            'nominee_name' => 'required|string|max:255',
            'nominee_relationship' => 'required|string|max:255',
            'nominee_mobile' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Employer Onboarding Validation Failed: ' . json_encode($validator->errors()->toArray()));
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Process Company Logo upload
            $logoPath = null;
            if ($request->hasFile('company_logo')) {
                $path = $request->file('company_logo')->store('logos', 'public');
                $logoPath = \Illuminate\Support\Facades\Storage::url($path);
            } else {
                // Keep existing logo path if any
                $logoPath = $user->employerProfile ? $user->employerProfile->company_logo_path : null;
            }

            // Update or create the profile
            $user->employerProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'business_name' => $request->business_name,
                    'industry_segment' => $request->industry_segment,
                    'business_location' => $request->business_location,
                    'contact_person_name' => $request->contact_person_name,
                    'business_mobile' => $request->business_mobile,
                    'business_email' => $request->business_email,
                    'preferred_language' => $request->preferred_language,
                    'company_logo_path' => $logoPath,
                    'operational_locations' => $request->operational_locations,
                    'nominee_name' => $request->nominee_name,
                    'nominee_relationship' => $request->nominee_relationship,
                    'nominee_mobile' => $request->nominee_mobile,
                    'is_completed' => true,
                ]
            );

            // Also update user's profile completeness/details to link them up
            $user->update([
                'full_name' => $request->contact_person_name,
                'email' => $request->business_email,
                'city' => $request->business_location,
                'profile_photo_path' => $logoPath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Onboarding completed successfully!',
                'redirect_url' => route('profile', ['section' => 'my_posted_jobs']),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Employer Onboarding Exception: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save/update Chef's Calendly Link.
     */
    public function saveCalendlyLink(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'calendly_link' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $chefProfile = $user->chefProfile;
        if (!$chefProfile) {
            $chefProfile = \App\Models\ChefProfile::create([
                'user_id' => $user->id,
                'cuisine_specialty' => 'Multi-Cuisine',
                'approval_status' => 'pending',
            ]);
        }

        $chefProfile->update([
            'calendly_link' => $request->calendly_link,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Calendly link updated successfully!',
            'calendly_link' => $request->calendly_link,
        ]);
    }
}
