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
                        <th>City / Experience</th>
                        <th>Active Role</th>
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
                            <td>
                                <div>{{ $user->city ?? 'No city' }}</div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                    {{ $user->experience_years !== null ? $user->experience_years . ' yrs exp' : 'No experience info' }}
                                </div>
                            </td>
                            <td>
                                @php $actRole = $user->activeRole; @endphp
                                @if($actRole)
                                    <span class="badge badge-category">{{ ucfirst(str_replace('_', ' ', $actRole->role_type)) }}</span>
                                @else
                                    <span style="color: var(--text-muted);">None</span>
                                @endif
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
@endsection
