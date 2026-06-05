<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use Illuminate\Http\Request;

class ChefModeratorController extends Controller
{
    /**
     * List all chef profiles.
     */
    public function index(Request $request)
    {
        $query = ChefProfile::with('user');

        // Optional filter by status
        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('approval_status', $request->status);
        }

        $chefs = $query->latest()->paginate(15);

        return view('admin.chefs', compact('chefs'));
    }

    /**
     * Approve a chef profile.
     */
    public function approve(ChefProfile $chef)
    {
        $chef->update(['approval_status' => 'approved']);

        return redirect()->back()->with('success', "Chef profile for {$chef->user->full_name} has been approved successfully.");
    }

    /**
     * Reject a chef profile.
     */
    public function reject(ChefProfile $chef)
    {
        $chef->update(['approval_status' => 'rejected']);

        return redirect()->back()->with('success', "Chef profile for {$chef->user->full_name} has been rejected.");
    }
}
