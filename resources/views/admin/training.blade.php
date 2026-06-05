@extends('layouts.admin')

@section('title', 'Training Programs')
@section('header-title', 'Training Opportunities')
@section('header-subtitle', 'Manage global hospitality training opportunities')

@section('content')
<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
    
    <!-- Left Panel: Lists -->
    <div class="glass-panel" style="margin-bottom: 0;">
        <div class="panel-header">
            <h2>📚 Active Programs ({{ $programs->total() }})</h2>
        </div>

        @if($programs->isEmpty())
            <p style="color: var(--text-secondary); text-align: center; padding: 3rem 0;">No active training opportunities created yet.</p>
        @else
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Program Name</th>
                            <th>Provider</th>
                            <th>Contact / Info</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($programs as $program)
                            <tr>
                                <td>
                                    <strong>{{ $program->program_name }}</strong>
                                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                        {{ $program->description }}
                                    </div>
                                </td>
                                <td><span class="badge badge-category">{{ $program->provider_name }}</span></td>
                                <td>
                                    <div style="font-size: 0.85rem;">{{ $program->contact_information }}</div>
                                    @if($program->external_link)
                                        <a href="{{ $program->external_link }}" target="_blank" style="color: var(--accent-blue); text-decoration: none; font-size: 0.8rem; display: inline-block; margin-top: 0.25rem;">
                                            External Link 🔗
                                        </a>
                                    @endif
                                </td>
                                <td>
                                    <div class="action-row">
                                        <!-- Javascript filled simple inline triggers for editing -->
                                        <button onclick="fillEditForm({{ json_encode($program) }})" class="btn btn-secondary btn-sm">Edit</button>
                                        
                                        <form action="{{ url('admin/training/' . $program->id) }}" method="POST" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this program?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 2rem;">
                {{ $programs->links() }}
            </div>
        @endif
    </div>

    <!-- Right Panel: Add / Edit Glass Form -->
    <div class="glass-panel" id="form-panel" style="margin-bottom: 0; position: sticky; top: 2rem;">
        <div class="panel-header">
            <h2 id="form-title">➕ Add New Program</h2>
            <button id="cancel-edit-btn" onclick="resetForm()" class="btn btn-secondary btn-sm" style="display: none; padding: 0.25rem 0.5rem; font-size: 0.75rem;">Cancel</button>
        </div>

        <form id="opportunity-form" action="{{ url('admin/training') }}" method="POST">
            @csrf
            <div id="method-field"></div>
            
            <div class="form-group">
                <label class="form-label">Program Title</label>
                <input type="text" name="program_name" id="field_program_name" class="form-control" placeholder="e.g. Master Food & Beverage Management" required value="{{ old('program_name') }}">
                @error('program_name') <span style="color: var(--accent-red); font-size: 0.8rem;">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label class="form-label">Provider Name</label>
                <input type="text" name="provider_name" id="field_provider_name" class="form-control" placeholder="e.g. Swiss Culinary Institute" required value="{{ old('provider_name') }}">
                @error('provider_name') <span style="color: var(--accent-red); font-size: 0.8rem;">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea name="description" id="field_description" class="form-control" placeholder="Describe curriculum details..." required>{{ old('description') }}</textarea>
                @error('description') <span style="color: var(--accent-red); font-size: 0.8rem;">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label class="form-label">Contact Information</label>
                <input type="text" name="contact_information" id="field_contact_information" class="form-control" placeholder="e.g. Email / Phone..." required value="{{ old('contact_information') }}">
                @error('contact_information') <span style="color: var(--accent-red); font-size: 0.8rem;">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label class="form-label">External Registration Link (Optional)</label>
                <input type="url" name="external_link" id="field_external_link" class="form-control" placeholder="https://example.com/apply" value="{{ old('external_link') }}">
                @error('external_link') <span style="color: var(--accent-red); font-size: 0.8rem;">{{ $message }}</span> @enderror
            </div>

            <div style="margin-top: 2rem;">
                <button type="submit" id="submit-btn" class="btn btn-primary" style="width: 100%; justify-content: center;">Create Opportunity</button>
            </div>
        </form>
    </div>

</div>

<!-- Client side interaction code for switching add/edit states without complex routing -->
<script>
    function fillEditForm(program) {
        // Change Form Action URL
        document.getElementById('opportunity-form').action = "{{ url('admin/training') }}/" + program.id;
        
        // Add PUT Method
        document.getElementById('method-field').innerHTML = '<input type="hidden" name="_method" value="PUT">';
        
        // Change Titles & Buttons
        document.getElementById('form-title').innerText = "✏️ Edit Program";
        document.getElementById('submit-btn').innerText = "Save Changes";
        document.getElementById('cancel-edit-btn').style.display = "block";
        
        // Fill Field Values
        document.getElementById('field_program_name').value = program.program_name;
        document.getElementById('field_provider_name').value = program.provider_name;
        document.getElementById('field_description').value = program.description;
        document.getElementById('field_contact_information').value = program.contact_information;
        document.getElementById('field_external_link').value = program.external_link || '';
        
        // Scroll to form view smoothly
        document.getElementById('form-panel').scrollIntoView({ behavior: 'smooth' });
    }

    function resetForm() {
        // Restore standard Form Action
        document.getElementById('opportunity-form').action = "{{ url('admin/training') }}";
        
        // Remove PUT Method
        document.getElementById('method-field').innerHTML = '';
        
        // Restore Titles & Buttons
        document.getElementById('form-title').innerText = "➕ Add New Program";
        document.getElementById('submit-btn').innerText = "Create Opportunity";
        document.getElementById('cancel-edit-btn').style.display = "none";
        
        // Reset Inputs
        document.getElementById('opportunity-form').reset();
    }
</script>
@endsection
