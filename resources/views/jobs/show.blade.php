<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>JobConnect - {{ $job->title }}</title>
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
        body {
            background-color: #faf8ff;
            font-family: 'Inter', sans-serif;
        }
        .whatsapp-shadow {
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
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
<body class="text-on-surface">

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

<!-- TopAppBar -->
<header class="fixed top-0 w-full h-[56px] bg-surface dark:bg-on-background flex justify-between items-center px-4 z-50 border-b-[0.5px] border-outline-variant">
    <div class="flex items-center gap-4">
        <a href="/" class="hover:bg-surface-container-low p-2 rounded-full transition-colors active:opacity-70 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">arrow_back</span>
        </a>
        <h1 class="font-h1 text-h1 font-bold text-primary dark:text-primary-fixed">JobConnect</h1>
    </div>
    <div class="flex items-center">
        <button class="hover:bg-surface-container-low p-2 rounded-full transition-colors active:opacity-70">
            <span class="material-symbols-outlined text-on-surface-variant">share</span>
        </button>
    </div>
</header>

<!-- Main Content Area -->
<main class="pt-[56px] pb-[100px] max-w-2xl mx-auto">
    <!-- Hero Section -->
    <section class="bg-surface p-4 flex flex-col items-center text-center space-y-4">
        <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-high whatsapp-shadow bg-white flex items-center justify-center">
            <img alt="Employer Logo" class="w-full h-full object-cover" 
                 src="{{ $job->company_logo_url ?? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150' }}"/>
        </div>
        <div class="space-y-1">
            <div class="flex items-center justify-center gap-2">
                <span class="font-h2 text-h2 text-on-surface">{{ $job->company }}</span>
                @if($job->status === 'approved')
                    <span class="material-symbols-outlined text-primary text-[18px]" style="font-variation-settings: 'FILL' 1;">verified</span>
                @endif
            </div>
            <h2 class="font-h1 text-h1 text-on-surface leading-tight">{{ $job->title }}</h2>
            <div class="flex items-center justify-center gap-2 mt-1">
                @if($job->is_pinned)
                    <span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-label-md text-label-md">Urgent Hiring</span>
                @endif
                <span class="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-label-md">
                    {{ $job->job_type ?? 'Full-time' }}
                </span>
            </div>
        </div>
    </section>

    <!-- Quick Info Grid -->
    <section class="grid grid-cols-2 gap-px bg-outline-variant border-y-[0.5px] border-outline-variant">
        <div class="bg-surface p-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">payments</span>
            <div>
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Salary</p>
                <p class="font-body-lg text-body-lg font-semibold text-on-surface">{{ $job->salary ?? 'Competitive' }}</p>
            </div>
        </div>
        <div class="bg-surface p-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">location_on</span>
            <div>
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Location</p>
                <p class="font-body-lg text-body-lg font-semibold text-on-surface">{{ $job->location ?? 'Not Specified' }}</p>
            </div>
        </div>
        <div class="bg-surface p-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">work_history</span>
            <div>
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Experience</p>
                <p class="font-body-lg text-body-lg font-semibold text-on-surface">{{ $job->experience_range ?? 'Not Specified' }}</p>
            </div>
        </div>
        <div class="bg-surface p-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">schedule</span>
            <div>
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Posted</p>
                <p class="font-body-lg text-body-lg font-semibold text-on-surface">{{ $job->created_at->diffForHumans() }}</p>
            </div>
        </div>
    </section>

    <!-- Description Content -->
    <article class="p-4 space-y-6">
        <!-- About the role -->
        <div class="space-y-3">
            <h3 class="font-h2 text-h2 text-on-surface">About the Role</h3>
            <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">{{ $job->description }}</p>
        </div>

        <!-- Key Requirements -->
        <div class="space-y-3">
            <h3 class="font-h2 text-h2 text-on-surface">Key Requirements</h3>
            <ul class="space-y-3">
                @if(!empty($job->requirements) && is_array($job->requirements))
                    @foreach($job->requirements as $req)
                        <li class="flex items-start gap-3">
                            <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                            <span class="font-body-md text-body-md text-on-surface-variant">{{ $req }}</span>
                        </li>
                    @endforeach
                @else
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                        <span class="font-body-md text-body-md text-on-surface-variant">Candidates must have relevant experience in hospitality or culinary arts.</span>
                    </li>
                @endif
            </ul>
        </div>

        <!-- Dessert Showcase Image / General fallback -->
        <div class="rounded-xl overflow-hidden whatsapp-shadow my-6">
            <img alt="Showcase" class="w-full h-auto max-h-[300px] object-cover" 
                 src="{{ $job->showcase_image_url ?? 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600' }}"/>
            <div class="p-3 bg-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">image</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant italic">
                    @if(str_contains(strtolower($job->title), 'pastry') || str_contains(strtolower($job->title), 'bakery'))
                        Example of our signature dessert menu style.
                    @else
                        Showcase of our workplace and environment.
                    @endif
                </span>
            </div>
        </div>

        <!-- Perks -->
        @if(!empty($job->benefits) && is_array($job->benefits))
            <div class="space-y-3">
                <h3 class="font-h2 text-h2 text-on-surface">Benefits &amp; Perks</h3>
                <div class="flex flex-wrap gap-2">
                    @foreach($job->benefits as $ben)
                        <span class="bg-surface-container-high px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant border border-outline-variant">{{ $ben }}</span>
                    @endforeach
                </div>
            </div>
        @endif

        <!-- Map Location -->
        <div class="space-y-3">
            <h3 class="font-h2 text-h2 text-on-surface">Location Map</h3>
            @if($job->map_image_url)
                <div class="w-full h-[180px] rounded-xl overflow-hidden border border-outline-variant whatsapp-shadow">
                    <img alt="Map of {{ $job->location }}" class="w-full h-full object-cover" data-location="{{ $job->location }}" src="{{ $job->map_image_url }}"/>
                </div>
            @else
                <div class="w-full h-[180px] rounded-xl overflow-hidden border border-outline-variant whatsapp-shadow bg-gray-100 flex items-center justify-center text-gray-400 font-semibold text-sm">
                    🗺️ Google Maps Location: {{ $job->location }}
                </div>
            @endif
        </div>
    </article>
</main>

<!-- Fixed Footer with Actions -->
<footer class="fixed bottom-0 w-full bg-surface border-t-[0.5px] border-outline-variant p-4 z-50">
    <div class="max-w-2xl mx-auto flex gap-3">
        @if($hasApplied)
            <button class="flex-1 h-12 bg-gray-200 text-gray-500 font-h2 text-h2 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-outline-variant/30" disabled>
                <span class="material-symbols-outlined text-[20px] font-bold text-green-600">check_circle</span>
                Applied
            </button>
        @else
            <form action="{{ route('jobs.apply', $job->id) }}" method="POST" class="flex-1 flex" data-ajax>
                @csrf
                <button type="submit" class="w-full h-12 bg-primary text-on-primary font-h2 text-h2 rounded-xl flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-primary/20">
                    Apply Now
                </button>
            </form>
        @endif
        <button class="w-12 h-12 bg-surface-container-high text-primary rounded-xl flex items-center justify-center transition-transform active:scale-95 border border-outline-variant"
                onclick="alert('Start direct discussion at: {{ $job->contact_info }}')">
            <span class="material-symbols-outlined">chat_bubble</span>
        </button>
    </div>
</footer>

<script>
    // Dynamic Header Shadow on Scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 20) {
            header.classList.add('shadow-sm');
        } else {
            header.classList.remove('shadow-sm');
        }
    });
</script>
@include('layouts.google_translate')
</body>
</html>
