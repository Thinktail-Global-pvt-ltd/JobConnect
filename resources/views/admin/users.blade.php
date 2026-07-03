@extends('layouts.admin')

@section('title', 'User Accounts')
@section('header-title', 'User Accounts')
@section('header-subtitle', 'Manage registered users and active profiles')

@section('content')
<div class="glass-panel">
    <div class="panel-header">
        <h2>👥 Platform Users ({{ $users->total() }})</h2>
        
        <!-- Search bar -->
        <form action="{{ url('admin/users') }}" method="GET" style="display: flex; gap: 0.5rem;">
            <input type="text" name="search" placeholder="Search by name, phone..." value="{{ request('search') }}" class="form-control" style="width: 250px; padding: 0.5rem 1rem;">
            <button type="submit" class="btn btn-secondary btn-sm">Search</button>
            @if(request('search'))
                <a href="{{ url('admin/users') }}" class="btn btn-secondary btn-sm">Clear</a>
            @endif
        </form>
    </div>

    @if($users->isEmpty())
        <p style="color: var(--text-secondary); text-align: center; padding: 2rem 0;">No registered users found matching the criteria.</p>
    @else
        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Details</th>
                        <th>Mobile</th>
                        <th>Registered Roles</th>
                        <th>Activity Stats</th>
                        <th>Profile Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $user)
                        <tr>
                            <td>
                                <strong>{{ $user->full_name ?? 'Not Provided' }}</strong>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">{{ $user->email ?? 'No email linked' }}</div>
                            </td>
                            <td><code>{{ $user->mobile_number }}</code></td>
                            <!-- Registered Roles -->
                            <td>
                                <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                                    @if($user->roles->isEmpty())
                                        <span style="color: var(--text-muted); font-size: 0.8rem;">None</span>
                                    @else
                                        @foreach($user->roles as $role)
                                            @php
                                                $isActive = $role->is_active;
                                                $roleLabel = ucfirst(str_replace('_', ' ', $role->role_type));
                                                $bg = $isActive ? 'rgba(22, 163, 74, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                                                $color = $isActive ? '#16a34a' : 'var(--text-secondary)';
                                                $border = $isActive ? '1px solid rgba(22, 163, 74, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)';
                                            @endphp
                                            <span class="badge" style="background: {{ $bg }}; color: {{ $color }}; border: {{ $border }}; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;">
                                                {{ $roleLabel }} @if($isActive) (Active) @endif
                                            </span>
                                        @endforeach
                                    @endif
                                </div>
                            </td>
                            <!-- Stats (Posted / Applied) -->
                            <td>
                                <div style="font-size: 0.8rem;">
                                    <div style="font-weight: 600; display: flex; align-items: center; gap: 6px;">
                                        <span style="color: var(--text-secondary);">Posted:</span> 
                                        <button type="button" onclick="showPostedJobs('{{ $user->id }}', '{{ addslashes($user->full_name ?? 'Not Provided') }}')" 
                                                class="badge-btn hover-scale"
                                                style="background: rgba(147, 51, 234, 0.1); color: #a855f7; border: 1px solid rgba(147, 51, 234, 0.2); font-weight: 700; padding: 1px 6px; border-radius: 4px; cursor: pointer; transition: all 0.2s;">
                                            {{ $user->job_posts_count }} 🔍
                                        </button>
                                    </div>
                                    <div style="font-weight: 600; display: flex; align-items: center; gap: 6px; margin-top: 6px;">
                                        <span style="color: var(--text-secondary);">Applied:</span> 
                                        <button type="button" onclick="showAppliedJobs('{{ $user->id }}', '{{ addslashes($user->full_name ?? 'Not Provided') }}')" 
                                                class="badge-btn hover-scale"
                                                style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); font-weight: 700; padding: 1px 6px; border-radius: 4px; cursor: pointer; transition: all 0.2s;">
                                            {{ $user->applications_count }} 🔍
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="flex: 1; background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden; max-width: 100px;">
                                        <div style="background: var(--accent-gradient); width: {{ $user->profile_completeness }}%; height: 100%;"></div>
                                    </div>
                                    <span style="font-size: 0.8rem; font-weight: 600;">{{ $user->profile_completeness }}%</span>
                                </div>
                            </td>
                            <td>
                                @if($user->is_suspended)
                                    <span class="badge badge-suspended">Suspended</span>
                                @else
                                    <span class="badge badge-active">Active</span>
                                @endif
                            </td>
                            <td>
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    @if($user->is_suspended)
                                        <form action="{{ url('admin/users/' . $user->id . '/activate') }}" method="POST" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-success btn-sm">Activate</button>
                                        </form>
                                    @else
                                        <form action="{{ url('admin/users/' . $user->id . '/suspend') }}" method="POST" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-danger btn-sm">Suspend</button>
                                        </form>
                                    @endif

                                    <form action="{{ url('admin/users/' . $user->id) }}" method="POST" style="display:inline;" onsubmit="return confirm('Are you sure you want to permanently delete this user ({{ $user->full_name ?? $user->mobile_number }}) and all their associated data? This action cannot be undone.');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm" style="background: var(--accent-red); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);">Hard Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Standard pagination links wrapper -->
        <div style="margin-top: 2rem;">
            {{ $users->appends(request()->query())->links() }}
        </div>
    @endif
</div>

<!-- Admin Stats Modal -->
<div id="stats-detail-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; display: none; align-items: center; justify-content: center; padding: 1rem;">
    <div style="background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; width: 100%; max-width: 500px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        <!-- Header -->
        <div style="padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02);">
            <h3 id="modal-title" style="margin: 0; font-size: 1rem; font-weight: 700; color: #fff;">Jobs List</h3>
            <button type="button" onclick="closeStatsModal()" style="background: none; border: none; color: #aaa; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; padding: 4px; line-height: 1;">
                ✕
            </button>
        </div>
        <!-- Body -->
        <div id="modal-body" style="padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
            <!-- Dynamic items -->
        </div>
    </div>
</div>

<script>
function closeStatsModal() {
    document.getElementById('stats-detail-modal').style.display = 'none';
}

// Close modal when clicking outside content area
document.getElementById('stats-detail-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeStatsModal();
    }
});

async function showPostedJobs(userId, userName) {
    const modal = document.getElementById('stats-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = `Jobs Posted by Chef ${userName}`;
    modalBody.innerHTML = '<p style="color: #aaa; font-size: 0.85rem; text-align: center; padding: 1rem;">Loading job posts...</p>';
    modal.style.display = 'flex';

    try {
        const response = await fetch(`{{ url('/') }}/admin/users/${userId}/posted-jobs`, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        
        if (data.success && data.jobs.length > 0) {
            modalBody.innerHTML = '';
            data.jobs.forEach(job => {
                const item = document.createElement('div');
                item.style.cssText = 'padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; text-align: left;';
                
                let appsHtml = '';
                let actualAppCount = 0;
                
                if (job.applications && job.applications.length > 0) {
                    job.applications.forEach(app => {
                        // Skip if applicant doesn't exist OR has no name (is 'null' or empty)
                        if (!app.applicant || !app.applicant.full_name || app.applicant.full_name.toLowerCase() === 'null' || app.applicant.full_name.trim() === '') {
                            return;
                        }
                        
                        actualAppCount++;
                        const applicantName = app.applicant.full_name;
                        const applicantPhone = app.applicant.mobile_number || 'N/A';
                        const applicantEmail = app.applicant.email || 'N/A';
                        
                        let statusColor = '#3b82f6';
                        let statusBg = 'rgba(59, 130, 246, 0.15)';
                        if (app.status === 'shortlisted') { statusColor = '#10b981'; statusBg = 'rgba(16, 185, 129, 0.15)'; }
                        else if (app.status === 'rejected') { statusColor = '#ef4444'; statusBg = 'rgba(239, 68, 68, 0.15)'; }
                        
                        appsHtml += `
                            <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 8px; display: flex; justify-content: space-between; align-items: start; margin-top: 4px;">
                                <div style="font-size: 0.75rem;">
                                    <div style="font-weight: 750; color: #eee;">${applicantName}</div>
                                    <div style="color: #888; font-size: 0.7rem; margin-top: 2px;">
                                        📞 <a href="tel:${applicantPhone}" style="color: #3b82f6; text-decoration: underline;">${applicantPhone}</a>
                                    </div>
                                    <div style="color: #666; font-size: 0.65rem; margin-top: 1px;">📧 ${applicantEmail}</div>
                                </div>
                                <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; background: ${statusBg}; color: ${statusColor}; padding: 1px 4px; border-radius: 4px; margin-top: 2px;">
                                    ${app.status}
                                </span>
                            </div>
                        `;
                    });
                }
                
                item.innerHTML = `
                    <div style="font-weight: 700; color: #fff; font-size: 0.85rem;">${job.title}</div>
                    <div style="color: #aaa; font-size: 0.75rem; margin-top: 4px;">📍 ${job.location} • 💼 ${job.job_type || 'Full-time'}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <span style="color: #16a34a; font-weight: 700; font-size: 0.75rem;">${job.salary || 'Salary Disclosed'}</span>
                        <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; background: ${job.status === 'approved' ? 'rgba(22, 163, 74, 0.15)' : 'rgba(234, 179, 8, 0.15)'}; color: ${job.status === 'approved' ? '#22c55e' : '#eab308'}; padding: 2px 6px; border-radius: 4px;">
                            ${job.status}
                        </span>
                    </div>
                    
                    <div style="margin-top: 10px; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px;">
                        ${actualAppCount > 0 ? `
                            <button type="button" onclick="const list = this.nextElementSibling; list.style.display = list.style.display === 'none' ? 'flex' : 'none';" 
                                    style="background: rgba(22, 163, 74, 0.1); color: #16a34a; border: 1px solid rgba(22, 163, 74, 0.2); font-size: 0.7rem; font-weight: bold; padding: 2px 8px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s;">
                                View Applicants (${actualAppCount}) 👇
                            </button>
                            <div style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
                                ${appsHtml}
                            </div>
                        ` : `
                            <span style="font-size: 0.7rem; color: #666; font-weight: bold; padding: 2px 0;">0 Applicants</span>
                        `}
                    </div>
                `;
                modalBody.appendChild(item);
            });
        } else {
            modalBody.innerHTML = '<p style="color: #aaa; font-size: 0.85rem; text-align: center; padding: 1rem;">This user has not posted any jobs yet.</p>';
        }
    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<p style="color: #ef4444; font-size: 0.85rem; text-align: center; padding: 1rem;">Failed to load jobs list.</p>';
    }
}

async function showAppliedJobs(userId, userName) {
    const modal = document.getElementById('stats-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = `Jobs Applied by ${userName}`;
    modalBody.innerHTML = '<p style="color: #aaa; font-size: 0.85rem; text-align: center; padding: 1rem;">Loading applications...</p>';
    modal.style.display = 'flex';

    try {
        const response = await fetch(`{{ url('/') }}/admin/users/${userId}/applied-jobs`, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        
        if (data.success && data.applications.length > 0) {
            modalBody.innerHTML = '';
            data.applications.forEach(app => {
                const job = app.job_post;
                if (!job) return;
                
                const item = document.createElement('div');
                item.style.cssText = 'padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; text-align: left;';
                
                let statusColor = '#3b82f6';
                let statusBg = 'rgba(59, 130, 246, 0.15)';
                if (app.status === 'shortlisted') { statusColor = '#10b981'; statusBg = 'rgba(16, 185, 129, 0.15)'; }
                else if (app.status === 'rejected') { statusColor = '#ef4444'; statusBg = 'rgba(239, 68, 68, 0.15)'; }
                
                item.innerHTML = `
                    <div style="font-weight: 700; color: #fff; font-size: 0.85rem;">${job.title}</div>
                    <div style="color: #aaa; font-size: 0.75rem; margin-top: 4px;">📍 ${job.location} • 💼 ${job.company || 'Direct Hire'}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.7rem;">
                        <span style="color: var(--text-secondary);">Applied: ${app.applied_at}</span>
                        <span style="font-weight: 800; text-transform: uppercase; background: ${statusBg}; color: ${statusColor}; padding: 2px 6px; border-radius: 4px;">
                            ${app.status}
                        </span>
                    </div>
                `;
                modalBody.appendChild(item);
            });
        } else {
            modalBody.innerHTML = '<p style="color: #aaa; font-size: 0.85rem; text-align: center; padding: 1rem;">This user has not applied to any jobs yet.</p>';
        }
    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<p style="color: #ef4444; font-size: 0.85rem; text-align: center; padding: 1rem;">Failed to load applications list.</p>';
    }
}
</script>

<style>
.hover-scale:hover {
    transform: scale(1.06);
    filter: brightness(1.1);
}
</style>
@endsection
