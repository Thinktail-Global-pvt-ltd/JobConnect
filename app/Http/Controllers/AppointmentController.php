<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Book a new consultation appointment with a chef.
     */
    public function book(Request $request)
    {
        try {
            $validated = $request->validate([
                'chef_id' => 'required|exists:users,id',
                'meeting_date' => 'required|string',
                'meeting_time' => 'required|string',
                'purpose' => 'nullable|string|max:1000',
            ]);

            $employer = Auth::user();
            if (!$employer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            // Create the appointment
            $appointment = Appointment::create([
                'chef_id' => $validated['chef_id'],
                'employer_id' => $employer->id,
                'meeting_date' => $validated['meeting_date'],
                'meeting_time' => $validated['meeting_time'],
                'purpose' => $validated['purpose'] ?? '',
                'status' => 'confirmed',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully!',
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to book appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get JSON list of received appointments for the logged-in Chef.
     */
    public function chefAppointmentsList()
    {
        try {
            $chef = Auth::user();
            if (!$chef) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            // Load received appointments with employer profile info
            $appointments = Appointment::where('chef_id', $chef->id)
                ->with(['employer'])
                ->latest()
                ->get()
                ->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'employer_name' => $app->employer ? $app->employer->full_name : 'Anonymous Employer',
                        'employer_phone' => $app->employer ? $app->employer->mobile_number : 'N/A',
                        'employer_email' => $app->employer ? $app->employer->email : 'N/A',
                        'meeting_date' => $app->meeting_date,
                        'meeting_time' => $app->meeting_time,
                        'purpose' => $app->purpose ?: 'No agenda specified.',
                        'status' => $app->status,
                        'created_at' => $app->created_at ? $app->created_at->format('d M Y') : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load appointments: ' . $e->getMessage()
            ], 500);
        }
    }
}
