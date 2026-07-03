@extends('layouts.admin')

@section('title', 'User Accounts')
@section('header-title', 'User Management')
@section('header-subtitle', 'Oversee system users, manage access, and track registration trends')

@section('content')
<!-- Search, Filter & Add Button Top Bar -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <!-- Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-100 md:border-none pb-3 md:pb-0">
        @php $currentTab = request('tab', 'all'); @endphp
        <a href="{{ url('admin/users?tab=all' . (request('search') ? '&search='.request('search') : '')) }}" 
           class="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 {{ $currentTab === 'all' ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
            All Users
        </a>
        <a href="{{ url('admin/users?tab=active' . (request('search') ? '&search='.request('search') : '')) }}" 
           class="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 {{ $currentTab === 'active' ? 'bg-brand-55 bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
            Active
        </a>
        <a href="{{ url('admin/users?tab=suspended' . (request('search') ? '&search='.request('search') : '')) }}" 
           class="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 {{ $currentTab === 'suspended' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
            Suspended
        </a>
    </div>

    <!-- Search & Actions -->
    <div class="flex items-center gap-3 self-stretch md:self-auto">
        <form action="{{ url('admin/users') }}" method="GET" class="relative flex-grow md:flex-grow-0 md:w-72">
            @if(request('tab'))
                <input type="hidden" name="tab" value="{{ request('tab') }}">
            @endif
            <input type="text" name="search" placeholder="Search by name, phone..." value="{{ request('search') }}" 
                   class="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-slate-600 focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200">
            <span class="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
            @if(request('search'))
                <a href="{{ url('admin/users' . (request('tab') ? '?tab='.request('tab') : '')) }}" class="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-1">✕</a>
            @endif
        </form>

        <button class="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm shadow-brand-500/10 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap">
            + Add New User
        </button>
    </div>
</div>

<!-- Main Table Card -->
<div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div class="p-6 border-b border-slate-50 bg-slate-50/20">
        <h2 class="font-outfit font-extrabold text-base text-slate-800">Platform Users ({{ $users->total() }})</h2>
    </div>

    @if($users->isEmpty())
        <div class="p-12 text-center text-slate-400 text-sm font-medium">
            No registered users found matching the criteria.
        </div>
    @else
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th class="py-4 px-6">User Details</th>
                        <th class="py-4 px-6">Mobile</th>
                        <th class="py-4 px-6">Registered Roles</th>
                        <th class="py-4 px-6 text-center">Activity Stats</th>
                        <th class="py-4 px-6">Profile Completeness</th>
                        <th class="py-4 px-6">Status</th>
                        <th class="py-4 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                    @foreach($users as $user)
                        <tr class="hover:bg-slate-50/30 transition-colors duration-150">
                            <!-- Details: Avatar, Name, Email -->
                            <td class="py-4.5 px-6 flex items-center gap-3">
                                @if($user->profile_photo_path)
                                    <img src="{{ $user->profile_photo_path }}" alt="Avatar" class="w-9 h-9 rounded-xl object-cover border border-slate-100">
                                @else
                                    <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold font-outfit text-xs border border-slate-100">
                                        {{ substr($user->full_name ?? 'N', 0, 2) }}
                                    </div>
                                @endif
                                <div>
                                    <span class="font-bold text-slate-800 block leading-tight">{{ $user->full_name ?? 'Not Provided' }}</span>
                                    <span class="text-[11px] font-semibold text-slate-400 block mt-0.5">{{ $user->email ?? 'No email linked' }}</span>
                                </div>
                            </td>

                            <!-- Mobile -->
                            <td class="py-4.5 px-6 font-semibold text-slate-600">
                                <code>{{ $user->mobile_number }}</code>
                            </td>

                            <!-- Registered Roles -->
                            <td class="py-4.5 px-6">
                                <div class="flex flex-wrap gap-1.5">
                                    @if($user->roles->isEmpty())
                                        <span class="text-xs text-slate-400 font-semibold italic">None</span>
                                    @else
                                        @foreach($user->roles as $role)
                                            @php $isActive = $role->is_active; @endphp
                                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border {{ $isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100' }}">
                                                {{ str_replace('_', ' ', $role->role_type) }}
                                            </span>
                                        @endforeach
                                    @endif
                                </div>
                            </td>

                            <!-- Activity Stats (Counts & Modals) -->
                            <td class="py-4.5 px-6">
                                <div class="flex items-center justify-center gap-2">
                                    <!-- Posted Jobs -->
                                    <button onclick="showPostedJobs('{{ $user->id }}', '{{ addslashes($user->full_name ?? $user->mobile_number) }}')" 
                                            class="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all duration-200 flex items-center gap-1">
                                        <span>Posted:</span>
                                        <span>{{ $user->job_posts_count }}</span>
                                    </button>
                                    <!-- Applied Jobs -->
                                    <button onclick="showAppliedJobs('{{ $user->id }}', '{{ addslashes($user->full_name ?? $user->mobile_number) }}')" 
                                            class="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center gap-1">
                                        <span>Applied:</span>
                                        <span>{{ $user->applications_count }}</span>
                                    </button>
                                </div>
                            </td>

                            <!-- Profile completeness -->
                            <td class="py-4.5 px-6">
                                <div class="flex items-center gap-3">
                                    <div class="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden max-w-[100px]">
                                        <div class="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full" style="width: {{ $user->profile_completeness }}%"></div>
                                    </div>
                                    <span class="text-xs font-bold text-slate-600">{{ $user->profile_completeness }}%</span>
                                </div>
                            </td>

                            <!-- Status Badge -->
                            <td class="py-4.5 px-6">
                                @if($user->is_suspended)
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                                        Suspended
                                    </span>
                                @else
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        Active
                                    </span>
                                @endif
                            </td>

                            <!-- Actions -->
                            <td class="py-4.5 px-6 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    @if($user->is_suspended)
                                        <form action="{{ url('admin/users/' . $user->id . '/activate') }}" method="POST" class="inline">
                                            @csrf
                                            <button type="submit" class="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-100 hover:border-emerald-500 transition-colors duration-200">
                                                Activate
                                            </button>
                                        </form>
                                    @else
                                        <form action="{{ url('admin/users/' . $user->id . '/suspend') }}" method="POST" class="inline">
                                            @csrf
                                            <button type="submit" class="bg-slate-50 hover:bg-rose-500 text-slate-500 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-100 hover:border-rose-500 transition-colors duration-200">
                                                Suspend
                                            </button>
                                        </form>
                                    @endif

                                    <form action="{{ url('admin/users/' . $user->id) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to permanently delete this user ({{ $user->full_name ?? $user->mobile_number }}) and all their associated data? This action cannot be undone.');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 hover:border-rose-500 transition-colors duration-200">
                                            Hard Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-5 border-t border-slate-50">
            {{ $users->appends(request()->query())->links() }}
        </div>
    @endif
</div>

<!-- Bottom KPI / Registration Trend Cards -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Growth (MoM)</span>
            <span class="font-outfit font-extrabold text-2xl text-emerald-600 block mt-1.5">+12.5%</span>
        </div>
        <div class="text-xl p-3 bg-emerald-50 rounded-xl text-emerald-600">📈</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Users</span>
            <span class="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">88%</span>
        </div>
        <div class="text-xl p-3 bg-blue-50 rounded-xl text-blue-600">🛡️</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Today</span>
            <span class="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">432</span>
        </div>
        <div class="text-xl p-3 bg-indigo-50 rounded-xl text-indigo-600">⚡</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Safety Flags</span>
            <span class="font-outfit font-extrabold text-2xl text-rose-600 block mt-1.5">2</span>
        </div>
        <div class="text-xl p-3 bg-rose-50 rounded-xl text-rose-600">🚨</div>
    </div>
</div>

<!-- Modal Container (Used for dynamic AJAX Posted / Applied Jobs views) -->
<div id="stats-detail-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
    <div class="bg-white border border-slate-100 rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h3 id="modal-title" class="font-outfit font-extrabold text-slate-800 text-base">Details</h3>
            <button type="button" onclick="closeStatsModal()" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all">✕</button>
        </div>
        <!-- Body -->
        <div id="modal-body" class="p-6 overflow-y-auto space-y-4">
            <!-- Dynamic components inject here -->
        </div>
    </div>
</div>

<script>
function closeStatsModal() {
    document.getElementById('stats-detail-modal').style.display = 'none';
}

document.getElementById('stats-detail-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeStatsModal();
    }
});

async function showPostedJobs(userId, userName) {
    const modal = document.getElementById('stats-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = `Jobs Posted by ${userName}`;
    modalBody.innerHTML = '<p class="text-xs font-semibold text-slate-400 text-center py-6">Loading job posts...</p>';
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
                item.className = 'p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-left space-y-3';
                
                let appsHtml = '';
                let actualAppCount = 0;
                
                if (job.applications && job.applications.length > 0) {
                    job.applications.forEach(app => {
                        if (!app.applicant || !app.applicant.full_name || app.applicant.full_name.toLowerCase() === 'null' || app.applicant.full_name.trim() === '') {
                            return;
                        }
                        
                        actualAppCount++;
                        const applicantName = app.applicant.full_name;
                        const applicantPhone = app.applicant.mobile_number || 'N/A';
                        const applicantEmail = app.applicant.email || 'N/A';
                        
                        let statusColorClass = 'bg-blue-50 text-blue-600 border-blue-100';
                        if (app.status === 'shortlisted') { statusColorClass = 'bg-emerald-50 text-emerald-600 border-emerald-100'; }
                        else if (app.status === 'rejected') { statusColorClass = 'bg-rose-50 text-rose-600 border-rose-100'; }
                        
                        appsHtml += `
                            <div class="bg-white border border-slate-100/60 p-3.5 rounded-xl flex justify-between items-start">
                                <div class="space-y-0.5">
                                    <div class="font-bold text-xs text-slate-800">${applicantName}</div>
                                    <div class="text-[10px] font-semibold text-slate-400">
                                        📞 <a href="tel:${applicantPhone}" class="text-brand-600 hover:underline">${applicantPhone}</a>
                                    </div>
                                    <div class="text-[9px] font-semibold text-slate-400">📧 ${applicantEmail}</div>
                                </div>
                                <span class="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${statusColorClass}">
                                    ${app.status}
                                </span>
                            </div>
                        `;
                    });
                }
                
                item.innerHTML = `
                    <div>
                        <div class="font-bold text-slate-800 text-sm">${job.title}</div>
                        <div class="text-[11px] font-semibold text-slate-400 mt-1">📍 ${job.location} • 💼 ${job.job_type || 'Full-time'}</div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-emerald-600 font-extrabold text-xs">${job.salary || 'Salary Disclosed'}</span>
                        <span class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${job.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}">
                            ${job.status}
                        </span>
                    </div>
                    
                    <div class="pt-3 border-t border-slate-100/60">
                        ${actualAppCount > 0 ? `
                            <button type="button" onclick="const list = this.nextElementSibling; list.classList.toggle('hidden');" 
                                    class="bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-100 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                                View Applicants (${actualAppCount}) 👇
                            </button>
                            <div class="hidden flex-col gap-2 mt-3 pl-2 border-l border-slate-100">
                                ${appsHtml}
                            </div>
                        ` : `
                            <span class="text-[10px] font-bold text-slate-400">0 Applicants</span>
                        `}
                    </div>
                `;
                modalBody.appendChild(item);
            });
        } else {
            modalBody.innerHTML = '<p class="text-xs font-semibold text-slate-400 text-center py-6">This user has not posted any jobs yet.</p>';
        }
    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<p class="text-xs font-semibold text-rose-500 text-center py-6">Failed to load jobs list.</p>';
    }
}

async function showAppliedJobs(userId, userName) {
    const modal = document.getElementById('stats-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = `Jobs Applied by ${userName}`;
    modalBody.innerHTML = '<p class="text-xs font-semibold text-slate-400 text-center py-6">Loading applications...</p>';
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
                item.className = 'p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-left space-y-2';
                
                let statusColorClass = 'bg-blue-50 text-blue-600 border-blue-100';
                if (app.status === 'shortlisted') { statusColorClass = 'bg-emerald-50 text-emerald-600 border-emerald-100'; }
                else if (app.status === 'rejected') { statusColorClass = 'bg-rose-50 text-rose-600 border-rose-100'; }
                
                item.innerHTML = `
                    <div class="font-bold text-slate-800 text-sm">${job.title}</div>
                    <div class="text-[11px] font-semibold text-slate-400">📍 ${job.location} • 💼 ${job.company || 'Direct Hire'}</div>
                    <div class="flex justify-between items-center pt-2 border-t border-slate-100/60 text-[10px] font-bold">
                        <span class="text-slate-400">Applied: ${app.applied_at}</span>
                        <span class="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${statusColorClass}">
                            ${app.status}
                        </span>
                    </div>
                `;
                modalBody.appendChild(item);
            });
        } else {
            modalBody.innerHTML = '<p class="text-xs font-semibold text-slate-400 text-center py-6">This user has not applied to any jobs yet.</p>';
        }
    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<p class="text-xs font-semibold text-rose-500 text-center py-6">Failed to load applications list.</p>';
    }
}
</script>
@endsection
