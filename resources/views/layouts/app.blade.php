<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard') | JobConnect</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        outfit: ['Outfit', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            200: '#bfdbfe',
                            500: '#1d4ed8', // Darker elegant blue
                            600: '#1e40af',
                            700: '#1d4ed8',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
    <!-- Navigation Bar -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div class="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-outfit font-bold text-lg shadow-md">
                    J
                </div>
                <span class="font-outfit font-bold text-xl tracking-tight text-blue-600">JobConnect</span>
            </a>

            @auth
                <div class="flex items-center gap-3">
                    @php $activeRole = Auth::user()->currentRoleContext(); @endphp
                    @if($activeRole)
                        <span class="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-100 uppercase tracking-wider">
                            {{ str_replace('_', ' ', $activeRole->role_type) }}
                        </span>
                    @endif
                    <a href="{{ route('logout') }}" class="text-gray-400 hover:text-red-500 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </a>
                </div>
            @endauth
        </div>
    </nav>

    <!-- Main Container -->
    <main class="flex-grow flex flex-col max-w-md mx-auto w-full bg-white shadow-md border-x border-gray-100">
        @if(session('success'))
            <div class="mx-4 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-start gap-2 shadow-sm">
                <span>✅</span>
                <span class="text-sm font-medium">{{ session('success') }}</span>
            </div>
        @endif

        @if(session('error'))
            <div class="mx-4 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2 shadow-sm">
                <span>⚠️</span>
                <span class="text-sm font-medium">{{ session('error') }}</span>
            </div>
        @endif

        <div class="flex-grow p-4">
            @yield('content')
        </div>
    </main>

    <!-- Navigation Footer -->
    <footer class="bg-white border-t border-gray-100 py-3 sticky bottom-0 z-50">
        <div class="max-w-md mx-auto px-6 flex items-center justify-between text-gray-400">
            <a href="/" class="flex flex-col items-center gap-1 transition {{ Request::is('/') ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-blue-600' }}">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span class="text-xs">Home</span>
            </a>
            <div class="flex flex-col items-center gap-1 hover:text-blue-600 cursor-pointer transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span class="text-xs">Apps</span>
            </div>
            <a href="{{ route('profile') }}" class="flex flex-col items-center gap-1 hover:text-blue-600 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs">Post</span>
            </a>
            <a href="{{ route('profile') }}" class="flex flex-col items-center gap-1 hover:text-blue-600 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="text-xs">Chefs</span>
            </a>
            <a href="{{ route('profile') }}" class="flex flex-col items-center gap-1 transition {{ Request::is('profile') ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-blue-600' }}">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-xs">Profile</span>
            </a>
        </div>
    </footer>
</body>
</html>
