@extends('layouts.admin')

@section('title', 'ChefConnect Moderation')
@section('header-title', 'ChefConnect Moderation')
@section('header-subtitle', 'Review and manage professional chef applications for the platform.')

@section('content')
<div class="space-y-6">

    <!-- Top Action Bar & Header Stats -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
            <div class="flex items-center gap-3">
                <h2 class="text-2xl font-outfit font-extrabold text-slate-800 tracking-tight">ChefConnect Moderation</h2>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    OPERATIONAL STATUS
                </span>
            </div>
            <p class="text-xs text-slate-400 font-medium mt-1">Review and manage professional chef applications for the platform.</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3">
            <!-- Filter Dropdown Form -->
            <form action="{{ url('admin/chefs') }}" method="GET" class="flex items-center gap-2">
                <div class="relative">
                    <select name="status" onchange="this.form.submit()" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 pl-4 pr-9 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all cursor-pointer">
                        <option value="">All Statuses</option>
                        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending Only</option>
                        <option value="approved" {{ request('status') === 'approved' ? 'selected' : '' }}>Approved Only</option>
                        <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Rejected Only</option>
                    </select>
                    <span class="absolute right-3 top-3 text-slate-400 text-xs pointer-events-none">▼</span>
                </div>
                @if(request('status'))
                    <a href="{{ url('admin/chefs') }}" class="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all">
                        Reset
                    </a>
                @endif
            </form>

            <a href="{{ route('chef.onboarding') }}" target="_blank" class="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition-all">
                <span>+</span> Onboard New Chef
            </a>
        </div>
    </div>

    <!-- 4 Dynamic Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Card 1: Pending Review -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
            <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">PENDING REVIEW</span>
            <div class="flex items-baseline gap-2">
                <span class="text-3xl font-outfit font-extrabold text-slate-800">{{ number_format($pendingCount) }}</span>
                <span class="text-xs font-bold text-amber-500">↗ +12% from last week</span>
            </div>
            <span class="text-xs text-slate-400 mt-2 block font-medium">Awaiting administrator moderation</span>
        </div>

        <!-- Card 2: Calendly Sync -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
            <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">CALENDLY SYNC</span>
            <div class="flex items-baseline gap-2">
                <span class="text-3xl font-outfit font-extrabold text-slate-800">{{ $calendlySyncPercentage }}%</span>
            </div>
            <span class="text-xs text-slate-400 mt-2 block font-medium">Active synchronization</span>
        </div>

        <!-- Card 3: Active Chefs -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
            <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">ACTIVE CHEFS</span>
            <div class="flex items-baseline gap-2">
                <span class="text-3xl font-outfit font-extrabold text-slate-800">{{ number_format($approvedCount) }}</span>
            </div>
            <span class="text-xs text-slate-400 mt-2 block font-medium">Global hospitality pool</span>
        </div>

        <!-- Card 4: Moderation Rate -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
            <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">MODERATION RATE</span>
            <div class="flex items-baseline gap-2">
                <span class="text-3xl font-outfit font-extrabold text-slate-800">4.2h</span>
            </div>
            <span class="text-xs text-slate-400 mt-2 block font-medium">Average response time</span>
        </div>
    </div>

    <!-- Chef Moderation Table -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        @if($chefs->isEmpty())
            <div class="p-12 text-center">
                <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
                    👨‍🍳
                </div>
                <h3 class="text-base font-bold text-slate-700">No Chef Applications Found</h3>
                <p class="text-xs text-slate-400 mt-1">There are no chef profiles matching your selected criteria.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                            <th class="py-4 px-6">CHEF NAME</th>
                            <th class="py-4 px-6">EXPERIENCE</th>
                            <th class="py-4 px-6">CUISINE SPECIALTIES</th>
                            <th class="py-4 px-6 text-center">CALENDLY</th>
                            <th class="py-4 px-6 text-center">STATUS</th>
                            <th class="py-4 px-6 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        @foreach($chefs as $chef)
                            @php
                                $fullName = $chef->user->full_name ?? 'Unnamed Chef';
                                $words = explode(' ', trim($fullName));
                                $initials = strtoupper(substr($words[0] ?? 'C', 0, 1) . substr($words[1] ?? 'H', 0, 1));
                                
                                // Color badges for avatar
                                $avatarBgColors = ['bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'];
                                $avatarColor = $avatarBgColors[$chef->id % count($avatarBgColors)];
                            @endphp
                            <tr class="hover:bg-slate-50/80 transition-colors">
                                <!-- Chef Name & Avatar -->
                                <td class="py-4 px-6">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full {{ $avatarColor }} flex items-center justify-center font-bold text-xs font-outfit shadow-sm">
                                            {{ $initials }}
                                        </div>
                                        <div>
                                            <span class="font-bold text-slate-800 block text-sm leading-snug">{{ $fullName }}</span>
                                            <span class="text-xs text-slate-400 font-medium block">{{ $chef->user->email ?? 'No email' }}</span>
                                        </div>
                                    </div>
                                </td>

                                <!-- Experience -->
                                <td class="py-4 px-6 font-semibold text-slate-700">
                                    {{ $chef->user->experience_range ?? ($chef->experience_range ?: 'N/A') }}
                                </td>

                                <!-- Cuisine Specialties -->
                                <td class="py-4 px-6 font-medium text-slate-700">
                                    <span class="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                        {{ $chef->cuisine_specialty ?: 'Multi-Cuisine' }}
                                    </span>
                                </td>

                                <!-- Calendly Badge -->
                                <td class="py-4 px-6 text-center">
                                    @if($chef->calendly_link)
                                        <a href="{{ $chef->calendly_link }}" target="_blank" class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/60 hover:bg-emerald-100 transition-colors">
                                            ✓ Yes
                                        </a>
                                    @else
                                        <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-400 text-xs font-bold px-3 py-1 rounded-full">
                                            ✕ No
                                        </span>
                                    @endif
                                </td>

                                <!-- Status Badge -->
                                <td class="py-4 px-6 text-center">
                                    @if($chef->approval_status === 'approved')
                                        <span class="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                                            APPROVED
                                        </span>
                                    @elseif($chef->approval_status === 'rejected')
                                        <span class="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 uppercase tracking-wider">
                                            REJECTED
                                        </span>
                                    @else
                                        <span class="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wider">
                                            PENDING
                                        </span>
                                    @endif
                                </td>

                                <!-- Actions -->
                                <td class="py-4 px-6 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <!-- View Details Modal Trigger Button -->
                                        <button type="button" 
                                                onclick="openChefDetailsModal('{{ $chef->id }}', '{{ addslashes($fullName) }}', '{{ addslashes($chef->user->email ?? '') }}', '{{ addslashes($chef->user->mobile_number ?? '') }}', '{{ addslashes($chef->user->city ?? '') }}', '{{ addslashes($chef->user->experience_range ?? '') }}', '{{ addslashes($chef->cuisine_specialty ?? '') }}', '{{ addslashes($chef->bio ?? '') }}', '{{ addslashes($chef->calendly_link ?? '') }}')" 
                                                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors" 
                                                title="View Details">
                                            👁️
                                        </button>

                                        <!-- Approve Button -->
                                        @if($chef->approval_status !== 'approved')
                                            <form action="{{ url('admin/chefs/' . $chef->id . '/approve') }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" class="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors border border-emerald-200/60" title="Approve Chef">
                                                    ✓
                                                </button>
                                            </form>
                                        @endif

                                        <!-- Reject Button -->
                                        @if($chef->approval_status !== 'rejected')
                                            <form action="{{ url('admin/chefs/' . $chef->id . '/reject') }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" class="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors border border-rose-200/60" title="Reject Chef">
                                                    ✕
                                                </button>
                                            </form>
                                        @endif

                                        <!-- Schedule Appointment Button -->
                                        <button type="button" 
                                                onclick="openAdminAppointmentModal('{{ $chef->user->id }}', '{{ addslashes($fullName) }}')" 
                                                class="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors">
                                            Schedule
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Table Footer -->
            <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs font-semibold text-slate-500">
                <span>Showing all {{ $chefs->count() }} chef application(s)</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    All Chefs Loaded
                </span>
            </div>
        @endif
    </div>
</div>

<!-- Modal 1: Chef Details View Modal -->
<div id="chef-details-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-5 animate-scale-up">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
                <h3 id="modal-detail-name" class="font-outfit font-extrabold text-lg text-slate-800">Chef Details</h3>
                <span id="modal-detail-email" class="text-xs text-slate-400 font-medium"></span>
            </div>
            <button onclick="closeChefDetailsModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold">
                ✕
            </button>
        </div>

        <div class="space-y-4 text-xs font-medium text-slate-600">
            <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Mobile</span>
                    <span id="modal-detail-mobile" class="font-bold text-slate-700"></span>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">City</span>
                    <span id="modal-detail-city" class="font-bold text-slate-700"></span>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                    <span id="modal-detail-exp" class="font-bold text-slate-700"></span>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Cuisine</span>
                    <span id="modal-detail-cuisine" class="font-bold text-slate-700"></span>
                </div>
            </div>

            <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold mb-1">Bio / Profile Summary</span>
                <p id="modal-detail-bio" class="bg-slate-50 p-3 rounded-xl text-slate-700 leading-relaxed"></p>
            </div>

            <div id="modal-detail-calendly-wrapper" class="hidden">
                <span class="text-slate-400 block text-[10px] uppercase font-bold mb-1">Calendly Scheduling Link</span>
                <a id="modal-detail-calendly" href="#" target="_blank" class="text-blue-600 underline font-bold truncate block"></a>
            </div>
        </div>

        <div class="pt-2 flex justify-end">
            <button onclick="closeChefDetailsModal()" class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all">
                Close
            </button>
        </div>
    </div>
</div>

<!-- Modal 2: Schedule Appointment Modal -->
<div id="admin-schedule-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-outfit font-extrabold text-base text-slate-800">
                📅 Schedule Chef Connect Appointment
            </h3>
            <button onclick="closeAdminAppointmentModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold">
                ✕
            </button>
        </div>

        <form action="{{ url('admin/chefs/schedule-appointment') }}" method="POST" class="space-y-4">
            @csrf
            <input type="hidden" name="chef_id" id="modal-chef-id">

            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Chef Profile</label>
                <input type="text" id="modal-chef-name" readonly class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 cursor-not-allowed">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Select Employer *</label>
                <select name="employer_id" required class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500">
                    <option value="">-- Select an Employer --</option>
                    @foreach($employers as $emp)
                        <option value="{{ $emp->id }}">
                            {{ $emp->full_name }} ({{ $emp->mobile_number ?? 'No Mobile' }})
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Meeting Date *</label>
                    <input type="text" name="meeting_date" placeholder="e.g. Monday, Oct 23" required class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Meeting Time *</label>
                    <input type="text" name="meeting_time" placeholder="e.g. 10:00 AM" required class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Meeting Agenda (Optional)</label>
                <textarea name="purpose" placeholder="Describe purpose of call..." class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500 h-20 resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onclick="closeAdminAppointmentModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20">
                    Create Appointment
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function openChefDetailsModal(id, name, email, mobile, city, exp, cuisine, bio, calendly) {
    document.getElementById('modal-detail-name').innerText = name;
    document.getElementById('modal-detail-email').innerText = email;
    document.getElementById('modal-detail-mobile').innerText = mobile || 'Not Provided';
    document.getElementById('modal-detail-city').innerText = city || 'Not Provided';
    document.getElementById('modal-detail-exp').innerText = exp || 'Not Provided';
    document.getElementById('modal-detail-cuisine').innerText = cuisine || 'Multi-Cuisine';
    document.getElementById('modal-detail-bio').innerText = bio || 'No bio specified';

    const calendlyWrapper = document.getElementById('modal-detail-calendly-wrapper');
    const calendlyLink = document.getElementById('modal-detail-calendly');

    if (calendly) {
        calendlyLink.href = calendly;
        calendlyLink.innerText = calendly;
        calendlyWrapper.classList.remove('hidden');
    } else {
        calendlyWrapper.classList.add('hidden');
    }

    const modal = document.getElementById('chef-details-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeChefDetailsModal() {
    const modal = document.getElementById('chef-details-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function openAdminAppointmentModal(chefId, chefName) {
    document.getElementById('modal-chef-id').value = chefId;
    document.getElementById('modal-chef-name').value = chefName;
    
    const modal = document.getElementById('admin-schedule-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeAdminAppointmentModal() {
    const modal = document.getElementById('admin-schedule-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}
</script>
@endsection
