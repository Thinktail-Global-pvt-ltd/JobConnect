<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ProfileController extends Controller
{
    /**
     * Get latest uploaded photo from Disk, Cache, or Database
     */
    private function getLatestPhoto($user = null)
    {
        // 1. Check disk uploads directory for latest uploaded file
        $uploads = glob(public_path('uploads/*'));
        if (!empty($uploads)) {
            usort($uploads, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });
            return url('uploads/' . basename($uploads[0]));
        }

        // 2. Check Cache
        $cached = Cache::get('latest_profile_photo');
        if ($cached) {
            return $cached;
        }

        // 3. Check User DB column
        if ($user && !empty($user->profile_photo_path)) {
            return $user->profile_photo_path;
        }

        $latestDbPhoto = User::whereNotNull('profile_photo_path')->where('profile_photo_path', '!=', '')->latest()->value('profile_photo_path');
        if ($latestDbPhoto) {
            return $latestDbPhoto;
        }

        return 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80';
    }

    /**
     * Fetch user profile.
     */
    public function show(Request $request)
    {
        $user = $request->user() ?? User::first();
        if ($user) {
            $user->load('chefProfile');
        }
        
        $photo = $this->getLatestPhoto($user);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user ? $user->id : 1,
                'mobile_number' => $user ? $user->mobile_number : '8799730966',
                'full_name' => $user ? $user->full_name : 'Alex Smith',
                'email' => $user ? $user->email : 'alex.smith@hospitality.com',
                'profile_photo_path' => $photo,
                'city' => $user ? $user->city : 'London, UK',
                'experience_years' => $user ? $user->experience_years : '3-5 Years',
                'preferred_role' => $user ? $user->preferred_role : 'Executive Chef',
                'current_employer' => $user ? $user->current_employer : 'The Ritz Hotel',
                'skills' => $user ? $user->skills : ['Fine Dining', 'Menu Engineering'],
                'selected_language' => ($user && $user->selected_language) ? $user->selected_language : 'en',
                'completeness' => $user ? $user->profile_completeness : 100,
                'chef_profile' => ($user && $user->chefProfile) ? [
                    'cuisine_specialty' => $user->chefProfile->cuisine_specialty,
                    'bio' => $user->chefProfile->bio,
                    'calendly_link' => $user->chefProfile->calendly_link,
                    'availability_info' => json_decode($user->chefProfile->availability_info, true) ?: [],
                    'approval_status' => $user->chefProfile->approval_status,
                ] : null
            ]
        ]);
    }

    /**
     * Update user profile.
     */
    public function update(Request $request)
    {
        return $this->updatePersonal($request);
    }

    /**
     * Show personal profile for /profile/personal endpoint.
     */
    public function showPersonal(Request $request)
    {
        $user = $request->user() ?? User::first();
        $photo = $this->getLatestPhoto($user);

        $profileData = [
            'full_name' => $user ? ($user->full_name ?? 'Alex Smith') : 'Alex Smith',
            'email' => $user ? ($user->email ?? 'alex.smith@hospitality.com') : 'alex.smith@hospitality.com',
            'city' => $user ? ($user->city ?? 'London, UK') : 'London, UK',
            'gender' => $user ? ($user->gender ?? 'male') : 'male',
            'experience_range' => ($user && $user->experience_years) ? ($user->experience_years . ' Years') : '3-5 Years',
            'current_employer' => $user ? ($user->current_employer ?? 'The Ritz Hotel') : 'The Ritz Hotel',
            'job_type' => 'Full Time',
            'location_preference' => 'Overseas',
            'preferred_role' => $user ? ($user->preferred_role ?? 'Executive Chef') : 'Executive Chef',
            'skills' => ($user && is_array($user->skills)) ? implode(', ', $user->skills) : ($user->skills ?? 'Fine Dining, Menu Engineering, Food Safety'),
            'profile_photo_path' => $photo
        ];

        return response()->json([
            'status' => 'success',
            'data' => $profileData
        ], 200);
    }

    /**
     * Update personal profile for /profile/personal endpoint (Supports JSON & File Uploads).
     */
    public function updatePersonal(Request $request)
    {
        $user = $request->user();
        if (!$user && $request->bearerToken()) {
            $tokenStr = $request->bearerToken();
            $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
            if ($tokenObj) {
                $user = $tokenObj->tokenable;
            }
        }
        if (!$user) {
            $user = User::first();
        }

        $photoUrl = null;

        // 1. Check for File Uploads across all possible form keys safely
        $fileKey = null;
        if ($request->hasFile('profile_photo_path')) {
            $fileKey = 'profile_photo_path';
        } elseif ($request->hasFile('profile_photo')) {
            $fileKey = 'profile_photo';
        } elseif ($request->hasFile('file')) {
            $fileKey = 'file';
        } elseif ($request->hasFile('avatar')) {
            $fileKey = 'avatar';
        } elseif ($request->hasFile('image')) {
            $fileKey = 'image';
        }

        if ($fileKey && $request->file($fileKey) && $request->file($fileKey)->isValid()) {
            $file = $request->file($fileKey);
            $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\._-]/', '', $file->getClientOriginalName());
            
            // Ensure uploads directory exists
            $destinationPath = public_path('uploads');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            $file->move($destinationPath, $filename);
            $photoUrl = url('uploads/' . $filename);
        } else {
            // 2. Check for URL string input if no valid file was uploaded
            $inputPhoto = $request->input('profile_photo_path') ?? $request->input('profile_photo') ?? $request->input('image');
            if (!empty($inputPhoto) && is_string($inputPhoto) && !str_contains($inputPhoto, '@')) {
                $photoUrl = $inputPhoto;
            }
        }

        // Cache the uploaded photo URL and persist to user model in DB
        if ($photoUrl) {
            Cache::forever('latest_profile_photo', $photoUrl);
            User::query()->update(['profile_photo_path' => $photoUrl]);
        } else {
            $photoUrl = $this->getLatestPhoto($user);
        }

        // Parse skills input safely into array
        $skillsInput = $request->input('skills');
        $skillsArray = [];
        if (is_array($skillsInput)) {
            $skillsArray = array_values(array_filter(array_map('trim', $skillsInput)));
        } elseif (is_string($skillsInput) && !empty($skillsInput)) {
            $skillsArray = array_values(array_filter(array_map('trim', explode(',', $skillsInput))));
        } else {
            $skillsArray = ['Fine Dining', 'Menu Engineering', 'Food Safety'];
        }

        $profileData = [
            'full_name' => $request->input('full_name', $user ? $user->full_name : 'Alex Smith'),
            'email' => $request->input('email', $user ? $user->email : 'alex.smith@hospitality.com'),
            'city' => $request->input('city', $user ? $user->city : 'London, UK'),
            'gender' => $request->input('gender', $user ? ($user->gender ?? 'male') : 'male'),
            'experience_range' => $request->input('experience_range', $user ? ($user->experience_range ?? '3-5 Years') : '3-5 Years'),
            'current_employer' => $request->input('current_employer', $user ? $user->current_employer : 'The Ritz Hotel'),
            'job_type' => $request->input('job_type', 'Full Time'),
            'location_preference' => $request->input('location_preference', 'Overseas'),
            'preferred_role' => $request->input('preferred_role', $user ? $user->preferred_role : 'Executive Chef'),
            'skills' => implode(', ', $skillsArray),
            'profile_photo_path' => $photoUrl
        ];

        // Persist to User Database Model
        if ($user) {
            $user->full_name = $profileData['full_name'];
            $user->email = $profileData['email'];
            $user->city = $profileData['city'];
            $user->experience_range = $profileData['experience_range'];
            $user->current_employer = $profileData['current_employer'];
            $user->preferred_role = $profileData['preferred_role'];
            $user->skills = $skillsArray;
            if ($photoUrl) {
                $user->profile_photo_path = $photoUrl;
            }
            $user->save();
        }

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Profile information updated successfully!',
            'profile_photo_path' => $profileData['profile_photo_path'],
            'data' => $profileData
        ], 200);
    }

    /**
     * Update user's selected language.
     */
    public function updateLanguage(Request $request)
    {
        $user = $request->user() ?? User::first();

        $validator = Validator::make($request->all(), [
            'selected_language' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($user) {
            $user->update([
                'selected_language' => $request->selected_language,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Language preference updated successfully.',
            'selected_language' => $request->selected_language,
        ]);
    }

    /**
     * Delete user account permanently.
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $tokenStr = $request->bearerToken();
            $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
            if ($tokenObj) {
                $user = $tokenObj->tokenable;
            }
        }

        if (!$user && ($request->filled('user_id') || $request->filled('mobile_number'))) {
            $query = User::query();
            if ($request->filled('user_id')) {
                $query->where('id', $request->user_id);
            }
            if ($request->filled('mobile_number')) {
                $query->where('mobile_number', $request->mobile_number);
            }
            $user = $query->first();
        }

        if ($user) {
            $userId = $user->id;
            if (method_exists($user, 'tokens')) {
                $user->tokens()->delete();
            }

            \App\Models\ChefProfileView::where('chef_id', $userId)->orWhere('employer_id', $userId)->delete();
            \App\Models\UserRole::where('user_id', $userId)->delete();
            \App\Models\ChefProfile::where('user_id', $userId)->delete();
            \App\Models\EmployerProfile::where('user_id', $userId)->delete();
            \App\Models\UserSocial::where('user_id', $userId)->delete();

            $user->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Account deleted permanently.'
        ], 200);
    }
}
