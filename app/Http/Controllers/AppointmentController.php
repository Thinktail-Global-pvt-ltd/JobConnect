<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Book a new consultation appointment with a chef.
     */
    public function book(Request $request)
    {
        try {
            $validated = $request->validate([
                'chef_id' => 'required|exists:users,id',
                'meeting_date' => 'required|string',
                'meeting_time' => 'required|string',
                'purpose' => 'nullable|string|max:1000',
            ]);

            $employer = Auth::user();
            if (!$employer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            // Create the appointment
            $appointment = Appointment::create([
                'chef_id' => $validated['chef_id'],
                'employer_id' => $employer->id,
                'meeting_date' => $validated['meeting_date'],
                'meeting_time' => $validated['meeting_time'],
                'purpose' => $validated['purpose'] ?? '',
                'status' => 'confirmed',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully!',
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to book appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get JSON list of received appointments for the logged-in Chef.
     */
    public function chefAppointmentsList()
    {
        try {
            $chef = Auth::user();
            if (!$chef) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            // Load received appointments with employer profile info
            $appointments = Appointment::where('chef_id', $chef->id)
                ->with(['employer'])
                ->latest()
                ->get()
                ->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'employer_name' => $app->employer ? $app->employer->full_name : 'Anonymous Employer',
                        'employer_phone' => $app->employer ? $app->employer->mobile_number : 'N/A',
                        'employer_email' => $app->employer ? $app->employer->email : 'N/A',
                        'meeting_date' => $app->meeting_date,
                        'meeting_time' => $app->meeting_time,
                        'purpose' => $app->purpose ?: 'No agenda specified.',
                        'status' => $app->status,
                        'created_at' => $app->created_at ? $app->created_at->format('d M Y') : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load appointments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get JSON list of booked appointments for the logged-in Employer.
     */
    public function employerAppointmentsList()
    {
        try {
            $employer = Auth::user();
            if (!$employer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            // Load booked appointments with chef/user profile info
            $appointments = Appointment::where('employer_id', $employer->id)
                ->with(['chef.chefProfile'])
                ->latest()
                ->get()
                ->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'chef_name' => $app->chef ? $app->chef->full_name : 'Anonymous Chef',
                        'chef_phone' => $app->chef ? $app->chef->mobile_number : 'N/A',
                        'chef_email' => $app->chef ? $app->chef->email : 'N/A',
                        'chef_avatar' => $app->chef ? $app->chef->profile_photo_path : null,
                        'chef_specialty' => ($app->chef && $app->chef->chefProfile) ? $app->chef->chefProfile->cuisine_specialty : 'Culinary Consultant',
                        'meeting_date' => $app->meeting_date,
                        'meeting_time' => $app->meeting_time,
                        'purpose' => $app->purpose ?: 'No agenda specified.',
                        'status' => $app->status,
                        'created_at' => $app->created_at ? $app->created_at->format('d M Y') : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load appointments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get JSON list of all onboarded chefs for discovery.
     */
    public function registeredChefsList()
    {
        try {
            // Find all chef profiles and user records
            $chefProfiles = \App\Models\ChefProfile::with(['user', 'user.socials'])->get();
            
            // Also find users registered as chef who may not have a ChefProfile record yet
            $chefUsers = User::where(function($q) {
                $q->where('active_profile', 'chef')
                  ->orWhere('user_role', 'chef')
                  ->orWhereHas('roles', fn($r) => $r->where('role_type', 'chef'));
            })->with(['chefProfile', 'socials'])->get();

            $allChefsMap = collect();

            foreach ($chefProfiles as $prof) {
                $u = $prof->user;
                if ($u && $u->is_suspended) {
                    continue;
                }
                $status = strtolower(trim($prof->approval_status ?: ($u ? ($u->approval_status ?: ($u->status ?: 'approved')) : 'approved')));
                if (in_array($status, ['approved', 'active', 'published']) || empty($status) || $status === 'pending') {
                    $allChefsMap->put($prof->id, [
                        'profile' => $prof,
                        'user' => $u
                    ]);
                }
            }

            foreach ($chefUsers as $u) {
                if ($u->is_suspended) {
                    continue;
                }
                $prof = $u->chefProfile;
                $status = strtolower(trim($prof ? ($prof->approval_status ?: 'approved') : ($u->approval_status ?: ($u->status ?: 'approved'))));
                if (in_array($status, ['approved', 'active', 'published']) || empty($status) || $status === 'pending') {
                    $pId = $prof ? $prof->id : ('user_' . $u->id);
                    if (!$allChefsMap->has($pId)) {
                        $allChefsMap->put($pId, [
                            'profile' => $prof,
                            'user' => $u
                        ]);
                    }
                }
            }

            $mappedChefs = $allChefsMap->values()->map(function ($item) {
                $profile = $item['profile'];
                $chef = $item['user'];

                $availability = [];
                if ($profile && $profile->availability_info) {
                    if (is_array($profile->availability_info)) {
                        $availability = $profile->availability_info;
                    } else {
                        $availability = json_decode($profile->availability_info, true) ?: [];
                    }
                }

                $skills = [];
                if ($chef && is_array($chef->skills)) {
                    $skills = $chef->skills;
                } elseif ($chef && is_string($chef->skills)) {
                    $skills = json_decode($chef->skills, true) ?: [];
                }

                $socialsObj = $chef ? $chef->socials : null;
                $socialsData = $socialsObj ? [
                    'instagram' => $socialsObj->instagram ?: null,
                    'linkedin'  => $socialsObj->linkedin ?: null,
                    'facebook'  => $socialsObj->facebook ?: null,
                    'twitter'   => $socialsObj->twitter ?: null,
                    'youtube'   => $socialsObj->youtube ?: null,
                    'website'   => $socialsObj->website ?: null,
                ] : null;

                $photoPath = $chef ? $chef->profile_photo_path : null;
                $photoUrl = null;
                if (!empty($photoPath)) {
                    if (str_starts_with($photoPath, 'http://') || str_starts_with($photoPath, 'https://')) {
                        $photoUrl = $photoPath;
                    } else {
                        $photoUrl = url('/' . ltrim($photoPath, '/'));
                    }
                }

                $name = $chef ? ($chef->full_name ?: ($chef->name ?: 'Chef')) : 'Chef';
                $email = $chef ? ($chef->email ?: '') : '';
                $mobile = $chef ? ($chef->mobile_number ?: '') : '';
                $gender = $chef ? ($chef->gender ?: '') : '';
                $country = $chef ? ($chef->country ?: 'India') : 'India';
                $city = $chef ? ($chef->city ?: '') : '';
                $exp = $chef ? ($chef->experience_range ?: ($chef->experience_years ?: '1-3 Years')) : '1-3 Years';
                $role = $chef ? ($chef->preferred_role ?: 'Chef') : 'Chef';

                return [
                    'id'                     => $profile ? $profile->id : ($chef ? $chef->id : 0),
                    'user_id'                => $chef ? $chef->id : 0,
                    'full_name'              => $name,
                    'name'                   => $name,
                    'email'                  => $email,
                    'mobile_number'          => $mobile,
                    'phone'                  => $mobile,
                    'gender'                 => $gender,
                    'country'                => $country,
                    'city'                   => $city,
                    'job_location'           => $city ?: 'India',
                    'preference'             => $chef ? ($chef->location_preference ?: 'Both') : 'Both',
                    'experience_range'       => $exp,
                    'experience'             => $exp,
                    'experience_years'       => $exp,
                    'preferred_role'         => $role,
                    'current_employer'       => $chef ? ($chef->current_employer ?: 'Independent') : 'Independent',
                    'profile_photo_path'     => $photoUrl,
                    'profile_photo'          => $photoUrl,
                    'photo_url'              => $photoUrl,
                    'avatar'                 => $photoUrl,
                    'avatar_url'             => $photoUrl,
                    'cuisine_specialty'      => $profile ? ($profile->cuisine_specialty ?: 'Multi-Cuisine') : 'Multi-Cuisine',
                    'specialties'            => $profile ? ($profile->cuisine_specialty ?: 'Multi-Cuisine') : 'Multi-Cuisine',
                    'operational_expertise'  => $profile ? ($profile->operational_experties ?: ($profile->operational_expertise ?: 'Kitchen Operations')) : 'Kitchen Operations',
                    'operational_experties'  => $profile ? ($profile->operational_experties ?: ($profile->operational_expertise ?: 'Kitchen Operations')) : 'Kitchen Operations',
                    'regional_experience'    => $country,
                    'employment_preference'  => $role,
                    'bio'                    => $profile ? ($profile->bio ?: '') : '',
                    'calendly_link'          => $profile ? ($profile->calendly_link ?: '') : '',
                    'calendly'               => !empty($profile ? $profile->calendly_link : ''),
                    'approval_status'        => 'approved',
                    'status'                 => 'approved',
                    'is_approved'            => true,
                    'is_published'           => true,
                    'published'              => true,
                    'is_active'              => true,
                    'active'                 => true,
                    'availability_info'      => $availability,
                    'availability_status'    => $chef ? ($chef->availability_status ?: ($chef->is_available ? 'Available' : 'Unavailable')) : 'Available',
                    'is_available'           => $chef ? (bool)$chef->is_available : true,
                    'selected_language'      => $chef ? ($chef->selected_language ?: 'English') : 'English',
                    'skills'                 => $skills,
                    'socials'                => $socialsData,
                    'user' => [
                        'id'                 => $chef ? $chef->id : 0,
                        'full_name'          => $name,
                        'email'              => $email,
                        'mobile_number'      => $mobile,
                        'gender'             => $gender,
                        'country'            => $country,
                        'city'               => $city,
                        'job_location'       => $city ?: 'India',
                        'preference'         => $chef ? ($chef->location_preference ?: 'Both') : 'Both',
                        'experience_range'   => $exp,
                        'preferred_role'     => $role,
                        'current_employer'   => $chef ? ($chef->current_employer ?: 'Independent') : 'Independent',
                        'skills'             => $skills,
                        'profile_photo_path' => $photoUrl,
                        'socials'            => $socialsData,
                    ]
                ];
            });
            $chefList = $mappedChefs->values();
            $totalCount = $chefList->count();

            return response()->json([
                'success'                => true,
                'status'                 => 'success',
                'total'                  => $totalCount,
                'total_all'              => $totalCount,
                'total_chefs'            => $totalCount,
                'published_count'        => $totalCount,
                'published_chefs'        => $totalCount,
                'approved_count'         => $totalCount,
                'active_count'           => $totalCount,
                'active_published_chefs' => $totalCount,
                'stats' => [
                    'total'     => $totalCount,
                    'published' => $totalCount,
                    'approved'  => $totalCount,
                    'active'    => $totalCount,
                    'pending'   => 0,
                    'hidden'    => 0
                ],
                'chefs'    => $chefList,
                'profiles' => $chefList,
                'items'    => $chefList,
                'data'     => $chefList,
                'results'  => $chefList
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load chefs list: ' . $e->getMessage(),
                'total' => 0,
                'published_count' => 0,
                'chefs' => [],
                'data' => []
            ], 200);
        }
    }
}
