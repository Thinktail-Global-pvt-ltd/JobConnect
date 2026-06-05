<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>JobConnect | Home</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <style>
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
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #faf8ff;
        }
    </style>
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
          min-height: max(884px, 100dvh);
        }
    </style>
</head>
<body class="bg-surface text-on-surface antialiased overflow-x-hidden">
<!-- Top AppBar -->
<header class="fixed top-0 w-full h-[56px] z-50 bg-surface dark:bg-on-background border-b-[0.5px] border-outline-variant flex justify-between items-center px-4">
    <div class="flex items-center gap-4">
        <button class="text-primary dark:text-primary-fixed transition-colors duration-200 active:opacity-70 hover:bg-surface-container-low dark:hover:bg-surface-variant p-2 rounded-full">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <a href="/" class="font-h1 text-h1 font-bold text-primary dark:text-primary-fixed">JobConnect</a>
    </div>
    <div class="flex items-center gap-2">
        <button class="text-primary dark:text-primary-fixed transition-colors duration-200 active:opacity-70 hover:bg-surface-container-low dark:hover:bg-surface-variant p-2 rounded-full">
            <span class="material-symbols-outlined">search</span>
        </button>
    </div>
</header>

<!-- Main Content Area -->
<main class="pt-[56px] pb-[64px] max-w-2xl mx-auto min-h-screen">
    <!-- Filter Bar -->
    <div class="sticky top-[56px] z-40 bg-surface/95 backdrop-blur-sm py-3 px-4 border-b-[0.5px] border-outline-variant overflow-x-auto hide-scrollbar flex items-center gap-2">
        <a href="/?category=all" class="px-4 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 shrink-0 {{ $filter === 'all' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container' }}">All</a>
        <a href="/?category=india" class="px-4 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 shrink-0 {{ $filter === 'india' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container' }}">India Jobs</a>
        <a href="/?category=overseas" class="px-4 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 shrink-0 {{ $filter === 'overseas' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container' }}">Overseas</a>
        <a href="/?category=training" class="px-4 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 shrink-0 {{ $filter === 'training' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container' }}">Training</a>
        <a href="/?category=community" class="px-4 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 shrink-0 {{ $filter === 'community' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container' }}">Referrals</a>
    </div>

    <!-- Feed Content -->
    <section class="flex flex-col">
        @if($feedItems->isEmpty())
            <div class="text-center py-12 px-4">
                <span class="material-symbols-outlined text-[48px] text-outline">inbox</span>
                <p class="text-on-surface-variant mt-2">No postings found under this category.</p>
            </div>
        @else
            @foreach($feedItems as $item)
                @if($item instanceof \App\Models\JobPost)
                    <!-- Job Post Card -->
                    <article class="bg-surface hover:bg-surface-container-low transition-colors border-b-[0.5px] border-outline-variant p-4">
                        <div class="flex gap-3">
                            <div class="flex-shrink-0 relative">
                                <img class="w-12 h-12 rounded-full object-cover border border-outline-variant" 
                                     src="{{ $item->company_logo_url ?? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150' }}" 
                                     alt="Company logo"/>
                                @if($item->is_pinned)
                                    <div class="absolute -bottom-1 -right-1 bg-surface-container-lowest rounded-full p-0.5 border border-outline-variant">
                                        <span class="material-symbols-outlined text-primary text-[14px]" style="font-variation-settings: 'FILL' 1;">push_pin</span>
                                    </div>
                                @endif
                            </div>
                            <div class="flex-grow flex flex-col">
                                <div class="flex justify-between items-start">
                                    <h3 class="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                                        {{ $item->company }} 
                                        @if($item->status === 'approved')
                                            <span class="material-symbols-outlined text-[14px] text-primary" style="font-variation-settings: 'FILL' 1;">verified</span>
                                        @endif
                                    </h3>
                                    <span class="font-time-stamp text-time-stamp text-outline">
                                        @if($item->is_pinned)
                                            Pinned
                                        @else
                                            {{ $item->created_at->diffForHumans() }}
                                        @endif
                                    </span>
                                </div>
                                <h2 class="font-h2 text-h2 mt-0.5 text-on-surface">{{ $item->title }}</h2>
                                <p class="font-body-md text-body-md text-on-surface-variant mt-1 line-clamp-2">{{ $item->description }}</p>
                                <div class="flex flex-wrap gap-y-2 gap-x-4 mt-3">
                                    <div class="flex items-center gap-1 text-on-surface-variant">
                                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                                        <span class="font-body-sm text-body-sm">{{ $item->location ?? 'Not Specified' }}</span>
                                    </div>
                                    <div class="flex items-center gap-1 text-primary font-bold">
                                        <span class="material-symbols-outlined text-[18px]">payments</span>
                                        <span class="font-body-sm text-body-sm">{{ $item->salary ?? 'Competitive' }}</span>
                                    </div>
                                </div>
                                <div class="mt-4 flex items-center justify-between">
                                    <span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase tracking-wider">
                                        {{ $item->category === 'community' ? 'Referrals' : ucfirst($item->category) }}
                                    </span>
                                    <div class="flex gap-2">
                                        <button class="p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors">
                                            <span class="material-symbols-outlined">share</span>
                                        </button>
                                         <a href="{{ route('jobs.show', $item->id) }}" class="px-6 h-10 rounded-xl bg-primary text-on-primary font-label-md text-label-md transition-all active:scale-95 shadow-sm inline-flex items-center justify-center">Apply</a>
                                     </div>
                                 </div>
                            </div>
                        </div>
                    </article>
                @elseif($item instanceof \App\Models\TrainingOpportunity)
                    <!-- Training Post Card -->
                    <article class="bg-surface hover:bg-surface-container-low transition-colors border-b-[0.5px] border-outline-variant p-4">
                        <div class="flex gap-3">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 border border-outline-variant">
                                <span class="material-symbols-outlined text-blue-600 text-2xl">school</span>
                            </div>
                            <div class="flex-grow flex flex-col">
                                <div class="flex justify-between items-start">
                                    <h3 class="font-label-md text-label-md text-on-surface-variant">{{ $item->provider_name }}</h3>
                                    <span class="font-time-stamp text-time-stamp text-outline">{{ $item->created_at->diffForHumans() }}</span>
                                </div>
                                <h2 class="font-h2 text-h2 mt-0.5 text-on-surface">{{ $item->program_name }}</h2>
                                <p class="font-body-md text-body-md text-on-surface-variant mt-1">{{ $item->description }}</p>
                                <div class="flex flex-wrap gap-y-2 gap-x-4 mt-3">
                                    <div class="flex items-center gap-1 text-on-surface-variant">
                                        <span class="material-symbols-outlined text-[18px]">school</span>
                                        <span class="font-body-sm text-body-sm">{{ $item->location ?? 'Online / Hybrid' }}</span>
                                    </div>
                                    <div class="flex items-center gap-1 text-primary font-bold">
                                        <span class="material-symbols-outlined text-[18px]">sell</span>
                                        <span class="font-body-sm text-body-sm">{{ $item->price ?? 'Course Program' }}</span>
                                    </div>
                                </div>
                                <div class="mt-4 flex items-center justify-between">
                                    <span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase tracking-wider">Training</span>
                                    <div class="flex gap-2">
                                        <button class="p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors">
                                            <span class="material-symbols-outlined">share</span>
                                        </button>
                                        @if($item->external_link)
                                            <a href="{{ $item->external_link }}" target="_blank" class="px-6 h-10 rounded-xl bg-primary text-on-primary font-label-md text-label-md transition-all active:scale-95 shadow-sm inline-flex items-center justify-center">Register</a>
                                        @else
                                            <button class="px-6 h-10 rounded-xl bg-primary text-on-primary font-label-md text-label-md transition-all active:scale-95 shadow-sm" onclick="alert('Register via: {{ $item->contact_information }}')">Register</button>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                @endif
            @endforeach
        @endif
    </section>
</main>

<!-- Bottom Navigation Bar -->
@include('layouts.bottom_nav')

<!-- Floating Interaction Hint -->
<a href="{{ route('profile') }}" class="fixed right-6 bottom-20 z-40 md:hidden w-14 h-14 rounded-full bg-primary text-on-primary shadow-[0px_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-transform active:scale-90">
    <span class="material-symbols-outlined text-[28px]">edit</span>
</a>

<script>
    // Simple scroll observer for sticky header effect
    let lastScrollTop = 0;
    window.addEventListener("scroll", function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        if (currentScroll > 10) {
            header.classList.add('shadow-sm');
        } else {
            header.classList.remove('shadow-sm');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);
</script>
@include('layouts.google_translate')
</body>
</html>
