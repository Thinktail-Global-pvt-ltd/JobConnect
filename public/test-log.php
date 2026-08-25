<?php
header('Content-Type: text/plain');
echo "=== GIT PULL OUTPUT ===\n";
echo shell_exec('cd /var/www/jobconnect && git pull 2>&1') . "\n\n";

echo "=== LARAVEL LOG LAST 50 LINES ===\n";
$logPath = __DIR__ . '/../storage/logs/laravel.log';
if (file_exists($logPath)) {
    $lines = file($logPath);
    echo implode('', array_slice($lines, -50));
} else {
    echo "No laravel.log file found at $logPath";
}
