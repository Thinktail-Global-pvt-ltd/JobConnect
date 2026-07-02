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
                <div onclick="openChefAppointmentsModal()" class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">event</span>
                        <span class="text-xs font-bold text-gray-700">Appointment Requests</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-400">
                        <span id="chef-app-req-count" class="bg-green-100 text-green-800 text-[9px] font-black px-2 py-0.5 rounded-full">0</span>
                        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                </div>
                <!-- Consultations -->
                <div onclick="openChefAppointmentsModal()" class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">interpreter_mode</span>
                        <span class="text-xs font-bold text-gray-700">Upcoming Consultations</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-400">
                        <span id="chef-app-up-count" class="bg-green-100 text-green-800 text-[9px] font-black px-2 py-0.5 rounded-full">0</span>
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
                <a href="{{ route('logout') }}" class="w-full p-3.5 flex items-center justify-between hover:bg-red-50/30 transition text-left block">
                    <div class="flex items-center gap-3 text-red-500">
                        <span class="material-symbols-outlined text-[18px]">logout</span>
                        <span class="text-xs font-extrabold">Logout</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-red-300">chevron_right</span>
                </a>
            </div>
        </div>

    </div>
</div>

<!-- Chef Appointments Drawer -->
<div id="chef-appointments-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-100">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-outfit font-extrabold text-xs text-gray-800 uppercase tracking-wider">Booked Appointments</h3>
            <button type="button" onclick="closeChefAppointmentsModal()" class="text-gray-400 hover:text-gray-600 flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition">
                <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
        </div>
        <!-- Body -->
        <div id="chef-appointments-body" class="p-5 overflow-y-auto space-y-3.5">
            <!-- Dynamic items loaded via ajax -->
        </div>
    </div>
</div>

<script>
function closeChefAppointmentsModal() {
    document.getElementById('chef-appointments-modal').classList.add('hidden');
}

// Close modal when clicking outside content area
document.getElementById('chef-appointments-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeChefAppointmentsModal();
    }
});

async function openChefAppointmentsModal() {
    const modal = document.getElementById('chef-appointments-modal');
    const body = document.getElementById('chef-appointments-body');
    if (!modal || !body) return;

    body.innerHTML = '<p class="text-xs text-gray-400 italic text-center py-6">Loading appointments...</p>';
    modal.classList.remove('hidden');

    try {
        const response = await fetch("{{ url('/chef/appointments') }}", {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        
        if (data.success && data.appointments.length > 0) {
            body.innerHTML = '';
            data.appointments.forEach(app => {
                const item = document.createElement('div');
                item.className = "bg-white border border-gray-100 rounded-2xl p-4 space-y-2 text-left shadow-2xs";
                item.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-xs text-gray-800">${app.employer_name}</h4>
                            <p class="text-[9px] text-gray-400 font-semibold mt-0.5">📧 ${app.employer_email} • 📞 ${app.employer_phone}</p>
                        </div>
                        <span class="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-100">
                            ${app.status}
                        </span>
                    </div>
                    <div class="text-[10px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed font-semibold">
                        <strong>Agenda:</strong> ${app.purpose}
                    </div>
                    <div class="flex items-center justify-between text-[9px] text-gray-400 font-bold mt-2 pt-1 border-t border-gray-50">
                        <span>🗓️ ${app.meeting_date}</span>
                        <span>⏰ ${app.meeting_time}</span>
                    </div>
                `;
                body.appendChild(item);
            });
        } else {
            body.innerHTML = '<p class="text-xs text-gray-400 italic text-center py-6">No appointments booked with you yet.</p>';
        }
    } catch (err) {
        console.error(err);
        body.innerHTML = '<p class="text-xs text-red-500 italic text-center py-6">Failed to load appointments list.</p>';
    }
}

// Fetch appointment counts on load to populate badges dynamically
async function loadAppointmentCounts() {
    try {
        const response = await fetch("{{ url('/chef/appointments') }}", {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
            const count = data.appointments.length;
            const reqCountEl = document.getElementById('chef-app-req-count');
            const upCountEl = document.getElementById('chef-app-up-count');
            
            if (reqCountEl) reqCountEl.textContent = count;
            if (upCountEl) upCountEl.textContent = count;
        }
    } catch (err) {
        console.error('Failed to load count badges:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadAppointmentCounts);
</script>
