@extends('layouts.admin')

@section('title', 'Job Moderation')
@section('header-title', 'Job Moderation')
@section('header-subtitle', 'Review and approve hospitality job listings across India')

@section('content')
<!-- Stats headers (Mock 2) -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Review Time</span>
            <span class="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">14 Minutes</span>
        </div>
        <div class="text-xl p-3 bg-emerald-50 rounded-xl text-emerald-600">⏱️</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approval Rate</span>
            <span class="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">90.4%</span>
        </div>
        <div class="text-xl p-3 bg-blue-50 rounded-xl text-blue-600">📈</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flagged Listings</span>
            <span class="font-outfit font-extrabold text-2xl text-rose-600 block mt-1.5">12</span>
        </div>
        <div class="text-xl p-3 bg-rose-50 rounded-xl text-rose-600">🚨</div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auto-Moderator</span>
            <span class="font-outfit font-extrabold text-2xl text-brand-600 block mt-1.5">Active Today</span>
        </div>
        <div class="text-xl p-3 bg-brand-50 rounded-xl text-brand-600">🤖</div>
    </div>
</div>

<!-- Search, Filter & Tabs Card -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <!-- Status Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-100 md:border-none pb-3 md:pb-0">
        @php $currentStatus = request('status', ''); @endphp
        <a href="{{ url('admin/jobs?status=' . (request('category') ? '&category='.request('category') : '')) }}" 
           class="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 {{ $currentStatus === '' ? 'bg-brand-55 bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
            All Jobs
        </a>
        <a href="{{ url('admin/jobs?status=pending' . (request('category') ? '&category='.request('category') : '')) }}" 
           class="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 {{ $currentStatus === 'pending' ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
            Pending
        </a>
        <a href="{{ url('admin/jobs?status=approved' . (request('category') ? '&category='.request('category') : '')) }}" 
           class="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 {{ $currentStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
            Approved
        </a>
        <a href="{{ url('admin/jobs?status=rejected' . (request('category') ? '&category='.request('category') : '')) }}" 
           class="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 {{ $currentStatus === 'rejected' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
            Rejected
        </a>
    </div>

    <!-- Category selector & Reset button -->
    <form action="{{ url('admin/jobs') }}" method="GET" class="flex items-center gap-3 self-stretch md:self-auto">
        @if(request('status'))
            <input type="hidden" name="status" value="{{ request('status') }}">
        @endif
        
        <select name="category" onchange="this.form.submit()" class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-500 focus:bg-white transition-all">
            <option value="">All Categories</option>
            <option value="india" {{ request('category') === 'india' ? 'selected' : '' }}>India</option>
            <option value="overseas" {{ request('category') === 'overseas' ? 'selected' : '' }}>Overseas</option>
            <option value="community" {{ request('category') === 'community' ? 'selected' : '' }}>Community</option>
        </select>

        @if(request('status') || request('category'))
            <a href="{{ url('admin/jobs') }}" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
                Reset
            </a>
        @endif
    </form>
</div>

<!-- Jobs List Table Card -->
<div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div class="p-6 border-b border-slate-50 bg-slate-50/20">
        <h2 class="font-outfit font-extrabold text-base text-slate-800">Job Submissions ({{ $jobs->total() }})</h2>
    </div>

    @if($jobs->isEmpty())
        <div class="p-12 text-center text-slate-400 text-sm font-medium">
            No job listings found matching the filters.
        </div>
    @else
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th class="py-4 px-6">Job Title & Type</th>
                        <th class="py-4 px-6">Employer</th>
                        <th class="py-4 px-6">Location</th>
                        <th class="py-4 px-6">Submitted Date</th>
                        <th class="py-4 px-6">Featured</th>
                        <th class="py-4 px-6">Status</th>
                        <th class="py-4 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                    @foreach($jobs as $job)
                        <tr class="hover:bg-slate-50/30 transition-colors duration-150">
                            <!-- Job details -->
                            <td class="py-4 px-6">
                                <span class="font-bold text-slate-800 block leading-tight">{{ $job->title }}</span>
                                <div class="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-400">
                                    <span class="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{{ $job->category }}</span>
                                    @if($job->job_type)
                                        <span class="h-1 w-1 rounded-full bg-slate-200"></span>
                                        <span>💼 {{ $job->job_type }}</span>
                                    @endif
                                </div>
                            </td>

                            <!-- Employer info -->
                            <td class="py-4 px-6">
                                <span class="font-bold text-slate-700 block leading-tight">{{ $job->company }}</span>
                                <span class="text-[11px] font-semibold text-slate-400 block mt-0.5">By: {{ $job->creator->mobile_number }}</span>
                            </td>

                            <!-- Location -->
                            <td class="py-4 px-6 font-semibold text-slate-600">
                                📍 {{ $job->location }}
                            </td>

                            <!-- Submitted Date -->
                            <td class="py-4 px-6 text-xs text-slate-500 font-semibold">
                                {{ $job->created_at ? $job->created_at->format('d M Y, h:i A') : 'Unknown Date' }}
                            </td>

                            <!-- Featured (Pinned) -->
                            <td class="py-4 px-6">
                                @if($job->is_pinned)
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                                        📌 Pinned
                                    </span>
                                @else
                                    <span class="text-xs text-slate-400 font-semibold">Standard</span>
                                @endif
                            </td>

                            <!-- Status badge -->
                            <td class="py-4 px-6">
                                @if($job->status === 'approved')
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        Approved
                                    </span>
                                @elseif($job->status === 'rejected')
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                                        Rejected
                                    </span>
                                @else
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                                        Pending
                                    </span>
                                @endif
                            </td>

                            <!-- Actions -->
                            <td class="py-4 px-6 text-right">
                                <div class="flex items-center justify-end gap-2.5">
                                    <a href="{{ url('admin/jobs/' . $job->id) }}" class="bg-slate-50 hover:bg-slate-100 text-slate-500 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-100 transition-colors duration-150" title="Review Detail">
                                        Review
                                    </a>

                                    @if($job->status !== 'approved')
                                        <form action="{{ url('admin/jobs/' . $job->id . '/approve') }}" method="POST" class="inline">
                                            @csrf
                                            <button type="submit" class="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-100 hover:border-emerald-500 transition-colors duration-200" title="Approve">
                                                ✓
                                            </button>
                                        </form>
                                    @endif

                                    @if($job->status !== 'rejected')
                                        <form action="{{ url('admin/jobs/' . $job->id . '/reject') }}" method="POST" class="inline">
                                            @csrf
                                            <button type="submit" class="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 hover:border-rose-500 transition-colors duration-200" title="Reject">
                                                ✕
                                            </button>
                                        </form>
                                    @endif

                                    @if($job->status === 'approved')
                                        <form action="{{ url('admin/jobs/' . $job->id . '/toggle-pin') }}" method="POST" class="inline">
                                            @csrf
                                            <button type="submit" class="bg-indigo-50 hover:bg-indigo-500 border border-indigo-100 text-indigo-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200">
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

        <!-- Pagination -->
        <div class="px-6 py-5 border-t border-slate-50">
            {{ $jobs->appends(request()->query())->links() }}
        </div>
    @endif
</div>
@endsection
