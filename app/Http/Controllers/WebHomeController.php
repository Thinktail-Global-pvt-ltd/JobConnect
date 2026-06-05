<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\TrainingOpportunity;
use Illuminate\Http\Request;

class WebHomeController extends Controller
{
    /**
     * Display the dynamic Home Feed.
     */
    public function index(Request $request)
    {
        if (!\Illuminate\Support\Facades\Auth::check()) {
            return view('landing');
        }

        $filter = $request->query('category', 'all');

        $jobs = collect();
        $trainings = collect();

        // 1. Query Job Posts based on filter
        if (in_array($filter, ['all', 'india', 'overseas', 'community'])) {
            $jobsQuery = JobPost::approved()->with('creator');
            if ($filter !== 'all') {
                $jobsQuery->where('category', $filter);
            }
            $jobs = $jobsQuery->get();
        }

        // 2. Query Training Opportunities based on filter
        if (in_array($filter, ['all', 'training'])) {
            $trainings = TrainingOpportunity::all();
        }

        // 3. Merge and Sort
        // Sorting logic: Pinned items at the top, then remaining items by created_at desc
        $feedItems = $jobs->concat($trainings)->sort(function ($a, $b) {
            $aPinned = ($a instanceof JobPost) && $a->is_pinned;
            $bPinned = ($b instanceof JobPost) && $b->is_pinned;

            if ($aPinned && !$bPinned) {
                return -1;
            }
            if (!$aPinned && $bPinned) {
                return 1;
            }

            // Fallback: newest first
            $aTime = $a->created_at ? $a->created_at->timestamp : 0;
            $bTime = $b->created_at ? $b->created_at->timestamp : 0;
            return $bTime <=> $aTime;
        })->values();

        return view('home', compact('feedItems', 'filter'));
    }
}
