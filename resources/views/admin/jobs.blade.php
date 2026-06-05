@extends('layouts.admin')

@section('title', 'Job Moderation')
@section('header-title', 'Job Moderation')
@section('header-subtitle', 'Moderate submitted job postings and feature content')

@section('content')
<!-- Filter Section -->
<div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
    <form action="{{ url('admin/jobs') }}" method="GET" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <label class="form-label" style="margin-bottom: 0;">Status</label>
            <select name="status" class="form-control" style="width: 150px; padding: 0.4rem 0.8rem; font-size: 0.9rem;">
                <option value="">All Statuses</option>
                <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
                <option value="approved" {{ request('status') === 'approved' ? 'selected' : '' }}>Approved</option>
                <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Rejected</option>
            </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <label class="form-label" style="margin-bottom: 0;">Category</label>
            <select name="category" class="form-control" style="width: 150px; padding: 0.4rem 0.8rem; font-size: 0.9rem;">
                <option value="">All Categories</option>
                <option value="india" {{ request('category') === 'india' ? 'selected' : '' }}>India</option>
                <option value="overseas" {{ request('category') === 'overseas' ? 'selected' : '' }}>Overseas</option>
                <option value="community" {{ request('category') === 'community' ? 'selected' : '' }}>Community</option>
            </select>
        </div>

        <div style="display: flex; align-items: flex-end; height: 100%; padding-top: 1.2rem;">
            <button type="submit" class="btn btn-secondary btn-sm" style="padding: 0.55rem 1.25rem;">Filter</button>
            @if(request('status') || request('category'))
                <a href="{{ url('admin/jobs') }}" class="btn btn-secondary btn-sm" style="margin-left: 0.5rem; padding: 0.55rem 1.25rem;">Reset</a>
            @endif
        </div>
    </form>
</div>

<div class="glass-panel">
    <div class="panel-header">
        <h2>💼 Job Submissions ({{ $jobs->total() }})</h2>
    </div>

    @if($jobs->isEmpty())
        <p style="color: var(--text-secondary); text-align: center; padding: 2rem 0;">No job listings found matching the filters.</p>
    @else
        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Job details</th>
                        <th>Category</th>
                        <th>Submitting user</th>
                        <th>Moderation Status</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($jobs as $job)
                        <tr>
                            <td>
                                <strong>{{ $job->title }}</strong>
                                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
                                    Company: {{ $job->company }}
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem; max-width: 320px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                    {{ $job->description }}
                                </div>
                                @if($job->category === 'overseas')
                                    <div style="font-size: 0.75rem; color: var(--accent-cyan); margin-top: 0.4rem; display: flex; gap: 0.75rem;">
                                        <span>🌍 Country: {{ $job->country }}</span>
                                        <span>📜 Visa: {{ $job->visa_assistance ? 'Yes' : 'No' }}</span>
                                        <span>🏠 Accom: {{ $job->accommodation_available ? 'Yes' : 'No' }}</span>
                                    </div>
                                @endif
                            </td>
                            <td><span class="badge badge-category">{{ ucfirst($job->category) }}</span></td>
                            <td><code>{{ $job->creator->mobile_number }}</code></td>
                            <td>
                                @if($job->status === 'approved')
                                    <span class="badge badge-approved">Approved</span>
                                @elseif($job->status === 'rejected')
                                    <span class="badge badge-rejected">Rejected</span>
                                @else
                                    <span class="badge badge-pending">Pending</span>
                                @endif
                            </td>
                            <td>
                                @if($job->is_pinned)
                                    <span class="badge badge-pinned">📌 Pinned</span>
                                @else
                                    <span style="color: var(--text-muted); font-size: 0.85rem;">Standard</span>
                                @endif
                            </td>
                            <td>
                                <div class="action-row" style="flex-wrap: wrap; gap: 0.4rem;">
                                    @if($job->status !== 'approved')
                                        <form action="{{ url('admin/jobs/' . $job->id . '/approve') }}" method="POST" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-success btn-sm">Approve</button>
                                        </form>
                                    @endif
                                    
                                    @if($job->status !== 'rejected')
                                        <form action="{{ url('admin/jobs/' . $job->id . '/reject') }}" method="POST" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-danger btn-sm">Reject</button>
                                        </form>
                                    @endif

                                    @if($job->status === 'approved')
                                        <form action="{{ url('admin/jobs/' . $job->id . '/toggle-pin') }}" method="POST" style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-secondary btn-sm" style="color: #60a5fa;">
                                                {{ $job->is_pinned ? 'Unpin' : 'Pin' }}
                                            </button>
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
            {{ $jobs->appends(request()->query())->links() }}
        </div>
    @endif
</div>
@endsection
