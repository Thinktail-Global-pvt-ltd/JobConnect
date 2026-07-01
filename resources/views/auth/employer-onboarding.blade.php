@extends('layouts.app')

@section('title', 'Complete Profile')

@section('content')
<div class="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col justify-between pb-8">
    
    <!-- Top App Bar -->
    <header class="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div class="flex items-center gap-3">
            <a href="{{ route('profile') }}" class="text-gray-400 hover:text-gray-600 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </a>
            <span class="font-outfit font-bold text-lg text-gray-900">Complete Profile</span>
        </div>
        <div class="text-xs font-bold text-green-600 uppercase tracking-wider" id="step-indicator">
            Step 1 of 5
        </div>
    </header>

    <!-- Global Progress Bar -->
    <div class="w-full bg-gray-100 h-1.5 sticky top-[52px] z-50">
        <div class="bg-green-500 h-full transition-all duration-300" id="progress-fill" style="width: 20%;"></div>
    </div>

    <!-- Onboarding Form Form -->
    <form action="{{ route('api.employer.onboarding.save') }}" method="POST" id="onboarding-form" enctype="multipart/form-data" class="flex-grow flex flex-col justify-between px-4 pt-6">
        @csrf
        
        <!-- Step Container -->
        <div class="flex-grow">
            
            <!-- STEP 1: Business Information -->
            <div class="step-pane" id="step-pane-1">
                <div class="mb-6">
                    <span class="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Onboarding Progress</span>
                    <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Business Information</h2>
                    <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                        Tell us about your establishment to help us find the right talent for your team.
                    </p>
                </div>

                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Business Name *</label>
                        <input type="text" name="business_name" id="input-business-name" 
                               class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                               placeholder="e.g. The Green Kitchen" required>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Industry Segment *</label>
                        <select name="industry_segment" id="input-industry-segment" 
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition" required>
                            <option value="">Select a segment</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Hotel & Resort">Hotel & Resort</option>
                            <option value="Cafe">Cafe</option>
                            <option value="Bakery / Patisserie">Bakery / Patisserie</option>
                            <option value="Cloud Kitchen / QSR">Cloud Kitchen / QSR</option>
                            <option value="Catering & Events">Catering & Events</option>
                            <option value="Bar / Pub / Lounge">Bar / Pub / Lounge</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Business Location *</label>
                        <div class="relative mb-3">
                            <span class="absolute left-4 top-3.5 text-gray-400">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25gA7.5 7.5 0 1119.5 10.5z" />
                                </svg>
                            </span>
                            <input type="text" name="business_location" id="input-business-location" 
                                   class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                   placeholder="Search city or street" required>
                        </div>

                        <!-- Mini Map Mockup -->
                        <div class="w-full h-36 bg-gray-100 rounded-2xl relative overflow-hidden border border-gray-200 flex items-center justify-center">
                            <!-- Background Map Mock Pattern -->
                            <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-75"></div>
                            
                            <!-- Location Pin -->
                            <div class="relative z-10 flex flex-col items-center">
                                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-300 shadow-sm animate-bounce">
                                    <span class="w-3.5 h-3.5 rounded-full bg-green-600"></span>
                                </div>
                                <span class="text-[10px] font-bold text-green-700 bg-white/90 backdrop-blur-sm border border-green-200 px-2 py-0.5 rounded-md mt-1 shadow-sm">Your Location</span>
                            </div>

                            <!-- Use current location button -->
                            <button type="button" onclick="useCurrentLocation()" class="absolute bottom-3 right-3 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1.5 transition">
                                <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25gA7.5 7.5 0 1119.5 10.5z" />
                                </svg>
                                Use current location
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Info Box -->
                <div class="mt-5 bg-green-50/60 border border-green-100 rounded-2xl p-4 flex gap-3">
                    <svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.085l-.04.02-.041.02a.75.75 0 01-1.085-1.085l.04-.02zM12 21.75a9.75 9.75 0 110-19.5 9.75 9.75 0 010 19.5z" />
                    </svg>
                    <p class="text-[11px] text-green-800 leading-relaxed font-semibold">
                        This information will be visible to potential candidates to help them understand your brand and location proximity.
                    </p>
                </div>
            </div>

            <!-- STEP 2: Contact Information -->
            <div class="step-pane hidden" id="step-pane-2">
                <div class="mb-6">
                    <span class="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Onboarding Progress</span>
                    <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Contact Information</h2>
                    <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                        Provide details so we can reach out regarding high-quality candidates and updates.
                    </p>
                </div>

                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Person Name *</label>
                        <input type="text" name="contact_person_name" id="input-contact-name" 
                               class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                               placeholder="Enter full name" required>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Business Mobile Number *</label>
                        <div class="flex gap-2">
                            <select class="w-24 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition">
                                <option value="+971">+971</option>
                                <option value="+91">+91</option>
                                <option value="+44">+44</option>
                                <option value="+1">+1</option>
                            </select>
                            <input type="tel" name="business_mobile" id="input-business-mobile" 
                                   class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                   placeholder="00 000 0000" required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Business Email Address</label>
                        <input type="email" name="business_email" id="input-business-email" 
                               class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                               placeholder="example@business.com">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Preferred Language *</label>
                        <select name="preferred_language" id="input-preferred-language" 
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition" required>
                            <option value="English (UK)">English (UK)</option>
                            <option value="Hindi (IN)">Hindi (IN)</option>
                            <option value="Arabic (UAE)">Arabic (UAE)</option>
                        </select>
                    </div>
                </div>

                <div class="text-center mt-6">
                    <p class="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">
                        Your email address is protected and will only be used for system notifications and secure verification purposes.
                    </p>
                </div>
            </div>

            <!-- STEP 3: Business Profile -->
            <div class="step-pane hidden" id="step-pane-3">
                <div class="mb-6">
                    <span class="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Onboarding Progress</span>
                    <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Business Profile</h2>
                    <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                        Upload your logo and add the physical locations where your hospitality team will be working.
                    </p>
                </div>

                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-5">
                    <!-- Logo Upload -->
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Company Logo</label>
                        <div class="flex items-center gap-4">
                            <div class="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden shrink-0 group hover:border-green-400 transition" id="logo-preview-box">
                                <span class="material-symbols-outlined text-[32px] text-gray-400" id="upload-icon">image</span>
                                <img id="logo-preview-img" class="w-full h-full object-cover hidden absolute inset-0">
                            </div>
                            <div class="flex-grow">
                                <input type="file" name="company_logo" id="input-company-logo" accept="image/*" class="hidden" onchange="previewLogo(this)">
                                <button type="button" onclick="document.getElementById('input-company-logo').click()" class="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">
                                    Choose Logo File
                                </button>
                                <p class="text-[10px] text-gray-400 mt-1.5">PNG, JPG up to 5MB. Recommended square format.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Operational Locations -->
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Operational Locations (MANDATORY)</label>
                        </div>
                        
                        <div id="locations-list" class="space-y-3">
                            <div class="location-item bg-gray-50/50 border border-gray-200/60 p-3 rounded-2xl flex gap-3 relative pr-8">
                                <span class="material-symbols-outlined text-gray-400 text-lg shrink-0 mt-0.5">location_on</span>
                                <div class="flex-grow">
                                    <input type="text" name="operational_locations[]" required
                                           class="w-full bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-gray-800 placeholder-gray-400" 
                                           placeholder="Enter building, street, city & postcode">
                                </div>
                            </div>
                        </div>

                        <button type="button" onclick="addLocationInput()" class="mt-3 w-full border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50/20 py-2.5 rounded-xl text-xs font-bold text-green-600 flex items-center justify-center gap-1.5 transition">
                            <span class="material-symbols-outlined text-sm">add</span>
                            Add Another Location
                        </button>
                    </div>
                </div>

                <!-- Info banner -->
                <div class="mt-5 bg-green-50/60 border border-green-100 rounded-2xl p-4 flex gap-3">
                    <svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.085l-.04.02-.041.02a.75.75 0 01-1.085-1.085l.04-.02zM12 21.75a9.75 9.75 0 110-19.5 9.75 9.75 0 010 19.5z" />
                    </svg>
                    <p class="text-[11px] text-green-800 leading-relaxed font-semibold">
                        Having multiple locations allows you to post jobs specifically for each venue while managing them from one central account.
                    </p>
                </div>
            </div>

            <!-- STEP 4: Nominee Details -->
            <div class="step-pane hidden" id="step-pane-4">
                <div class="mb-6">
                    <span class="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Onboarding Progress</span>
                    <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Talent Manager Details</h2>
                    <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                        Please provide the contact details for your business nominee or secondary contact person.
                    </p>
                </div>

                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nominee Full Name *</label>
                        <input type="text" name="nominee_name" id="input-nominee-name" 
                               class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                               placeholder="Legal name as per identity documents" required>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Relationship *</label>
                        <select name="nominee_relationship" id="input-nominee-rel" 
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition" required>
                            <option value="">Select Relationship</option>
                            <option value="Business Owner / Founder">Business Owner / Founder</option>
                            <option value="Human Resource Manager">Human Resource Manager</option>
                            <option value="Operations Director">Operations Director</option>
                            <option value="General Manager">General Manager</option>
                            <option value="Colleague / Deputy Chef">Colleague / Deputy Chef</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number *</label>
                        <div class="flex gap-2">
                            <select class="w-24 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition">
                                <option value="+91">+91</option>
                                <option value="+971">+971</option>
                                <option value="+1">+1</option>
                            </select>
                            <input type="tel" name="nominee_mobile" id="input-nominee-mobile" 
                                   class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                   placeholder="Mobile Number" required>
                        </div>
                    </div>
                </div>

                <!-- Privacy Info banner -->
                <div class="mt-5 bg-green-50/60 border border-green-100 rounded-2xl p-4 flex gap-3">
                    <svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    <p class="text-[11px] text-green-800 leading-relaxed font-semibold">
                        <strong>Secure Verification:</strong> We prioritize data privacy. Nominee details are only used for legal compliance and essential platform updates.
                    </p>
                </div>
            </div>

            <!-- STEP 5: Onboarding Complete (All Set!) -->
            <div class="step-pane hidden" id="step-pane-5">
                <div class="text-center mb-8 flex flex-col items-center">
                    <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">All Set!</h2>
                    <p class="text-gray-500 text-xs mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                        Your employer profile has been completed successfully. You can now start posting jobs and reviewing applicants.
                    </p>
                </div>

                <!-- Profile Summary Card -->
                <div class="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6 space-y-5">
                    <!-- Identity Row -->
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                            <img id="summary-logo" class="w-full h-full object-cover hidden">
                            <span class="material-symbols-outlined text-[28px] text-gray-400" id="summary-logo-placeholder">apartment</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-base" id="summary-business-name">Verdant Stays</h4>
                            <p class="text-xs text-gray-400 font-semibold" id="summary-segment">Hospitality</p>
                        </div>
                    </div>

                    <!-- Details List -->
                    <div class="border-t border-gray-100 pt-4 space-y-4">
                        <div>
                            <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Operational Locations</span>
                            <div class="flex flex-wrap gap-1.5" id="summary-locations-pills">
                                <!-- dynamic pills -->
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Nominee</span>
                                <p class="text-xs font-bold text-gray-800" id="summary-nominee">Aryan Jain</p>
                                <p class="text-[10px] text-gray-400 font-semibold" id="summary-relationship">Manager</p>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Interface Language</span>
                                <p class="text-xs font-bold text-gray-800" id="summary-language">English (UK)</p>
                                <p class="text-[10px] text-gray-400 font-semibold">Primary Interface</p>
                            </div>
                        </div>

                        <div class="flex items-center justify-between bg-gray-50/50 px-4 py-3 rounded-2xl">
                            <div>
                                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Type</span>
                                <p class="text-xs font-bold text-gray-800 mt-0.5" id="summary-segment-type">Luxury Hotel Chain</p>
                            </div>
                            <button type="button" onclick="goToStep(1)" class="text-green-600 hover:text-green-700 transition">
                                <span class="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Sticky Bottom Action Button -->
        <div class="pt-6">
            <button type="button" id="next-button" onclick="handleNextStep()"
                    class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-green-200/50 transition flex items-center justify-center gap-2">
                <span id="button-label">Continue</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" id="button-arrow">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    </form>
</div>

<script>
let currentStep = 1;
const totalSteps = 5;

function useCurrentLocation() {
    document.getElementById('input-business-location').value = 'Mumbai, Maharashtra, India';
    alert('Location filled using GPS (Mock location: Mumbai).');
}

function addLocationInput() {
    const wrapper = document.getElementById('locations-list');
    const container = document.createElement('div');
    container.className = 'location-item bg-gray-50/50 border border-gray-200/60 p-3 rounded-2xl flex gap-3 relative pr-8';
    
    container.innerHTML = `
        <span class="material-symbols-outlined text-gray-400 text-lg shrink-0 mt-0.5">location_on</span>
        <div class="flex-grow">
            <input type="text" name="operational_locations[]" required
                   class="w-full bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-gray-800 placeholder-gray-400" 
                   placeholder="Enter building, street, city & postcode">
        </div>
        <button type="button" onclick="this.closest('.location-item').remove()" class="absolute right-2 top-3 text-gray-400 hover:text-red-500 transition">
            <span class="material-symbols-outlined text-base">close</span>
        </button>
    `;
    wrapper.appendChild(container);
}

function previewLogo(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById('logo-preview-img');
            const previewIcon = document.getElementById('upload-icon');
            
            previewImg.src = e.target.result;
            previewImg.classList.remove('hidden');
            previewIcon.classList.add('hidden');
            
            // Also update step 5 summary logo
            const summaryLogo = document.getElementById('summary-logo');
            const summaryLogoPlaceholder = document.getElementById('summary-logo-placeholder');
            summaryLogo.src = e.target.result;
            summaryLogo.classList.remove('hidden');
            summaryLogoPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function validateStep(step) {
    if (step === 1) {
        return document.getElementById('input-business-name').value.trim() !== '' &&
               document.getElementById('input-industry-segment').value !== '' &&
               document.getElementById('input-business-location').value.trim() !== '';
    }
    if (step === 2) {
        return document.getElementById('input-contact-name').value.trim() !== '' &&
               document.getElementById('input-business-mobile').value.trim() !== '' &&
               document.getElementById('input-preferred-language').value !== '';
    }
    if (step === 3) {
        const inputs = document.querySelectorAll('input[name="operational_locations[]"]');
        let valid = true;
        inputs.forEach(i => {
            if (i.value.trim() === '') valid = false;
        });
        return valid && inputs.length > 0;
    }
    if (step === 4) {
        return document.getElementById('input-nominee-name').value.trim() !== '' &&
               document.getElementById('input-nominee-rel').value !== '' &&
               document.getElementById('input-nominee-mobile').value.trim() !== '';
    }
    return true;
}

function goToStep(step) {
    // Hide all step panes
    document.querySelectorAll('.step-pane').forEach(p => p.classList.add('hidden'));
    
    // Show target step pane
    document.getElementById(`step-pane-${step}`).classList.remove('hidden');
    
    // Update progress bar & indicators
    currentStep = step;
    document.getElementById('step-indicator').textContent = `Step ${step} of ${totalSteps}`;
    document.getElementById('progress-fill').style.width = `${(step / totalSteps) * 100}%`;
    
    // Update button labels
    const btnLabel = document.getElementById('button-label');
    const btnArrow = document.getElementById('button-arrow');
    
    if (step === 5) {
        btnLabel.textContent = 'Start Posting Jobs';
        btnArrow.classList.add('hidden');
        
        // Formulate summary card
        document.getElementById('summary-business-name').textContent = document.getElementById('input-business-name').value;
        document.getElementById('summary-segment').textContent = document.getElementById('input-industry-segment').value;
        document.getElementById('summary-segment-type').textContent = document.getElementById('input-industry-segment').value + ' Operations';
        document.getElementById('summary-nominee').textContent = document.getElementById('input-nominee-name').value;
        document.getElementById('summary-relationship').textContent = document.getElementById('input-nominee-rel').value;
        document.getElementById('summary-language').textContent = document.getElementById('input-preferred-language').value;
        
        // Locations pills
        const pillsWrapper = document.getElementById('summary-locations-pills');
        pillsWrapper.innerHTML = '';
        const locations = document.querySelectorAll('input[name="operational_locations[]"]');
        locations.forEach(loc => {
            if (loc.value.trim() !== '') {
                const pill = document.createElement('span');
                pill.className = 'px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-full text-[10px] border border-gray-200';
                pill.textContent = loc.value.split(',')[0]; // first word or city name
                pillsWrapper.appendChild(pill);
            }
        });
    } else {
        btnLabel.textContent = 'Continue';
        btnArrow.classList.remove('hidden');
    }
}

function handleNextStep() {
    if (currentStep < totalSteps) {
        if (!validateStep(currentStep)) {
            alert('Please fill out all mandatory fields before continuing.');
            return;
        }
        goToStep(currentStep + 1);
    } else {
        submitForm();
    }
}

async function submitForm() {
    const form = document.getElementById('onboarding-form');
    const submitBtn = document.getElementById('next-button');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-block animate-pulse">Completing Setup...</span>';

    const formData = new FormData(form);

    try {
        const response = await fetch(form.getAttribute('action'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.location.href = data.redirect_url;
        } else {
            if (data.errors) {
                let errorMessages = [];
                Object.keys(data.errors).forEach(key => {
                    errorMessages.push(data.errors[key][0]);
                });
                alert('Validation Errors:\n\n' + errorMessages.join('\n'));
            } else {
                alert(data.message || 'Verification / submission failed.');
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (err) {
        console.error(err);
        alert('An unexpected error occurred.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}
</script>
@endsection
