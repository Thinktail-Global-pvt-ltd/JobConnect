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
            'login_role' => 'required|string|in:job_seeker,employer',
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
                        'active_role' => $targetRole,
                    ],
                ]);
            } else {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        }

        $mobile = $request->mobile_number;
        
        // Generate random 4-digit OTP
        $otp = (string) mt_rand(1000, 9999);

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
            'otp' => 'required|string|size:4',
            'login_role' => 'required|string|in:job_seeker,employer',
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
            ]);
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
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully as ' . ucfirst(str_replace('_', ' ', $targetRole)) . '!',
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
}
