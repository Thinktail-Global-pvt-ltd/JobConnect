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
                                <div class="action-row">
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
@endsection
