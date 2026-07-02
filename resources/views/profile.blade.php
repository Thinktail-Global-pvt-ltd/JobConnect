<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Profile - JobConnect</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-background": "#191b24",
                    "error": "#ba1a1a",
                    "inverse-on-surface": "#eff0fc",
                    "on-error-container": "#93000a",
                    "surface-bright": "#faf8ff",
                    "primary": "#0055c9",
                    "on-tertiary": "#ffffff",
                    "on-primary": "#ffffff",
                    "secondary-fixed-dim": "#bdc7d9",
                    "on-secondary-fixed": "#121c2a",
                    "on-error": "#ffffff",
                    "on-tertiary-fixed-variant": "#7f2b00",
                    "outline": "#727787",
                    "surface": "#faf8ff",
                    "primary-container": "#006bfb",
                    "secondary-container": "#d6e0f3",
                    "on-tertiary-container": "#fffbff",
                    "tertiary-fixed-dim": "#ffb599",
                    "on-secondary": "#ffffff",
                    "inverse-surface": "#2d3039",
                    "surface-variant": "#e1e2ee",
                    "secondary": "#555f6f",
                    "tertiary-container": "#cb4a00",
                    "primary-fixed-dim": "#b1c5ff",
                    "on-tertiary-fixed": "#370e00",
                    "surface-container-highest": "#e1e2ee",
                    "on-surface": "#191b24",
                    "tertiary-fixed": "#ffdbce",
                    "secondary-fixed": "#d9e3f6",
                    "on-secondary-container": "#596373",
                    "on-primary-fixed": "#001946",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-container": "#fefcff",
                    "background": "#faf8ff",
                    "outline-variant": "#c2c6d8",
                    "primary-fixed": "#dae2ff",
                    "surface-tint": "#0057ce",
                    "error-container": "#ffdad6",
                    "surface-dim": "#d8d9e5",
                    "tertiary": "#a23900",
                    "surface-container-low": "#f2f3ff",
                    "on-primary-fixed-variant": "#00419e",
                    "on-secondary-fixed-variant": "#3d4756",
                    "inverse-primary": "#b1c5ff",
                    "surface-container-high": "#e6e7f3",
                    "on-surface-variant": "#424655",
                    "surface-container": "#ecedf9"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "padding-item": "12px 16px",
                    "gutter-list": "12px",
                    "stack-md": "8px",
                    "stack-lg": "16px",
                    "unit": "4px",
                    "margin-mobile": "16px",
                    "stack-sm": "4px"
            },
            "fontFamily": {
                    "h2": ["Inter"],
                    "body-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "body-md": ["Inter"],
                    "h1": ["Inter"],
                    "time-stamp": ["Inter"],
                    "body-lg": ["Inter"]
            },
            "fontSize": {
                    "h2": ["18px", {"lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                    "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "600"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "h1": ["22px", {"lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                    "time-stamp": ["11px", {"lineHeight": "14px", "fontWeight": "400"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #faf8ff;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        .whatsapp-list-item:last-child .divider {
            display: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        body {
          min-height: max(884px, 100dvh);
        }
    </style>
</head>
<body class="bg-background text-on-surface antialiased">

<!-- Flash Toast Notifications -->
@if(session('success'))
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-auto px-4">
        <div class="bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">check_circle</span>
                <span class="text-sm font-semibold">{{ session('success') }}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:opacity-80">
                <span class="material-symbols-outlined !text-[18px]">close</span>
            </button>
        </div>
    </div>
@endif

@if(session('error'))
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-auto px-4">
        <div class="bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">error</span>
                <span class="text-sm font-semibold">{{ session('error') }}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:opacity-80">
                <span class="material-symbols-outlined !text-[18px]">close</span>
            </button>
        </div>
    </div>
@endif

@if($activeRole && ($activeRole->role_type === 'employer' || $activeRole->role_type === 'agency'))
    @include('profile.employer_dashboard')
@elseif($activeRole && $activeRole->role_type === 'chef')
    @include('profile.chef_dashboard')
@else
<!-- Top App Bar -->
<header class="fixed top-0 w-full h-[56px] flex justify-between items-center px-4 z-50 bg-surface border-b-[0.5px] border-outline-variant">
    <div class="flex items-center gap-4">
        <button class="text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200" onclick="window.history.back()">
            <span class="material-symbols-outlined" data-icon="menu">menu</span>
        </button>
        <a href="/" class="font-h1 text-h1 font-bold text-primary">JobConnect</a>
    </div>
    <div class="flex items-center">
        <button class="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200">
            <span class="material-symbols-outlined" data-icon="search">search</span>
        </button>
    </div>
</header>

<!-- Main Content Canvas -->
<main class="pt-[56px] pb-[80px] max-w-md mx-auto min-h-screen">
    <!-- Profile Header Section -->
    <section class="bg-surface-container-lowest px-4 py-8 flex flex-col items-center text-center border-b-[0.5px] border-outline-variant">
        <div class="relative mb-4">
            <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-fixed p-1">
                <img alt="User Profile" class="w-full h-full object-cover rounded-full bg-gray-100" 
                     src="{{ $user->profile_photo_path ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOK8JwJwp4Q9tQO4Y2ACiAQ8CH4fjhOs25Gyzg5vQACrt7V5oeQ7f6fqE8ytPQ7PsEGeuty0beDYC3JGmhmk3nriNB8Li7QCRupPXnmnD0g2w6T6-upFUfrJ6WnB65BVIX5oR3YSY_LrnVIAQVo6yXnhzat6sMJ_qV4nfdbqouEp5_JesOII__ZaJm_Vw31iKlfgFrDUhwulRR5GzH7Q0tu8atVlVfzsdjRnw0Iv_zL0XBfAi2jQKgQHXaBRVlERo1kcwgbHZmZK_V' }}"/>
            </div>
            <a href="{{ route('profile.personal.edit') }}" class="absolute bottom-0 right-0 bg-primary text-on-primary p-1.5 rounded-full border-2 border-surface-container-lowest flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                <span class="material-symbols-outlined !text-[18px]" data-icon="edit">edit</span>
            </a>
        </div>
        <h1 class="font-h1 text-h1 text-on-surface mb-1">{{ $user->full_name ?? 'Guest User' }}</h1>
        <p class="font-body-md text-on-surface-variant mb-2">{{ $user->mobile_number }}</p>

        <!-- Active Context Switch Display with Toggle Button -->
        <div class="flex justify-center items-center gap-2 mb-4">
            <span class="px-3.5 py-1 bg-primary/10 text-primary rounded-full font-label-md text-label-md uppercase tracking-wider font-extrabold flex items-center gap-1.5 border border-primary/20">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active: {{ str_replace('_', ' ', $activeRole->role_type ?? 'job_seeker') }}
            </span>
            <form action="{{ route('profile.toggle-role') }}" method="POST" class="inline" data-ajax>
                @csrf
                <button type="submit" class="flex items-center gap-0.5 bg-primary text-on-primary hover:bg-primary-container font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm transition active:scale-95 duration-200">
                    <span class="material-symbols-outlined !text-[14px]">sync</span>
                    Toggle
                </button>
            </form>
        </div>

        <!-- Progress Bar Section -->
        <div class="w-full bg-surface-container-high rounded-full px-4 py-3 border border-outline-variant/30 shadow-sm">
            <div class="flex justify-between items-center mb-2">
                <span class="font-label-md text-label-md text-on-surface">Profile {{ $user->profile_completeness }}% Complete</span>
                <a href="{{ route('profile.personal.edit') }}" class="font-label-md text-label-md text-primary font-bold hover:underline">Finish Now</a>
            </div>
            <div class="w-full bg-surface-variant rounded-full h-2">
                <div class="bg-primary h-2 rounded-full transition-all duration-700 ease-out" style="width: {{ $user->profile_completeness }}%;"></div>
            </div>
        </div>
    </section>

    <!-- Profile Navigation List (WhatsApp Style) -->
    <section class="mt-2 bg-surface-container-lowest">
        <!-- Section: Personal Information -->
        <a href="{{ route('profile.personal.edit') }}" class="whatsapp-list-item-group border-b border-outline-variant/30 block">
            <div class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200">
                <div class="pl-4 py-4 pr-3">
                    <span class="material-symbols-outlined text-secondary" data-icon="person">person</span>
                </div>
                <div class="flex-grow py-4 pr-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-body-lg text-body-lg text-on-surface">Personal Information</p>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">Manage your basic details and contacts</p>
                        </div>
                        <span class="material-symbols-outlined text-outline-variant !text-[20px]" data-icon="chevron_right">chevron_right</span>
                    </div>
                </div>
            </div>
        </a>

        <!-- Section: Professional Information -->
        <a href="{{ route('profile.personal.edit') }}#professional" class="whatsapp-list-item-group border-b border-outline-variant/30 block">
            <div class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200">
                <div class="pl-4 py-4 pr-3">
                    <span class="material-symbols-outlined text-secondary" data-icon="badge">badge</span>
                </div>
                <div class="flex-grow py-4 pr-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-body-lg text-body-lg text-on-surface">Professional Information</p>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">Experience, skills, and certifications</p>
                        </div>
                        <span class="material-symbols-outlined text-outline-variant !text-[20px]" data-icon="chevron_right">chevron_right</span>
                    </div>
                </div>
            </div>
        </a>

        <!-- Section: My Applications -->
        <a href="{{ route('profile.applications') }}" class="whatsapp-list-item-group border-b border-outline-variant/30 block">
            <div class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200">
                <div class="pl-4 py-4 pr-3">
                    <span class="material-symbols-outlined text-secondary" data-icon="description">description</span>
                </div>
                <div class="flex-grow py-4 pr-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-body-lg text-body-lg text-on-surface">My Applications</p>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">Track your {{ $user->applications->count() }} current job submissions</p>
                        </div>
                        <span class="material-symbols-outlined text-outline-variant !text-[20px]" data-icon="chevron_right">chevron_right</span>
                    </div>
                </div>
            </div>
        </a>

        <!-- Section: Saved Jobs -->
        <a href="{{ route('profile.saved') }}" class="whatsapp-list-item-group border-b border-outline-variant/30 block">
            <div class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200">
                <div class="pl-4 py-4 pr-3">
                    <span class="material-symbols-outlined text-secondary" data-icon="star">star</span>
                </div>
                <div class="flex-grow py-4 pr-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-body-lg text-body-lg text-on-surface">Saved Jobs</p>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">View your {{ $user->savedJobPosts->count() }} bookmarked vacancies</p>
                        </div>
                        <span class="material-symbols-outlined text-outline-variant !text-[20px]" data-icon="chevron_right">chevron_right</span>
                    </div>
                </div>
            </div>
        </a>



        <!-- Collapsible Section: My Posted Jobs -->
        <div class="whatsapp-list-item-group border-b border-outline-variant/30">
            <div class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200" onclick="toggleSection('my-posted-jobs-list')">
                <div class="pl-4 py-4 pr-3">
                    <span class="material-symbols-outlined text-secondary" data-icon="work_history">work_history</span>
                </div>
                <div class="flex-grow py-4 pr-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-body-lg text-body-lg text-on-surface">My Posted Jobs</p>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">Jobs you have listed for hire ({{ $user->jobPosts->count() }} total)</p>
                        </div>
                        <span class="material-symbols-outlined text-outline-variant !text-[20px] transition-transform duration-200" id="my-posted-jobs-list-arrow">chevron_right</span>
                    </div>
                </div>
            </div>
            
            <!-- Collapsible Posted Jobs List -->
            <div id="my-posted-jobs-list" class="hidden px-4 pb-6 bg-surface-container-low border-t border-outline-variant/20">
                @if($user->jobPosts->isEmpty())
                    <p class="text-on-surface-variant text-sm py-4 italic text-center">You haven't posted any jobs yet.</p>
                @else
                    <div class="space-y-4 pt-4">
                        @foreach($user->jobPosts as $jobPost)
                            <div class="bg-surface rounded-xl p-3 border border-outline-variant/50 shadow-sm space-y-3">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-bold text-sm text-on-surface">{{ $jobPost->title }}</h4>
                                        <p class="text-[11px] text-on-surface-variant">{{ $jobPost->location }} | {{ $jobPost->salary }}</p>
                                    </div>
                                    <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold {{ $jobPost->status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                                        {{ $jobPost->status }}
                                    </span>
                                </div>
                                
                                <!-- Applicants Sub-list -->
                                <div class="pt-2 border-t border-outline-variant/30">
                                    <h5 class="text-xs font-bold text-primary mb-2 flex items-center gap-1">
                                        <span class="material-symbols-outlined !text-[14px]">groups</span>
                                        Applicants ({{ $jobPost->applications->count() }})
                                    </h5>
                                    @if($jobPost->applications->isEmpty())
                                        <p class="text-[11px] text-on-surface-variant italic">No applicants yet.</p>
                                    @else
                                        <div class="space-y-2">
                                            @foreach($jobPost->applications as $app)
                                                <div class="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex justify-between items-center text-xs">
                                                    <div>
                                                        <p class="font-bold text-on-surface">{{ $app->applicant->full_name ?? 'Anonymous User' }}</p>
                                                        <p class="text-[10px] text-on-surface-variant">{{ $app->applicant->mobile_number }}</p>
                                                        @if(!empty($app->applicant->skills) && is_array($app->applicant->skills))
                                                            <div class="flex flex-wrap gap-1 mt-1">
                                                                @foreach(array_slice($app->applicant->skills, 0, 3) as $skill)
                                                                    <span class="px-1.5 py-0.5 bg-secondary-container/40 text-on-secondary-container text-[9px] rounded font-medium">{{ $skill }}</span>
                                                                @endforeach
                                                            </div>
                                                        @endif
                                                    </div>
                                                    <div class="text-right">
                                                        <span class="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-secondary-container text-on-secondary-container">
                                                            {{ $app->status }}
                                                        </span>
                                                        <p class="text-[9px] text-outline mt-1">{{ $app->created_at->diffForHumans() }}</p>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        </div>

        <!-- Spacer divider -->
        <div class="h-2 bg-background"></div>

        <!-- Category: Switch Context & Roles (Instant Toggle & Switch Vetting Free) -->
        <div class="px-4 py-3 bg-surface-container-low text-xs font-extrabold text-primary uppercase tracking-wider border-b border-outline-variant/30">
            Switch Profile Context
        </div>

        @php
            $roleOptions = [
                ['type' => 'job_seeker', 'title' => 'Job Seeker Profile', 'desc' => 'Search and apply for hospitality vacancies', 'icon' => 'person', 'color' => 'text-secondary'],
                ['type' => 'chef', 'title' => 'Pastry / Culinary Chef', 'desc' => 'Showcase culinary skills & menu styles', 'icon' => 'restaurant', 'color' => 'text-tertiary'],
                ['type' => 'employer', 'title' => 'Employer Profile', 'desc' => 'Post jobs and hire kitchen & service staff', 'icon' => 'business_center', 'color' => 'text-primary'],
                ['type' => 'agency', 'title' => 'Recruitment Agency', 'desc' => 'Manage placement pipelines & candidates', 'icon' => 'groups', 'color' => 'text-secondary'],
                ['type' => 'administrator', 'title' => 'Administrator Profile', 'desc' => 'Moderate listings, users, and programs', 'icon' => 'settings', 'color' => 'text-error'],
            ];
        @endphp

        @foreach($roleOptions as $roleOption)
            @php
                $isActive = ($activeRole && $activeRole->role_type === $roleOption['type']);
            @endphp
            <form action="{{ route('profile.switch-role') }}" method="POST" id="form-role-{{ $roleOption['type'] }}" class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200" onclick="document.getElementById('form-role-{{ $roleOption['type'] }}').requestSubmit()" data-ajax>
                @csrf
                <input type="hidden" name="role_type" value="{{ $roleOption['type'] }}">
                <div class="pl-4 py-4 pr-3">
                    <span class="material-symbols-outlined {{ $roleOption['color'] }} {{ $isActive ? 'font-bold scale-110' : '' }}" style="{{ $isActive ? "font-variation-settings: 'FILL' 1;" : '' }}">{{ $roleOption['icon'] }}</span>
                </div>
                <div class="flex-1 py-4 pr-4 border-b border-outline-variant/30">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-body-lg text-body-lg {{ $isActive ? 'text-primary font-bold' : 'text-on-surface' }}">
                                {{ $roleOption['title'] }}
                                @if($isActive)
                                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ml-1.5 align-middle animate-ping absolute"></span>
                                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ml-1.5 align-middle relative"></span>
                                @endif
                            </p>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">{{ $isActive ? 'Currently Active Profile Context' : $roleOption['desc'] }}</p>
                        </div>
                        @if($isActive)
                            <span class="text-xs bg-primary text-on-primary font-extrabold px-3 py-1 rounded-full shadow-sm">Active</span>
                        @else
                            <span class="material-symbols-outlined text-outline-variant !text-[20px]">chevron_right</span>
                        @endif
                    </div>
                </div>
            </form>
        @endforeach

        <!-- Category: App Settings -->
        <div class="h-2 bg-background"></div>

        <div class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200" onclick="alert('Settings configured using system default preferences.')">
            <div class="pl-4 py-4 pr-3">
                <span class="material-symbols-outlined text-secondary" data-icon="settings">settings</span>
            </div>
            <div class="flex-1 py-4 pr-4 border-b border-outline-variant/30">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-body-lg text-body-lg text-on-surface">Settings</p>
                        <p class="font-body-sm text-body-sm text-on-surface-variant">Privacy, notifications, and security</p>
                    </div>
                    <span class="material-symbols-outlined text-outline-variant !text-[20px]" data-icon="chevron_right">chevron_right</span>
                </div>
            </div>
        </div>

        <div class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200" onclick="openLanguageModal()">
            <div class="pl-4 py-4 pr-3">
                <span class="material-symbols-outlined text-secondary" data-icon="language">language</span>
            </div>
            <div class="flex-1 py-4 pr-4 border-b border-outline-variant/30">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-body-lg text-body-lg text-on-surface">Language</p>
                        <p class="font-body-sm text-body-sm text-on-surface-variant" id="active-language-label">English</p>
                    </div>
                    <span class="material-symbols-outlined text-outline-variant !text-[20px]" data-icon="chevron_right">chevron_right</span>
                </div>
            </div>
        </div>

        <a href="{{ route('logout') }}" class="whatsapp-list-item group flex items-start cursor-pointer hover:bg-surface-container-low transition-colors duration-200">
            <div class="pl-4 py-4 pr-3">
                <span class="material-symbols-outlined text-error" data-icon="logout">logout</span>
            </div>
            <div class="flex-1 py-4 pr-4">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-body-lg text-body-lg text-error">Logout</p>
                        <p class="font-body-sm text-body-sm text-on-error-container/60">Sign out of your account</p>
                    </div>
                    <span class="material-symbols-outlined text-outline-variant !text-[20px]" data-icon="chevron_right">chevron_right</span>
                </div>
            </div>
        </a>
    </section>

    <!-- Additional Info Footer -->
    <footer class="px-4 py-8 text-center bg-surface-container-lowest border-t border-outline-variant/30">
        <p class="font-body-sm text-body-sm text-on-surface-variant opacity-50">from</p>
        <p class="font-label-md text-label-md tracking-widest uppercase text-on-surface font-bold mt-1">HOSPITALITY CO.</p>
        <p class="font-time-stamp text-time-stamp text-on-surface-variant mt-4">JobConnect v4.2.1-stable</p>
    </footer>
</main>

<!-- Bottom Navigation Bar -->
@include('layouts.bottom_nav')
@endif

<script>
    // Simple micro-interaction for list items
    document.querySelectorAll('.whatsapp-list-item').forEach(item => {
        item.addEventListener('touchstart', function() {
            this.classList.add('bg-surface-container');
        });
        item.addEventListener('touchend', function() {
            this.classList.remove('bg-surface-container');
        });
    });

    // Helper function to toggle collapsible panels smoothly
    function toggleSection(id) {
        const element = document.getElementById(id);
        const arrow = document.getElementById(id + '-arrow');
        if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
            if (arrow) arrow.style.transform = 'rotate(90deg)';
        } else {
            element.classList.add('hidden');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    }

    // Dynamic progress bar animation on load & auto-expand query sections
    window.addEventListener('DOMContentLoaded', (event) => {
        const progressBar = document.querySelector('.bg-primary.h-2');
        const initialPercent = "{{ $user->profile_completeness }}";
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = initialPercent + '%';
            }, 300);
        }

        // Auto-expand sections from query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section');
        if (section) {
            let targetId = null;
            if (section === 'applications') {
                targetId = 'my-applications-list';
            } else if (section === 'my_posted_jobs') {
                targetId = 'my-posted-jobs-list';
            }
            
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Open the section
                    toggleSection(targetId);
                    // Smoothly scroll to the section
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                }
            }
        }
    });
</script>
<!-- Language Selector Bottom Sheet Modal -->
<div id="language-bottom-sheet" class="fixed inset-0 z-50 bg-black/40 hidden flex items-end justify-center transition-opacity duration-300 opacity-0" onclick="closeLanguageModal()">
    <div class="w-full max-w-md bg-surface-container-lowest rounded-t-3xl border-t border-outline-variant/30 shadow-2xl p-6 space-y-4 transform translate-y-full transition-transform duration-300" onclick="event.stopPropagation()">
        <!-- Pull Handle -->
        <div class="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto mb-2"></div>
        
        <div class="flex justify-between items-center pb-2 border-b border-outline-variant/20">
            <h3 class="font-h1 text-h1 text-on-surface">Select Language</h3>
            <button class="text-outline hover:text-on-surface p-1 rounded-full flex items-center justify-center hover:bg-surface-container-low transition" onclick="closeLanguageModal()">
                <span class="material-symbols-outlined !text-[20px]">close</span>
            </button>
        </div>
        
        <div class="space-y-2">
            @php
                $languages = [
                    ['code' => 'en', 'label' => 'English', 'flag' => '🇺🇸'],
                    ['code' => 'hi', 'label' => 'हिन्दी (Hindi)', 'flag' => '🇮🇳'],
                    ['code' => 'es', 'label' => 'Español (Spanish)', 'flag' => '🇪🇸'],
                    ['code' => 'fr', 'label' => 'Français (French)', 'flag' => '🇫🇷'],
                    ['code' => 'de', 'label' => 'Deutsch (German)', 'flag' => '🇩🇪'],
                    ['code' => 'ar', 'label' => 'العربية (Arabic)', 'flag' => '🇸🇦'],
                ];
            @endphp
            @foreach($languages as $lang)
                <button onclick="selectAppLanguage('{{ $lang['code'] }}', '{{ $lang['label'] }}')" class="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-low rounded-xl transition text-left">
                    <span class="font-body-lg text-body-lg text-on-surface flex items-center gap-3">
                        <span class="text-[20px]">{{ $lang['flag'] }}</span>
                        <span class="language-name-display">{{ $lang['label'] }}</span>
                    </span>
                    <span class="material-symbols-outlined text-primary hidden check-icon" id="lang-check-{{ $lang['code'] }}">check_circle</span>
                </button>
            @endforeach
        </div>
    </div>
</div>

<script>
    function openLanguageModal() {
        const modal = document.getElementById('language-bottom-sheet');
        const sheet = modal.querySelector('div');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('opacity-100');
            sheet.classList.remove('translate-y-full');
        }, 10);
        
        const activeLang = localStorage.getItem('selected_language') || 'en';
        document.querySelectorAll('.check-icon').forEach(icon => icon.classList.add('hidden'));
        const activeIcon = document.getElementById('lang-check-' + activeLang);
        if (activeIcon) activeIcon.classList.remove('hidden');
    }

    function closeLanguageModal() {
        const modal = document.getElementById('language-bottom-sheet');
        const sheet = modal.querySelector('div');
        modal.classList.remove('opacity-100');
        sheet.classList.add('translate-y-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    function selectAppLanguage(code, label) {
        setLanguage(code);
        const labelEl = document.getElementById('active-language-label');
        if (labelEl) labelEl.textContent = label;
        closeLanguageModal();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const savedLang = localStorage.getItem('selected_language') || 'en';
        const languagesMap = {
            'en': 'English',
            'hi': 'हिन्दी (Hindi)',
            'es': 'Español (Spanish)',
            'fr': 'Français (French)',
            'de': 'Deutsch (German)',
            'ar': 'العربية (Arabic)'
        };
        const labelEl = document.getElementById('active-language-label');
        if (labelEl && languagesMap[savedLang]) {
            labelEl.textContent = languagesMap[savedLang];
        }
    });
</script>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Intercept forms marked with data-ajax
    document.querySelectorAll('form[data-ajax]').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="inline-block animate-pulse">Processing...</span>';
            }

            // Clear previous errors
            form.querySelectorAll('.validation-error').forEach(el => el.remove());

            const formData = new FormData(form);
            const url = form.getAttribute('action');
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: formData
                });

                const data = await response.json();

                if (!response.ok) {
                    // Handle validation or other errors
                    if (data.errors) {
                        Object.keys(data.errors).forEach(field => {
                            const input = form.querySelector(`[name="${field}"]`) || form.querySelector(`#${field}`);
                            if (input) {
                                const errSpan = document.createElement('span');
                                errSpan.className = 'validation-error text-red-500 text-xs font-semibold mt-1 block';
                                errSpan.textContent = data.errors[field][0];
                                input.closest('div').appendChild(errSpan);
                            }
                        });
                    } else if (data.message) {
                        alert(data.message);
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                    return;
                }

                // Success
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else if (data.success) {
                    const action = form.getAttribute('action') || '';
                    if (action.includes('/api/login')) {
                        const mobileVal = form.querySelector('[name="mobile_number"]')?.value || '';
                        const roleVal = form.querySelector('[name="login_role"]:checked')?.value || 'job_seeker';
                        window.location.href = '/verify-otp?mobile=' + encodeURIComponent(mobileVal) + '&login_role=' + encodeURIComponent(roleVal);
                    } else if (action.includes('/api/verify-otp')) {
                        const params = new URLSearchParams(window.location.search);
                        const roleVal = params.get('login_role') || 'job_seeker';
                        window.location.href = (roleVal === 'employer') ? '/profile?section=my_posted_jobs' : '/';
                    } else if (action.includes('/api/profile/personal') || action.includes('/api/profile/update') || action.includes('/api/profile/switch-role') || action.includes('/api/profile/become-') || action.includes('/api/profile/toggle-role') || action.includes('/api/jobs/store')) {
                        window.location.href = '/profile';
                    } else if (action.includes('/apply')) {
                        window.location.reload();
                    } else {
                        if (data.message) {
                            alert(data.message);
                        }
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnText;
                        }
                    }
                } else if (data.message) {
                    alert(data.message);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    });
});
</script>

@include('layouts.google_translate')
</body>
</html>
