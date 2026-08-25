<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Auto-sync code from GitHub main if lock file is stale or missing
$lockFile = sys_get_temp_dir() . '/jobconnect_git_pull.lock';
if (function_exists('exec') && (!file_exists($lockFile) || (time() - @filemtime($lockFile)) > 10)) {
    @touch($lockFile);
    @exec('cd ' . __DIR__ . '/.. && git fetch origin && git reset --hard origin/main 2>&1');
    if (function_exists('opcache_reset')) { @opcache_reset(); }
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
