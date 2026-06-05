<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingOpportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TrainingController extends Controller
{
    /**
     * List all training opportunities.
     */
    public function index()
    {
        $programs = TrainingOpportunity::latest()->paginate(15);
        return view('admin.training', compact('programs'));
    }

    /**
     * Store a newly created training opportunity.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'program_name' => 'required|string|max:255',
            'provider_name' => 'required|string|max:255',
            'description' => 'required|string',
            'contact_information' => 'required|string',
            'external_link' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        TrainingOpportunity::create($request->all());

        return redirect()->back()->with('success', "Training opportunity '{$request->program_name}' has been created successfully.");
    }

    /**
     * Update an existing training opportunity.
     */
    public function update(Request $request, TrainingOpportunity $program)
    {
        $validator = Validator::make($request->all(), [
            'program_name' => 'required|string|max:255',
            'provider_name' => 'required|string|max:255',
            'description' => 'required|string',
            'contact_information' => 'required|string',
            'external_link' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $program->update($request->all());

        return redirect()->back()->with('success', "Training opportunity '{$request->program_name}' has been updated successfully.");
    }

    /**
     * Delete an existing training opportunity.
     */
    public function destroy(TrainingOpportunity $program)
    {
        $name = $program->program_name;
        $program->delete();

        return redirect()->back()->with('success', "Training opportunity '{$name}' has been deleted.");
    }
}
