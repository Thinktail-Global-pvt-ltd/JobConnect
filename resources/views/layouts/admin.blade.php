<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Dashboard') | JobConnect Admin</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Tailwind CSS via CDN -->
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
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            200: '#bbf7d0',
                            500: '#16a34a',
                            600: '#15803d',
                            700: '#166534',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
    </style>
</head>
<body class="bg-[#f8f9fc] font-sans text-slate-800 min-h-screen flex">

    <!-- Sidebar -->
    <aside class="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-screen z-50">
        <!-- Logo Section -->
        <div class="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-outfit font-extrabold text-xl shadow-md shadow-brand-500/20">
                J
            </div>
            <div>
                <span class="font-outfit font-extrabold text-2xl tracking-tight text-brand-600 block leading-none">JobConnect</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-1">Admin Console</span>
            </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <!-- Group Label -->
            <span class="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Core Controls</span>

            <a href="{{ url('admin/dashboard') }}" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group {{ Request::is('admin/dashboard') ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
                <span class="text-xl {{ Request::is('admin/dashboard') ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600' }}">📊</span>
                <span class="text-sm">Dashboard</span>
            </a>

            <a href="{{ url('admin/users') }}" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group {{ Request::is('admin/users*') ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
                <span class="text-xl {{ Request::is('admin/users*') ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600' }}">👥</span>
                <span class="text-sm">Users</span>
            </a>

            <a href="{{ url('admin/jobs') }}" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group {{ Request::is('admin/jobs*') ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
                <span class="text-xl {{ Request::is('admin/jobs*') ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600' }}">💼</span>
                <span class="text-sm">Jobs</span>
            </a>

            <a href="{{ url('admin/chefs') }}" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group {{ Request::is('admin/chefs*') ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
                <span class="text-xl {{ Request::is('admin/chefs*') ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600' }}">👨‍🍳</span>
                <span class="text-sm">Chef Screening</span>
            </a>

            <a href="{{ url('admin/training') }}" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group {{ Request::is('admin/training*') ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800' }}">
                <span class="text-xl {{ Request::is('admin/training*') ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600' }}">📚</span>
                <span class="text-sm">Training Programs</span>
            </a>

            <span class="px-4 pt-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Other Services</span>

            <a href="#" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:bg-slate-50 hover:text-slate-800">
                <span class="text-xl text-slate-300">🔗</span>
                <span class="text-sm">Referrals</span>
                <span class="ml-auto bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Soon</span>
            </a>

            <a href="#" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:bg-slate-50 hover:text-slate-800">
                <span class="text-xl text-slate-300">💬</span>
                <span class="text-sm">Community Feed</span>
            </a>

            <a href="#" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:bg-slate-50 hover:text-slate-800">
                <span class="text-xl text-slate-300">🏢</span>
                <span class="text-sm">Employers</span>
            </a>

            <a href="#" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:bg-slate-50 hover:text-slate-800">
                <span class="text-xl text-slate-300">✉️</span>
                <span class="text-sm">Enquiries</span>
            </a>

            <a href="#" class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:bg-slate-50 hover:text-slate-800">
                <span class="text-xl text-slate-300">⚙️</span>
                <span class="text-sm">Settings</span>
            </a>
        </nav>

        <!-- Footer Admin Profile info -->
        <div class="p-6 border-t border-slate-50 bg-slate-50/50 flex items-center gap-3.5">
            <img class="w-10 h-10 rounded-xl object-cover bg-brand-100" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="Admin Avatar">
            <div class="overflow-hidden">
                <span class="text-sm font-bold text-slate-700 block truncate">Sanjay Kapoor</span>
                <span class="text-[11px] font-semibold text-slate-400 block truncate">Main Admin</span>
            </div>
            <a href="{{ url('logout') }}" class="ml-auto w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors duration-200" title="Logout">
                🚪
            </a>
        </div>
    </aside>

    <!-- Main Workspace -->
    <div class="flex-grow ml-72 flex flex-col min-h-screen">
        <!-- Top Header Navigation -->
        <header class="bg-white border-b border-slate-100 h-20 px-10 flex items-center justify-between sticky top-0 z-40">
            <div>
                <h1 class="font-outfit font-extrabold text-xl text-slate-800">@yield('header-title', 'Overview')</h1>
                <p class="text-xs font-semibold text-slate-400 mt-0.5">@yield('header-subtitle', 'Platform overview and stats')</p>
            </div>

            <!-- Right Controls -->
            <div class="flex items-center gap-6">
                <!-- Search bar -->
                <div class="relative w-64">
                    <input type="text" placeholder="Search data, users..." class="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-600 focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-300">
                    <span class="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
                </div>

                <!-- Notifications -->
                <button class="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors duration-200">
                    <span>🔔</span>
                    <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
                </button>

                <!-- Divider -->
                <div class="h-8 w-px bg-slate-100"></div>

                <!-- Admin Label -->
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <span class="text-xs font-bold text-slate-700 block">Sanjay Kapoor</span>
                        <span class="text-[10px] font-semibold text-brand-500 uppercase tracking-wider block">Superuser</span>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold font-outfit text-sm">
                        SK
                    </div>
                </div>
            </div>
        </header>

        <!-- Dynamic Main Content Wrapper -->
        <main class="flex-grow p-10 space-y-8">
            @if(session('success'))
                <div class="bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in" id="success-alert">
                    <span class="text-lg">✅</span>
                    <span class="text-sm font-semibold">{{ session('success') }}</span>
                    <button onclick="document.getElementById('success-alert').remove()" class="ml-auto text-emerald-400 hover:text-emerald-600 font-bold">✕</button>
                </div>
            @endif

            @yield('content')
        </main>
    </div>

</body>
</html>
