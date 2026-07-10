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
                <div onclick="openChefCalendlyModal()" class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer">
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

        <!-- Developer Tools (FCM Tester) -->
        <div class="space-y-2">
            <h4 class="font-outfit font-bold text-gray-400 text-[10px] uppercase tracking-wider text-left">Developer Tools</h4>
            <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
                <!-- Firebase FCM Test -->
                <a href="{{ route('profile.firebase-test') }}" class="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer block text-left">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-orange-500 text-[18px]">campaign</span>
                        <span class="text-xs font-bold text-gray-700">Firebase FCM Tester</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
                </a>
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

<!-- Chef Calendly Modal -->
<div id="chef-calendly-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-100 transition-all transform scale-95 opacity-0 duration-300" id="chef-calendly-content">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-outfit font-extrabold text-xs text-gray-800 uppercase tracking-wider">Calendly Integration</h3>
            <button type="button" onclick="closeChefCalendlyModal()" class="text-gray-400 hover:text-gray-600 flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition">
                <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
        </div>
        <!-- Body -->
        <div class="p-5 space-y-4 text-left">
            <p class="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Connect your Calendly page to allow employers to book directly using your custom scheduling link.
            </p>
            
            <div class="space-y-2">
                <label for="calendly_link_input" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Calendly Booking Link</label>
                <div class="relative">
                    <span class="absolute left-4 top-3.5 text-blue-600 font-medium text-sm">
                        <span class="material-symbols-outlined text-[18px]">link</span>
                    </span>
                    <input type="url" id="calendly_link_input" 
                           class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-xs"
                           placeholder="https://calendly.com/your-username" 
                           value="{{ $user->chefProfile->calendly_link ?? '' }}">
                </div>
                <span id="calendly-error-msg" class="text-red-500 text-[10px] font-semibold mt-1 hidden"></span>
            </div>
            
            <button type="button" id="btn-save-calendly" onclick="saveCalendlyLink()"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                Save Link
            </button>
        </div>
    </div>
</div>

<script>
function closeChefAppointmentsModal() {
    document.getElementById('chef-appointments-modal').classList.add('hidden');
}

function openChefCalendlyModal() {
    const modal = document.getElementById('chef-calendly-modal');
    const content = document.getElementById('chef-calendly-content');
    if (!modal || !content) return;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 20);
}

function closeChefCalendlyModal() {
    const modal = document.getElementById('chef-calendly-modal');
    const content = document.getElementById('chef-calendly-content');
    if (!modal || !content) return;
    
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

function showToastMessage(message, type = 'success') {
    const container = document.createElement('div');
    container.className = "fixed top-4 left-1/2 transform -translate-x-1/2 z-[200] max-w-sm w-full mx-auto px-4";
    const bgClass = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const iconName = type === 'success' ? 'check_circle' : 'error';
    container.innerHTML = `
        <div class="${bgClass} text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between transition-all transform translate-y-[-20px] opacity-0 duration-300">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">${iconName}</span>
                <span class="text-sm font-semibold">${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:opacity-80">
                <span class="material-symbols-outlined !text-[18px]">close</span>
            </button>
        </div>
    `;
    document.body.appendChild(container);
    setTimeout(() => {
        const inner = container.querySelector('div');
        inner.classList.remove('translate-y-[-20px]', 'opacity-0');
        inner.classList.add('translate-y-0', 'opacity-100');
    }, 20);
    setTimeout(() => {
        const inner = container.querySelector('div');
        if (inner) {
            inner.classList.remove('translate-y-0', 'opacity-100');
            inner.classList.add('translate-y-[-20px]', 'opacity-0');
            setTimeout(() => container.remove(), 300);
        }
    }, 3000);
}

async function saveCalendlyLink() {
    const input = document.getElementById('calendly_link_input');
    const errorEl = document.getElementById('calendly-error-msg');
    const saveBtn = document.getElementById('btn-save-calendly');
    
    if (!input || !saveBtn || !errorEl) return;
    
    errorEl.classList.add('hidden');
    
    const value = input.value.trim();
    if (value !== '' && !value.startsWith('http://') && !value.startsWith('https://')) {
        errorEl.textContent = 'Please enter a valid URL starting with http:// or https://';
        errorEl.classList.remove('hidden');
        return;
    }
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = 'Saving...';
    
    try {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const response = await fetch("{{ url('/api/profile/calendly/save') }}", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ calendly_link: value })
        });
        
        const data = await response.json();
        
        if (response.status === 422) {
            const errText = data.errors && data.errors.calendly_link ? data.errors.calendly_link[0] : 'Validation failed.';
            errorEl.textContent = errText;
            errorEl.classList.remove('hidden');
        } else if (data.success) {
            showToastMessage(data.message, 'success');
            closeChefCalendlyModal();
            input.value = data.calendly_link || '';
        } else {
            errorEl.textContent = data.message || 'An error occurred.';
            errorEl.classList.remove('hidden');
        }
    } catch (err) {
        console.error(err);
        errorEl.textContent = 'Failed to save link. Please check network connection.';
        errorEl.classList.remove('hidden');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Save Link';
    }
}

// Close modal when clicking outside content area
document.getElementById('chef-appointments-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeChefAppointmentsModal();
    }
});

// Close calendly modal when clicking outside content area
document.getElementById('chef-calendly-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeChefCalendlyModal();
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
