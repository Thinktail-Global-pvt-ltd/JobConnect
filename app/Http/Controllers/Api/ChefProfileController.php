<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChefProfileController extends Controller
{
    /**
     * Create or update specialized Chef Profile.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'cuisine_specialty' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'calendly_link' => 'nullable|url|max:255',
            'availability_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update if existing, create if new
        $chefProfile = ChefProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'cuisine_specialty' => $request->cuisine_specialty,
                'bio' => $request->bio,
                'calendly_link' => $request->calendly_link,
                'availability_info' => $request->availability_info,
                'approval_status' => 'pending', // reset/set to pending on submission for admin review
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Chef profile submitted successfully and is pending administrative approval.',
            'chef_profile' => $chefProfile,
        ], 211);
    }
}
