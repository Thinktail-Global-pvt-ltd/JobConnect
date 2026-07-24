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

        // Fetch dynamic stats for dashboard cards
        $pendingCount = ChefProfile::where('approval_status', 'pending')->count();
        $approvedCount = ChefProfile::where('approval_status', 'approved')->count();
        $totalChefs = ChefProfile::count();
        $calendlyLinkedCount = ChefProfile::whereNotNull('calendly_link')->where('calendly_link', '!=', '')->count();
        $calendlySyncPercentage = $totalChefs > 0 ? round(($calendlyLinkedCount / $totalChefs) * 100) : 0;

        // Fetch all employers for coordination appointments
        $employers = \App\Models\User::whereHas('roles', function($q) {
            $q->where('role_type', 'employer');
        })->orderBy('full_name', 'asc')->get();

        return view('admin.chefs', compact('chefs', 'employers', 'pendingCount', 'approvedCount', 'totalChefs', 'calendlySyncPercentage'));
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

    /**
     * Schedule an appointment between a chef and an employer.
     */
    public function scheduleAppointment(Request $request)
    {
        $validated = $request->validate([
            'chef_id' => 'required|exists:users,id',
            'employer_id' => 'required|exists:users,id',
            'meeting_date' => 'required|string',
            'meeting_time' => 'required|string',
            'purpose' => 'nullable|string|max:1000',
        ]);

        \App\Models\Appointment::create([
            'chef_id' => $validated['chef_id'],
            'employer_id' => $validated['employer_id'],
            'meeting_date' => $validated['meeting_date'],
            'meeting_time' => $validated['meeting_time'],
            'purpose' => $validated['purpose'] ?? 'Coordinated by Administrator',
            'status' => 'confirmed',
        ]);

        return redirect()->back()->with('success', "Appointment scheduled successfully.");
    }
}
