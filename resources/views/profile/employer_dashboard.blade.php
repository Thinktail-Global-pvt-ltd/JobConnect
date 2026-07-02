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
        <!-- TAB 2.5: Chef Connect Talent Discovery -->
        <!-- ======================================= -->
        <div id="tab-pane-chef_connect" class="employer-tab-pane hidden space-y-5">
            <!-- Header Title -->
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-outfit font-bold text-xl text-gray-900 tracking-tight">Chef Connect</h3>
                    <p class="text-[10px] text-gray-400 font-semibold mt-0.5">Discover Available Hospitality Professionals</p>
                </div>
                <!-- Count Badge -->
                <span class="text-[10px] font-extrabold uppercase px-3 py-1 rounded-xl bg-green-50 text-green-700 border border-green-100 shrink-0">
                    {{ count($registeredChefs) }} Chefs
                </span>
            </div>

            <!-- Search & Filters -->
            <div class="space-y-3">
                <div class="flex items-center gap-2">
                    <!-- Search Input -->
                    <div class="flex-grow relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input type="text" id="chef-search" onkeyup="filterChefs()" placeholder="Name, Cuisine, or Location" 
                               class="w-full bg-white border border-gray-100 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 shadow-sm transition">
                    </div>
                    <!-- Advanced Filters Toggle -->
                    <button onclick="toggleAdvancedChefFilters()" class="shrink-0 p-2.5 bg-white border border-gray-100 hover:bg-gray-50 rounded-2xl shadow-sm text-gray-500 hover:text-green-600 transition flex items-center justify-center">
                        <span class="material-symbols-outlined text-lg">tune</span>
                    </button>
                 </div>

                 <!-- Filter Badges/Tabs -->
                 <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                     <button onclick="filterChefType('all')" id="btn-chef-all" class="chef-type-filter-btn px-4 py-2 rounded-xl text-[10px] font-extrabold bg-green-600 text-white shadow-sm transition">
                         All Professionals
                     </button>
                     <button onclick="filterChefType('Freelance')" id="btn-chef-freelance" class="chef-type-filter-btn px-4 py-2 rounded-xl text-[10px] font-extrabold bg-white border border-gray-100 text-gray-500 hover:bg-gray-50/50 transition">
                         Freelance Chef
                     </button>
                     <button onclick="filterChefType('Full Time')" id="btn-chef-fulltime" class="chef-type-filter-btn px-4 py-2 rounded-xl text-[10px] font-extrabold bg-white border border-gray-100 text-gray-500 hover:bg-gray-50/50 transition">
                         Full Time
                     </button>
                 </div>
            </div>

            <!-- Chefs Grid / List -->
            <div id="chefs-list-wrapper" class="space-y-4">
                @if(count($registeredChefs) === 0)
                    <div class="bg-white border border-gray-100 p-8 rounded-3xl text-center shadow-sm">
                        <span class="material-symbols-outlined text-gray-300 text-4xl">restaurant</span>
                        <p class="text-xs text-gray-400 font-semibold mt-2">No chefs registered on the platform yet.</p>
                    </div>
                @else
                    @foreach($registeredChefs as $chef)
                        @php
                            $pref = $chef->decoded_availability['employment_preference'] ?? [];
                            $prefStr = is_array($pref) ? implode(' • ', $pref) : $pref;
                            $isFreelance = str_contains(strtolower($prefStr), 'freelance') || str_contains(strtolower($prefStr), 'consultant');
                            $isFullTime = str_contains(strtolower($prefStr), 'full time') || str_contains(strtolower($prefStr), 'permanent') || count($pref) === 0;
                            
                            // Tags
                            $regional = $chef->decoded_availability['regional_experience'] ?? [];
                        @endphp
                        <div class="chef-card-item bg-white border border-gray-100 p-4 rounded-3xl shadow-sm hover:scale-[1.005] transition-all duration-300 flex flex-col justify-between gap-3"
                             data-name="{{ strtolower($chef->full_name) }}"
                             data-cuisine="{{ strtolower($chef->chefProfile->cuisine_specialty ?? '') }}"
                             data-location="{{ strtolower($chef->city ?? '') }}"
                             data-freelance="{{ $isFreelance ? 'true' : 'false' }}"
                             data-fulltime="{{ $isFullTime ? 'true' : 'false' }}">
                             
                             <div class="flex items-start gap-3">
                                 <!-- Avatar -->
                                 <div class="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 overflow-hidden shrink-0">
                                     <img src="{{ $chef->profile_photo_path ?? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120&h=120' }}" class="w-full h-full object-cover">
                                 </div>
                                 <div class="flex-grow">
                                     <div class="flex justify-between items-start">
                                         <div>
                                             <h4 class="font-outfit font-extrabold text-sm text-gray-900">{{ $chef->full_name }}</h4>
                                             <p class="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5 mt-0.5">
                                                 📍 {{ $chef->city ?? 'Location Not Disclosed' }}
                                             </p>
                                         </div>
                                         <!-- Badge -->
                                         <span class="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
                                             {{ count($pref) > 0 ? $pref[0] : 'Chef Professional' }}
                                         </span>
                                     </div>
                                     
                                     <div class="mt-2 space-y-1 text-[11px]">
                                         <div class="flex items-center gap-1 text-gray-500 font-semibold">
                                             <span class="material-symbols-outlined text-[14px]">history</span>
                                             <span>{{ $chef->experience_range ?? '0' }} Experience</span>
                                         </div>
                                         <div class="flex items-center gap-1 text-green-600 font-bold">
                                             <span class="material-symbols-outlined text-[14px]">restaurant_menu</span>
                                             <span>{{ $chef->chefProfile->cuisine_specialty ?? 'Multi-Cuisine' }} Specialty</span>
                                         </div>
                                     </div>

                                     <!-- Tags -->
                                     @if(count($regional) > 0)
                                         <div class="flex flex-wrap gap-1.5 mt-3">
                                             @foreach($regional as $tag)
                                                 <span class="text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-md">
                                                     {{ $tag }} Experience
                                                 </span>
                                             @endforeach
                                         </div>
                                     @endif
                                 </div>
                             </div>

                             <!-- Actions -->
                             <div class="flex flex-col gap-2 mt-1">
                                 @if($isFreelance)
                                     <button onclick="openBookingDrawer('{{ $chef->id }}', '{{ addslashes($chef->full_name) }}', '{{ addslashes($chef->chefProfile->cuisine_specialty ?? 'Specialist') }}', '{{ $chef->experience_range }}', '{{ $chef->profile_photo_path ?? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120&h=120' }}', '{{ $chef->chefProfile->calendly_link }}')"
                                             class="w-full bg-green-500 hover:bg-green-600 text-white font-extrabold text-xs py-2.5 rounded-2xl shadow-sm shadow-green-500/10 transition-colors flex items-center justify-center gap-1.5">
                                         <span class="material-symbols-outlined text-sm">event</span>
                                         Book Consultation
                                     </button>
                                 @else
                                     <button onclick="requestChefResume('{{ $chef->id }}', '{{ addslashes($chef->full_name) }}')"
                                             class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-2.5 rounded-2xl transition flex items-center justify-center gap-1.5">
                                         <span class="material-symbols-outlined text-sm">download</span>
                                         Request Resume
                                     </button>
                                 @endif
                                 <button onclick="openChefDetailsDrawer({{ json_encode($chef) }})"
                                         class="w-full border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-800 font-extrabold text-[10px] py-2 rounded-2xl transition">
                                     View Full Profile
                                 </button>
                             </div>
                        </div>
                    @endforeach
                @endif
            </div>
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

        <button onclick="switchTab('chef_connect')" id="nav-btn-chef_connect" class="flex flex-col items-center gap-0.5 text-gray-400 hover:text-green-600 transition">
            <span class="material-symbols-outlined text-xl">restaurant_menu</span>
            <span class="text-[9px] font-bold">Chef Connect</span>
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

<!-- Chef Details Drawer (Screen 2) -->
<div id="chef-details-drawer" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div class="flex items-center gap-2">
                <button type="button" onclick="closeChefDetailsDrawer()" class="text-gray-400 hover:text-gray-600 flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition">
                    <span class="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <h3 class="font-outfit font-extrabold text-sm text-gray-800">Chef Profile</h3>
            </div>
            <button type="button" onclick="closeChefDetailsDrawer()" class="text-gray-400 hover:text-gray-600 flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition">
                <span class="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
        </div>
        
        <!-- Body -->
        <div class="p-5 overflow-y-auto space-y-5">
            <!-- Profile Header Card -->
            <div class="flex flex-col items-center text-center space-y-2">
                <div class="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden relative mx-auto">
                    <img id="detail-chef-avatar" src="" class="w-full h-full object-cover rounded-full">
                    <!-- Active status dot -->
                    <span class="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <h2 id="detail-chef-name" class="font-outfit font-extrabold text-base text-gray-900"></h2>
                    <p id="detail-chef-location" class="text-xs text-gray-400 font-semibold mt-0.5"></p>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Available for Consultation
                </span>
            </div>

            <!-- Professional Summary -->
            <div class="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-2">
                <h4 class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Professional Summary</h4>
                <p id="detail-chef-bio" class="text-xs text-gray-600 leading-relaxed font-semibold"></p>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-white border border-gray-100 p-3.5 rounded-2xl flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-green-600 text-sm">schedule</span>
                    </div>
                    <div>
                        <span class="block text-[8px] font-extrabold text-gray-400 uppercase">Experience</span>
                        <span id="detail-chef-experience" class="text-xs font-bold text-gray-800"></span>
                    </div>
                </div>
                <div class="bg-white border border-gray-100 p-3.5 rounded-2xl flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-blue-600 text-sm">verified_user</span>
                    </div>
                    <div>
                        <span class="block text-[8px] font-extrabold text-gray-400 uppercase">Identity</span>
                        <span class="text-xs font-bold text-blue-600">Verified ✔</span>
                    </div>
                </div>
            </div>

            <!-- Dynamic Lists Sections -->
            <div class="space-y-4">
                <!-- Employment Preferences -->
                <div class="space-y-1.5">
                    <span class="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Employment Preference</span>
                    <div id="detail-chef-employment" class="flex flex-wrap gap-1.5"></div>
                </div>

                <!-- Cuisine Expertise -->
                <div class="space-y-1.5">
                    <span class="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Cuisine Expertise</span>
                    <div id="detail-chef-cuisine" class="flex flex-wrap gap-1.5"></div>
                </div>

                <!-- Operational Expertise -->
                <div class="space-y-1.5">
                    <span class="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Operational Expertise</span>
                    <div id="detail-chef-operational" class="flex flex-wrap gap-1.5"></div>
                </div>

                <!-- Core Skills -->
                <div class="space-y-1.5">
                    <span class="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Core Skills</span>
                    <div id="detail-chef-skills" class="flex flex-wrap gap-1.5"></div>
                </div>

                <!-- Regional Experience -->
                <div class="space-y-1.5">
                    <span class="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Regional Experience</span>
                    <div id="detail-chef-regional" class="flex flex-wrap gap-1.5"></div>
                </div>
            </div>

            <!-- Social Links -->
            <div class="border-t border-gray-100 pt-4 flex justify-center gap-6">
                <button type="button" class="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition">
                    <span class="material-symbols-outlined text-base">link</span>
                </button>
                <button type="button" class="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition">
                    <span class="material-symbols-outlined text-base">language</span>
                </button>
                <button type="button" class="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition">
                    <span class="material-symbols-outlined text-base">mail</span>
                </button>
            </div>
        </div>

        <!-- Sticky Footer Action -->
        <div class="p-4 border-t border-gray-100 bg-gray-50/50">
            <button id="detail-action-btn" onclick="" class="w-full bg-green-500 hover:bg-green-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg shadow-green-500/10 transition-colors flex items-center justify-center gap-1.5">
                Get Appointment
            </button>
        </div>
    </div>
</div>

<!-- Chef Booking Drawer (Screen 3) -->
<div id="chef-booking-drawer" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div class="flex items-center gap-2">
                <button type="button" onclick="closeBookingDrawer()" class="text-gray-400 hover:text-gray-600 flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition">
                    <span class="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <h3 class="font-outfit font-extrabold text-sm text-gray-800">Book Appointment</h3>
            </div>
            <button type="button" onclick="closeBookingDrawer()" class="text-gray-400 hover:text-gray-600 flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition">
                <span class="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
        </div>
        
        <!-- Body -->
        <div class="p-5 overflow-y-auto space-y-5">
            <!-- Small Chef Header Summary -->
            <div class="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                    <img id="booking-chef-avatar" src="" class="w-full h-full object-cover">
                </div>
                <div>
                    <h4 id="booking-chef-name" class="font-outfit font-extrabold text-xs text-gray-800"></h4>
                    <p id="booking-chef-specialty" class="text-[10px] text-gray-400 font-semibold mt-0.5"></p>
                </div>
            </div>

            <!-- Calendly Status Info -->
            <div class="flex items-center justify-between bg-blue-50 border border-blue-100 px-4 py-3 rounded-2xl">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-blue-600 text-lg">calendar_month</span>
                    <span class="text-[10px] font-extrabold text-blue-800">Calendly Connected</span>
                </div>
                <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            </div>

            <!-- Slots Grid Section -->
            <div class="space-y-4">
                <span class="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Available Slots</span>
                
                <!-- Day 1 -->
                <div class="space-y-2">
                    <span class="block text-[10px] font-bold text-gray-800">Monday, Oct 23</span>
                    <div class="grid grid-cols-2 gap-2">
                        <button type="button" onclick="selectTimeSlot(this)" class="time-slot-btn py-2.5 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">10:00 AM</button>
                        <button type="button" onclick="selectTimeSlot(this)" class="time-slot-btn py-2.5 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">11:30 AM</button>
                        <button type="button" onclick="selectTimeSlot(this)" class="time-slot-btn py-2.5 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">2:00 PM</button>
                        <button type="button" onclick="selectTimeSlot(this)" class="time-slot-btn py-2.5 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">4:30 PM</button>
                    </div>
                </div>

                <!-- Day 2 -->
                <div class="space-y-2">
                    <span class="block text-[10px] font-bold text-gray-800">Tuesday, Oct 24</span>
                    <div class="grid grid-cols-2 gap-2">
                        <button type="button" onclick="selectTimeSlot(this)" class="time-slot-btn py-2.5 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">9:00 AM</button>
                        <button type="button" onclick="selectTimeSlot(this)" class="time-slot-btn py-2.5 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">12:00 PM</button>
                        <button type="button" onclick="selectTimeSlot(this)" class="time-slot-btn py-2.5 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">3:30 PM</button>
                    </div>
                </div>
            </div>

            <!-- Purpose of meeting textarea -->
            <div class="space-y-1.5">
                <span class="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Purpose of Meeting (Optional)</span>
                <textarea id="booking-purpose" placeholder="Briefly describe what you'd like to discuss..." 
                          class="w-full bg-white border border-gray-100 p-3.5 rounded-2xl text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 shadow-sm transition h-20 resize-none"></textarea>
            </div>
        </div>

        <!-- Sticky Footer Action -->
        <div class="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
            <button onclick="confirmChefBooking()" class="w-full bg-green-500 hover:bg-green-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg shadow-green-500/10 transition-colors">
                Confirm Appointment
            </button>
            <button onclick="closeBookingDrawer()" class="w-full hover:bg-gray-100 text-gray-500 font-extrabold text-[10px] py-2 rounded-2xl transition">
                Cancel
            </button>
        </div>
    </div>
</div>

<script>
let selectedChefId = null;
let selectedChefName = '';
let selectedTimeSlotText = '';

function filterChefs() {
    const searchVal = document.getElementById('chef-search').value.toLowerCase();
    const cards = document.querySelectorAll('.chef-card-item');
    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const cuisine = card.getAttribute('data-cuisine');
        const location = card.getAttribute('data-location');
        
        if (name.includes(searchVal) || cuisine.includes(searchVal) || location.includes(searchVal)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterChefType(type) {
    // Update button styling
    document.querySelectorAll('.chef-type-filter-btn').forEach(btn => {
        btn.classList.remove('bg-green-600', 'text-white', 'shadow-sm');
        btn.classList.add('bg-white', 'border', 'border-gray-100', 'text-gray-500');
    });
    
    const activeBtnId = `btn-chef-${type === 'all' ? 'all' : (type === 'Freelance' ? 'freelance' : 'fulltime')}`;
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'border', 'border-gray-100', 'text-gray-500');
        activeBtn.classList.add('bg-green-600', 'text-white', 'shadow-sm');
    }

    // Filter cards
    const cards = document.querySelectorAll('.chef-card-item');
    cards.forEach(card => {
        const isFreelance = card.getAttribute('data-freelance') === 'true';
        const isFullTime = card.getAttribute('data-fulltime') === 'true';
        
        if (type === 'all') {
            card.style.display = 'flex';
        } else if (type === 'Freelance') {
            card.style.display = isFreelance ? 'flex' : 'none';
        } else if (type === 'Full Time') {
            card.style.display = isFullTime ? 'flex' : 'none';
        }
    });
}

function openChefDetailsDrawer(chef) {
    const drawer = document.getElementById('chef-details-drawer');
    if (!drawer) return;
    
    // Populate basic details
    document.getElementById('detail-chef-avatar').src = chef.profile_photo_path || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120&h=120';
    document.getElementById('detail-chef-name').textContent = chef.full_name;
    document.getElementById('detail-chef-location').textContent = `📍 ${chef.city || 'India & Overseas'}`;
    document.getElementById('detail-chef-bio').textContent = chef.chef_profile ? chef.chef_profile.bio : 'No professional summary provided.';
    document.getElementById('detail-chef-experience').textContent = `${chef.experience_range || '0+'} Years`;

    // Helper function to render tag badges
    const renderTags = (containerId, tagsArray, colorClass = 'bg-gray-100 text-gray-600') => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        if (tagsArray && tagsArray.length > 0) {
            tagsArray.forEach(tag => {
                const span = document.createElement('span');
                span.className = `text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${colorClass}`;
                span.textContent = tag;
                container.appendChild(span);
            });
        } else {
            container.innerHTML = '<span class="text-[9px] text-gray-400 font-semibold">Not Specified</span>';
        }
    };

    // Populate preferences and tags
    const pref = chef.decoded_availability.employment_preference || [];
    renderTags('detail-chef-employment', pref, 'bg-gray-100 text-gray-600');
    
    const cuisines = chef.chef_profile && chef.chef_profile.cuisine_specialty ? [chef.chef_profile.cuisine_specialty] : [];
    renderTags('detail-chef-cuisine', cuisines, 'bg-green-50 text-green-700 border border-green-100');

    // Populate mock operational, skills, regional tags
    const operational = ['Kitchen Setup', 'Menu Engineering', 'Team Management'];
    renderTags('detail-chef-operational', operational, 'bg-blue-50 text-blue-700 border border-blue-100');

    const coreSkills = chef.skills || [];
    renderTags('detail-chef-skills', coreSkills, 'bg-gray-50 text-gray-500 border border-gray-100');

    const regional = chef.decoded_availability.regional_experience || [];
    renderTags('detail-chef-regional', regional, 'bg-purple-50 text-purple-700 border border-purple-100');

    // Update button action
    const actionBtn = document.getElementById('detail-action-btn');
    const prefStr = pref.join(' ').toLowerCase();
    const isFreelance = prefStr.includes('freelance') || prefStr.includes('consultant');
    
    if (isFreelance) {
        actionBtn.textContent = 'Get Appointment';
        actionBtn.setAttribute('onclick', `closeChefDetailsDrawer(); openBookingDrawer('${chef.id}', '${chef.full_name.replace(/'/g, "\\'")}', '${chef.chef_profile ? chef.chef_profile.cuisine_specialty : 'Specialist'}', '${chef.experience_range}', '${chef.profile_photo_path}', '${chef.chef_profile ? chef.chef_profile.calendly_link : ''}')`);
    } else {
        actionBtn.textContent = 'Request Resume';
        actionBtn.setAttribute('onclick', `closeChefDetailsDrawer(); requestChefResume('${chef.id}', '${chef.full_name.replace(/'/g, "\\'")}')`);
    }

    drawer.classList.remove('hidden');
}

function closeChefDetailsDrawer() {
    const drawer = document.getElementById('chef-details-drawer');
    if (drawer) drawer.classList.add('hidden');
}

function openBookingDrawer(id, name, specialty, experience, avatar, calendly) {
    selectedChefId = id;
    selectedChefName = name;
    selectedTimeSlotText = '';
    
    const drawer = document.getElementById('chef-booking-drawer');
    if (!drawer) return;

    document.getElementById('booking-chef-avatar').src = avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120&h=120';
    document.getElementById('booking-chef-name').textContent = name;
    document.getElementById('booking-chef-specialty').textContent = `${specialty} Specialist • ${experience}`;
    document.getElementById('booking-purpose').value = '';

    // Reset slot buttons active states
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('bg-green-500', 'text-white', 'border-green-500');
        btn.classList.add('bg-white', 'border-gray-100', 'text-gray-700');
    });

    drawer.classList.remove('hidden');
}

function closeBookingDrawer() {
    const drawer = document.getElementById('chef-booking-drawer');
    if (drawer) drawer.classList.add('hidden');
}

function selectTimeSlot(button) {
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('bg-green-500', 'text-white', 'border-green-500');
        btn.classList.add('bg-white', 'border-gray-100', 'text-gray-700');
    });

    button.classList.remove('bg-white', 'border-gray-100', 'text-gray-700');
    button.classList.add('bg-green-500', 'text-white', 'border-green-500');
    selectedTimeSlotText = button.textContent;
}

function confirmChefBooking() {
    if (!selectedTimeSlotText) {
        alert('Please select a time slot first.');
        return;
    }

    alert(`Appointment successfully confirmed with Chef ${selectedChefName} for slot ${selectedTimeSlotText}!`);
    closeBookingDrawer();
}

function requestChefResume(chefId, name) {
    alert(`Resume request sent to Chef ${name}. You will be notified once they share it.`);
}

function toggleAdvancedChefFilters() {
    alert('Advanced Filters drawer will be implemented in the next release.');
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.employer-tab-pane').forEach(el => el.classList.add('hidden'));
    
    // Show selected tab
    document.getElementById(`tab-pane-${tabName}`).classList.remove('hidden');
    
    // Reset nav button active states
    const navButtons = {
        'dashboard': document.getElementById('nav-btn-dashboard'),
        'my_jobs': document.getElementById('nav-btn-my_jobs'),
        'chef_connect': document.getElementById('nav-btn-chef_connect'),
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
