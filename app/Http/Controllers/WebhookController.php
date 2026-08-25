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

        $commands = [
            'cd /var/www/jobconnect && git pull 2>&1',
            'cd /var/www/jobconnect && php artisan package:discover 2>&1',
            'cd /var/www/jobconnect && php artisan config:clear 2>&1',
            'cd /var/www/jobconnect && php artisan route:clear 2>&1',
            'cd /var/www/jobconnect/frontend && npm run build 2>&1',
            'cd /var/www/jobconnect && cp -r frontend/dist/assets/* public/assets/ 2>&1',
            'rm -f /var/www/jobconnect/public/index.html 2>&1',
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
        ], 200);
    }

    public function deployNow(Request $request)
    {
        $this->logMessage('================== MANUAL DEPLOYMENT TRIGGERED ==================');

        $commands = [
            'cd /var/www/jobconnect && git pull 2>&1',
            'cd /var/www/jobconnect/frontend && npm run build 2>&1',
            'cd /var/www/jobconnect && cp -r frontend/dist/assets/* public/assets/ 2>&1',
            'rm -f /var/www/jobconnect/public/index.html 2>&1',
            'cd /var/www/jobconnect && php artisan config:clear 2>&1',
            'cd /var/www/jobconnect && php artisan route:clear 2>&1',
            'cd /var/www/jobconnect && php artisan config:cache 2>&1',
            'cd /var/www/jobconnect && php artisan route:cache 2>&1',
        ];

        $outputLog = [];
        foreach ($commands as $command) {
            $this->logMessage('Executing command: ' . $command);
            $output = [];
            $returnVar = 0;
            exec($command, $output, $returnVar);
            $this->logMessage('Exit Code: ' . $returnVar);
            $this->logMessage('Output: ' . implode("\n", $output));
            $outputLog[$command] = [
                'exit_code' => $returnVar,
                'output' => implode("\n", $output),
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Deployment executed successfully.',
            'log' => $outputLog,
        ], 200);
    }

    protected function logMessage(string $message): void
    {
        $formatted = '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL;
        file_put_contents($this->logPath, $formatted, FILE_APPEND);
    }
}
