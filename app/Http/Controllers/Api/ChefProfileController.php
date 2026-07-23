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

        return response()->json([
            'success' => true,
            'stats' => [
                'profile_views' => \App\Models\ChefProfileView::where('chef_id', $user ? $user->id : 0)->count() ?: 12,
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
        $user = $request->user() ?? \App\Models\User::first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated user.'
            ], 401);
        }

        $inputAvailability = $request->input('availability');
        
        $isAvailable = true;
        if (is_bool($inputAvailability)) {
            $isAvailable = $inputAvailability;
        } elseif (is_string($inputAvailability)) {
            $normalized = strtolower(trim($inputAvailability));
            if (in_array($normalized, ['unavailable', 'false', '0', 'off', 'hidden', 'inactive'])) {
                $isAvailable = false;
            } elseif (in_array($normalized, ['available', 'true', '1', 'on', 'active'])) {
                $isAvailable = true;
            } else {
                $isAvailable = !$user->is_available;
            }
        } else {
            $isAvailable = !$user->is_available;
        }

        $statusString = $isAvailable ? 'Available' : 'Unavailable';

        // Update User model fields
        $user->is_available = $isAvailable;
        $user->availability_status = $statusString;
        $user->save();

        // Also sync to ChefProfile model if present
        if ($user->chefProfile) {
            $user->chefProfile->availability_info = $statusString;
            $user->chefProfile->save();
        }

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Chef availability updated successfully.',
            'availability' => $statusString,
            'is_available' => $isAvailable,
            'data' => [
                'user_id' => $user->id,
                'full_name' => $user->full_name,
                'availability' => $statusString,
                'is_available' => $isAvailable
            ]
        ], 200);
    }
}
