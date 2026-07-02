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
                                        <span style="background: rgba(147, 51, 234, 0.1); color: #a855f7; font-weight: 700; padding: 1px 5px; border-radius: 4px;">{{ $user->job_posts_count }}</span>
                                    </div>
                                    <div style="font-weight: 600; display: flex; align-items: center; gap: 6px; margin-top: 4px;">
                                        <span style="color: var(--text-secondary);">Applied:</span> 
                                        <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; font-weight: 700; padding: 1px 5px; border-radius: 4px;">{{ $user->applications_count }}</span>
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
