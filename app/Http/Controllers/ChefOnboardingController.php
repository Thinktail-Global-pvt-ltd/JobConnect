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
        $user = $request->user();
        if (!$user) {
            $tokenStr = $request->bearerToken();
            if ($tokenStr) {
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
                if (!$tokenObj && str_contains($tokenStr, '|')) {
                    $tokenId = explode('|', $tokenStr)[0];
                    $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                }
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
        }
        if (!$user && ($request->filled('user_id') || $request->filled('id'))) {
            $uId = $request->input('user_id') ?: $request->input('id');
            $user = \App\Models\User::find($uId);
        }
        if (!$user) {
            $user = Auth::user();
        }
        if (!$user) {
            $user = \App\Models\User::first();
        }

        // Check Role Conflict: Block onboarding as chef if user is registered with a different role
        $activeRole = $user->activeRole()->first();
        $existingRoleType = $activeRole ? $activeRole->role_type : ($user->roles()->first()?->role_type);
        if ($existingRoleType && !in_array($existingRoleType, ['chef', 'cook'])) {
            $displayExisting = str_replace('_', ' ', $existingRoleType);
            return response()->json([
                'success' => false,
                'message' => "Role conflict error: Mobile number {$user->mobile_number} is registered as '{$displayExisting}'. You cannot onboard or switch to chef.",
            ], 400);
        }

        // 1. Alias mapping for flexible mobile client payload keys
        if (!$request->has('experience_range')) {
            if ($request->has('experience')) {
                $request->merge(['experience_range' => $request->input('experience')]);
            } elseif ($request->has('experience_years')) {
                $request->merge(['experience_range' => $request->input('experience_years')]);
            }
        }

        if (!$request->has('preferred_role')) {
            if ($request->has('position')) {
                $request->merge(['preferred_role' => $request->input('position')]);
            } elseif ($request->has('job_title')) {
                $request->merge(['preferred_role' => $request->input('job_title')]);
            } elseif ($request->has('role')) {
                $request->merge(['preferred_role' => $request->input('role')]);
            }
        }

        if (!$request->has('skills') && $request->has('additional_skills')) {
            $request->merge(['skills' => $request->input('additional_skills')]);
        }

        // Normalize skills input to array if passed as string or array
        $skillsInput = $request->input('skills');
        if (is_string($skillsInput)) {
            $skillsArray = array_values(array_filter(array_map('trim', explode(',', $skillsInput))));
            $request->merge(['skills' => $skillsArray]);
        }

        $cuisineSpecialty = $request->input('cuisine_specialty') 
            ?: ($request->input('specialty') 
            ?: ($request->input('specialties') 
            ?: ($request->input('cuisine') ?: 'Multi-Cuisine')));

        $opsExperties = $request->input('operational_experties')
            ?: ($request->input('operational_expertise')
            ?: ($request->input('operational_experience') ?: null));

        if (is_array($opsExperties)) {
            $opsExperties = implode(', ', $opsExperties);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'preferred_role' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'experience_range' => 'nullable|string|max:255',
            'skills' => 'nullable',
            'cuisine_specialty' => 'nullable|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'specialties' => 'nullable|string|max:255',
            'cuisine' => 'nullable|string|max:255',
            'operational_experties' => 'nullable',
            'operational_expertise' => 'nullable',
            'bio' => 'nullable|string',
            'calendly_link' => 'nullable|url|max:255',
            'profile_photo' => 'nullable',

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
            DB::transaction(function () use ($user, $request, $cuisineSpecialty, $opsExperties) {
                // 1. Process profile photo upload if provided (supports profile_photo & profile_photo_path)
                $photoFile = $request->file('profile_photo') ?? $request->file('profile_photo_path');
                if ($photoFile && $photoFile->isValid()) {
                    $path = $photoFile->store('profile_photos', 'public');
                    $user->profile_photo_path = '/storage/' . $path;
                } elseif ($request->filled('profile_photo_path') && is_string($request->input('profile_photo_path')) && !str_contains($request->input('profile_photo_path'), '@')) {
                    $user->profile_photo_path = $request->input('profile_photo_path');
                }

                // 2. Update User details
                $user->full_name = $request->full_name;
                $user->preferred_role = $request->preferred_role;
                if ($request->has('city')) {
                    $user->city = $request->city;
                }
                if ($request->has('country')) {
                    $user->country = $request->country;
                }
                if ($request->has('current_employer')) {
                    $user->current_employer = $request->current_employer;
                }
                if ($request->has('gender') && \Illuminate\Support\Facades\Schema::hasColumn('users', 'gender')) {
                    $user->gender = $request->gender;
                }
                if ($request->has('age')) {
                    $user->age = (string)$request->input('age');
                }
                $user->experience_range = $request->experience_range;
                $user->skills = $request->skills;
                if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'availability_status')) {
                    $user->availability_status = $request->input('availability', 'Available Immediately');
                }
                if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_available')) {
                    $user->is_available = true;
                }
                $user->save();

                // 3. Serialize chef-specific selections into availability_info
                $availValue = $request->input('availability', 'Available Immediately');
                $availabilityDetails = [
                    'languages' => $request->input('languages', []),
                    'regional_experience' => $request->input('regional_experience', []),
                    'location_preference' => $request->input('location_preference', 'Both'),
                    'employment_preference' => $request->input('employment_preference', []),
                    'availability_status' => $availValue,
                    'status' => $availValue,
                    'is_available' => true,
                    'age' => $request->input('age'),
                ];

                // 4. Update or create Chef Profile
                // New profiles → 'pending' (require admin approval before appearing in employer discovery)
                // Existing profiles → keep their current approval_status (don't reset approved chefs)
                $existingProfile = ChefProfile::where('user_id', $user->id)->first();
                $updateData = [
                    'cuisine_specialty'     => $cuisineSpecialty,
                    'operational_experties' => $opsExperties,
                    'bio'                   => $request->bio,
                    'calendly_link'         => $request->calendly_link,
                    'availability_info'     => json_encode($availabilityDetails),
                ];
                if ($request->has('age')) {
                    if (!\Illuminate\Support\Facades\Schema::hasColumn('chef_profiles', 'age')) {
                        try {
                            \Illuminate\Support\Facades\DB::statement("ALTER TABLE chef_profiles ADD COLUMN age VARCHAR(255) NULL");
                        } catch (\Throwable $e) {}
                    }
                    $updateData['age'] = (string)$request->input('age');
                }
                if (!$existingProfile) {
                    // Brand new chef — start as pending, admin must approve
                    $updateData['approval_status'] = 'pending';
                }
                ChefProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    $updateData
                );

                // 5. Update or create Social Profiles (supports linkedin/linkedin_link, etc.)
                UserSocial::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'linkedin'  => $request->input('linkedin') ?? $request->input('linkedin_link'),
                        'instagram' => $request->input('instagram') ?? $request->input('instagram_link'),
                        'facebook'  => $request->input('facebook') ?? $request->input('facebook_link'),
                        'twitter'   => $request->input('twitter') ?? $request->input('twitter_link'),
                    ]
                );

                // 6. Deactivate other roles and ensure chef role exists and is active
                $user->roles()->update(['is_active' => false]);
                UserRole::updateOrCreate(
                    ['user_id' => $user->id, 'role_type' => 'chef'],
                    ['is_active' => true]
                );
            });

            $user->refresh();
            $photoPath = $user->profile_photo_path;
            $photoUrl = null;
            if (!empty($photoPath)) {
                if (str_starts_with($photoPath, 'http://') || str_starts_with($photoPath, 'https://')) {
                    $photoUrl = $photoPath;
                } else {
                    $photoUrl = url('/' . ltrim($photoPath, '/'));
                }
            }

            $completenessResult = \App\Services\ProfileProgressService::calculateChef($user);

            return response()->json([
                'success' => true,
                'message' => 'Chef onboarding completed successfully! Profile is pending administrator review.',
                'profile_photo_path' => $photoPath,
                'profile_photo' => $photoUrl ?: $photoPath,
                'photo_url' => $photoUrl ?: $photoPath,
                'avatar' => $photoUrl ?: $photoPath,
                'avatar_url' => $photoUrl ?: $photoPath,
                'completeness' => $completenessResult['completeness'] ?? 100,
                'profile_completeness' => $completenessResult['completeness'] ?? 100,
                'breakdown' => $completenessResult['breakdown'] ?? [],
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
