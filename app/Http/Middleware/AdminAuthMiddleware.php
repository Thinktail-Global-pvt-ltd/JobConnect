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

        if (!session('admin_authenticated') && !$request->wantsJson()) {
            return redirect('/admin/login');
        }

        return $next($request);
    }
}
