<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use Illuminate\Http\Request;

class ChefModeratorController extends Controller
{
    /**
     * List all chef profiles.
     */
    public function index(Request $request)
    {
        $query = ChefProfile::with('user');

        // Optional filter by status
        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('approval_status', $request->status);
        }

        $chefs = $query->latest()->get();

        // Fetch dynamic stats for dashboard cards
        $pendingCount = ChefProfile::where('approval_status', 'pending')->count();
        $approvedCount = ChefProfile::where('approval_status', 'approved')->count();
        $totalChefs = ChefProfile::count();
        $calendlyLinkedCount = ChefProfile::whereNotNull('calendly_link')->where('calendly_link', '!=', '')->count();
        $calendlySyncPercentage = $totalChefs > 0 ? round(($calendlyLinkedCount / $totalChefs) * 100) : 0;

        // Fetch all employers for coordination appointments
        $employers = \App\Models\User::whereHas('roles', function($q) {
            $q->where('role_type', 'employer');
        })->orderBy('full_name', 'asc')->get();

        return view('admin.chefs', compact('chefs', 'employers', 'pendingCount', 'approvedCount', 'totalChefs', 'calendlySyncPercentage'));
    }

    /**
     * Get JSON list of all onboarded chefs for API / React admin.
     */
    public function apiIndex(Request $request)
    {
        try {
            $query = ChefProfile::with('user');

            if ($request->has('status') && !empty($request->status) && in_array($request->status, ['pending', 'approved', 'rejected'])) {
                $query->where('approval_status', $request->status);
            }

            $chefProfiles = $query->latest()->get();

            $chefs = $chefProfiles->map(function ($chef) {
                $availability = [];
                if ($chef->availability_info) {
                    $availability = json_decode($chef->availability_info, true) ?: [];
                }

                $user = $chef->user;
                $fullName = $user ? $user->full_name : 'Unnamed Chef';

                return [
                    'id' => $chef->id,
                    'user_id' => $chef->user_id,
                    'full_name' => $fullName,
                    'name' => $fullName,
                    'email' => $user ? $user->email : '',
                    'mobile_number' => $user ? $user->mobile_number : '',
                    'city' => $user ? $user->city : '',
                    'profile_photo_path' => $user ? $user->profile_photo_path : null,
                    'experience_range' => $user ? ($user->experience_range ?: '0') : '0',
                    'experience' => $user ? ($user->experience_range ?: '0') : '0',
                    'cuisine_specialty' => $chef->cuisine_specialty ?: 'Multi-Cuisine',
                    'specialties' => $chef->cuisine_specialty ?: 'Multi-Cuisine',
                    'bio' => $chef->bio ?: '',
                    'calendly_link' => $chef->calendly_link ?: '',
                    'calendly' => !empty($chef->calendly_link),
                    'approval_status' => $chef->approval_status ?: 'pending',
                    'status' => $chef->approval_status ?: 'pending',
                    'availability_info' => $availability,
                    'skills' => ($user && is_array($user->skills)) ? $user->skills : [],
                ];
            });

            return response()->json([
                'success' => true,
                'chefs' => $chefs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load chefs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve a chef profile.
     */
    public function approve(ChefProfile $chef, Request $request)
    {
        $chef->update(['approval_status' => 'approved']);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['success' => true, 'message' => 'Chef approved successfully.']);
        }

        return redirect()->back()->with('success', "Chef profile for {$chef->user->full_name} has been approved successfully.");
    }

    /**
     * Reject a chef profile.
     */
    public function reject(ChefProfile $chef, Request $request)
    {
        $chef->update(['approval_status' => 'rejected']);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['success' => true, 'message' => 'Chef rejected successfully.']);
        }

        return redirect()->back()->with('success', "Chef profile for {$chef->user->full_name} has been rejected.");
    }

    /**
     * Schedule an appointment between a chef and an employer.
     */
    public function scheduleAppointment(Request $request)
    {
        $validated = $request->validate([
            'chef_id' => 'required|exists:users,id',
            'employer_id' => 'required|exists:users,id',
            'meeting_date' => 'required|string',
            'meeting_time' => 'required|string',
            'purpose' => 'nullable|string|max:1000',
        ]);

        \App\Models\Appointment::create([
            'chef_id' => $validated['chef_id'],
            'employer_id' => $validated['employer_id'],
            'meeting_date' => $validated['meeting_date'],
            'meeting_time' => $validated['meeting_time'],
            'purpose' => $validated['purpose'] ?? 'Coordinated by Administrator',
            'status' => 'confirmed',
        ]);

        return redirect()->back()->with('success', "Appointment scheduled successfully.");
    }
}
