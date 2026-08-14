<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role.active' => \App\Http\Middleware\EnforceActiveRoleWeb::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'webhook/deploy',
            'api/*',
            'backend/api/*',
            'admin/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function (\Illuminate\Http\Request $request, \Throwable $e) {
            if ($request->is('backend/api/*') || $request->is('api/*') || $request->is('admin/*')) {
                return true;
            }
            return $request->expectsJson();
        });
    })->create();
