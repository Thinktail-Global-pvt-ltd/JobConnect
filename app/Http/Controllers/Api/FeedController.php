<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    /**
     * Unified, Single Feed sorting: Display approved content ordered with is_pinned items first, then newest records chronologically (created_at).
     */
    public function index(Request $request)
    {
        $query = JobPost::approved();

        // Optional filter by category
        if ($request->has('category') && in_null($request->category) === false) {
            $category = $request->category;
            if (in_array($category, ['india', 'overseas', 'community'])) {
                $query->where('category', $category);
            }
        }

        // Apply Feed ordering
        $feedItems = $query->sortedFeed()
                           ->paginate(15);

        $user = $request->user();
        $appliedJobIds = [];
        if ($user) {
            $appliedJobIds = \App\Models\JobApplication::where('applicant_id', $user->id)
                ->pluck('job_post_id')
                ->toArray();
        }

        $feedItems->getCollection()->transform(function ($job) use ($appliedJobIds) {
            $job->applied = in_array($job->id, $appliedJobIds);
            return $job;
        });

        return response()->json([
            'success' => true,
            'feed' => $feedItems,
        ]);
    }
}

// Inline helper for safety
function in_null($val) {
    return $val === null || $val === 'null' || $val === '';
}
