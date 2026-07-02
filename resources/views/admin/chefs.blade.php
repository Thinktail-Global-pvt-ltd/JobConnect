@extends('layouts.admin')

@section('title', 'Chef Screening')
@section('header-title', 'Chef Screening')
@section('header-subtitle', 'Moderate and approve specialist chef portfolios')

@section('content')
<!-- Filter Section -->
<div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
    <form action="{{ url('admin/chefs') }}" method="GET" style="display: flex; gap: 1rem; align-items: center;">
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <label class="form-label" style="margin-bottom: 0;">Approval Status</label>
            <select name="status" class="form-control" style="width: 180px; padding: 0.4rem 0.8rem; font-size: 0.9rem;">
                <option value="">All Statuses</option>
                <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
                <option value="approved" {{ request('status') === 'approved' ? 'selected' : '' }}>Approved</option>
                <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Rejected</option>
            </select>
        </div>

        <div style="display: flex; align-items: flex-end; height: 100%; padding-top: 1.2rem;">
            <button type="submit" class="btn btn-secondary btn-sm" style="padding: 0.55rem 1.25rem;">Filter</button>
            @if(request('status'))
                <a href="{{ url('admin/chefs') }}" class="btn btn-secondary btn-sm" style="margin-left: 0.5rem; padding: 0.55rem 1.25rem;">Reset</a>
            @endif
        </div>
    </form>
</div>

<div class="glass-panel">
    <div class="panel-header">
        <h2>👩‍🍳 Culinary Specialists ({{ $chefs->total() }})</h2>
    </div>

    @if($chefs->isEmpty())
        <p style="color: var(--text-secondary); text-align: center; padding: 2rem 0;">No chef profiles found matching the criteria.</p>
    @else
        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Chef Details</th>
                        <th>Mobile</th>
                        <th>Cuisine Specialty</th>
                        <th>Availability / Bio</th>
                        <th>Calendly Link</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($chefs as $chef)
                        <tr>
                            <td>
                                <strong>{{ $chef->user->full_name ?? 'Unnamed Chef' }}</strong>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">{{ $chef->user->email ?? 'No email linked' }}</div>
                            </td>
                            <td><code>{{ $chef->user->mobile_number }}</code></td>
                            <td><span class="badge badge-category">{{ $chef->cuisine_specialty }}</span></td>
                            <td>
                                <div style="font-size: 0.9rem; max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="{{ $chef->bio }}">
                                    {{ $chef->bio ?? 'No bio details' }}
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                    ⏰ {{ $chef->availability_info ?? 'No availability info' }}
                                </div>
                            </td>
                            <td>
                                @if($chef->calendly_link)
                                    <a href="{{ $chef->calendly_link }}" target="_blank" style="color: var(--accent-blue); text-decoration: none; font-weight: 500;">
                                        Calendly 🔗
                                    </a>
                                @else
                                    <span style="color: var(--text-muted);">Not Linked</span>
                                @endif
                            </td>
                            <td>
                                @if($chef->approval_status === 'approved')
                                    <span class="badge badge-approved">Approved</span>
                                @elseif($chef->approval_status === 'rejected')
                                    <span class="badge badge-rejected">Rejected</span>
                                @else
                                    <span class="badge badge-pending">Pending</span>
                                @endif
                            </td>
                            <td>
                                <div class="action-row" style="gap: 0.5rem;">
                                    @if($chef->approval_status !== 'approved')
                                        <form action="{{ url('admin/chefs/' . $chef->id . '/approve') }}" method="POST" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-success btn-sm">Approve</button>
                                        </form>
                                    @endif

                                    @if($chef->approval_status !== 'rejected')
                                        <form action="{{ url('admin/chefs/' . $chef->id . '/reject') }}" method="POST" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-danger btn-sm">Reject</button>
                                        </form>
                                    @endif

                                    <button type="button" onclick="openAdminAppointmentModal('{{ $chef->user->id }}', '{{ addslashes($chef->user->full_name) }}')" class="btn btn-sm" style="background-color: var(--accent-blue, #3b82f6); color: white; border-color: var(--accent-blue, #3b82f6); padding: 0.35rem 0.85rem;">
                                        Schedule
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div style="margin-top: 2rem;">
            {{ $chefs->appends(request()->query())->links() }}
        </div>
    @endif
</div>

<!-- Schedule Appointment Modal -->
<div id="admin-schedule-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
    <div class="glass-panel" style="width: 100%; max-width: 500px; padding: 2rem; margin: 1rem; position: relative; border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; background: var(--bg-secondary, #151f32);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.75rem;">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-primary, #ffffff); font-family: 'Outfit', sans-serif; font-weight: 700;">
                📅 Schedule Chef Connect Appointment
            </h3>
            <button type="button" onclick="closeAdminAppointmentModal()" style="background: none; border: none; color: var(--text-secondary, #94a3b8); cursor: pointer; font-size: 1.5rem; font-weight: 700; line-height: 1;">
                &times;
            </button>
        </div>

        <!-- Form -->
        <form action="{{ url('admin/chefs/schedule-appointment') }}" method="POST" style="display: flex; flex-direction: column; gap: 1.25rem;">
            @csrf
            
            <input type="hidden" name="chef_id" id="modal-chef-id">
            
            <!-- Chef Name display (read-only) -->
            <div style="display: flex; flex-direction: column; gap: 0.25rem; text-align: left;">
                <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary, #94a3b8); text-align: left;">Chef Profile</label>
                <input type="text" id="modal-chef-name" readonly class="form-control" style="background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); color: var(--text-secondary); cursor: not-allowed; padding: 0.5rem 0.75rem; font-size: 0.9rem;">
            </div>

            <!-- Employer Dropdown -->
            <div style="display: flex; flex-direction: column; gap: 0.25rem; text-align: left;">
                <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary, #94a3b8); text-align: left;">Select Employer *</label>
                <select name="employer_id" required class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.9rem; background: var(--bg-primary, #0c1424); border-color: rgba(255,255,255,0.05); color: var(--text-primary, #ffffff);">
                    <option value="" style="background: var(--bg-primary);">-- Select an Employer --</option>
                    @foreach($employers as $emp)
                        <option value="{{ $emp->id }}" style="background: var(--bg-primary);">
                            {{ $emp->full_name }} ({{ $emp->mobile_number ?? 'No Mobile' }})
                        </option>
                    @endforeach
                </select>
            </div>

            <!-- Date and Time Inputs -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 0.25rem; text-align: left;">
                    <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary, #94a3b8); text-align: left;">Meeting Date *</label>
                    <input type="text" name="meeting_date" placeholder="e.g. Monday, Oct 23" required class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.9rem; background: var(--bg-primary, #0c1424); border-color: rgba(255,255,255,0.05); color: var(--text-primary, #ffffff);">
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.25rem; text-align: left;">
                    <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary, #94a3b8); text-align: left;">Meeting Time *</label>
                    <input type="text" name="meeting_time" placeholder="e.g. 10:00 AM" required class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.9rem; background: var(--bg-primary, #0c1424); border-color: rgba(255,255,255,0.05); color: var(--text-primary, #ffffff);">
                </div>
            </div>

            <!-- Meeting Purpose -->
            <div style="display: flex; flex-direction: column; gap: 0.25rem; text-align: left;">
                <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary, #94a3b8); text-align: left;">Meeting Agenda / Purpose (Optional)</label>
                <textarea name="purpose" placeholder="Describe the purpose of this call..." class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.9rem; min-height: 80px; resize: vertical; background: var(--bg-primary, #0c1424); border-color: rgba(255,255,255,0.05); color: var(--text-primary, #ffffff);"></textarea>
            </div>

            <!-- Footer Actions -->
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; margin-top: 0.5rem;">
                <button type="button" onclick="closeAdminAppointmentModal()" class="btn btn-secondary btn-sm" style="padding: 0.55rem 1.25rem;">Cancel</button>
                <button type="submit" class="btn btn-sm" style="padding: 0.55rem 1.25rem; background-color: var(--accent-blue, #3b82f6); border-color: var(--accent-blue, #3b82f6); color: white;">
                    Create Appointment
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function openAdminAppointmentModal(chefId, chefName) {
    document.getElementById('modal-chef-id').value = chefId;
    document.getElementById('modal-chef-name').value = chefName;
    document.getElementById('admin-schedule-modal').style.display = 'flex';
}

function closeAdminAppointmentModal() {
    document.getElementById('admin-schedule-modal').style.display = 'none';
}

// Close on clicking overlay
document.getElementById('admin-schedule-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAdminAppointmentModal();
    }
});
</script>
@endsection
