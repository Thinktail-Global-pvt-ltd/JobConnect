<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserSocial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserSocialController extends Controller
{
    /**
     * GET /api/user/socials
     *
     * Fetch the socials details of the currently authenticated user.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        // Get or initialize socials record
        $socials = $user->socials ?? UserSocial::firstOrCreate(['user_id' => $user->id]);

        $others = [];
        if ($socials->others) {
            $others = is_array($socials->others) ? $socials->others : (json_decode($socials->others, true) ?: []);
        }

        return response()->json([
            'success' => true,
            'socials' => [
                'linkedin'  => $socials->linkedin ?: '',
                'instagram' => $socials->instagram ?: '',
                'facebook'  => $socials->facebook ?: '',
                'twitter'   => $socials->twitter ?: '',
                'youtube'   => $socials->youtube ?: '',
                'website'   => $socials->website ?: '',
                'github'    => $socials->github ?: '',
                'others'    => $others,
            ]
        ]);
    }

    /**
     * POST /api/user/socials
     *
     * Create or update the socials details of the currently authenticated user.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'linkedin'  => 'nullable|string|url|max:255',
            'instagram' => 'nullable|string|url|max:255',
            'facebook'  => 'nullable|string|url|max:255',
            'twitter'   => 'nullable|string|url|max:255',
            'youtube'   => 'nullable|string|url|max:255',
            'website'   => 'nullable|string|url|max:255',
            'github'    => 'nullable|string|url|max:255',
            'others'    => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        if (isset($validated['others']) && is_array($validated['others'])) {
            $validated['others'] = json_encode($validated['others']);
        }

        // Get or create socials record
        $socials = UserSocial::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        $others = [];
        if ($socials->others) {
            $others = is_array($socials->others) ? $socials->others : (json_decode($socials->others, true) ?: []);
        }

        return response()->json([
            'success' => true,
            'message' => 'Social profile links saved successfully.',
            'socials' => [
                'linkedin'  => $socials->linkedin ?: '',
                'instagram' => $socials->instagram ?: '',
                'facebook'  => $socials->facebook ?: '',
                'twitter'   => $socials->twitter ?: '',
                'youtube'   => $socials->youtube ?: '',
                'website'   => $socials->website ?: '',
                'github'    => $socials->github ?: '',
                'others'    => $others,
            ]
        ]);
    }
}
