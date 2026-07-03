<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    /**
     * GET /admin/referrals
     *
     * Returns all job posts where is_referral = true,
     * with the submitter's user profile attached.
     *
     * Query params:
     *  - status  : pending | approved | rejected (optional filter)
     *  - search  : searches title, company, location (optional)
     */
    public function index(Request $request)
    {
        $query = JobPost::with('creator')
            ->where('is_referral', true);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search filter
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($q2) use ($q) {
                $q2->where('title',    'like', "%{$q}%")
                   ->orWhere('company', 'like', "%{$q}%")
                   ->orWhere('location','like', "%{$q}%");
            });
        }

        $referrals = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success'   => true,
            'referrals' => $referrals,
            'stats'     => [
                'total'    => JobPost::where('is_referral', true)->count(),
                'pending'  => JobPost::where('is_referral', true)->where('status', 'pending')->count(),
                'approved' => JobPost::where('is_referral', true)->where('status', 'approved')->count(),
                'rejected' => JobPost::where('is_referral', true)->where('status', 'rejected')->count(),
            ],
        ]);
    }

    /**
     * POST /admin/referrals/{id}/approve
     */
    public function approve($id)
    {
        $referral = JobPost::where('is_referral', true)->findOrFail($id);
        $referral->update(['status' => 'approved']);

        return response()->json(['success' => true, 'message' => 'Referral approved.']);
    }

    /**
     * POST /admin/referrals/{id}/reject
     */
    public function reject($id)
    {
        $referral = JobPost::where('is_referral', true)->findOrFail($id);
        $referral->update(['status' => 'rejected']);

        return response()->json(['success' => true, 'message' => 'Referral rejected.']);
    }

    /**
     * DELETE /admin/referrals/{id}
     */
    public function destroy($id)
    {
        $referral = JobPost::where('is_referral', true)->findOrFail($id);
        $referral->delete();

        return response()->json(['success' => true, 'message' => 'Referral deleted.']);
    }
}
