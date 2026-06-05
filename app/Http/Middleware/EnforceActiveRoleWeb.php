<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceActiveRoleWeb
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
        // If user is suspended, log them out and block access
        if ($user->is_suspended) {
            Auth::logout();
            return redirect()->route('login')->with('error', 'Your account has been suspended.');
        }

        $activeRole = $user->currentRoleContext();

        if (!$activeRole) {
            return redirect()->route('profile')->with('error', 'Please select an active profile role context first.');
        }

        // If specific roles are required, ensure current active role matches
        if (!empty($roles) && !in_array($activeRole->role_type, $roles)) {
            $formattedRoles = implode(', ', array_map(function($r) {
                return ucfirst(str_replace('_', ' ', $r));
            }, $roles));
            
            return redirect()->route('profile')->with('error', "Access Denied. Your active role is '" . ucfirst(str_replace('_', ' ', $activeRole->role_type)) . "', but this route requires: {$formattedRoles}.");
        }

        return $next($request);
    }
}
