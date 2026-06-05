<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>My Applications - JobConnect</title>
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
        body {
          min-height: max(884px, 100dvh);
        }
    </style>
</head>
<body class="bg-background text-on-surface antialiased">

<!-- Top App Bar -->
<header class="fixed top-0 w-full h-[56px] flex justify-between items-center px-4 z-50 bg-surface border-b-[0.5px] border-outline-variant">
    <div class="flex items-center gap-4">
        <a href="{{ route('profile') }}" class="text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200 flex items-center justify-center">
            <span class="material-symbols-outlined">arrow_back</span>
        </a>
        <h1 class="font-h1 text-h1 font-bold text-primary">My Applications</h1>
    </div>
    <div class="flex items-center">
        <span class="px-3 py-1 bg-primary/10 text-primary rounded-full font-label-md text-label-md uppercase tracking-wider font-extrabold flex items-center gap-1.5 border border-primary/20">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {{ $applications->count() }} Total
        </span>
    </div>
</header>

<!-- Main Content Canvas -->
<main class="pt-[56px] pb-[80px] max-w-md mx-auto min-h-screen px-4">
    <!-- Header Intro -->
    <div class="py-6 text-center">
        <span class="material-symbols-outlined text-[48px] text-primary mb-2" style="font-variation-settings: 'FILL' 1;">description</span>
        <h2 class="font-h1 text-h1 text-on-surface">Application Tracking</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Review and track the real-time status of your job submissions.</p>
    </div>

    <!-- Applications List -->
    @if($applications->isEmpty())
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm p-8 text-center flex flex-col items-center">
            <span class="material-symbols-outlined text-[48px] text-outline-variant mb-3">folder_open</span>
            <h3 class="font-bold text-base text-on-surface mb-1">No Applications Yet</h3>
            <p class="text-xs text-on-surface-variant mb-6 max-w-[240px]">Browse vacant positions on the home feed and send in your chef/work details to apply.</p>
            <a href="/" class="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition">
                Explore Vacancies
            </a>
        </div>
    @else
        <div class="space-y-3">
            @foreach($applications as $app)
                <a href="{{ route('jobs.show', $app->job_post_id) }}" class="block bg-surface-container-lowest rounded-2xl border border-outline-variant/40 hover:border-primary/50 shadow-sm p-4 hover:shadow transition duration-200">
                    <div class="flex justify-between items-start gap-4">
                        <div class="space-y-1">
                            <h4 class="font-bold text-sm text-on-surface hover:text-primary transition-colors">{{ $app->jobPost->title ?? 'Deleted Job Post' }}</h4>
                            <p class="text-xs text-on-surface-variant font-medium">{{ $app->jobPost->company ?? 'Unknown Company' }}</p>
                            <div class="flex items-center gap-2 text-[11px] text-outline">
                                <span class="material-symbols-outlined !text-[12px]">location_on</span>
                                <span>{{ $app->jobPost->location ?? 'N/A' }}</span>
                                <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
                                <span>{{ $app->jobPost->salary ?? 'N/A' }}</span>
                            </div>
                        </div>
                        <div>
                            @php
                                $status = strtolower($app->status);
                                $badgeColor = 'bg-primary/10 text-primary border-primary/20';
                                if ($status === 'approved' || $status === 'hired') {
                                    $badgeColor = 'bg-green-100 text-green-800 border-green-200';
                                } elseif ($status === 'rejected' || $status === 'declined') {
                                    $badgeColor = 'bg-red-100 text-red-800 border-red-200';
                                } elseif ($status === 'interviewing') {
                                    $badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                                }
                            @endphp
                            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold border {{ $badgeColor }}">
                                {{ $app->status }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="pt-3 mt-3 border-t border-outline-variant/20 flex justify-between items-center text-[10px] text-outline font-medium">
                        <span>Submitted {{ $app->created_at->diffForHumans() }}</span>
                        <span class="text-primary flex items-center gap-0.5 font-bold">
                            View details
                            <span class="material-symbols-outlined !text-[12px]">chevron_right</span>
                        </span>
                    </div>
                </a>
            @endforeach
        </div>
    @endif
</main>

<!-- Bottom Navigation Bar -->
@include('layouts.bottom_nav')

@include('layouts.google_translate')
</body>
</html>
