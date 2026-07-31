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
            // Find all users with role_type = 'chef' or having chefProfile
            $chefUsers = User::whereHas('roles', function ($q) {
                $q->where('role_type', 'chef');
            })->orWhereHas('chefProfile')
            ->with(['chefProfile'])
            ->get();

            // Auto-create missing chef profiles
            foreach ($chefUsers as $user) {
                if (!$user->chefProfile) {
                    \App\Models\ChefProfile::create([
                        'user_id' => $user->id,
                        'cuisine_specialty' => 'Multi-Cuisine',
                        'bio' => 'Professional Chef',
                        'approval_status' => 'approved',
                    ]);
                }
            }

            // Reload all chefs with chefProfile — only return APPROVED/PUBLISHED chefs for employer discovery
            $chefs = User::whereHas('roles', function ($q) {
                $q->where('role_type', 'chef');
            })->orWhereHas('chefProfile')
            ->with(['chefProfile'])
            ->get()
            ->filter(function ($chef) {
                // Only include chefs whose profile is approved
                $profile = $chef->chefProfile;
                if (!$profile) return false;
                return $profile->approval_status === 'approved';
            })
            ->map(function ($chef) {
                $profile = $chef->chefProfile;
                $availability = [];
                if ($profile && $profile->availability_info) {
                    if (is_array($profile->availability_info)) {
                        $availability = $profile->availability_info;
                    } else {
                        $availability = json_decode($profile->availability_info, true) ?: [];
                    }
                }

                $status = $profile ? ($profile->approval_status ?: 'approved') : 'approved';

                $skills = [];
                if (is_array($chef->skills)) {
                    $skills = $chef->skills;
                } elseif (is_string($chef->skills)) {
                    $skills = json_decode($chef->skills, true) ?: [];
                }

                return [
                    'id' => $profile ? $profile->id : $chef->id,
                    'user_id' => $chef->id,
                    'full_name' => $chef->full_name ?: ('Chef #' . $chef->id),
                    'name' => $chef->full_name ?: ('Chef #' . $chef->id),
                    'email' => $chef->email ?: '',
                    'mobile_number' => $chef->mobile_number ?: '',
                    'gender' => $chef->gender ?: '',
                    'country' => $chef->country ?? 'India',
                    'city' => $chef->city ?: '',
                    'job_location' => $chef->job_location ?? ($chef->city ?: 'N/A'),
                    'preference' => $chef->preference ?? 'Both',
                    'experience_range' => $chef->experience_range ?: '0',
                    'experience' => $chef->experience_range ?: '0',
                    'experience_years' => $chef->experience_years ?: $chef->experience_range ?: '0',
                    'preferred_role' => $chef->preferred_role ?: 'Chef',
                    'current_employer' => $chef->current_employer ?: 'N/A',
                    'profile_photo_path' => $chef->profile_photo_path,
                    'cuisine_specialty' => $profile ? ($profile->cuisine_specialty ?: 'Multi-Cuisine') : 'Multi-Cuisine',
                    'specialties' => $profile ? ($profile->cuisine_specialty ?: 'Multi-Cuisine') : 'Multi-Cuisine',
                    'bio' => $profile ? ($profile->bio ?: '') : '',
                    'calendly_link' => $profile ? ($profile->calendly_link ?: '') : '',
                    'calendly' => !empty($profile ? $profile->calendly_link : ''),
                    'approval_status' => $profile->approval_status ?: 'pending',
                    'status' => $profile->approval_status ?: 'pending',
                    'is_approved' => $profile->approval_status === 'approved',
                    'is_published' => $profile->approval_status === 'approved',
                    'published' => $profile->approval_status === 'approved',
                    'is_active' => $profile->approval_status === 'approved',
                    'active' => $profile->approval_status === 'approved',
                    'availability_info' => $availability,
                    'skills' => $skills,
                    'user' => [
                        'id' => $chef->id,
                        'full_name' => $chef->full_name,
                        'email' => $chef->email,
                        'mobile_number' => $chef->mobile_number,
                        'gender' => $chef->gender,
                        'country' => $chef->country ?? 'India',
                        'city' => $chef->city,
                        'job_location' => $chef->job_location ?? ($chef->city ?: 'N/A'),
                        'preference' => $chef->preference ?? 'Both',
                        'experience_range' => $chef->experience_range,
                        'preferred_role' => $chef->preferred_role,
                        'current_employer' => $chef->current_employer,
                        'skills' => $skills,
                        'profile_photo_path' => $chef->profile_photo_path,
                    ]
                ];
            });

            $chefList = $chefs->values();
            $totalCount = $chefList->count(); // Already filtered to approved only

            return response()->json([
                'success' => true,
                'status' => 'success',
                'total' => $totalCount,
                'total_all' => $totalCount,
                'total_chefs' => $totalCount,
                'published_count' => $totalCount,
                'published_chefs' => $totalCount,
                'approved_count' => $totalCount,
                'active_count' => $totalCount,
                'active_published_chefs' => $totalCount,
                'stats' => [
                    'total' => $totalCount,
                    'published' => $totalCount,
                    'approved' => $totalCount,
                    'active' => $totalCount,
                    'pending' => 0,
                    'hidden' => 0
                ],
                'chefs' => $chefList,
                'profiles' => $chefList,
                'items' => $chefList,
                'data' => $chefList,
                'results' => $chefList
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
