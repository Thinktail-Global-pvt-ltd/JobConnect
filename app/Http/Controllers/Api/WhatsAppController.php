<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class WhatsAppController extends Controller
{
    /**
     * Handshake verification with Meta Webhook setup.
     */
    public function verifyWebhook(Request $request)
    {
        $mode = $request->input('hub_mode') ?? $request->input('hub.mode');
        $token = $request->input('hub_verify_token') ?? $request->input('hub.verify_token');
        $challenge = $request->input('hub_challenge') ?? $request->input('hub.challenge');

        $verifyToken = env('WHATSAPP_VERIFY_TOKEN', 'jobrito_whatsapp_verify_token');

        if ($mode && $token) {
            if ($mode === 'subscribe' && $token === $verifyToken) {
                return response($challenge, 200)->header('Content-Type', 'text/plain');
            }
        }

        return response('Forbidden', 403);
    }

    /**
     * Handle incoming webhook event notifications from Meta.
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        
        $logEntry = '[' . date('Y-m-d H:i:s') . '] Webhook Received: ' . json_encode($payload, JSON_PRETTY_PRINT) . PHP_EOL;
        file_put_contents(storage_path('logs/whatsapp.log'), $logEntry, FILE_APPEND);

        return response('EVENT_RECEIVED', 200);
    }

    /**
     * Send test WhatsApp message (Template or Plain Text).
     */
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'to' => 'required|string',
            'message' => 'nullable|string',
            'template_name' => 'nullable|string',
            'language_code' => 'nullable|string',
            'phone_number_id' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $to = $request->input('to');
        $textMessage = $request->input('message');
        $templateName = $request->input('template_name'); // e.g. hello_world
        $languageCode = $request->input('language_code', 'en_US');
        
        $phoneNumberId = $request->input('phone_number_id') ?? env('WHATSAPP_PHONE_NUMBER_ID');
        $accessToken = env('WHATSAPP_ACCESS_TOKEN');

        if (empty($phoneNumberId)) {
            return response()->json([
                'success' => false,
                'message' => 'WhatsApp Phone Number ID is required. Set WHATSAPP_PHONE_NUMBER_ID in .env or pass it as "phone_number_id" in the request payload.'
            ], 400);
        }

        if (empty($accessToken)) {
            return response()->json([
                'success' => false,
                'message' => 'WhatsApp Access Token is not configured in .env.'
            ], 400);
        }

        // Build Payload
        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
        ];

        if ($templateName) {
            $payload['type'] = 'template';
            $templateData = [
                'name' => $templateName,
                'language' => [
                    'code' => $languageCode
                ]
            ];

            $otpCode = $request->input('otp') ?? $request->input('code');
            if ($otpCode) {
                $templateData['components'] = [
                    [
                        'type' => 'body',
                        'parameters' => [
                            [
                                'type' => 'text',
                                'text' => (string) $otpCode
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
                                'text' => (string) $otpCode
                            ]
                        ]
                    ]
                ];
            } elseif ($request->has('parameters') && is_array($request->parameters)) {
                $componentsParams = array_map(function($p) {
                    return ['type' => 'text', 'text' => (string)$p];
                }, $request->parameters);

                $templateData['components'] = [
                    [
                        'type' => 'body',
                        'parameters' => $componentsParams
                    ]
                ];
            }

            $payload['template'] = $templateData;
        } else {
            $payload['type'] = 'text';
            $payload['text'] = [
                'body' => $textMessage ?? 'Hello from Jobrito WhatsApp integration!'
            ];
        }

        $url = "https://graph.facebook.com/v20.0/{$phoneNumberId}/messages";

        try {
            $response = Http::withToken($accessToken)
                ->asJson()
                ->post($url, $payload);

            $statusCode = $response->status();
            $body = $response->json();

            $logEntry = '[' . date('Y-m-d H:i:s') . '] Send Message Response (' . $statusCode . '): ' . json_encode($body, JSON_PRETTY_PRINT) . PHP_EOL;
            file_put_contents(storage_path('logs/whatsapp.log'), $logEntry, FILE_APPEND);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'WhatsApp message request sent successfully.',
                    'response' => $body
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to send WhatsApp message.',
                'whatsapp_error' => $body
            ], $statusCode);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An exception occurred while sending WhatsApp message.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
