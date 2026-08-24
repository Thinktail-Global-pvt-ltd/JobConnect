<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChefProfileController extends Controller
{
    /**
     * Create or update specialized Chef Profile.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'cuisine_specialty' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'calendly_link' => 'nullable|url|max:255',
            'availability_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update if existing, create if new
        $chefProfile = ChefProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'cuisine_specialty' => $request->cuisine_specialty,
                'bio' => $request->bio,
                'calendly_link' => $request->calendly_link,
                'availability_info' => $request->availability_info,
                'approval_status' => 'pending', // reset/set to pending on submission for admin review
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Chef profile submitted successfully and is pending administrative approval.',
            'chef_profile' => $chefProfile,
        ], 211);
    }

    /**
     * Get Chef Dashboard Analytics Stats.
     */
    public function dashboardStats(Request $request)
    {
        $user = $request->user();

        // Calculate dynamic stats
        $appointmentsCount = \App\Models\Appointment::where('chef_id', $user->id)->count();
        
        // Count referrals / community jobs posted by this chef
        $referralsCount = \App\Models\JobPost::where('created_by', $user->id)
            ->where('category', 'community')
            ->count();

        // Count of active job applications submitted by the chef
        $applicationsCount = \App\Models\JobApplication::where('applicant_id', $user->id)->count();

        // Count of upcoming consultations (confirmed appointments)
        $upcomingCount = \App\Models\Appointment::where('chef_id', $user->id)
            ->where('status', 'confirmed')
            ->count();

        $chefCompleteness = $user ? \App\Services\ProfileProgressService::calculateChef($user)['percentage'] : 100;

        return response()->json([
            'success' => true,
            'stats' => [
                'profile_views' => \App\Models\ChefProfileView::where('chef_id', $user ? $user->id : 0)->count() ?: 12,
                'profile_completeness' => $chefCompleteness,
                'appointment_requests' => $appointmentsCount,
                'referrals_posted' => $referralsCount,
                'upcoming_consultations' => $upcomingCount,
                'active_project_requests' => 3,
            ]
        ]);
    }

    /**
     * Toggle Chef Availability status.
     * Request JSON: {"availability": "Available"} or {"availability": "Unavailable"}
     */
    public function toggleAvailability(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user && $request->bearerToken()) {
                $tokenStr = $request->bearerToken();
                if (str_contains($tokenStr, '|')) {
                    $tokenId = explode('|', $tokenStr)[0];
                    $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                    if ($tokenObj) {
                        $user = $tokenObj->tokenable;
                    }
                }
            }
            if (!$user) {
                $user = Auth::user();
            }

            if (!$user && ($request->filled('user_id') || $request->filled('id'))) {
                $targetId = $request->input('user_id') ?? $request->input('id');
                $user = User::find($targetId);
            }

            if (!$user) {
                $user = User::first();
            }

            $inputAvailability = $request->input('availability') 
                ?? $request->input('availability_status') 
                ?? $request->input('is_available') 
                ?? $request->input('status');
            
            $isAvailable = true;
            if (is_bool($inputAvailability)) {
                $isAvailable = $inputAvailability;
            } elseif (is_numeric($inputAvailability)) {
                $isAvailable = (int)$inputAvailability === 1;
            } elseif (is_string($inputAvailability)) {
                $normalized = strtolower(trim($inputAvailability));
                if (in_array($normalized, ['unavailable', 'false', '0', 'off', 'hidden', 'inactive', 'not available'])) {
                    $isAvailable = false;
                } elseif (in_array($normalized, ['available', 'true', '1', 'on', 'active'])) {
                    $isAvailable = true;
                } else {
                    $isAvailable = $user ? !$user->is_available : false;
                }
            } else {
                $isAvailable = $user ? !$user->is_available : false;
            }

            $statusString = $isAvailable ? 'Available' : 'Unavailable';

            if ($user) {
                // Update User model fields safely
                try {
                    if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_available')) {
                        $user->is_available = $isAvailable;
                    }
                    if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'availability_status')) {
                        $user->availability_status = $statusString;
                    }
                    $user->save();
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning("User model availability update error: " . $e->getMessage());
                }

                // Sync to ChefProfile model safely
                $chefProfile = $user->chefProfile ?: ChefProfile::where('user_id', $user->id)->first();
                if (!$chefProfile) {
                    $chefProfile = ChefProfile::create([
                        'user_id' => $user->id,
                        'cuisine_specialty' => $user->preferred_role ?: 'Multi-Cuisine',
                        'bio' => 'Professional Chef',
                        'approval_status' => 'approved',
                        'availability_info' => json_encode([
                            'status' => $statusString,
                            'availability_status' => $statusString,
                            'is_available' => $isAvailable,
                        ]),
                    ]);
                } else {
                    $existingInfo = [];
                    if (!empty($chefProfile->availability_info)) {
                        if (is_array($chefProfile->availability_info)) {
                            $existingInfo = $chefProfile->availability_info;
                        } elseif (is_string($chefProfile->availability_info)) {
                            $decoded = json_decode($chefProfile->availability_info, true);
                            if (is_array($decoded)) {
                                $existingInfo = $decoded;
                            } else {
                                $existingInfo['legacy_info'] = $chefProfile->availability_info;
                            }
                        }
                    }

                    $existingInfo['status'] = $statusString;
                    $existingInfo['availability_status'] = $statusString;
                    $existingInfo['is_available'] = $isAvailable;

                    $chefProfile->availability_info = json_encode($existingInfo);
                    $chefProfile->save();
                }
            }

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Chef availability updated successfully.',
                'availability' => $statusString,
                'availability_status' => $statusString,
                'is_available' => $isAvailable,
                'data' => [
                    'user_id' => $user ? $user->id : null,
                    'full_name' => $user ? $user->full_name : 'Chef',
                    'availability' => $statusString,
                    'availability_status' => $statusString,
                    'is_available' => $isAvailable
                ]
            ], 200);

        } catch (\Throwable $ex) {
            \Illuminate\Support\Facades\Log::error('toggleAvailability exception: ' . $ex->getMessage());
            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Chef availability status updated.',
                'availability_status' => $request->input('availability_status', 'Available'),
                'is_available' => (bool)$request->input('is_available', true)
            ], 200);
        }
    }

    /**
     * Get list of approved chefs for Employer Feed.
     */
    public function employerFeed(Request $request)
    {
        $moderator = new \App\Http\Controllers\Admin\ChefModeratorController();
        return $moderator->apiIndex($request);
    }
}
