<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;



class WebAuthController extends Controller
{
    /**
     * Show login form.
     */
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('profile');
        }
        return view('auth.login');
    }

    /**
     * Submit mobile number to request OTP.
     */
    public function submitLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|regex:/^[0-9]{10}$/',
            'login_role' => 'required|string|in:job_seeker,employer,chef',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if (Auth::check()) {
            $user = Auth::user();
            if ($request->mobile_number === $user->mobile_number) {
                $targetRole = $request->login_role;
                
                // Deactivate all user's roles
                $user->roles()->update(['is_active' => false]);

                // Find or create the selected role and set it active
                UserRole::updateOrCreate(
                    ['user_id' => $user->id, 'role_type' => $targetRole],
                    ['is_active' => true]
                );

                // Generate Sanctum auth token
                $user->load(['employerProfile', 'chefProfile', 'roles']);
                $token = $user->createToken('auth_token')->plainTextToken;
 
                return response()->json([
                    'success' => true,
                    'message' => 'Already logged in.',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'mobile_number' => $user->mobile_number,
                        'full_name' => $user->full_name,
                        'email' => $user->email,
                        'profile_photo_path' => $user->profile_photo_path,
                        'city' => $user->city,
                        'experience_range' => $user->experience_range,
                        'preferred_role' => $user->preferred_role,
                        'current_employer' => $user->current_employer,
                        'skills' => $user->skills,
                        'selected_language' => $user->selected_language ?? 'en',
                        'active_role' => $targetRole,
                        'employer_profile' => $user->employerProfile,
                        'chef_profile' => $user->chefProfile,
                        'registered_roles' => $user->roles,
                    ],
                ]);
            } else {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        }

        $mobile = $request->mobile_number;
        
        // Generate random 6-digit OTP to match Figma screenshots
        $otp = (string) mt_rand(100000, 999999);

        // Store OTP in Cache for 5 minutes
        Cache::put("web_otp_{$mobile}", $otp, now()->addMinutes(5));

        // Flash to Session for development/testing visibility
        session()->flash('demo_otp', $otp);

        return response()->json([
            'success' => true,
            'message' => 'Demo OTP generated successfully.',
            'demo_otp' => $otp,
            'mobile' => $mobile,
            'login_role' => $request->login_role,
        ]);
    }

    /**
     * Show OTP verification form.
     */
    public function showVerify(Request $request)
    {
        if (Auth::check()) {
            return redirect()->route('profile');
        }

        $mobile = $request->query('mobile');
        $loginRole = $request->query('login_role', 'job_seeker');
        if (empty($mobile)) {
            return redirect()->route('login');
        }

        return view('auth.verify-otp', compact('mobile', 'loginRole'));
    }

    /**
     * Submit OTP to complete session login.
     */
    public function submitVerify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|regex:/^[0-9]{10}$/',
            'otp' => 'required|string|size:6',
            'login_role' => 'required|string|in:job_seeker,employer,chef',
            'selected_language' => 'nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $mobile = $request->mobile_number;
        $otp = $request->otp;
        $targetRole = $request->login_role;

        $cachedOtp = Cache::get("web_otp_{$mobile}");

        if ($cachedOtp === null || $cachedOtp !== $otp) {
            return response()->json([
                'success' => false,
                'errors' => ['otp' => ['Invalid or expired OTP code code.']],
                'message' => 'Invalid or expired OTP code code.',
            ], 401);
        }

        // OTP verified successfully. Remove from Cache.
        Cache::forget("web_otp_{$mobile}");

        // Fetch or create user
        $user = User::where('mobile_number', $mobile)->first();
        
        if (!$user) {
            $user = User::create([
                'mobile_number' => $mobile,
                'is_suspended' => false,
                'selected_language' => $request->selected_language ?? 'en',
            ]);
        } else {
            if ($request->filled('selected_language')) {
                $user->update([
                    'selected_language' => $request->selected_language
                ]);
            }
        }

        // Verify user state
        if ($user->is_suspended) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended by an administrator.',
            ], 403);
        }

        // Deactivate all user's roles
        $user->roles()->update(['is_active' => false]);

        // Find or create the selected role and set it active
        UserRole::updateOrCreate(
            ['user_id' => $user->id, 'role_type' => $targetRole],
            ['is_active' => true]
        );

        // Login using Laravel Web guard
        Auth::login($user, true);

        // Regenerate session ID for security
        $request->session()->regenerate();

        // Generate Sanctum auth token for API/mobile app compatibility
        $user->load(['employerProfile', 'chefProfile', 'roles']);
        $token = $user->createToken('auth_token')->plainTextToken;
 
        $hasCompletedOnboarding = false;
        if ($targetRole === 'employer') {
            $hasCompletedOnboarding = $user->employerProfile ? (bool)$user->employerProfile->is_completed : false;
        } elseif ($targetRole === 'chef') {
            $hasCompletedOnboarding = $user->chefProfile ? true : false;
        }
 
        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully as ' . ucfirst(str_replace('_', ' ', $targetRole)) . '!',
            'token' => $token,
            'has_completed_onboarding' => $hasCompletedOnboarding,
            'user' => [
                'id' => $user->id,
                'mobile_number' => $user->mobile_number,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'profile_photo_path' => $user->profile_photo_path,
                'city' => $user->city,
                'experience_range' => $user->experience_range,
                'preferred_role' => $user->preferred_role,
                'current_employer' => $user->current_employer,
                'skills' => $user->skills,
                'selected_language' => $user->selected_language ?? 'en',
                'active_role' => $targetRole,
                'employer_profile' => $user->employerProfile,
                'chef_profile' => $user->chefProfile,
                'registered_roles' => $user->roles,
            ],
        ]);
    }

    /**
     * Destroy authentication session.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')
            ->with('success', 'Signed out successfully.');
    }

    /**
     * Invalidate/revoke user access token (API Logout).
     */
    public function apiLogout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        // Also logout from web session guard for hybrid clients
        if (Auth::guard('web') instanceof \Illuminate\Auth\SessionGuard) {
            Auth::guard('web')->logout();
        }
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out and token revoked successfully.'
        ]);
    }
}
