<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Post a New Job - JobConnect</title>
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

<!-- Top App Bar -->
<header class="fixed top-0 w-full h-[56px] flex justify-between items-center px-4 z-50 bg-surface border-b-[0.5px] border-outline-variant">
    <div class="flex items-center gap-4">
        <a href="{{ route('profile') }}" class="text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200 flex items-center justify-center">
            <span class="material-symbols-outlined">arrow_back</span>
        </a>
        <h1 class="font-h1 text-h1 font-bold text-primary">Post a Job</h1>
    </div>
    <div class="flex items-center">
        <span class="px-3.5 py-1 bg-primary/10 text-primary rounded-full font-label-md text-label-md uppercase tracking-wider font-extrabold flex items-center gap-1 border border-primary/20">
            Employer context
        </span>
    </div>
</header>

<!-- Main Content Canvas -->
<main class="pt-[56px] pb-[80px] max-w-md mx-auto min-h-screen px-4">
    <!-- Form Intro -->
    <div class="py-6 text-center">
        <span class="material-symbols-outlined text-[48px] text-primary mb-2" style="font-variation-settings: 'FILL' 1;">post_add</span>
        <h2 class="font-h1 text-h1 text-on-surface">Publish a New Vacancy</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Fill out the details below to post a vacancy onto the community feed.</p>
    </div>

    <!-- Job Posting Form -->
    <form action="{{ route('jobs.store') }}" method="POST" class="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm p-4 space-y-4 mb-8">
        @csrf
        <div>
            <label for="job_title" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Job Title</label>
            <input type="text" name="title" id="job_title" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" required placeholder="e.g. Senior Pastry Chef" value="{{ old('title') }}">
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="job_category" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Category</label>
                <select name="category" id="job_category" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" required>
                    <option value="india" {{ old('category') === 'india' ? 'selected' : '' }}>India Jobs</option>
                    <option value="overseas" {{ old('category') === 'overseas' ? 'selected' : '' }}>Overseas Jobs</option>
                    <option value="community" {{ old('category') === 'community' ? 'selected' : '' }}>Referrals</option>
                </select>
            </div>
            <div>
                <label for="job_type" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Job Type</label>
                <input type="text" name="job_type" id="job_type" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" required placeholder="e.g. Full-time" value="{{ old('job_type', 'Full-time') }}">
            </div>
        </div>

        <div>
            <label for="company_name" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Company Name</label>
            <input type="text" name="company" id="company_name" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" required placeholder="e.g. The Grand Patisserie" value="{{ old('company') }}">
        </div>

        <div>
            <label for="company_logo_url" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Company Logo URL (Optional)</label>
            <input type="url" name="company_logo_url" id="company_logo_url" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" placeholder="https://example.com/logo.jpg" value="{{ old('company_logo_url') }}">
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="salary_range" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Salary Range</label>
                <input type="text" name="salary" id="salary_range" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" placeholder="e.g. £35k - £42k / yr" value="{{ old('salary') }}">
            </div>
            <div>
                <label for="job_location" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Location</label>
                <input type="text" name="location" id="job_location" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" placeholder="e.g. Mayfair, London" value="{{ old('location') }}">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="job_experience" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Experience Range</label>
                <select name="experience_range" id="job_experience" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition">
                    <option value="0-2 Years" {{ old('experience_range') === '0-2 Years' ? 'selected' : '' }}>0-2 Years</option>
                    <option value="2-4 Years" {{ old('experience_range') === '2-4 Years' ? 'selected' : '' }}>2-4 Years</option>
                    <option value="4-6 Years" {{ old('experience_range') === '4-6 Years' ? 'selected' : '' }}>4-6 Years</option>
                    <option value="6+ Years" {{ old('experience_range') === '6+ Years' ? 'selected' : '' }}>6+ Years</option>
                </select>
            </div>
            <div>
                <label for="job_contact" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Information</label>
                <input type="text" name="contact_info" id="job_contact" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" required placeholder="e.g. jobs@company.com" value="{{ old('contact_info') }}">
            </div>
        </div>

        <div>
            <label for="job_description" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Job Description</label>
            <textarea name="description" id="job_description" rows="4" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" required placeholder="Describe the role responsibilities...">{{ old('description') }}</textarea>
        </div>

        <div>
            <label for="job_requirements" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Requirements (Comma-separated)</label>
            <textarea name="requirements" id="job_requirements" rows="2" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" placeholder="e.g. 5+ years experience, Food hygiene certificate">{{ old('requirements') }}</textarea>
        </div>

        <div>
            <label for="job_benefits" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Benefits & Perks (Comma-separated)</label>
            <textarea name="benefits" id="job_benefits" rows="2" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" placeholder="e.g. Free Staff Meals, Health Cover">{{ old('benefits') }}</textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="showcase_image" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Showcase Image URL</label>
                <input type="url" name="showcase_image_url" id="showcase_image" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" placeholder="https://example.com/dessert.jpg" value="{{ old('showcase_image_url') }}">
            </div>
            <div>
                <label for="map_image" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Map Image URL</label>
                <input type="url" name="map_image_url" id="map_image" class="w-full px-4 py-2.5 bg-background border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition" placeholder="https://example.com/map.jpg" value="{{ old('map_image_url') }}">
            </div>
        </div>

        <button type="submit" class="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-200">
            Publish Job Posting
        </button>
    </form>
</main>

<!-- Bottom Navigation Bar -->
@include('layouts.bottom_nav')

<script>
    // Simple micro-interactions for input focus
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('scale-[1.01]');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('scale-[1.01]');
        });
    });
</script>
@include('layouts.google_translate')
</body>
</html>
