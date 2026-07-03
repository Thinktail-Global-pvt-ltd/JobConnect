@extends('layouts.admin')

@section('title', 'Job Detail Review')
@section('header-title', 'Job Review Detail')
@section('header-subtitle', 'Review details and decide moderation status')

@section('content')
<!-- Back button -->
<div class="mb-4">
    <a href="{{ url('admin/jobs') }}" class="bg-white hover:bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-2 transition-colors duration-150">
        ← Back to Job Moderation
    </a>
</div>

<!-- Main Job detail grid -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Left 2 Columns: Description & Details (2/3 width) -->
    <div class="lg:col-span-2 space-y-8">
        
        <!-- Job Main Card -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 relative overflow-hidden">
            <!-- Header Section -->
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <span class="bg-brand-50 text-brand-600 border border-brand-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {{ $job->category }}
                    </span>
                    @if($job->status === 'approved')
                        <span class="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                            Active / Approved
                        </span>
                    @elseif($job->status === 'rejected')
                        <span class="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                            Rejected
                        </span>
                    @else
                        <span class="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                            Pending Review
                        </span>
                    @endif
                </div>
                
                <h2 class="font-outfit font-extrabold text-2xl text-slate-800">{{ $job->title }}</h2>
                
                <p class="text-xs font-semibold text-slate-400">
                    Submitted {{ $job->created_at ? $job->created_at->diffForHumans() : 'recently' }} by 
                    <span class="text-slate-600 font-bold">{{ $job->creator->full_name ?? 'Employer' }}</span> 
                    ({{ $job->creator->mobile_number }})
                </p>
            </div>

            <!-- Key metrics row (Mock 4) -->
            <div class="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 bg-slate-50/20 px-4 rounded-xl">
                <div class="text-center md:text-left">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Salary Range</span>
                    <span class="font-outfit font-extrabold text-lg text-emerald-600 block mt-1">{{ $job->salary ?: 'Not Disclosed' }}</span>
                </div>
                <div class="text-center md:text-left border-x border-slate-100 px-4">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                    <span class="font-outfit font-extrabold text-lg text-slate-700 block mt-1">{{ $job->experience_range ?: 'Not Specified' }}</span>
                </div>
                <div class="text-center md:text-left">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Work Type</span>
                    <span class="font-outfit font-extrabold text-lg text-brand-600 block mt-1">{{ $job->job_type ?: 'Full-Time' }}</span>
                </div>
            </div>

            <!-- Description -->
            <div class="space-y-3">
                <h3 class="font-outfit font-extrabold text-base text-slate-800">Job Description</h3>
                <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{{ $job->description }}</p>
            </div>

            <!-- Requirements -->
            <div class="space-y-3 pt-4 border-t border-slate-50">
                <h3 class="font-outfit font-extrabold text-base text-slate-800">Key Requirements</h3>
                <ul class="list-disc pl-5 text-sm text-slate-600 space-y-2 leading-relaxed">
                    @if(is_array($job->requirements) && count($job->requirements) > 0)
                        @foreach($job->requirements as $req)
                            <li>{{ $req }}</li>
                        @endforeach
                    @else
                        <li>No specific requirements listed.</li>
                    @endif
                </ul>
            </div>

            <!-- Benefits -->
            <div class="space-y-3 pt-4 border-t border-slate-50">
                <h3 class="font-outfit font-extrabold text-base text-slate-800">Benefits & Perks</h3>
                <ul class="list-disc pl-5 text-sm text-slate-600 space-y-2 leading-relaxed">
                    @if(is_array($job->benefits) && count($job->benefits) > 0)
                        @foreach($job->benefits as $ben)
                            <li>{{ $ben }}</li>
                        @endforeach
                    @else
                        <li>No specific benefits listed.</li>
                    @endif
                </ul>
            </div>

        </div>

    </div>

    <!-- Right 1 Column: Meta details & Moderation actions (1/3 width) -->
    <div class="lg:col-span-1 space-y-8">
        
        <!-- Action Control Panel -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 class="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-50 pb-3">Moderation Actions</h3>
            
            <div class="space-y-3 pt-1">
                @if($job->status !== 'approved')
                    <form action="{{ url('admin/jobs/' . $job->id . '/approve') }}" method="POST" class="block w-full">
                        @csrf
                        <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-xs font-bold shadow-sm shadow-emerald-500/10 transition-all duration-200 hover:-translate-y-0.5">
                            ✓ Approve Job Posting
                        </button>
                    </form>
                @endif

                @if($job->status !== 'rejected')
                    <form action="{{ url('admin/jobs/' . $job->id . '/reject') }}" method="POST" class="block w-full">
                        @csrf
                        <button type="submit" class="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-3 text-xs font-bold shadow-sm shadow-rose-500/10 transition-all duration-200 hover:-translate-y-0.5">
                            ✕ Reject Job Posting
                        </button>
                    </form>
                @endif

                @if($job->status === 'approved')
                    <form action="{{ url('admin/jobs/' . $job->id . '/toggle-pin') }}" method="POST" class="block w-full">
                        @csrf
                        <button type="submit" class="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 rounded-xl py-3 text-xs font-bold transition-all duration-200">
                            {{ $job->is_pinned ? 'Unpin from Top' : '📌 Pin to Top' }}
                        </button>
                    </form>
                @endif
            </div>
        </div>

        <!-- Meta Details Card -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 class="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-50 pb-3">Posting Details</h3>
            
            <div class="space-y-4 text-xs font-semibold text-slate-500">
                <div class="flex items-center gap-3">
                    <span class="text-base">🏢</span>
                    <div>
                        <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Company</span>
                        <span class="text-slate-700 font-bold mt-0.5 block">{{ $job->company }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="text-base">📍</span>
                    <div>
                        <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Location</span>
                        <span class="text-slate-700 font-bold mt-0.5 block">{{ $job->location }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="text-base">📧</span>
                    <div>
                        <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Contact Info</span>
                        <span class="text-slate-700 font-bold mt-0.5 block">{{ $job->contact_info }}</span>
                    </div>
                </div>

                @if($job->category === 'overseas')
                    <div class="flex items-center gap-3">
                        <span class="text-base">🌍</span>
                        <div>
                            <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Visa Assistance</span>
                            <span class="text-slate-700 font-bold mt-0.5 block">{{ $job->visa_assistance ? 'Yes, Available' : 'No' }}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <span class="text-base">🏠</span>
                        <div>
                            <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Accommodation</span>
                            <span class="text-slate-700 font-bold mt-0.5 block">{{ $job->accommodation_available ? 'Yes, Included' : 'No' }}</span>
                        </div>
                    </div>
                @endif
            </div>
        </div>

    </div>

</div>
@endsection
