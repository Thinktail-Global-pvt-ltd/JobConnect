<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPostController extends Controller
{
    /**
     * Create a new job post.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Enforce rate limit logic: Max 1 community post per day per user
        if ($request->category === 'community' && JobPost::hasExceededDailyLimit($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Rate limit exceeded: You can only submit 1 community or referral job post every 24 hours.',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:india,overseas,community',
            'company' => 'required|string|max:255',
            'contact_info' => 'required|string',
            'description' => 'required|string',
            // Overseas specific fields
            'country' => 'nullable|required_if:category,overseas|string|max:100',
            'visa_assistance' => 'nullable|boolean',
            'accommodation_available' => 'nullable|boolean',
            'contract_duration' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Default status is pending, is_pinned is false
        $jobPost = JobPost::create(array_merge($request->all(), [
            'created_by' => $user->id,
            'status' => 'pending',
            'is_pinned' => false,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Job post submitted successfully and is pending moderation.',
            'job_post' => $jobPost,
        ], 211);
    }
}
