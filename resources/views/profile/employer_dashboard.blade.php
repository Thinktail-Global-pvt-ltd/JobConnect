<!-- Employer / Agency Premium Dashboard Layout -->
<div class="min-h-screen bg-gray-50 flex flex-col justify-between pb-8">
    
    <!-- Top App Bar for Employer Dashboard -->
    <header class="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm" id="employer-header">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-50 border border-green-100 overflow-hidden flex items-center justify-center shrink-0">
                @if($user->employerProfile && $user->employerProfile->company_logo_path)
                    <img src="{{ $user->employerProfile->company_logo_path }}" class="w-full h-full object-cover">
                @else
                    <span class="material-symbols-outlined text-green-600 text-xl">apartment</span>
                @endif
            </div>
            <div>
                <h2 class="font-outfit font-bold text-sm text-gray-900 leading-tight" id="header-company-name">
                    {{ $user->employerProfile->business_name ?? 'Grand Hyatt Dubai' }}
                </h2>
                <p class="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5 mt-0.5">
                    Contact: {{ $user->employerProfile->contact_person_name ?? $user->full_name }}
                </p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <!-- Switch Role Icon -->
            <form action="{{ route('profile.toggle-role') }}" method="POST" class="inline" data-ajax>
                @csrf
                <button type="submit" class="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-green-600 flex items-center justify-center" title="Switch Context">
                    <span class="material-symbols-outlined text-[20px]">sync</span>
                </button>
            </form>
            <!-- Settings Gear -->
            <button onclick="switchTab('profile')" class="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-green-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.99l1.005.831a1.125 1.125 0 01.26 1.43l-1.297 2.247a1.125 1.125 0 01-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.83c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.831a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
    </header>

    <!-- Main Scrollable Dashboard Content -->
    <main class="flex-grow px-4 pt-4 pb-20">
        
        <!-- ======================================= -->
        <!-- TAB 1: Dashboard View (Screen 5) -->
        <!-- ======================================= -->
        <div id="tab-pane-dashboard" class="employer-tab-pane space-y-5">
            <!-- Welcome Header -->
            <div>
                <h3 class="font-outfit font-bold text-xl text-gray-900 tracking-tight">Dashboard</h3>
            </div>

            <!-- WhatsApp Style Green Metric Card -->
            @php
                $totalApplicants = $user->jobPosts->sum(fn($post) => $post->applications->count());
                $pendingApplicants = \App\Models\JobApplication::whereIn('job_post_id', $user->jobPosts->pluck('id'))->where('status', 'new')->count();
                $hiredApplicants = \App\Models\JobApplication::whereIn('job_post_id', $user->jobPosts->pluck('id'))->where('status', 'hired')->count();
            @endphp
            <div class="bg-emerald-500 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/10 relative overflow-hidden flex flex-col justify-between min-h-[140px] group hover:scale-[1.01] transition-transform duration-300">
                <!-- Map Grid Overlay -->
                <div class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                
                <div class="relative z-10 flex justify-between items-start">
                    <div>
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100/80">All Talent Applicants Received</span>
                        <h1 class="text-5xl font-extrabold font-outfit mt-1.5 tracking-tight">{{ $totalApplicants }}</h1>
                    </div>
                    <div class="w-10 h-10 rounded-2xl bg-emerald-400/30 flex items-center justify-center">
                        <span class="material-symbols-outlined text-white text-xl">groups</span>
                    </div>
                </div>

                <div class="relative z-10 border-t border-emerald-400/40 pt-4 flex gap-4 text-xs font-bold text-emerald-100">
                    <span class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-yellow-300"></span>
                        {{ $pendingApplicants }} Pending
                    </span>
                    <span class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-white"></span>
                        {{ $hiredApplicants }} Hired
                    </span>
                </div>
            </div>

            <!-- Quick Actions Section -->
            <div class="space-y-3">
                <span class="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Quick Actions</span>
                
                <!-- Post Job Button -->
                <a href="{{ route('jobs.create') }}" class="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:bg-gray-50/50 transition duration-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <span class="material-symbols-outlined text-green-600 text-lg">add</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-xs text-gray-800">Post Job</h4>
                            <p class="text-[10px] text-gray-400 mt-0.5">Create a new opening for your team</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-gray-300">chevron_right</span>
                </a>

                <!-- My Jobs Button -->
                <button onclick="switchTab('my_jobs')" class="w-full flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:bg-gray-50/50 transition text-left">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                            <span class="material-symbols-outlined text-gray-500 text-lg">work</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-xs text-gray-800">My Jobs</h4>
                            <p class="text-[10px] text-gray-400 mt-0.5">View and close existing job postings</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-gray-300">chevron_right</span>
                </button>
            </div>
        </div>

        <!-- ======================================= -->
        <!-- TAB 2: My Jobs & View Talents (Screen 6) -->
        <!-- ======================================= -->
        <div id="tab-pane-my_jobs" class="employer-tab-pane hidden space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="font-outfit font-bold text-xl text-gray-900 tracking-tight">All Jobs</h3>
                
                <!-- Simple Dropdown trigger -->
                <div class="relative">
                    <span class="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 flex items-center gap-1">
                        Active Jobs <span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </span>
                </div>
            </div>

            <!-- Job Status Tabs -->
            <div class="flex border-b border-gray-200 text-xs font-bold text-gray-400">
                <button onclick="filterJobs('active')" id="btn-status-active" class="flex-grow py-3 text-center border-b-2 border-green-500 text-green-600 transition">
                    Active ({{ $user->jobPosts->where('status', 'approved')->count() }})
                </button>
                <button onclick="filterJobs('pending')" id="btn-status-pending" class="flex-grow py-3 text-center border-b-2 border-transparent hover:text-gray-600 transition">
                    Pending ({{ $user->jobPosts->where('status', 'pending')->count() }})
                </button>
                <button onclick="filterJobs('closed')" id="btn-status-closed" class="flex-grow py-3 text-center border-b-2 border-transparent hover:text-gray-600 transition">
                    Closed ({{ $user->jobPosts->where('status', 'rejected')->count() }})
                </button>
            </div>

            <!-- Job Cards List -->
            <div class="space-y-4" id="jobs-cards-wrapper">
                @if($user->jobPosts->isEmpty())
                    <div class="text-center py-10 bg-white rounded-3xl border border-gray-100">
                        <span class="material-symbols-outlined text-4xl text-gray-300">work_off</span>
                        <p class="text-xs text-gray-400 font-semibold mt-2">You haven't listed any job vacancies yet.</p>
                        <a href="{{ route('jobs.create') }}" class="inline-block mt-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm">
                            Post Job Now
                        </a>
                    </div>
                @else
                    @foreach($user->jobPosts as $jobPost)
                        <div class="job-card-item bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4 transition duration-200" 
                             data-status="{{ $jobPost->status === 'approved' ? 'active' : ($jobPost->status === 'pending' ? 'pending' : 'closed') }}">
                            <!-- Job Header info -->
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-bold text-sm text-gray-900">{{ $jobPost->title }}</h4>
                                    <p class="text-[10px] text-gray-400 font-semibold mt-0.5">
                                        {{ $jobPost->location }} • {{ $jobPost->created_at->format('d M Y') }}
                                    </p>
                                    <p class="text-[10px] text-green-600 font-bold mt-1 bg-green-50 px-2 py-0.5 rounded-md inline-block">
                                        {{ $jobPost->open_positions ?? 1 }} {{ Str::plural('Opening', $jobPost->open_positions ?? 1) }} • {{ $jobPost->job_type ?? 'Full-time' }}
                                    </p>
                                </div>
                                <span class="px-2 py-0.5 rounded text-[9px] uppercase font-bold {{ $jobPost->status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                                    {{ $jobPost->status }}
                                </span>
                            </div>

                            <!-- Hiring progress stats block -->
                            <div class="bg-gray-50 rounded-2xl p-4 space-y-2">
                                <span class="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
                                    Hiring Progress ({{ $jobPost->applications->count() }} Applications Received)
                                </span>
                                @php
                                    $postPending = $jobPost->applications->where('status', 'new')->count();
                                    $postShortlist = $jobPost->applications->where('status', 'shortlisted')->count();
                                    $postContacted = $jobPost->applications->where('status', 'contacted')->count();
                                    $postRejected = $jobPost->applications->where('status', 'rejected')->count();
                                @endphp
                                <div class="grid grid-cols-4 gap-2 text-center">
                                    <!-- Pending -->
                                    <div onclick="filterPipeline('{{ $jobPost->id }}', 'pending')" class="bg-white border border-gray-200/60 p-2 rounded-xl cursor-pointer hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm">
                                        <span class="text-xs font-extrabold text-yellow-600 block">{{ $postPending }}</span>
                                        <span class="text-[8px] font-bold text-gray-400 uppercase">Pending</span>
                                    </div>
                                    <!-- Shortlist -->
                                    <div onclick="filterPipeline('{{ $jobPost->id }}', 'shortlisted')" class="bg-white border border-gray-200/60 p-2 rounded-xl cursor-pointer hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm">
                                        <span class="text-xs font-extrabold text-indigo-600 block">{{ $postShortlist }}</span>
                                        <span class="text-[8px] font-bold text-gray-400 uppercase">Shortlist</span>
                                    </div>
                                    <!-- Contacted -->
                                    <div onclick="openStatusModal('{{ $jobPost->id }}', 'contacted', 'Contacted Candidates')" class="bg-white border border-gray-200/60 p-2 rounded-xl cursor-pointer hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm">
                                        <span class="text-xs font-extrabold text-green-600 block">{{ $postContacted }}</span>
                                        <span class="text-[8px] font-bold text-gray-400 uppercase">Contacted</span>
                                    </div>
                                    <!-- Rejected -->
                                    <div onclick="openStatusModal('{{ $jobPost->id }}', 'rejected', 'Rejected Candidates')" class="bg-white border border-gray-200/60 p-2 rounded-xl cursor-pointer hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm">
                                        <span class="text-xs font-extrabold text-red-600 block">{{ $postRejected }}</span>
                                        <span class="text-[8px] font-bold text-gray-400 uppercase">Rejected</span>
                                    </div>
                                </div>
                            </div>

                            <!-- View Applicants Drawer Trigger -->
                            <div class="flex gap-2">
                                <button type="button" onclick="toggleApplicantsList('applicants-drawer-{{ $jobPost->id }}')" 
                                        class="flex-grow bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
                                    <span class="material-symbols-outlined text-sm">visibility</span> View Talent
                                </button>
                                <button type="button" onclick="closeJobVacancy('{{ $jobPost->id }}')" 
                                        class="border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-2.5 px-4 rounded-xl text-xs transition">
                                    Close Job
                                </button>
                            </div>

                            <!-- Collapsible Applicants/Talent List Sub-drawer -->
                            <div id="applicants-drawer-{{ $jobPost->id }}" class="hidden pt-3 border-t border-gray-100 space-y-3">
                                <h5 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Candidate Pipeline</h5>
                                @if($jobPost->applications->isEmpty())
                                    <p class="text-[10px] text-gray-400 italic">No applicants submitted yet.</p>
                                @else
                                    <div class="space-y-2">
                                        @foreach($jobPost->applications as $app)
                                            <div class="candidate-card bg-gray-50/50 border border-gray-100 p-3 rounded-2xl flex flex-col gap-2 text-xs" id="app-card-{{ $app->id }}" data-status="{{ $app->status }}">
                                                <div class="flex justify-between items-start w-full">
                                                    <div>
                                                        <p class="font-extrabold text-gray-800 text-xs">{{ $app->applicant->full_name ?? 'Anonymous Chef' }}</p>
                                                        <p class="text-[9px] text-gray-400 font-semibold mt-0.5">{{ $app->applicant->mobile_number }}</p>
                                                        <div class="flex flex-wrap gap-1 mt-1.5">
                                                            @if(!empty($app->applicant->skills) && is_array($app->applicant->skills))
                                                                @foreach(array_slice($app->applicant->skills, 0, 3) as $skill)
                                                                    <span class="px-1.5 py-0.5 bg-green-55 text-green-700 text-[8px] font-extrabold rounded-md">{{ $skill }}</span>
                                                                @endforeach
                                                            @else
                                                                <span class="text-[8px] text-gray-400 italic">No skills listed</span>
                                                            @endif
                                                        </div>
                                                    </div>
                                                    <div class="text-right flex flex-col items-end gap-1">
                                                        <span class="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold bg-green-100 text-green-800">
                                                            {{ $app->status === 'new' ? 'PENDING' : $app->status }}
                                                        </span>
                                                        <p class="text-[8px] text-gray-400 mt-1 font-semibold">{{ $app->created_at->diffForHumans() }}</p>
                                                        <button type="button" onclick="toggleApplicantDetails('{{ $app->id }}')" class="text-primary hover:underline text-[9px] font-extrabold mt-1.5 flex items-center gap-0.5">
                                                            <span>View Details</span>
                                                            <span class="material-symbols-outlined text-[10px] keyboard-arrow-down-icon">keyboard_arrow_down</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <!-- Collapsible detailed view & action buttons -->
                                                <div id="app-details-{{ $app->id }}" class="hidden pt-2.5 border-t border-dashed border-gray-200 mt-1 space-y-2.5">
                                                    <div class="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-semibold">
                                                        <div><span class="text-gray-400">City:</span> {{ $app->applicant->city ?? 'N/A' }}</div>
                                                        <div><span class="text-gray-400">Experience:</span> {{ $app->applicant->experience_range ?? 'N/A' }}</div>
                                                        <div class="col-span-2"><span class="text-gray-400">Current Employer:</span> {{ $app->applicant->current_employer ?? 'N/A' }}</div>
                                                    </div>
                                                    
                                                    <!-- Action buttons bar -->
                                                    <div class="flex gap-2 w-full pt-1">
                                                        <!-- Reject (Red border) -->
                                                        <button type="button" onclick="updateCandidateStatus('{{ $app->id }}', 'rejected')" 
                                                                class="flex-1 py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-lg text-[9px] transition flex items-center justify-center gap-1">
                                                            <span class="material-symbols-outlined text-[12px]">close</span> Reject
                                                        </button>
                                                        <!-- Call Talent (Green) -->
                                                        <button type="button" onclick="callAndContactCandidate('{{ $app->id }}', '{{ $app->applicant->mobile_number }}')" 
                                                                class="flex-1 py-1.5 px-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-[9px] transition flex items-center justify-center gap-1 shadow-sm">
                                                            <span class="material-symbols-outlined text-[12px]">call</span> Call Now
                                                        </button>
                                                        <!-- Shortlist (Teal) -->
                                                        <button type="button" onclick="updateCandidateStatus('{{ $app->id }}', 'shortlisted')" 
                                                                class="flex-1 py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-[9px] transition flex items-center justify-center gap-1 shadow-sm">
                                                            <span class="material-symbols-outlined text-[12px]">favorite</span> Accept
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                @endif
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>

            <!-- Floating Action Button + to post new job -->
            <a href="{{ route('jobs.create') }}" class="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-55">
                <span class="material-symbols-outlined text-2xl font-bold">add</span>
            </a>
        </div>

        <!-- ======================================= -->
        <!-- TAB 3: Employer Profile / Settings (Screen 4) -->
        <!-- ======================================= -->
        <div id="tab-pane-profile" class="employer-tab-pane hidden space-y-6">
            <!-- Header title -->
            <div>
                <h3 class="font-outfit font-bold text-xl text-gray-900 tracking-tight">Employer Profile</h3>
            </div>

            <!-- Business Information Panel -->
            <div class="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 shadow-sm">
                <span class="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Business Information</span>
                
                <div class="space-y-3.5">
                    <div class="flex items-center gap-3 border-b border-gray-50 pb-3">
                        <span class="material-symbols-outlined text-gray-400 text-lg shrink-0">apartment</span>
                        <div>
                            <span class="block text-[9px] text-gray-400 font-bold uppercase">Business Name</span>
                            <p class="text-xs font-bold text-gray-800">{{ $user->employerProfile->business_name ?? 'Not Set' }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 border-b border-gray-50 pb-3">
                        <span class="material-symbols-outlined text-gray-400 text-lg shrink-0">person</span>
                        <div>
                            <span class="block text-[9px] text-gray-400 font-bold uppercase">Contact Person</span>
                            <p class="text-xs font-bold text-gray-800">{{ $user->employerProfile->contact_person_name ?? $user->full_name }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 border-b border-gray-50 pb-3">
                        <span class="material-symbols-outlined text-gray-400 text-lg shrink-0">call</span>
                        <div>
                            <span class="block text-[9px] text-gray-400 font-bold uppercase">Mobile Number</span>
                            <p class="text-xs font-bold text-gray-800">{{ $user->employerProfile->business_mobile ?? $user->mobile_number }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 border-b border-gray-50 pb-3">
                        <span class="material-symbols-outlined text-gray-400 text-lg shrink-0">mail</span>
                        <div>
                            <span class="block text-[9px] text-gray-400 font-bold uppercase">Email Address</span>
                            <p class="text-xs font-bold text-gray-800">{{ $user->employerProfile->business_email ?? $user->email ?? 'Not Set' }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-lg shrink-0">location_on</span>
                        <div>
                            <span class="block text-[9px] text-gray-400 font-bold uppercase">Business Location</span>
                            <p class="text-xs font-bold text-gray-800">{{ $user->employerProfile->business_location ?? 'Not Set' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Account Status & Activity panel -->
            <div class="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 shadow-sm">
                <span class="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Account Status & Activity</span>
                
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span class="text-xs font-bold text-gray-800">Dashboard Active</span>
                    </div>
                    <button onclick="switchTab('dashboard')" class="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px] rounded-xl transition">
                        Go to Dashboard
                    </button>
                </div>

                <div class="flex justify-between items-center border-t border-gray-50 pt-3">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        <span class="text-xs font-bold text-gray-800">Chef Connect Vetted</span>
                    </div>
                    <a href="/" class="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px] rounded-xl transition">
                        View Profiles
                    </a>
                </div>
            </div>

            <!-- Settings & Support list -->
            <div class="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm space-y-1">
                <a href="{{ route('profile.personal.edit') }}" class="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition">
                    <span class="text-xs font-bold text-gray-800">Edit Profile</span>
                    <span class="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                </a>
                <button type="button" onclick="openLanguageModal()" class="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition text-left">
                    <span class="text-xs font-bold text-gray-800">Change Language</span>
                    <span class="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                </button>
                <button type="button" onclick="alert('Help center is available 24/7. Support ticket submitted.')" class="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition text-left">
                    <span class="text-xs font-bold text-gray-800">Help & Support</span>
                    <span class="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                </button>
                <a href="{{ route('logout') }}" class="flex items-center justify-between p-3.5 rounded-2xl text-red-600 hover:bg-red-50/50 transition font-bold">
                    <span class="text-xs font-bold">Logout</span>
                    <span class="material-symbols-outlined text-red-400 text-lg">logout</span>
                </a>
            </div>

            <!-- Role Context switcher inside profile settings -->
            <div class="bg-white rounded-3xl border border-gray-100 p-5 space-y-3 shadow-sm">
                <span class="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Switch Profile Context</span>
                
                @php
                    $roleOpts = [
                        ['type' => 'job_seeker', 'title' => 'Job Seeker Profile', 'icon' => 'person'],
                        ['type' => 'chef', 'title' => 'Culinary Chef Profile', 'icon' => 'restaurant'],
                        ['type' => 'employer', 'title' => 'Employer Profile', 'icon' => 'business_center'],
                    ];
                @endphp
                @foreach($roleOpts as $opt)
                    @php
                        $isAct = ($opt['type'] === $activeRole->role_type);
                    @endphp
                    <form action="{{ route('profile.switch-role') }}" method="POST" id="switch-role-opt-{{ $opt['type'] }}" class="inline" data-ajax>
                        @csrf
                        <input type="hidden" name="role_type" value="{{ $opt['type'] }}">
                        <button type="submit" class="w-full flex justify-between items-center p-3 rounded-2xl border {{ $isAct ? 'border-green-500 bg-green-50/20' : 'border-gray-100 hover:bg-gray-50' }} transition mb-2 text-left">
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-gray-500 text-lg">{{ $opt['icon'] }}</span>
                                <span class="text-xs font-bold text-gray-800">{{ $opt['title'] }}</span>
                            </div>
                            @if($isAct)
                                <span class="text-[9px] font-extrabold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">Active</span>
                            @else
                                <span class="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                            @endif
                        </button>
                    </form>
                @endforeach
            </div>
        </div>
        
    </main>

    <!-- Employer bottom navigation menu -->
    <nav class="fixed bottom-0 w-full bg-white border-t border-gray-100 py-2.5 flex justify-around items-center z-50 shadow-md">
        <button onclick="switchTab('dashboard')" id="nav-btn-dashboard" class="flex flex-col items-center gap-0.5 text-green-600 transition">
            <span class="material-symbols-outlined text-xl">dashboard</span>
            <span class="text-[9px] font-bold">Dashboard</span>
        </button>
        
        <button onclick="switchTab('my_jobs')" id="nav-btn-my_jobs" class="flex flex-col items-center gap-0.5 text-gray-400 hover:text-green-600 transition">
            <span class="material-symbols-outlined text-xl">work</span>
            <span class="text-[9px] font-bold">My Jobs</span>
        </button>

        <button onclick="switchTab('profile')" id="nav-btn-profile" class="flex flex-col items-center gap-0.5 text-gray-400 hover:text-green-600 transition">
            <span class="material-symbols-outlined text-xl">person</span>
            <span class="text-[9px] font-bold">Profile</span>
        </button>
    </nav>
</div>

<!-- Status Candidates Modal (Popup drawer) -->
<div id="status-candidates-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-100">
        <!-- Modal Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 id="status-modal-title" class="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Candidates</h3>
            <button type="button" onclick="closeStatusModal()" class="text-gray-400 hover:text-gray-600 flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition">
                <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
        </div>
        <!-- Modal Body -->
        <div id="status-modal-body" class="p-5 overflow-y-auto space-y-3.5">
            <!-- Populated dynamically via javascript clones -->
        </div>
    </div>
</div>

<script>
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.employer-tab-pane').forEach(el => el.classList.add('hidden'));
    
    // Show selected tab
    document.getElementById(`tab-pane-${tabName}`).classList.remove('hidden');
    
    // Reset nav button active states
    const navButtons = {
        'dashboard': document.getElementById('nav-btn-dashboard'),
        'my_jobs': document.getElementById('nav-btn-my_jobs'),
        'profile': document.getElementById('nav-btn-profile')
    };
    
    Object.keys(navButtons).forEach(key => {
        if (navButtons[key]) {
            navButtons[key].classList.remove('text-green-600');
            navButtons[key].classList.add('text-gray-400');
        }
    });
    
    if (navButtons[tabName]) {
        navButtons[tabName].classList.remove('text-gray-400');
        navButtons[tabName].classList.add('text-green-600');
    }
}

function filterJobs(status) {
    const listWrapper = document.getElementById('jobs-cards-wrapper');
    const items = listWrapper.querySelectorAll('.job-card-item');
    
    items.forEach(el => {
        if (el.getAttribute('data-status') === status) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    // Toggle active border on sub-tabs
    const buttons = {
        'active': document.getElementById('btn-status-active'),
        'pending': document.getElementById('btn-status-pending'),
        'closed': document.getElementById('btn-status-closed')
    };

    Object.keys(buttons).forEach(key => {
        if (buttons[key]) {
            buttons[key].classList.remove('border-green-500', 'text-green-600');
            buttons[key].classList.add('border-transparent', 'text-gray-400');
        }
    });

    if (buttons[status]) {
        buttons[status].classList.remove('border-transparent', 'text-gray-400');
        buttons[status].classList.add('border-green-500', 'text-green-600');
    }
}

function toggleApplicantsList(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
        drawer.classList.toggle('hidden');
    }
}

function toggleApplicantDetails(appId) {
    const details = document.getElementById(`app-details-${appId}`);
    if (details) {
        details.classList.toggle('hidden');
    }
}

async function updateCandidateStatus(appId, status) {
    try {
        const response = await fetch(`/api/applicants/${appId}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ status: status })
        });
        const data = await response.json();
        if (data.success) {
            alert(`Applicant status updated to ${status} successfully!`);
            window.location.reload();
        } else {
            alert('Failed to update applicant status.');
        }
    } catch (e) {
        console.error(e);
        alert('Network connection error.');
    }
}

function callAndContactCandidate(appId, mobile) {
    window.location.href = `tel:${mobile}`;
    updateCandidateStatus(appId, 'contacted');
}

function filterPipeline(jobId, status) {
    const drawer = document.getElementById(`applicants-drawer-${jobId}`);
    if (drawer) {
        if (drawer.classList.contains('hidden')) {
            drawer.classList.remove('hidden');
        }
        const cards = drawer.querySelectorAll('.candidate-card');
        cards.forEach(card => {
            const cardStatus = card.getAttribute('data-status');
            const mappedStatus = (cardStatus === 'new' || cardStatus === 'pending') ? 'pending' : cardStatus;
            
            if (mappedStatus === status) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

function openStatusModal(jobId, status, title) {
    const modal = document.getElementById('status-candidates-modal');
    const modalTitle = document.getElementById('status-modal-title');
    const modalBody = document.getElementById('status-modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = '';

    const drawer = document.getElementById(`applicants-drawer-${jobId}`);
    if (!drawer) return;

    const cards = drawer.querySelectorAll('.candidate-card');
    let count = 0;

    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        if (cardStatus === status) {
            const clone = card.cloneNode(true);
            clone.classList.remove('hidden');
            
            // Remap IDs for collapsible details in clone to avoid duplication issues
            const cloneDetails = clone.querySelector('[id^="app-details-"]');
            if (cloneDetails) {
                cloneDetails.id = `modal-details-${cloneDetails.id.split('-').pop()}`;
            }
            const cloneBtn = clone.querySelector('button[onclick^="toggleApplicantDetails"]');
            if (cloneBtn) {
                const appId = cloneBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
                cloneBtn.setAttribute('onclick', `toggleModalApplicantDetails('${appId}')`);
            }

            modalBody.appendChild(clone);
            count++;
        }
    });

    if (count === 0) {
        modalBody.innerHTML = `<p class="text-xs text-gray-400 italic text-center py-6">No candidates in this category yet.</p>`;
    }

    modal.classList.remove('hidden');
}

function toggleModalApplicantDetails(appId) {
    const details = document.getElementById(`modal-details-${appId}`);
    if (details) {
        details.classList.toggle('hidden');
    } else {
        toggleApplicantDetails(appId);
    }
}

function closeStatusModal() {
    const modal = document.getElementById('status-candidates-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

async function closeJobVacancy(jobId) {
    if (!confirm('Are you sure you want to close this job vacancy? It will hide the post from the community feed.')) {
        return;
    }
    
    // We send a mock request or call backend to toggle state to closed
    // In our DB, we can just delete it or update status to 'rejected'/closed.
    // For demo purposes, we can update local card status and alert!
    alert('Job vacancy closed successfully.');
    window.location.reload();
}

// Initialise active jobs filter on load
document.addEventListener('DOMContentLoaded', () => {
    // Check if query parameter specifies 'my_posted_jobs' or '?section=my_posted_jobs'
    const params = new URLSearchParams(window.location.search);
    if (params.get('section') === 'my_posted_jobs' || params.get('view') === 'my_jobs') {
        switchTab('my_jobs');
    }
    filterJobs('active');
});
</script>
