<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Personal Information - JobConnect</title>
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
        <h1 class="font-h1 text-h1 font-bold text-primary">Personal Details</h1>
    </div>
    <div class="flex items-center">
        <span class="material-symbols-outlined text-outline p-2">lock</span>
    </div>
</header>

<!-- Main Content Canvas -->
<main class="pt-[56px] pb-[80px] max-w-md mx-auto min-h-screen px-4">
    <!-- Intro Header -->
    <div class="py-6 text-center">
        <div class="relative w-20 h-20 mx-auto mb-3">
            <img alt="User Photo" class="w-full h-full object-cover rounded-full border border-outline-variant bg-gray-100" 
                 src="{{ $user->profile_photo_path ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOK8JwJwp4Q9tQO4Y2ACiAQ8CH4fjhOs25Gyzg5vQACrt7V5oeQ7f6fqE8ytPQ7PsEGeuty0beDYC3JGmhmk3nriNB8Li7QCRupPXnmnD0g2w6T6-upFUfrJ6WnB65BVIX5oR3YSY_LrnVIAQVo6yXnhzat6sMJ_qV4nfdbqouEp5_JesOII__ZaJm_Vw31iKlfgFrDUhwulRR5GzH7Q0tu8atVlVfzsdjRnw0Iv_zL0XBfAi2jQKgQHXaBRVlERo1kcwgbHZmZK_V' }}"/>
        </div>
        <h2 class="font-h1 text-h1 text-on-surface">Update Personal Information</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Keep your basic profile details accurate and up to date.</p>
    </div>

    <!-- Personal Form Card -->
    <form action="{{ route('profile.personal.update') }}" method="POST" class="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm p-4 space-y-4 mb-8" data-ajax>
        @csrf
        <div>
            <label for="full_name" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name (15%)</label>
            <input type="text" name="full_name" id="full_name" class="w-full px-4 py-2.5 bg-background border @error('full_name') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" required placeholder="Alex Thompson" value="{{ old('full_name', $user->full_name) }}">
            @error('full_name')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <div>
            <label for="email" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
            <input type="email" name="email" id="email" class="w-full px-4 py-2.5 bg-background border @error('email') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" placeholder="alex@hospitality.com" value="{{ old('email', $user->email) }}">
            @error('email')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <div>
            <label for="profile_photo_path" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Profile Photo URL (15%)</label>
            <input type="url" name="profile_photo_path" id="profile_photo_path" class="w-full px-4 py-2.5 bg-background border @error('profile_photo_path') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" placeholder="https://example.com/photo.jpg" value="{{ old('profile_photo_path', $user->profile_photo_path) }}">
            @error('profile_photo_path')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <div>
            <label for="city" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">City (15%)</label>
            <input type="text" name="city" id="city" class="w-full px-4 py-2.5 bg-background border @error('city') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" required placeholder="London, UK" value="{{ old('city', $user->city) }}">
            @error('city')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <div class="pt-4 border-t border-outline-variant/30 mt-6">
            <h3 class="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined !text-[18px]">badge</span>
                Professional Information
            </h3>
        </div>

        <div>
            <label for="experience_range" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Experience Range (20%)</label>
            <select name="experience_range" id="experience_range" class="w-full px-4 py-2.5 bg-background border @error('experience_range') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" required>
                <option value="0-2 Years" {{ old('experience_range', $user->experience_range) === '0-2 Years' ? 'selected' : '' }}>0-2 Years</option>
                <option value="2-4 Years" {{ old('experience_range', $user->experience_range) === '2-4 Years' ? 'selected' : '' }}>2-4 Years</option>
                <option value="4-6 Years" {{ old('experience_range', $user->experience_range) === '4-6 Years' ? 'selected' : '' }}>4-6 Years</option>
                <option value="6+ Years" {{ old('experience_range', $user->experience_range) === '6+ Years' ? 'selected' : '' }}>6+ Years</option>
            </select>
            @error('experience_range')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <div>
            <label for="preferred_role" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Preferred Role (15%)</label>
            <input type="text" name="preferred_role" id="preferred_role" class="w-full px-4 py-2.5 bg-background border @error('preferred_role') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" required value="{{ old('preferred_role', $user->preferred_role) }}">
            @error('preferred_role')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <div>
            <label for="current_employer" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Current Employer</label>
            <input type="text" name="current_employer" id="current_employer" class="w-full px-4 py-2.5 bg-background border @error('current_employer') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" value="{{ old('current_employer', $user->current_employer) }}">
            @error('current_employer')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <div>
            <label for="skills" class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Skills (10%) <span class="text-outline font-normal">(Comma-separated)</span></label>
            <input type="text" name="skills" id="skills" class="w-full px-4 py-2.5 bg-background border @error('skills') border-red-500 focus:ring-red-500 @else border-outline-variant/50 focus:ring-primary @enderror rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:bg-surface transition" placeholder="e.g. Fine Dining, Chocolate tempering" value="{{ old('skills', is_array($user->skills) ? implode(', ', $user->skills) : '') }}">
            @error('skills')
                <p class="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">error</span>
                    {{ $message }}
                </p>
            @enderror
        </div>

        <button type="submit" class="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-200">
            Save Profile Details
        </button>
    </form>
</main>

<!-- Bottom Navigation Bar -->
@include('layouts.bottom_nav')

<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        if (window.location.hash === '#professional') {
            const element = document.getElementById('experience_range');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Give select input a visual focus glow temporarily
                    element.classList.add('ring-2', 'ring-primary');
                    setTimeout(() => {
                        element.classList.remove('ring-2', 'ring-primary');
                    }, 2000);
                }, 300);
            }
        }
    });
</script>
@include('layouts.google_translate')
</body>
</html>
