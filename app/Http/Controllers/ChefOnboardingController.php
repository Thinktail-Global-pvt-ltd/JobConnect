<?php

namespace App\Http\Controllers;

use App\Models\ChefProfile;
use App\Models\UserRole;
use App\Models\User;
use App\Models\UserSocial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ChefOnboardingController extends Controller
{
    /**
     * Show Chef Onboarding Form.
     */
    public function show(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Fetch or create a default chef profile to pre-fill if it exists
        $profile = $user->chefProfile;

        return view('auth.chef-onboarding', compact('user', 'profile'));
    }

    /**
     * Save Chef Onboarding Form (AJAX).
     */
    public function save(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated user.',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'preferred_role' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'experience_range' => 'required|string|max:255',
            'skills' => 'required|array',
            'cuisine_specialty' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'calendly_link' => 'nullable|url|max:255',
            'profile_photo' => 'nullable|image|max:2048', // max 2MB

            // Social media links
            'linkedin' => 'nullable|string|url|max:255',
            'instagram' => 'nullable|string|url|max:255',
            'facebook' => 'nullable|string|url|max:255',
            'twitter' => 'nullable|string|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::transaction(function () use ($user, $request) {
                // 1. Process profile photo upload if provided
                if ($request->hasFile('profile_photo')) {
                    $path = $request->file('profile_photo')->store('profile_photos', 'public');
                    $user->profile_photo_path = '/storage/' . $path;
                }

                // 2. Update User details
                $user->full_name = $request->full_name;
                $user->preferred_role = $request->preferred_role;
                $user->city = $request->city;
                $user->experience_range = $request->experience_range;
                $user->skills = $request->skills;
                $user->save();

                // 3. Serialize chef-specific selections into availability_info
                $availabilityDetails = [
                    'languages' => $request->input('languages', []),
                    'regional_experience' => $request->input('regional_experience', []),
                    'location_preference' => $request->input('location_preference', 'Both'),
                    'employment_preference' => $request->input('employment_preference', []),
                    'availability_status' => $request->input('availability', 'Available Immediately'),
                ];

                // 4. Update or create Chef Profile
                ChefProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'cuisine_specialty' => $request->cuisine_specialty,
                        'bio' => $request->bio,
                        'calendly_link' => $request->calendly_link,
                        'availability_info' => json_encode($availabilityDetails),
                        'approval_status' => 'pending', // Pending admin approval
                    ]
                );

                // 5. Update or create Social Profiles
                UserSocial::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'linkedin'  => $request->linkedin,
                        'instagram' => $request->instagram,
                        'facebook'  => $request->facebook,
                        'twitter'   => $request->twitter,
                    ]
                );

                // 6. Deactivate other roles and ensure chef role exists and is active
                $user->roles()->update(['is_active' => false]);
                UserRole::updateOrCreate(
                    ['user_id' => $user->id, 'role_type' => 'chef'],
                    ['is_active' => true]
                );
            });

            return response()->json([
                'success' => true,
                'message' => 'Chef onboarding completed successfully! Profile is pending administrator review.',
                'redirect_url' => route('profile')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save onboarding details: ' . $e->getMessage(),
            ], 500);
        }
    }
}
