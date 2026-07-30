<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;

class ChefModeratorController extends Controller
{
    /**
     * Helper to auto-sync and fetch all chef records (combining user_roles & chef_profiles).
     */
    private function syncAndGetChefProfiles()
    {
        // 1. Find all user IDs who have role_type = 'chef' in user_roles
        $chefRoleUserIds = UserRole::where('role_type', 'chef')->pluck('user_id')->toArray();

        // 2. Find all user IDs who have active_profile = 'chef' or preferred_role containing chef/cook in users table
        $userModelChefIds = User::where('active_profile', 'chef')
            ->orWhere('preferred_role', 'like', '%chef%')
            ->orWhere('preferred_role', 'like', '%cook%')
            ->pluck('id')
            ->toArray();

        $allChefUserIds = array_unique(array_merge($chefRoleUserIds, $userModelChefIds));

        // 3. Ensure every such user has a ChefProfile record
        if (!empty($allChefUserIds)) {
            $existingProfileUserIds = ChefProfile::whereIn('user_id', $allChefUserIds)->pluck('user_id')->toArray();
            $missingUserIds = array_diff($allChefUserIds, $existingProfileUserIds);

            foreach ($missingUserIds as $userId) {
                ChefProfile::create([
                    'user_id' => $userId,
                    'cuisine_specialty' => 'Multi-Cuisine',
                    'bio' => 'Professional Chef',
                    'approval_status' => 'pending',
                ]);
            }
        }

        // 4. Fetch all ChefProfile records with user relation
        return ChefProfile::with('user')->latest()->get();
    }

    /**
     * List all chef profiles for Blade view.
     */
    public function index(Request $request)
    {
        $profiles = $this->syncAndGetChefProfiles();

        if ($request->filled('status') && $request->status !== 'all' && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $profiles = $profiles->filter(fn($p) => $p->approval_status === $request->status)->values();
        }

        $chefs = $profiles;

        // Fetch dynamic stats for dashboard cards
        $allProfiles = ChefProfile::all();
        $pendingCount = $allProfiles->where('approval_status', 'pending')->count();
        $approvedCount = $allProfiles->where('approval_status', 'approved')->count();
        $totalChefs = $allProfiles->count();
        $calendlyLinkedCount = $allProfiles->filter(fn($p) => !empty($p->calendly_link))->count();
        $calendlySyncPercentage = $totalChefs > 0 ? round(($calendlyLinkedCount / $totalChefs) * 100) : 0;

        // Fetch all employers for coordination appointments
        $employers = User::whereHas('roles', function($q) {
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
            $profiles = $this->syncAndGetChefProfiles();

            $allChefs = $profiles->map(function ($chef) {
                $user = $chef->user ?: User::find($chef->user_id);

                $availability = [];
                if ($chef->availability_info) {
                    $availability = is_array($chef->availability_info)
                        ? $chef->availability_info
                        : (json_decode($chef->availability_info, true) ?: []);
                }

                $fullName = ($user && $user->full_name) ? $user->full_name : ('Chef #' . $chef->user_id);
                $email = $user ? ($user->email ?: '') : '';
                $mobile = $user ? ($user->mobile_number ?: '') : ($user ? $user->mobile : '');
                $city = $user ? ($user->city ?: '') : '';
                $exp = $user ? ($user->experience_range ?: '0') : '0';
                $photo = $user ? $user->profile_photo_path : null;
                $skills = ($user && is_array($user->skills)) ? $user->skills : [];

                return [
                    'id' => $chef->id,
                    'user_id' => $chef->user_id,
                    'full_name' => $fullName,
                    'name' => $fullName,
                    'email' => $email,
                    'mobile_number' => $mobile,
                    'city' => $city,
                    'profile_photo_path' => $photo,
                    'experience_range' => $exp,
                    'experience' => $exp,
                    'cuisine_specialty' => $chef->cuisine_specialty ?: 'Multi-Cuisine',
                    'specialties' => $chef->cuisine_specialty ?: 'Multi-Cuisine',
                    'bio' => $chef->bio ?: '',
                    'calendly_link' => $chef->calendly_link ?: '',
                    'calendly' => !empty($chef->calendly_link),
                    'approval_status' => $chef->approval_status ?: 'pending',
                    'status' => $chef->approval_status ?: 'pending',
                    'availability_info' => $availability,
                    'skills' => $skills,
                ];
            });

            $filteredChefs = $allChefs;
            $statusParam = $request->query('status');
            if (!empty($statusParam) && $statusParam !== 'all' && in_array($statusParam, ['pending', 'approved', 'rejected'])) {
                $filteredChefs = $allChefs->filter(function($c) use ($statusParam) {
                    return $c['status'] === $statusParam;
                })->values();
            }

            return response()->json([
                'success' => true,
                'total' => $filteredChefs->count(),
                'total_all' => $allChefs->count(),
                'pending_count' => $allChefs->where('status', 'pending')->count(),
                'approved_count' => $allChefs->where('status', 'approved')->count(),
                'chefs' => $filteredChefs->values()
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
    public function approve($id, Request $request)
    {
        $chef = ChefProfile::where('id', $id)->orWhere('user_id', $id)->first();
        if (!$chef) {
            $chef = ChefProfile::create(['user_id' => $id, 'approval_status' => 'approved']);
        } else {
            $chef->update(['approval_status' => 'approved']);
        }

        // Shoot FCM Push Notification to Chef
        \App\Services\NotificationTriggerService::sendToUser(
            $chef->user_id,
            "Chef Profile Approved! 🎉",
            "Congratulations! Your Chef profile has been approved by admin. Employers can now view & book you on JobConnect!"
        );

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json(['success' => true, 'message' => 'Chef approved successfully.']);
        }

        return redirect()->back()->with('success', "Chef profile has been approved successfully.");
    }

    /**
     * Unpublish a chef profile (reverts approval_status to pending).
     */
    public function unpublish($id, Request $request)
    {
        $chef = ChefProfile::where('id', $id)->orWhere('user_id', $id)->first();
        if (!$chef) {
            $chef = ChefProfile::create(['user_id' => $id, 'approval_status' => 'pending']);
        } else {
            $chef->update(['approval_status' => 'pending']);
        }

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json(['success' => true, 'message' => 'Chef unpublished successfully.']);
        }

        return redirect()->back()->with('success', "Chef profile has been unpublished.");
    }

    /**
     * Reject a chef profile.
     */
    public function reject($id, Request $request)
    {
        $chef = ChefProfile::where('id', $id)->orWhere('user_id', $id)->first();
        if (!$chef) {
            $chef = ChefProfile::create(['user_id' => $id, 'approval_status' => 'rejected']);
        } else {
            $chef->update(['approval_status' => 'rejected']);
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['success' => true, 'message' => 'Chef rejected successfully.']);
        }

        return redirect()->back()->with('success', "Chef profile has been rejected.");
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
