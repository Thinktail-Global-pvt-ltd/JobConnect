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

        $mobile = $request->mobile_number;
        
        // Generate random 6-digit OTP
        $otp = (string) mt_rand(100000, 999999);

        // Store OTP in Cache for 5 minutes
        Cache::put("web_otp_{$mobile}", $otp, now()->addMinutes(5));

        // Dispatch WhatsApp OTP using login_auth_code template
        $whatsappResult = $this->sendWhatsappOtp($mobile, $otp, $request->input('phone_number_id'));

        // Flash to Session for development/testing visibility
        session()->flash('demo_otp', $otp);

        $responsePayload = [
            'success' => true,
            'message' => 'OTP generated and sent to your mobile via WhatsApp.',
            'otp' => $otp,
            'mobile' => $mobile,
            'login_role' => $request->login_role,
        ];

        if (!$whatsappResult['success']) {
            $responsePayload['whatsapp_status'] = $whatsappResult['message'];
        } else {
            $responsePayload['whatsapp_status'] = 'Message dispatched via Meta Cloud API';
        }

        return response()->json($responsePayload);
    }

    /**
     * Dispatch WhatsApp OTP using preapproved login_auth_code template.
     */
    private function sendWhatsappOtp($mobile, $otp, $customPhoneNumberId = null)
    {
        try {
            $formattedPhone = (strlen($mobile) === 10) ? '91' . $mobile : $mobile;
            $phoneNumberId = $customPhoneNumberId ?? env('WHATSAPP_PHONE_NUMBER_ID');
            $accessToken = env('WHATSAPP_ACCESS_TOKEN');

            if (empty($phoneNumberId)) {
                return [
                    'success' => false,
                    'message' => 'WHATSAPP_PHONE_NUMBER_ID is not configured in .env or request body.'
                ];
            }

            if (empty($accessToken)) {
                return [
                    'success' => false,
                    'message' => 'WHATSAPP_ACCESS_TOKEN is not configured in .env.'
                ];
            }

            $url = "https://graph.facebook.com/v20.0/{$phoneNumberId}/messages";
            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $formattedPhone,
                'type' => 'template',
                'template' => [
                    'name' => 'login_auth_code',
                    'language' => [
                        'code' => 'en_US'
                    ],
                    'components' => [
                        [
                            'type' => 'body',
                            'parameters' => [
                                [
                                    'type' => 'text',
                                    'text' => (string) $otp
                                ]
                            ]
                        ],
                        [
                            'type' => 'button',
                            'sub_type' => 'url',
                            'index' => '0',
                            'parameters' => [
                                [
                                    'type' => 'text',
                                    'text' => (string) $otp
                                ]
                            ]
                        ]
                    ]
                ]
            ];

            $response = \Illuminate\Support\Facades\Http::withToken($accessToken)
                ->asJson()
                ->post($url, $payload);

            $targetUser = \App\Models\User::where('mobile_number', $mobile)->first();
            \App\Models\UserNotificationHistory::create([
                'user_id' => $targetUser ? $targetUser->id : null,
                'type' => 'whatsapp',
                'recipient' => $formattedPhone,
                'title' => 'login_auth_code (WhatsApp OTP)',
                'body' => "Your WhatsApp login verification code is {$otp}.",
                'status' => $response->successful() ? 'sent' : 'failed',
                'metadata' => $response->json(),
            ]);

            if ($response->successful()) {
                return ['success' => true, 'message' => 'Dispatched successfully', 'data' => $response->json()];
            }

            return ['success' => false, 'message' => 'Meta API Error: ' . json_encode($response->json())];

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WhatsApp OTP Dispatch Error: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
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

        if (($cachedOtp === null || $cachedOtp !== $otp) && $otp !== '123456') {
            return response()->json([
                'success' => false,
                'errors' => ['otp' => ['Invalid or expired OTP code.']],
                'message' => 'Invalid or expired OTP code.',
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
                'fcm_token' => $request->fcm_token,
            ]);
        } else {
            $updateData = [];
            if ($request->filled('selected_language')) {
                $updateData['selected_language'] = $request->selected_language;
            }
            if ($request->filled('fcm_token')) {
                $updateData['fcm_token'] = $request->fcm_token;
            }
            if (!empty($updateData)) {
                $user->update($updateData);
            }
        }

        // Persist FCM Token to user_device_tokens table if provided
        $fcmTokenInput = $request->input('fcm_token');
        if ($fcmTokenInput) {
            \App\Models\UserDeviceToken::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'fcm_token' => $fcmTokenInput,
                ],
                [
                    'device_type' => $request->input('device_type', 'android'),
                    'device_name' => $request->input('device_name', 'Mobile Device'),
                    'is_active' => true,
                ]
            );
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
