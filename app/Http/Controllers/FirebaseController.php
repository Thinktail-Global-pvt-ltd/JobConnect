<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FirebaseController extends Controller
{
    /**
     * Store or update user's FCM device token for push notifications.
     */
    public function saveFcmToken(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'fcm_token' => $request->fcm_token,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FCM token updated successfully!',
        ]);
    }

    /**
     * Send a test push notification to a specific FCM token.
     */
    public function sendTestNotification(Request $request, \App\Services\FirebaseService $firebaseService)
    {
        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required|string',
            'title' => 'required|string',
            'body' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $firebaseService->sendPushNotification(
            $request->fcm_token,
            $request->title,
            $request->body
        );

        return response()->json($result);
    }
}
