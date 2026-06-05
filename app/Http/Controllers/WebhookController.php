<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebhookController extends Controller
{
    /**
     * Path to the custom webhook deployment log file.
     */
    protected string $logPath;

    public function __construct()
    {
        $this->logPath = storage_path('logs/webhook.log');
    }

    /**
     * Handle incoming GitHub webhook deployment triggers.
     */
    public function deploy(Request $request)
    {
        $this->logMessage('================== DEPLOYMENT TRIGGERED ==================');
        $this->logMessage('Client IP: ' . $request->ip());

        // Log important GitHub headers
        $headers = [
            'X-Hub-Signature-256' => $request->header('X-Hub-Signature-256'),
            'X-GitHub-Event' => $request->header('X-GitHub-Event'),
            'X-GitHub-Delivery' => $request->header('X-GitHub-Delivery'),
            'User-Agent' => $request->header('User-Agent'),
        ];
        $this->logMessage('Headers: ' . json_encode($headers));

        $signatureHeader = $headers['X-Hub-Signature-256'];

        if (!$signatureHeader) {
            $this->logMessage('Verification FAILED: Signature header missing.');
            return response()->json([
                'success' => false,
                'message' => 'Signature header missing.',
            ], 403);
        }

        // The header format is typically: sha256=<signature>
        $parts = explode('=', $signatureHeader, 2);
        if (count($parts) !== 2 || $parts[0] !== 'sha256') {
            $this->logMessage('Verification FAILED: Invalid signature format: ' . $signatureHeader);
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature format.',
            ], 403);
        }

        $githubSignature = $parts[1];
        $payload = $request->getContent();
        $this->logMessage('Payload length: ' . strlen($payload) . ' bytes');

        $secret = env('GITHUB_WEBHOOK_SECRET');

        if (empty($secret)) {
            $this->logMessage('Configuration ERROR: GITHUB_WEBHOOK_SECRET is empty.');
            return response()->json([
                'success' => false,
                'message' => 'Webhook secret is not configured on the server.',
            ], 500);
        }

        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expectedSignature, $githubSignature)) {
            $this->logMessage('Verification FAILED: Signature mismatch.');
            $this->logMessage('Expected signature (calculated): ' . $expectedSignature);
            $this->logMessage('GitHub signature (received): ' . $githubSignature);
            return response()->json([
                'success' => false,
                'message' => 'Signature verification failed.',
            ], 403);
        }

        $this->logMessage('Verification SUCCESS: Signature matches GITHUB_WEBHOOK_SECRET.');

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
            $this->logMessage('Executing command: ' . $command);
            
            $output = [];
            $resultCode = null;
            exec($command, $output, $resultCode);
            
            $outputStr = implode(PHP_EOL, $output);
            $this->logMessage('Status Code: ' . $resultCode);
            $this->logMessage('Command Output: ' . (empty($outputStr) ? '(No Output)' : $outputStr));

            $outputLog[] = [
                'command' => $command,
                'output' => $output,
                'status' => $resultCode,
            ];
        }

        $this->logMessage('================== DEPLOYMENT COMPLETED ==================');

        return response()->json([
            'success' => true,
            'message' => 'Deployment executed successfully.',
            'log' => $outputLog,
        ]);
    }

    /**
     * Write a log entry to the custom log file.
     */
    protected function logMessage(string $message): void
    {
        $logEntry = '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL;
        file_put_contents($this->logPath, $logEntry, FILE_APPEND);
    }
}
