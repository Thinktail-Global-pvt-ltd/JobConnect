<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPostController extends Controller
{
    /**
     * POST /api/jobs
     *
     * Create a new job post.
     *
     * Required fields:
     *   - title         (string)
     *   - category      (india | overseas | community)
     *   - company       (string)
     *   - contact_info  (string)
     *   - description   (string)
     *
     * Optional fields:
     *   - salary, location, company_logo_url, job_type, experience_range
     *   - requirements  (array)
     *   - benefits      (array)
     *   - open_positions(integer)
     *   - showcase_image_url, map_image_url
     *
     * Overseas-specific (required when category = overseas):
     *   - country, visa_assistance, accommodation_available, contract_duration
     *
     * Referral fields (new):
     *   - is_referral        (boolean, default false)
     *     When true the post is treated as a referral submission in the community feed.
     *   - submitted_by_role  (jobseeker | chef | employer | agency)
     *     Saved automatically from the authenticated user's role_type.
     *     Can also be sent explicitly by the client.
     *
     * Rate limit:
     *   Community / referral category posts are limited to 1 per 24 hours per user.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Enforce rate limit: max 1 community/referral post every 24 hours per user
        if ($request->category === 'community' && JobPost::hasExceededDailyLimit($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Rate limit exceeded: You can only submit 1 community or referral job post every 24 hours.',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'title'                  => 'required|string|max:255',
            'category'               => 'required|string|in:india,overseas,community',
            'company'                => 'required|string|max:255',
            'contact_info'           => 'required|string',
            'description'            => 'required|string',

            // Optional generic fields
            'salary'                 => 'nullable|string|max:100',
            'location'               => 'nullable|string|max:255',
            'company_logo_url'       => 'nullable|url',
            'job_type'               => 'nullable|string|in:Full-time,Part-time,Contract,Internship,Freelance',
            'experience_range'       => 'nullable|string|max:100',
            'requirements'           => 'nullable|array',
            'requirements.*'         => 'string|max:255',
            'benefits'               => 'nullable|array',
            'benefits.*'             => 'string|max:255',
            'open_positions'         => 'nullable|integer|min:1',
            'showcase_image_url'     => 'nullable|url',
            'map_image_url'          => 'nullable|url',

            // Overseas-specific fields
            'country'                => 'nullable|required_if:category,overseas|string|max:100',
            'visa_assistance'        => 'nullable|boolean',
            'accommodation_available'=> 'nullable|boolean',
            'contract_duration'      => 'nullable|string|max:100',

            // Referral fields
            'is_referral'            => 'nullable|boolean',
            // Accept both: "job_seeker" (with underscore) and "jobseeker" (without)
            'submitted_by_role'      => 'nullable|string|in:jobseeker,job_seeker,chef,employer,agency',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Auto-detect submitted_by_role from the user's profile if not explicitly sent
        $rawRole = $request->submitted_by_role ?? $user->role_type ?? null;

        // Normalize: "job_seeker" → "jobseeker" for consistent DB storage
        $submittedByRole = $rawRole
            ? str_replace('_', '', strtolower(trim($rawRole)))
            : null;

        // Default status is pending, is_pinned is false
        $jobPost = JobPost::create(array_merge($validator->validated(), [
            'created_by'        => $user->id,
            'status'            => 'pending',
            'is_pinned'         => false,
            'submitted_by_role' => $submittedByRole,
        ]));

        return response()->json([
            'success'  => true,
            'message'  => 'Job post submitted successfully and is pending moderation.',
            'job_post' => $jobPost,
        ], 201);
    }

    /**
     * GET /api/my-jobs
     *
     * Retrieve all job posts / referrals submitted by the authenticated user.
     * Optional filter:
     *   - is_referral  (boolean)  e.g. ?is_referral=true
     *   - status       (pending | approved | rejected)
     */
    public function myJobs(Request $request)
    {
        $user = $request->user();

        $query = JobPost::where('created_by', $user->id);

        if ($request->has('is_referral')) {
            $query->where('is_referral', filter_var($request->is_referral, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $jobs = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'jobs'    => $jobs,
        ]);
    }
}
