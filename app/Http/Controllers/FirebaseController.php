<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\UserDeviceToken;

class FirebaseController extends Controller
{
    /**
     * Store or update user's FCM device token for push notifications.
     */
    public function saveFcmToken(Request $request)
    {
        $user = $request->user() ?? Auth::user() ?? User::first();

        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required|string',
            'device_type' => 'nullable|string',
            'device_name' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($user) {
            $user->update([
                'fcm_token' => $request->fcm_token,
            ]);

            UserDeviceToken::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'fcm_token' => $request->fcm_token,
                ],
                [
                    'device_type' => $request->input('device_type', 'android'),
                    'device_name' => $request->input('device_name', 'Mobile Device'),
                    'is_active' => true,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'FCM token updated and mapped to user successfully!',
            'data' => [
                'user_id' => $user ? $user->id : null,
                'fcm_token' => $request->fcm_token,
                'device_type' => $request->input('device_type', 'android'),
            ]
        ]);
    }

    /**
     * Show the Firebase FCM test page.
     */
    public function showTestPage()
    {
        $user = Auth::user();
        return view('profile.firebase_test', compact('user'));
    }

    /**
     * Send a push notification by User ID or direct FCM token.
     */
    public function sendTestNotification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required_without:fcm_token',
            'fcm_token' => 'required_without:user_id|string|nullable',
            'title' => 'required|string',
            'body' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $fcmToken = $request->input('fcm_token');
        $userId = $request->input('user_id');
        $user = null;

        if ($userId) {
            $user = User::find($userId);
            if ($user && !empty($user->fcm_token)) {
                $fcmToken = $user->fcm_token;
            } else {
                $deviceTokenRecord = UserDeviceToken::where('user_id', $userId)
                    ->where('is_active', true)
                    ->latest()
                    ->first();
                if ($deviceTokenRecord) {
                    $fcmToken = $deviceTokenRecord->fcm_token;
                }
            }
        }

        if (empty($fcmToken)) {
            return response()->json([
                'success' => false,
                'message' => 'No active FCM device token found for User #' . ($userId ?? 'N/A') . '. Make sure to send fcm_token during login or via /api/user/fcm-token.'
            ], 404);
        }

        try {
            $firebaseService = app(\App\Services\FirebaseService::class);
            $result = $firebaseService->sendPushNotification(
                $fcmToken,
                $request->title,
                $request->body
            );

            return response()->json([
                'success' => true,
                'message' => 'Push notification request shot successfully for User #' . ($userId ?? ($user ? $user->id : 'N/A')),
                'target_user_id' => $userId ? (int)$userId : ($user ? $user->id : null),
                'fcm_token' => $fcmToken,
                'title' => $request->title,
                'body' => $request->body,
                'firebase_result' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Firebase Initialization Error: ' . $e->getMessage() . '. Please verify that your credentials file exists and is valid in storage/app/firebase/firebase_credentials.json',
                'target_user_id' => $userId ? (int)$userId : null,
                'fcm_token' => $fcmToken,
            ], 200);
        }
    }
}
