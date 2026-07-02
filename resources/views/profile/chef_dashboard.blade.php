<div class="max-w-md mx-auto bg-gray-50/50 min-h-screen flex flex-col justify-between pb-24">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-green-500/10">J</div>
            <span class="font-outfit font-black text-base text-gray-800 tracking-tight">Chef Connect</span>
        </div>
        <button type="button" class="text-gray-400 hover:text-gray-600 transition flex items-center justify-center p-1.5 hover:bg-gray-50 rounded-full relative">
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span class="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
        </button>
    </header>

    <!-- Body Container -->
    <div class="px-4 py-5 space-y-4">
        
        <!-- Profile Summary Card -->
        <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4 flex flex-col">
            <div class="flex items-start gap-4">
                <!-- Avatar Image -->
                <div class="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                    @if($user->profile_photo_path)
                        <img src="{{ $user->profile_photo_path }}" class="w-full h-full object-cover">
                    @else
                        <div class="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">👨‍🍳</div>
                    @endif
                </div>
                <!-- Profile details -->
                <div class="text-left space-y-1">
                    <h3 class="font-outfit font-extrabold text-sm text-gray-800 leading-tight">Chef {{ $user->full_name }}</h3>
                    <p class="text-[10px] text-gray-400 font-bold leading-tight">{{ $user->preferred_role ?? 'Culinary Consultant' }}</p>
                    <div class="flex items-center gap-1 text-[9px] text-gray-400 font-semibold mt-1">
                        <span class="material-symbols-outlined text-[10px]">location_on</span>
                        <span>{{ $user->city ?? 'India' }} &amp; Overseas</span>
                    </div>
                    <!-- Availability Status indicator -->
                    <div class="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 border border-green-100">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Available for Consultation
                    </div>
                </div>
            </div>
            
            <button type="button" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition text-xs flex items-center justify-center gap-1.5">
                View Profile
                <span class="material-symbols-outlined text-[14px]">visibility</span>
            </button>
        </div>

        <!-- Performance Analytics Grid -->
        <div class="space-y-2.5">
            <h4 class="font-outfit font-bold text-gray-400 text-[10px] uppercase tracking-wider text-left">Performance Analytics</h4>
            
            <div class="grid grid-cols-2 gap-3.5">
                <!-- Profile Views -->
                <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-1 text-left shadow-2xs hover:shadow-sm transition">
                    <span class="text-gray-400 text-[18px]">👁️</span>
                    <span class="text-xl font-extrabold text-gray-800 mt-1">12</span>
                    <span class="text-[9px] font-bold text-gray-400 uppercase">Profile Views</span>
                </div>
                <!-- Appointment Requests -->
                <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-1 text-left shadow-2xs hover:shadow-sm transition">
                    <span class="text-gray-400 text-[18px]">🗓️</span>
                    <span class="text-xl font-extrabold text-gray-800 mt-1">3</span>
                    <span class="text-[9px] font-bold text-gray-400 uppercase text-ellipsis overflow-hidden whitespace-nowrap">Appointment Requests</span>
                </div>
                <!-- Referrals Posted -->
                <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-1 text-left shadow-2xs hover:shadow-sm transition">
                    <span class="text-gray-400 text-[18px]">📝</span>
                    <span class="text-xl font-extrabold text-gray-800 mt-1">3</span>
                    <span class="text-[9px] font-bold text-gray-400 uppercase">Referrals Posted</span>
                </div>
                <!-- Upcoming Consultations -->
                <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-1 text-left shadow-2xs hover:shadow-sm transition">
                    <span class="text-gray-400 text-[18px]">🧑‍🍳</span>
                    <span class="text-xl font-extrabold text-gray-800 mt-1">1</span>
                    <span class="text-[9px] font-bold text-gray-400 uppercase text-ellipsis overflow-hidden whitespace-nowrap">Upcoming Consultations</span>
                </div>
            </div>

            <!-- Project Requests Block -->
            <button type="button" class="w-full bg-white border border-gray-100 rounded-2xl p-3.5 flex items-center justify-between text-xs font-bold text-gray-700 hover:bg-gray-50/50 shadow-2xs transition">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-green-600">work</span>
                    <span>Active Project Requests</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="bg-green-100 text-green-800 text-[9px] font-black px-2 py-0.5 rounded-full">3</span>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </div>
            </button>
        </div>

        <!-- My Activity Section -->
        <div class="space-y-2">
            <h4 class="font-outfit font-bold text-gray-400 text-[10px] uppercase tracking-wider text-left">My Activity</h4>
            <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
                <!-- Applications -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">send</span>
                        <span class="text-xs font-bold text-gray-700">My Applications</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-400">
                        <span class="bg-gray-100 text-gray-600 text-[9px] font-black px-2 py-0.5 rounded-full">1</span>
                        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                </div>
                <!-- Saved Jobs -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">bookmark</span>
                        <span class="text-xs font-bold text-gray-700">My Saved Jobs</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-400">
                        <span class="bg-gray-100 text-gray-600 text-[9px] font-black px-2 py-0.5 rounded-full">3</span>
                        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                </div>
                <!-- Appointment Requests -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">event</span>
                        <span class="text-xs font-bold text-gray-700">Appointment Requests</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-400">
                        <span class="bg-gray-100 text-gray-600 text-[9px] font-black px-2 py-0.5 rounded-full">3</span>
                        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                </div>
                <!-- Consultations -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">interpreter_mode</span>
                        <span class="text-xs font-bold text-gray-700">Upcoming Consultations</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-400">
                        <span class="bg-gray-100 text-gray-600 text-[9px] font-black px-2 py-0.5 rounded-full">1</span>
                        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Professional Tools Section -->
        <div class="space-y-2">
            <h4 class="font-outfit font-bold text-gray-400 text-[10px] uppercase tracking-wider text-left">Professional Tools</h4>
            <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
                <!-- Calendly -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-blue-600 text-[18px]">calendar_month</span>
                        <span class="text-xs font-bold text-gray-700">Calendly Integration</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </div>
                <!-- Social Media Links -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[#0077b5] text-[18px]">link</span>
                        <span class="text-xs font-bold text-gray-700">Social Media Links</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </div>
                <!-- Availability -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-green-600 text-[18px]">event_available</span>
                        <span class="text-xs font-bold text-gray-700">Availability</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </div>
                <!-- Share profile -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-purple-600 text-[18px]">ios_share</span>
                        <span class="text-xs font-bold text-gray-700">Share Professional Profile</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </div>
            </div>
        </div>

        <!-- Settings & Support -->
        <div class="space-y-2">
            <h4 class="font-outfit font-bold text-gray-400 text-[10px] uppercase tracking-wider text-left">Settings &amp; Support</h4>
            <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
                <!-- Language -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">language</span>
                        <span class="text-xs font-bold text-gray-700">Language</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-400">
                        <span class="text-[10px] font-bold text-gray-400">English</span>
                        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                </div>
                <!-- Settings -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">settings</span>
                        <span class="text-xs font-bold text-gray-700">Settings</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </div>
                <!-- Help & Support -->
                <div class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">help</span>
                        <span class="text-xs font-bold text-gray-700">Help &amp; Support</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </div>
                <!-- Logout -->
                <form action="{{ route('logout') }}" method="POST" class="w-full">
                    @csrf
                    <button type="submit" class="w-full p-3.5 flex items-center justify-between hover:bg-red-50/30 transition text-left">
                        <div class="flex items-center gap-3 text-red-500">
                            <span class="material-symbols-outlined text-[18px]">logout</span>
                            <span class="text-xs font-extrabold">Logout</span>
                        </div>
                        <span class="material-symbols-outlined text-[16px] text-red-300">chevron_right</span>
                    </button>
                </form>
            </div>
        </div>

    </div>
</div>
