<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuthMiddleware
{
    /**
     * Handle an incoming request for Admin routes.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->is('admin/login')) {
            return $next($request);
        }

        if (!session('admin_authenticated')) {
            if ($request->wantsJson() || $request->ajax() || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin authentication required. Please log in to the admin panel.',
                ], 401);
            }
            return redirect('/admin/login');
        }

        return $next($request);
    }
}
