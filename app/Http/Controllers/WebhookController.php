<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebhookController extends Controller
{
    /**
     * Handle incoming GitHub webhook deployment triggers.
     */
    public function deploy(Request $request)
    {
        $signatureHeader = $request->header('X-Hub-Signature-256');

        if (!$signatureHeader) {
            return response()->json([
                'success' => false,
                'message' => 'Signature header missing.',
            ], 403);
        }

        // The header format is typically: sha256=<signature>
        $parts = explode('=', $signatureHeader, 2);
        if (count($parts) !== 2 || $parts[0] !== 'sha256') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature format.',
            ], 403);
        }

        $githubSignature = $parts[1];
        $payload = $request->getContent();
        $secret = env('GITHUB_WEBHOOK_SECRET');

        if (empty($secret)) {
            return response()->json([
                'success' => false,
                'message' => 'Webhook secret is not configured on the server.',
            ], 500);
        }

        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expectedSignature, $githubSignature)) {
            return response()->json([
                'success' => false,
                'message' => 'Signature verification failed.',
            ], 403);
        }

        // Sequential deployment commands to run
        $commands = [
            'cd /var/www/jobconnect && git pull 2>&1',
            'cd /var/www/jobconnect && php artisan config:clear 2>&1',
            'cd /var/www/jobconnect && php artisan route:clear 2>&1',
            'cd /var/www/jobconnect && php artisan config:cache 2>&1',
            'cd /var/www/jobconnect && php artisan route:cache 2>&1',
        ];

        $outputLog = [];
        foreach ($commands as $command) {
            $output = [];
            $resultCode = null;
            exec($command, $output, $resultCode);
            $outputLog[] = [
                'command' => $command,
                'output' => $output,
                'status' => $resultCode,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Deployment executed successfully.',
            'log' => $outputLog,
        ]);
    }
}
