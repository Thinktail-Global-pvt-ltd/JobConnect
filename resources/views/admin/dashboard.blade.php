@extends('layouts.admin')

@section('title', 'Platform Overview')
@section('header-title', 'Overview & Performance')
@section('header-subtitle', 'Real-time indicators across the JobConnect platform')

@section('content')
<!-- Stats Counter Cards -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-value">{{ $stats['users_count'] }}</div>
        <div class="stat-label">Total Users</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
            Active: {{ $stats['users_active'] }} | Suspended: {{ $stats['users_suspended'] }}
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-value">{{ $stats['jobs_total'] }}</div>
        <div class="stat-label">Job Postings</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
            Approved: {{ $stats['jobs_approved'] }} | Pending: {{ $stats['jobs_pending'] }}
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-value">{{ $stats['chefs_total'] }}</div>
        <div class="stat-label">Specialist Chefs</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
            Approved: {{ $stats['chefs_approved'] }} | Pending: {{ $stats['chefs_pending'] }}
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-value">{{ $stats['training_opportunities'] }}</div>
        <div class="stat-label">Training Programs</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
            Active Opportunities Listed
        </div>
    </div>
</div>

<!-- Pending jobs moderation card -->
<div class="glass-panel">
    <div class="panel-header">
        <h2>⏳ Recent Pending Jobs (Needs Action)</h2>
        <a href="{{ url('admin/jobs') }}" class="btn btn-secondary btn-sm">Manage All Jobs</a>
    </div>

    @if($pendingJobs->isEmpty())
        <p style="color: var(--text-secondary); text-align: center; padding: 2rem 0;">🎉 Nice work! No job postings are currently waiting for moderation.</p>
    @else
        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Company</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($pendingJobs as $job)
                        <tr>
                            <td><strong>{{ $job->title }}</strong></td>
                            <td><span class="badge badge-category">{{ ucfirst($job->category) }}</span></td>
                            <td>{{ $job->company }}</td>
                            <td>{{ $job->creator->mobile_number }}</td>
                            <td class="action-row">
                                <form action="{{ url('admin/jobs/' . $job->id . '/approve') }}" method="POST" style="display:inline;">
                                    @csrf
                                    <button type="submit" class="btn btn-success btn-sm">Approve</button>
                                </form>
                                <form action="{{ url('admin/jobs/' . $job->id . '/reject') }}" method="POST" style="display:inline;">
                                    @csrf
                                    <button type="submit" class="btn btn-danger btn-sm">Reject</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>

<!-- Pending chefs moderation card -->
<div class="glass-panel">
    <div class="panel-header">
        <h2>👨‍🍳 Recent Chef Profiles awaiting Approval</h2>
        <a href="{{ url('admin/chefs') }}" class="btn btn-secondary btn-sm">Manage All Chefs</a>
    </div>

    @if($pendingChefs->isEmpty())
        <p style="color: var(--text-secondary); text-align: center; padding: 2rem 0;">✨ All chef profiles are vetted and up to date.</p>
    @else
        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Chef Name</th>
                        <th>Mobile</th>
                        <th>Specialty Cuisine</th>
                        <th>Calendly Url</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($pendingChefs as $chef)
                        <tr>
                            <td><strong>{{ $chef->user->full_name ?? 'Unnamed Chef' }}</strong></td>
                            <td>{{ $chef->user->mobile_number }}</td>
                            <td><span class="badge badge-category">{{ $chef->cuisine_specialty }}</span></td>
                            <td>
                                @if($chef->calendly_link)
                                    <a href="{{ $chef->calendly_link }}" target="_blank" style="color: var(--accent-blue); text-decoration: none;">Link 🔗</a>
                                @else
                                    <span style="color: var(--text-muted);">None</span>
                                @endif
                            </td>
                            <td class="action-row">
                                <form action="{{ url('admin/chefs/' . $chef->id . '/approve') }}" method="POST" style="display:inline;">
                                    @csrf
                                    <button type="submit" class="btn btn-success btn-sm">Approve</button>
                                </form>
                                <form action="{{ url('admin/chefs/' . $chef->id . '/reject') }}" method="POST" style="display:inline;">
                                    @csrf
                                    <button type="submit" class="btn btn-danger btn-sm">Reject</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
@endsection
