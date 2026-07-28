@extends('layouts.admin')

@section('title', 'Employers Management')
@section('header-title', 'Employers Management')
@section('header-subtitle', 'Oversee platform employers, verification states, and job posting analytics.')

@section('content')
<!-- Growth & Priority Stats Bar -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Growth Overview Card -->
    <div class="lg:col-span-2 bg-white rounded-3xl p-7 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
        <div class="space-y-4 z-10">
            <div>
                <h3 class="font-outfit font-extrabold text-lg text-slate-800">Growth Overview</h3>
                <p class="text-xs font-medium text-slate-400 mt-0.5">Total active employers and job posting throughput.</p>
            </div>
            
            <div class="flex items-center gap-10 pt-2">
                <div>
                    <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">ACTIVE PARTNERS</span>
                    <span class="font-outfit font-black text-3xl text-slate-800 mt-1 block">{{ number_format($totalActiveEmployers) }}</span>
                </div>
                <div class="h-10 w-px bg-slate-100"></div>
                <div>
                    <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">NEW POSTINGS</span>
                    <span class="font-outfit font-black text-3xl text-slate-800 mt-1 block">{{ number_format($totalNewPostings) }}</span>
                </div>
            </div>
        </div>

        <!-- Decorative Growth Curve graphic -->
        <div class="hidden sm:flex items-center justify-center w-36 h-24 bg-gradient-to-tr from-rose-50/50 to-brand-50/60 rounded-2xl border border-slate-100 p-2">
            <svg class="w-full h-full text-brand-500" viewBox="0 0 100 50" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M0 45 Q 25 35, 50 25 T 100 5" stroke-linecap="round" />
            </svg>
        </div>
    </div>

    <!-- Priority Actions Card -->
    <div class="bg-gradient-to-br from-emerald-500 to-brand-600 rounded-3xl p-7 text-white shadow-lg shadow-brand-500/15 flex flex-col justify-between">
        <div>
            <h3 class="font-outfit font-extrabold text-lg">Priority Actions</h3>
            <p class="text-xs text-emerald-100 font-medium mt-1">
                {{ $pendingVerificationCount }} employer{{ $pendingVerificationCount == 1 ? '' : 's' }} pending profile review
            </p>
        </div>

        <div class="pt-6">
            <a href="{{ url('admin/employers?tab=pending') }}" class="inline-flex items-center justify-center w-full bg-slate-900/90 hover:bg-slate-900 text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5">
                🛡️ Review Now
            </a>
        </div>
    </div>
</div>

<!-- Main Employer Directory Card (Dynamic List — No Pagination) -->
<div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-8">
    <!-- Top Filter Bar -->
    <div class="p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div class="flex items-center gap-3">
            <h2 class="font-outfit font-black text-xl text-slate-800">Employer Directory</h2>
            <span class="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">GLOBAL ACCESS</span>
            <span class="bg-purple-50 text-purple-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">PREMIUM TIER</span>
        </div>

        <!-- Search Form -->
        <div class="flex items-center gap-3">
            <form action="{{ url('admin/employers') }}" method="GET" class="relative flex-grow md:w-80">
                <input type="text" name="search" placeholder="Search employers, regions, or status..." value="{{ request('search') }}" 
                       class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-10 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500 focus:bg-white transition-all">
                <span class="absolute left-3.5 top-3.5 text-slate-400 text-xs">🔍</span>
                @if(request('search'))
                    <a href="{{ url('admin/employers') }}" class="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold p-1">✕</a>
                @endif
            </form>
        </div>
    </div>

    <!-- Table Section -->
    @if($employers->isEmpty())
        <div class="p-16 text-center text-slate-400 font-medium">
            <div class="text-4xl mb-3">🏢</div>
            <p class="text-sm font-semibold text-slate-600">No employer accounts found</p>
            <p class="text-xs text-slate-400 mt-1">Try resetting search filters or register new employer accounts.</p>
        </div>
    @else
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/70 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        <th class="py-4.5 px-7">BUSINESS NAME</th>
                        <th class="py-4.5 px-6">CONTACT PERSON</th>
                        <th class="py-4.5 px-6">MOBILE NUMBER</th>
                        <th class="py-4.5 px-6">JOBS POSTED</th>
                        <th class="py-4.5 px-6">STATUS</th>
                        <th class="py-4.5 px-7 text-right">ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                    @foreach($employers as $employer)
                        @php
                            $bizName = $employer->employerProfile->business_name ?? ($employer->current_employer ?: ($employer->full_name ?: 'Employer Account'));
                            $bizLocation = $employer->employerProfile->business_location ?? ($employer->city ?: 'India');
                            $contactName = $employer->employerProfile->contact_person_name ?? ($employer->full_name ?: 'Main Contact');
                            $initial = strtoupper(substr($bizName, 0, 1));
                        @endphp
                        <tr class="hover:bg-slate-50/50 transition-colors duration-150">
                            <!-- Business Name & Location -->
                            <td class="py-4.5 px-7 flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-outfit font-black text-base flex items-center justify-center border border-blue-100 shrink-0">
                                    {{ $initial }}
                                </div>
                                <div>
                                    <span class="font-bold text-slate-900 block leading-tight text-sm">{{ $bizName }}</span>
                                    <span class="text-[11px] font-semibold text-slate-400 block mt-0.5">📍 {{ $bizLocation }}</span>
                                </div>
                            </td>

                            <!-- Contact Person -->
                            <td class="py-4.5 px-6">
                                <span class="font-bold text-slate-800 block text-xs">{{ $contactName }}</span>
                                <span class="text-[11px] font-medium text-slate-400 block mt-0.5">{{ $employer->email ?? 'No email linked' }}</span>
                            </td>

                            <!-- Mobile Number -->
                            <td class="py-4.5 px-6 font-semibold text-slate-700 text-xs">
                                <code>{{ $employer->mobile_number }}</code>
                            </td>

                            <!-- Jobs Posted Count -->
                            <td class="py-4.5 px-6">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                                    📑 {{ $employer->job_posts_count }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="py-4.5 px-6">
                                @if($employer->is_suspended)
                                    <span class="px-3 py-1 text-[10px] font-black rounded-full bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider">
                                        SUSPENDED
                                    </span>
                                @elseif(optional($employer->employerProfile)->is_completed == false)
                                    <span class="px-3 py-1 text-[10px] font-black rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                                        PENDING VERIFICATION
                                    </span>
                                @else
                                    <span class="px-3 py-1 text-[10px] font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                                        ACTIVE
                                    </span>
                                @endif
                            </td>

                            <!-- Actions -->
                            <td class="py-4.5 px-7 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    @if($employer->is_suspended)
                                        <form action="{{ url('admin/employers/'.$employer->id.'/activate') }}" method="POST" class="inline">
                                            @csrf
                                            <button type="submit" class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition">
                                                Activate
                                            </button>
                                        </form>
                                    @else
                                        <form action="{{ url('admin/employers/'.$employer->id.'/suspend') }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to suspend this employer account?')">
                                            @csrf
                                            <button type="submit" class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition">
                                                Suspend
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

        <!-- Footer Notice (Showing ALL employers without pagination) -->
        <div class="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Showing all {{ $employers->count() }} registered employers (No Pagination)</span>
            <span class="text-slate-400">Total Employer Accounts: {{ $employers->count() }}</span>
        </div>
    @endif
</div>
@endsection
