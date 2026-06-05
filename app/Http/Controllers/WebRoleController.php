<?php

namespace App\Http\Controllers;

use App\Models\ChefProfile;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WebRoleController extends Controller
{
    /**
     * Switch user role context inside a database transaction, auto-unlocking and auto-approving.
     */
    public function switchRole(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_type' => 'required|string|in:job_seeker,employer,agency,chef,administrator',
        ]);

        $expectsJson = $request->expectsJson() || $request->query('format') === 'json' || $request->input('format') === 'json';

        if ($validator->fails()) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid role selection.',
                ], 422);
            }
            return redirect()->back()->with('error', 'Invalid role selection.');
        }

        $user = Auth::user();
        $targetRole = $request->role_type;

        // Auto unlock/create the role if it doesn't exist yet
        UserRole::firstOrCreate(
            ['user_id' => $user->id, 'role_type' => $targetRole],
            ['is_active' => false]
        );

        // Auto approve Chef profile if target is chef
        if ($targetRole === UserRole::ROLE_CHEF) {
            ChefProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'cuisine_specialty' => $user->preferred_role ?? 'General Culinary',
                    'bio' => 'Auto-approved chef profile.',
                    'approval_status' => 'approved',
                ]
            );
        }

        // Switch roles inside transaction
        try {
            DB::transaction(function () use ($user, $targetRole) {
                // Inactivate all roles
                $user->roles()->update(['is_active' => false]);
                
                // Activate target role
                $user->roles()->where('role_type', $targetRole)->update(['is_active' => true]);
            });

            if ($expectsJson) {
                return response()->json([
                    'success' => true,
                    'message' => "Role switched to '" . ucfirst(str_replace('_', ' ', $targetRole)) . "' successfully.",
                    'redirect_url' => route('profile'),
                ]);
            }

            return redirect()->route('profile')
                ->with('success', "Role switched to '" . ucfirst(str_replace('_', ' ', $targetRole)) . "' successfully.");
        } catch (\Exception $e) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to toggle role. Please try again.',
                ], 500);
            }
            return redirect()->back()->with('error', 'Failed to toggle role. Please try again.');
        }
    }

    /**
     * Cycle / Toggle active role context directly.
     * Loop sequence: job_seeker -> chef -> employer -> agency -> administrator -> job_seeker
     */
    public function toggleRole()
    {
        $user = Auth::user();
        $currentRoleModel = $user->currentRoleContext();
        $currentRole = $currentRoleModel ? $currentRoleModel->role_type : 'job_seeker';

        $roleCycle = [
            'job_seeker' => 'chef',
            'chef' => 'employer',
            'employer' => 'agency',
            'agency' => 'administrator',
            'administrator' => 'job_seeker',
        ];

        $targetRole = $roleCycle[$currentRole] ?? 'job_seeker';

        // Auto unlock / create the role if it doesn't exist
        UserRole::firstOrCreate(
            ['user_id' => $user->id, 'role_type' => $targetRole],
            ['is_active' => false]
        );

        // Auto approve Chef profile if switching to chef
        if ($targetRole === 'chef') {
            ChefProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'cuisine_specialty' => $user->preferred_role ?? 'General Culinary',
                    'bio' => 'Auto-approved chef profile.',
                    'approval_status' => 'approved',
                ]
            );
        }

        $expectsJson = request()->expectsJson() || request()->query('format') === 'json' || request()->input('format') === 'json';

        try {
            DB::transaction(function () use ($user, $targetRole) {
                $user->roles()->update(['is_active' => false]);
                $user->roles()->where('role_type', $targetRole)->update(['is_active' => true]);
            });

            if ($expectsJson) {
                return response()->json([
                    'success' => true,
                    'message' => "Role toggled to '" . ucfirst(str_replace('_', ' ', $targetRole)) . "' successfully.",
                    'redirect_url' => route('profile'),
                ]);
            }

            return redirect()->route('profile')
                ->with('success', "Role toggled to '" . ucfirst(str_replace('_', ' ', $targetRole)) . "' successfully.");
        } catch (\Exception $e) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to toggle role. Please try again.',
                ], 500);
            }
            return redirect()->back()->with('error', 'Failed to toggle role. Please try again.');
        }
    }

    /**
     * Unlock and instantly switch to Employer role.
     */
    public function becomeEmployer()
    {
        $user = Auth::user();

        $expectsJson = request()->expectsJson() || request()->query('format') === 'json' || request()->input('format') === 'json';

        try {
            DB::transaction(function () use ($user) {
                // Find or create Employer role
                $role = UserRole::firstOrCreate(
                    ['user_id' => $user->id, 'role_type' => UserRole::ROLE_EMPLOYER],
                    ['is_active' => false]
                );

                // Set all other roles to inactive
                $user->roles()->update(['is_active' => false]);

                // Set Employer active
                $role->update(['is_active' => true]);
            });

            if ($expectsJson) {
                return response()->json([
                    'success' => true,
                    'message' => 'You are now an Employer! You can post jobs.',
                    'redirect_url' => route('profile'),
                ]);
            }

            return redirect()->route('profile')
                ->with('success', 'You are now an Employer! You can post jobs.');
        } catch (\Exception $e) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to activate Employer profile.',
                ], 500);
            }
            return redirect()->back()->with('error', 'Failed to activate Employer profile.');
        }
    }

    /**
     * Unlock and instantly switch to Agency role.
     */
    public function becomeAgency()
    {
        $user = Auth::user();

        $expectsJson = request()->expectsJson() || request()->query('format') === 'json' || request()->input('format') === 'json';

        try {
            DB::transaction(function () use ($user) {
                // Find or create Agency role
                $role = UserRole::firstOrCreate(
                    ['user_id' => $user->id, 'role_type' => UserRole::ROLE_AGENCY],
                    ['is_active' => false]
                );

                // Set all other roles to inactive
                $user->roles()->update(['is_active' => false]);

                // Set Agency active
                $role->update(['is_active' => true]);
            });

            if ($expectsJson) {
                return response()->json([
                    'success' => true,
                    'message' => 'You are now registered as an Agency profile.',
                    'redirect_url' => route('profile'),
                ]);
            }

            return redirect()->route('profile')
                ->with('success', 'You are now registered as an Agency profile.');
        } catch (\Exception $e) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to activate Agency profile.',
                ], 500);
            }
            return redirect()->back()->with('error', 'Failed to activate Agency profile.');
        }
    }

    /**
     * Unlock and instantly switch to Administrator role.
     */
    public function becomeAdmin()
    {
        $user = Auth::user();

        $expectsJson = request()->expectsJson() || request()->query('format') === 'json' || request()->input('format') === 'json';

        try {
            DB::transaction(function () use ($user) {
                // Find or create Administrator role
                $role = UserRole::firstOrCreate(
                    ['user_id' => $user->id, 'role_type' => UserRole::ROLE_ADMINISTRATOR],
                    ['is_active' => false]
                );

                // Set all other roles to inactive
                $user->roles()->update(['is_active' => false]);

                // Set Admin active
                $role->update(['is_active' => true]);
            });

            if ($expectsJson) {
                return response()->json([
                    'success' => true,
                    'message' => 'You are now an Administrator.',
                    'redirect_url' => route('profile'),
                ]);
            }

            return redirect()->route('profile')
                ->with('success', 'You are now an Administrator.');
        } catch (\Exception $e) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to activate Administrator profile.',
                ], 500);
            }
            return redirect()->back()->with('error', 'Failed to activate Administrator profile.');
        }
    }

    /**
     * Register or update Chef profile. Sets status to 'pending' and registers 'chef' user_role as inactive.
     */
    public function becomeChef(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cuisine_specialty' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'calendly_link' => 'nullable|url|max:255',
            'availability_info' => 'nullable|string',
        ]);

        $expectsJson = $request->expectsJson() || $request->query('format') === 'json' || $request->input('format') === 'json';

        if ($validator->fails()) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $user = Auth::user();

        try {
            DB::transaction(function () use ($user, $request) {
                // 1. Create or update Chef Profile record (always set approval to pending)
                ChefProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'cuisine_specialty' => $request->cuisine_specialty,
                        'bio' => $request->bio,
                        'calendly_link' => $request->calendly_link,
                        'availability_info' => $request->availability_info,
                        'approval_status' => 'pending',
                    ]
                );

                // 2. Create User Role entry for Chef (inactive by default, requires admin approval to switch)
                UserRole::firstOrCreate(
                    ['user_id' => $user->id, 'role_type' => UserRole::ROLE_CHEF],
                    ['is_active' => false]
                );
            });

            if ($expectsJson) {
                return response()->json([
                    'success' => true,
                    'message' => 'Chef profile details submitted successfully! It is now pending administrator review.',
                    'redirect_url' => route('profile'),
                ]);
            }

            return redirect()->route('profile')
                ->with('success', 'Chef profile details submitted successfully! It is now pending administrator review.');
        } catch (\Exception $e) {
            if ($expectsJson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to submit Chef profile.',
                ], 500);
            }
            return redirect()->back()->with('error', 'Failed to submit Chef profile.');
        }
    }
}
