@extends('layouts.admin')

@section('title', 'Admin Dashboard')
@section('header-title', 'Dashboard Overview')
@section('header-subtitle', 'Real-time performance metrics for the JobConnect platform')

@section('content')
<!-- Dashboard Top Bar Filter & Actions -->
<div class="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Date Filter:</span>
        <button class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors duration-200">
            <span>📅</span> Last 30 Days
        </button>
    </div>
    <button class="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm shadow-brand-500/10 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
        <span>📥</span> Export Report
    </button>
</div>

<!-- Stats Counter Grid -->
<div class="grid grid-cols-1 md:grid-cols-5 gap-6">
    <!-- Total Users -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-100 transition-all duration-300">
        <div class="flex justify-between items-start">
            <div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
                <span class="font-outfit font-extrabold text-3xl text-slate-800 block mt-2.5">{{ number_format($stats['users_count']) }}</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg text-slate-500">👥</div>
        </div>
        <div class="mt-4 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span class="text-emerald-500">Active: {{ $stats['users_active'] }}</span>
            <span class="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
            <span class="text-rose-500">Suspended: {{ $stats['users_suspended'] }}</span>
        </div>
    </div>

    <!-- Job Postings -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-100 transition-all duration-300">
        <div class="flex justify-between items-start">
            <div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Job Postings</span>
                <span class="font-outfit font-extrabold text-3xl text-slate-800 block mt-2.5">{{ number_format($stats['jobs_total']) }}</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg text-slate-500">💼</div>
        </div>
        <div class="mt-4 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span class="text-emerald-500">Approved: {{ $stats['jobs_approved'] }}</span>
            <span class="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
            <span class="text-amber-500">Pending: {{ $stats['jobs_pending'] }}</span>
        </div>
    </div>

    <!-- Specialist Chefs -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-100 transition-all duration-300">
        <div class="flex justify-between items-start">
            <div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chef Profiles</span>
                <span class="font-outfit font-extrabold text-3xl text-slate-800 block mt-2.5">{{ number_format($stats['chefs_total']) }}</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg text-slate-500">👩‍🍳</div>
        </div>
        <div class="mt-4 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span class="text-emerald-500">Approved: {{ $stats['chefs_approved'] }}</span>
            <span class="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
            <span class="text-amber-500">Pending: {{ $stats['chefs_pending'] }}</span>
        </div>
    </div>

    <!-- Training Programs -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-100 transition-all duration-300">
        <div class="flex justify-between items-start">
            <div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Training Programs</span>
                <span class="font-outfit font-extrabold text-3xl text-slate-800 block mt-2.5">{{ number_format($stats['training_opportunities']) }}</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg text-slate-500">📚</div>
        </div>
        <div class="mt-4 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span class="text-brand-600">Active Programs Listed</span>
        </div>
    </div>

    <!-- Total Applications -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-100 transition-all duration-300">
        <div class="flex justify-between items-start">
            <div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Applications</span>
                <span class="font-outfit font-extrabold text-3xl text-slate-800 block mt-2.5">{{ number_format($stats['applications_count']) }}</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg text-slate-500">📝</div>
        </div>
        <div class="mt-4 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span class="text-indigo-600">Job applications submitted</span>
        </div>
    </div>
</div>

<!-- Main Content Grid -->
<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
    
    <!-- Left Column: Pending Actions (3/5 width) -->
    <div class="lg:col-span-3 space-y-8">
        
        <!-- Jobs Awaiting Approval -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div class="flex items-center gap-2.5">
                    <span class="text-xl">⏳</span>
                    <div>
                        <h3 class="font-outfit font-extrabold text-base text-slate-800">Jobs Awaiting Approval</h3>
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Needs action / review</p>
                    </div>
                </div>
                <a href="{{ url('admin/jobs') }}" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-colors duration-200">
                    View All Jobs
                </a>
            </div>

            <div class="divide-y divide-slate-100">
                @if($pendingJobs->isEmpty())
                    <div class="p-8 text-center text-slate-400 text-xs font-medium">
                        ✨ No job postings are currently waiting for moderation.
                    </div>
                @else
                    @foreach($pendingJobs as $job)
                        <div class="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                            <div class="space-y-1">
                                <a href="{{ url('admin/jobs/' . $job->id) }}" class="text-sm font-bold text-slate-800 hover:text-brand-500 transition-colors duration-150 block">{{ $job->title }}</a>
                                <div class="flex items-center gap-2.5 text-xs text-slate-400 font-semibold">
                                    <span>🏢 {{ $job->company }}</span>
                                    <span class="h-1 w-1 rounded-full bg-slate-200"></span>
                                    <span>📍 {{ $job->location }}</span>
                                    <span class="h-1 w-1 rounded-full bg-slate-200"></span>
                                    <span class="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">{{ $job->category }}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <a href="{{ url('admin/jobs/' . $job->id) }}" class="bg-slate-50 hover:bg-slate-100 text-slate-500 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-100 transition-colors duration-150" title="Review Detail">
                                    Review
                                </a>
                                <form action="{{ url('admin/jobs/' . $job->id . '/approve') }}" method="POST" class="inline">
                                    @csrf
                                    <button type="submit" class="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-100 hover:border-emerald-500 transition-all duration-200" title="Approve">
                                        ✓
                                    </button>
                                </form>
                                <form action="{{ url('admin/jobs/' . $job->id . '/reject') }}" method="POST" class="inline">
                                    @csrf
                                    <button type="submit" class="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 hover:border-rose-500 transition-all duration-200" title="Reject">
                                        ✕
                                    </button>
                                </form>
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>

        <!-- Chefs Awaiting Approval -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div class="flex items-center gap-2.5">
                    <span class="text-xl">👩‍🍳</span>
                    <div>
                        <h3 class="font-outfit font-extrabold text-base text-slate-800">Chefs Awaiting Approval</h3>
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Vetting & Verification</p>
                    </div>
                </div>
                <a href="{{ url('admin/chefs') }}" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-colors duration-200">
                    View All Chefs
                </a>
            </div>

            <div class="divide-y divide-slate-100">
                @if($pendingChefs->isEmpty())
                    <div class="p-8 text-center text-slate-400 text-xs font-medium">
                        🎉 All chef profiles are vetted and active.
                    </div>
                @else
                    @foreach($pendingChefs as $chef)
                        <div class="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 font-bold font-outfit text-sm">
                                    {{ substr($chef->user->full_name ?? 'C', 0, 2) }}
                                </div>
                                <div class="space-y-0.5">
                                    <span class="text-sm font-bold text-slate-800 block">{{ $chef->user->full_name ?? 'Unnamed Chef' }}</span>
                                    <div class="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                                        <span>🍳 {{ $chef->cuisine_specialty }}</span>
                                        <span class="h-1 w-1 rounded-full bg-slate-200"></span>
                                        <span>📞 {{ $chef->user->mobile_number }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                @if($chef->calendly_link)
                                    <a href="{{ $chef->calendly_link }}" target="_blank" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors duration-150">
                                        Link 🔗
                                    </a>
                                @endif
                                <form action="{{ url('admin/chefs/' . $chef->id . '/approve') }}" method="POST" class="inline">
                                    @csrf
                                    <button type="submit" class="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-100 hover:border-emerald-500 transition-all duration-200">
                                        Approve
                                    </button>
                                </form>
                                <form action="{{ url('admin/chefs/' . $chef->id . '/reject') }}" method="POST" class="inline">
                                    @csrf
                                    <button type="submit" class="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 hover:border-rose-500 transition-all duration-200">
                                        Reject
                                    </button>
                                </form>
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>

    </div>

    <!-- Right Column: Recent Activity Feed (2/5 width) -->
    <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div class="p-6 border-b border-slate-50 bg-slate-50/30">
                <h3 class="font-outfit font-extrabold text-base text-slate-800">Recent Activity Feed</h3>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Real-time event stream</p>
            </div>

            <!-- Activity Items List -->
            <div class="p-6 flex-grow space-y-6">
                @foreach($feed as $activity)
                    <div class="flex items-start gap-4">
                        <!-- Icon -->
                        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base {{ $activity->badge_color }} shrink-0">
                            {{ $activity->icon }}
                        </div>
                        <!-- Info -->
                        <div class="space-y-0.5 flex-grow">
                            <span class="text-xs font-bold text-slate-800 block">{{ $activity->title }}</span>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ $activity->description }}</p>
                            <span class="text-[10px] font-bold text-slate-400/80 block pt-1">{{ $activity->time }}</span>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Footer audit link -->
            <div class="p-6 border-t border-slate-50 bg-slate-50/30 text-center">
                <button class="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 py-3 rounded-xl text-xs font-bold transition-all duration-200">
                    Full Audit Log
                </button>
            </div>
        </div>
    </div>

</div>
@endsection
