@extends('layouts.app')

@section('title', 'Chef Onboarding')

@section('content')
<div class="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col justify-between pb-8">
    
    <!-- Top App Bar -->
    <header class="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm" id="onboarding-header">
        <div class="flex items-center gap-3">
            <button type="button" id="btn-back" class="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-50 rounded-full">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <span class="font-outfit font-bold text-lg text-gray-900" id="header-title">ChefConnect</span>
        </div>
        <div class="text-xs font-bold text-green-600 uppercase tracking-wider hidden" id="step-indicator">
            Step 1 of 4
        </div>
    </header>

    <!-- Global Progress Bar -->
    <div class="w-full bg-gray-100 h-1.5 sticky top-[52px] z-50 hidden" id="progress-bar-container">
        <div class="bg-green-500 h-full transition-all duration-300" id="progress-fill" style="width: 0%;"></div>
    </div>

    <!-- MAIN ONBOARDING FORM CONTAINER -->
    <form action="{{ route('api.chef.onboarding.save') }}" method="POST" id="chef-onboarding-form" enctype="multipart/form-data" class="flex-grow flex flex-col justify-between px-4 pt-6">
        @csrf
        
        <div class="flex-grow flex flex-col">
            
            <!-- ========================================== -->
            <!-- WELCOME SCREEN -->
            <!-- ========================================== -->
            <div class="step-pane flex-grow flex flex-col justify-between" id="step-pane-welcome">
                <div class="space-y-6">
                    <!-- Brand Section -->
                    <div class="bg-gradient-to-tr from-green-800 to-green-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                        <div class="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10"></div>
                        <span class="text-xs font-bold uppercase bg-white/20 px-2.5 py-0.5 rounded-full">Premium Talent Network</span>
                        <h2 class="font-outfit font-black text-2xl mt-4 leading-tight">The Global Nexus for<br>Culinary Excellence</h2>
                        <div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                            <div>
                                <span class="block text-2xl font-black">3,000+</span>
                                <span class="text-[9px] text-green-100 font-bold uppercase tracking-wider">Verified Chefs</span>
                            </div>
                            <div>
                                <span class="block text-2xl font-black">62+</span>
                                <span class="text-[9px] text-green-100 font-bold uppercase tracking-wider">Countries</span>
                            </div>
                        </div>
                    </div>

                    <!-- Elevate career benefits -->
                    <div class="space-y-4">
                        <h3 class="font-outfit font-bold text-gray-800 text-sm uppercase tracking-wider">Elevate Your Career</h3>
                        
                        <div class="space-y-3">
                            <div class="flex gap-3 bg-white p-3 border border-gray-100 rounded-2xl">
                                <span class="text-xl">💼</span>
                                <div>
                                    <h4 class="font-bold text-xs text-gray-800">Consulting Opportunities</h4>
                                    <p class="text-[10px] text-gray-400 mt-0.5">Connect with top brands globally</p>
                                </div>
                            </div>
                            <div class="flex gap-3 bg-white p-3 border border-gray-100 rounded-2xl">
                                <span class="text-xl">🏨</span>
                                <div>
                                    <h4 class="font-bold text-xs text-gray-800">Hospitality Projects</h4>
                                    <p class="text-[10px] text-gray-400 mt-0.5">Join exclusive luxury resort and hotel openings</p>
                                </div>
                            </div>
                            <div class="flex gap-3 bg-white p-3 border border-gray-100 rounded-2xl">
                                <span class="text-xl">🤝</span>
                                <div>
                                    <h4 class="font-bold text-xs text-gray-800">Business Networking</h4>
                                    <p class="text-[10px] text-gray-400 mt-0.5">Interact with industry leaders and innovators</p>
                                </div>
                            </div>
                            <div class="flex gap-3 bg-white p-3 border border-gray-100 rounded-2xl">
                                <span class="text-xl">🌐</span>
                                <div>
                                    <h4 class="font-bold text-xs text-gray-800">Professional Visibility</h4>
                                    <p class="text-[10px] text-gray-400 mt-0.5">Showcase your portfolio to wide network</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <button type="button" onclick="nextStep()" 
                            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                        Become a Culinary Talent
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>


            <!-- ========================================== -->
            <!-- STEP 1: PERSONAL DETAILS -->
            <!-- ========================================== -->
            <div class="step-pane flex-grow flex flex-col justify-between hidden" id="step-pane-1">
                <div class="space-y-6">
                    <!-- Heading -->
                    <div>
                        <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Personal Identity</h2>
                        <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                            First impressions matter in the professional kitchen. Setup your identity card.
                        </p>
                    </div>

                    <!-- Avatar Image Upload -->
                    <div class="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                        <label for="profile_photo" class="cursor-pointer group relative flex flex-col items-center">
                            <div class="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative" id="photo-preview-box">
                                <span class="material-symbols-outlined text-gray-400 text-2xl group-hover:scale-105 transition-transform" id="photo-icon">photo_camera</span>
                                <img id="photo-preview" src="" class="absolute inset-0 w-full h-full object-cover hidden">
                            </div>
                            <span class="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider group-hover:text-green-600 transition">Upload Photo</span>
                            <input type="file" name="profile_photo" id="profile_photo" accept="image/*" class="sr-only" onchange="previewImage(this)">
                        </label>
                    </div>

                    <!-- Input Fields -->
                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name *</label>
                            <input type="text" name="full_name" id="input-full-name" 
                                   class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                   placeholder="e.g. Rajesh Kumar" required value="{{ $user->full_name }}">
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Title *</label>
                            <input type="text" name="preferred_role" id="input-role" 
                                   class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                   placeholder="e.g. Executive Chef, Sous Chef" required value="{{ $user->preferred_role }}">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Current City *</label>
                                <input type="text" name="city" id="input-city" 
                                       class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                       placeholder="e.g. Dubai" required value="{{ $user->city }}">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Country *</label>
                                <input type="text" name="country" id="input-country" 
                                       class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                       placeholder="e.g. UAE" required value="India">
                            </div>
                        </div>

                        <!-- Languages Spoken -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Languages Spoken *</label>
                            <div class="flex flex-wrap gap-2" id="languages-chips">
                                @php
                                    $allLanguages = ['English', 'Hindi', 'French', 'Arabic', 'Spanish', 'German'];
                                @endphp
                                @foreach($allLanguages as $lang)
                                    <button type="button" onclick="toggleLanguageChip(this, '{{ $lang }}')"
                                            class="lang-chip border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition">
                                        {{ $lang }}
                                    </button>
                                @endforeach
                            </div>
                            <input type="hidden" name="languages[]" id="hidden-languages">
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <button type="button" onclick="nextStep()" 
                            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                        Continue
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>


            <!-- ========================================== -->
            <!-- STEP 2: PROFESSIONAL EXPERTISE -->
            <!-- ========================================== -->
            <div class="step-pane flex-grow flex flex-col justify-between hidden" id="step-pane-2">
                <div class="space-y-6">
                    <!-- Heading -->
                    <div>
                        <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Professional Expertise</h2>
                        <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                            Specify your culinary specialties and operational management capabilities.
                        </p>
                    </div>

                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-5">
                        <!-- Cuisine Specialty -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Cuisine Specialization *</label>
                            <div class="flex flex-wrap gap-2" id="cuisine-chips">
                                @php
                                    $cuisines = ['Italian', 'Continental', 'Indian', 'Chinese', 'Bakery', 'Arabic', 'Multi Cuisine', 'Grill & BBQ'];
                                @endphp
                                @foreach($cuisines as $cuisine)
                                    <button type="button" onclick="toggleCuisineChip(this, '{{ $cuisine }}')"
                                            class="cuisine-chip border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition">
                                        {{ $cuisine }}
                                    </button>
                                @endforeach
                            </div>
                            <!-- Save first selection to standard column, additional to serialized -->
                            <input type="hidden" name="cuisine_specialty" id="hidden-cuisine-main" required>
                        </div>

                        <!-- Operational Expertise -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Operational Expertise *</label>
                            <div class="flex flex-wrap gap-2" id="operational-chips">
                                @php
                                    $operationalSkills = ['Kitchen Setup', 'Menu Engineering', 'SOP Writer', 'Team Builder', 'Cost Control Expert'];
                                @endphp
                                @foreach($operationalSkills as $opSkill)
                                    <button type="button" onclick="toggleOperationalChip(this, '{{ $opSkill }}')"
                                            class="op-chip border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition">
                                        {{ $opSkill }}
                                    </button>
                                @endforeach
                            </div>
                            <input type="hidden" name="skills[]" id="hidden-operational" required>
                        </div>

                        <!-- Years of Experience -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Years of Experience *</label>
                            <select name="experience_range" id="input-experience" 
                                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition" required>
                                <option value="">Select years in industry</option>
                                <option value="Less than 1 Year">Less than 1 Year</option>
                                <option value="1-2 Years">1-2 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                                <option value="5-8 Years">5-8 Years</option>
                                <option value="8+ Years">8+ Years</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <button type="button" onclick="nextStep()" 
                            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                        Continue
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>


            <!-- ========================================== -->
            <!-- STEP 3: REGIONS & AVAILABILITY -->
            <!-- ========================================== -->
            <div class="step-pane flex-grow flex flex-col justify-between hidden" id="step-pane-3">
                <div class="space-y-6">
                    <!-- Heading -->
                    <div>
                        <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Experience & Availability</h2>
                        <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                            Specify your regional exposure, availability, preferences, and summarize your expertise.
                        </p>
                    </div>

                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                        <!-- Regional Experience -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Regional Experience *</label>
                            <div class="flex flex-wrap gap-2" id="regional-chips">
                                @php
                                    $regions = ['Saudi Arabia', 'UAE', 'GCC', 'International', 'India'];
                                @endphp
                                @foreach($regions as $region)
                                    <button type="button" onclick="toggleRegionChip(this, '{{ $region }}')"
                                            class="region-chip border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition">
                                        {{ $region }}
                                    </button>
                                @endforeach
                            </div>
                            <input type="hidden" name="regional_experience[]" id="hidden-regions">
                        </div>

                        <!-- Location Preference -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Job Location Preference *</label>
                            <div class="flex gap-2">
                                <label class="flex-1 cursor-pointer">
                                    <input type="radio" name="location_preference" value="India" class="peer sr-only" checked>
                                    <div class="peer-checked:border-green-600 peer-checked:bg-green-50/30 peer-checked:text-green-700 border border-gray-200 rounded-xl p-2.5 text-center font-bold text-xs text-gray-500 transition">
                                        India
                                    </div>
                                </label>
                                <label class="flex-1 cursor-pointer">
                                    <input type="radio" name="location_preference" value="Overseas" class="peer sr-only">
                                    <div class="peer-checked:border-green-600 peer-checked:bg-green-50/30 peer-checked:text-green-700 border border-gray-200 rounded-xl p-2.5 text-center font-bold text-xs text-gray-500 transition">
                                        Overseas
                                    </div>
                                </label>
                                <label class="flex-1 cursor-pointer">
                                    <input type="radio" name="location_preference" value="Both" class="peer sr-only">
                                    <div class="peer-checked:border-green-600 peer-checked:bg-green-50/30 peer-checked:text-green-700 border border-gray-200 rounded-xl p-2.5 text-center font-bold text-xs text-gray-500 transition">
                                        Both
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Employment Preference -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Employment Preference *</label>
                            <div class="flex flex-wrap gap-2" id="employment-chips">
                                @php
                                    $jobTypes = ['Full Time', 'Contract', 'Freelance', 'Project Based', 'Consultant'];
                                @endphp
                                @foreach($jobTypes as $jt)
                                    <button type="button" onclick="toggleEmploymentChip(this, '{{ $jt }}')"
                                            class="employment-chip border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition">
                                        {{ $jt }}
                                    </button>
                                @endforeach
                            </div>
                            <input type="hidden" name="employment_preference[]" id="hidden-employment">
                        </div>

                        <!-- Availability -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Availability *</label>
                            <select name="availability" id="input-availability" 
                                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition" required>
                                <option value="Available Immediately">Available Immediately</option>
                                <option value="1 Month Notice">1 Month Notice</option>
                                <option value="2 Month Notice">2 Month Notice</option>
                                <option value="3 Month Notice">3 Month Notice</option>
                            </select>
                        </div>

                        <!-- Bio -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Bio *</label>
                            <textarea name="bio" id="input-bio" rows="3" required
                                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                      placeholder="Briefly describe your expertise, career highlights, and what you bring to the kitchen..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <button type="button" onclick="nextStep()" 
                            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                        Continue
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>


            <!-- ========================================== -->
            <!-- STEP 4: CALENDLY INTEGRATION -->
            <!-- ========================================== -->
            <div class="step-pane flex-grow flex flex-col justify-between hidden" id="step-pane-4">
                <div class="space-y-6">
                    <!-- Heading -->
                    <div>
                        <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Schedule Faster</h2>
                        <p class="text-gray-500 text-xs mt-1.5 leading-relaxed">
                            Connect your calendar to let employers book interviews instantly.
                        </p>
                    </div>

                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4 text-center">
                        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto shadow-sm">
                            📅
                        </div>
                        <h3 class="font-extrabold text-sm text-gray-800 mt-3">Connect Calendly</h3>
                        <p class="text-[11px] text-gray-400 leading-normal max-w-xs mx-auto">
                            Add your Calendly link so employers can book slots with you in one tap.
                        </p>

                        <div class="text-left pt-2">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Calendly Link</label>
                            <input type="url" name="calendly_link" id="input-calendly" 
                                   class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                   placeholder="calendly.com/your-name">
                        </div>
                    </div>

                    <!-- Notice Box -->
                    <div class="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-3 text-left">
                        <span class="text-blue-600 text-lg">💡</span>
                        <div>
                            <h4 class="font-bold text-[11px] text-blue-800">Why connect calendar?</h4>
                            <p class="text-[10px] text-blue-800/80 leading-relaxed mt-0.5 font-semibold">
                                Candidates with connected Calendly accounts receive 30% more interview requests. It's the fastest way to land a job.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="pt-6">
                    <button type="submit" id="btn-submit"
                            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                        Connect & Complete
                    </button>
                </div>
            </div>

        </div>
    </form>
</div>

<script>
// --- STEP WIZARD NAVIGATION ---
const steps = ['welcome', '1', '2', '3', '4'];
let currentStepIndex = 0;

// Collections for chips
const state = {
    languages: [],
    cuisines: [],
    skills: [],
    regions: [],
    employment: []
};

// DOM References
const elements = {
    btnBack: document.getElementById('btn-back'),
    headerTitle: document.getElementById('header-title'),
    stepIndicator: document.getElementById('step-indicator'),
    progressBarContainer: document.getElementById('progress-bar-container'),
    progressFill: document.getElementById('progress-fill'),
    form: document.getElementById('chef-onboarding-form'),
    submitBtn: document.getElementById('btn-submit')
};

function updateWizardUI() {
    const step = steps[currentStepIndex];

    // Hide all step panes
    document.querySelectorAll('.step-pane').forEach(el => el.classList.add('hidden'));

    // Show current pane
    document.getElementById(`step-pane-${step}`).classList.remove('hidden');

    if (step === 'welcome') {
        elements.headerTitle.textContent = 'ChefConnect';
        elements.stepIndicator.classList.add('hidden');
        elements.progressBarContainer.classList.add('hidden');
    } else {
        const stepNum = parseInt(step);
        elements.headerTitle.textContent = 'Complete Profile';
        elements.stepIndicator.classList.remove('hidden');
        elements.stepIndicator.textContent = `Step ${stepNum} of 4`;
        elements.progressBarContainer.classList.remove('hidden');
        
        // Progress Fill percent
        const percent = stepNum * 25;
        elements.progressFill.style.width = `${percent}%`;
    }
}

function nextStep() {
    // Validate current step before proceeding
    if (steps[currentStepIndex] === '1') {
        const name = document.getElementById('input-full-name').value.trim();
        const role = document.getElementById('input-role').value.trim();
        const city = document.getElementById('input-city').value.trim();
        if (name === '' || role === '' || city === '') {
            alert('Please fill out all required fields.');
            return;
        }
        if (state.languages.length === 0) {
            alert('Please select at least one language.');
            return;
        }
    } else if (steps[currentStepIndex] === '2') {
        const mainCuisine = document.getElementById('hidden-cuisine-main').value;
        const exp = document.getElementById('input-experience').value;
        if (!mainCuisine) {
            alert('Please select at least one Cuisine Specialization.');
            return;
        }
        if (state.skills.length === 0) {
            alert('Please select at least one Operational Expertise.');
            return;
        }
        if (exp === '') {
            alert('Please select your experience range.');
            return;
        }
    } else if (steps[currentStepIndex] === '3') {
        const bio = document.getElementById('input-bio').value.trim();
        if (state.regions.length === 0) {
            alert('Please select at least one Regional Experience.');
            return;
        }
        if (state.employment.length === 0) {
            alert('Please select at least one Employment Preference.');
            return;
        }
        if (bio === '') {
            alert('Please write a short professional bio.');
            return;
        }
    }

    if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        updateWizardUI();
    }
}

function prevStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        updateWizardUI();
    } else {
        // Go back to profile / logout / feed
        window.location.href = '/login';
    }
}

elements.btnBack.addEventListener('click', prevStep);

// --- CHIP TOGGLERS ---

function toggleLanguageChip(btn, lang) {
    btn.classList.toggle('border-green-500');
    btn.classList.toggle('bg-green-50/40');
    btn.classList.toggle('text-green-700');
    
    const idx = state.languages.indexOf(lang);
    if (idx === -1) {
        state.languages.push(lang);
    } else {
        state.languages.splice(idx, 1);
    }
    document.getElementById('hidden-languages').value = JSON.stringify(state.languages);
}

function toggleCuisineChip(btn, cuisine) {
    // Standard Cuisine specialty only accepts one main selection in the schema, 
    // so we will highlight the selected and store it.
    document.querySelectorAll('.cuisine-chip').forEach(el => {
        el.classList.remove('border-green-500', 'bg-green-50/40', 'text-green-700');
    });

    btn.classList.add('border-green-500', 'bg-green-50/40', 'text-green-700');
    state.cuisines = [cuisine];
    document.getElementById('hidden-cuisine-main').value = cuisine;
}

function toggleOperationalChip(btn, skill) {
    btn.classList.toggle('border-green-500');
    btn.classList.toggle('bg-green-50/40');
    btn.classList.toggle('text-green-700');
    
    const idx = state.skills.indexOf(skill);
    if (idx === -1) {
        state.skills.push(skill);
    } else {
        state.skills.splice(idx, 1);
    }
    // Set to hidden skills input (standard input supports multiple arrays via fields skills[])
    const container = document.getElementById('hidden-operational');
    // Laravel expects individual inputs or array values, so we will append them
    // Actually, we can serialize it as JSON or create dynamic inputs. 
    // Let's create dynamic hidden inputs in form for skills[]:
    updateHiddenInputs('hidden-skills-container', 'skills[]', state.skills);
}

function toggleRegionChip(btn, region) {
    btn.classList.toggle('border-green-500');
    btn.classList.toggle('bg-green-50/40');
    btn.classList.toggle('text-green-700');
    
    const idx = state.regions.indexOf(region);
    if (idx === -1) {
        state.regions.push(region);
    } else {
        state.regions.splice(idx, 1);
    }
    updateHiddenInputs('hidden-regions-container', 'regional_experience[]', state.regions);
}

function toggleEmploymentChip(btn, jt) {
    btn.classList.toggle('border-green-500');
    btn.classList.toggle('bg-green-50/40');
    btn.classList.toggle('text-green-700');
    
    const idx = state.employment.indexOf(jt);
    if (idx === -1) {
        state.employment.push(jt);
    } else {
        state.employment.splice(idx, 1);
    }
    updateHiddenInputs('hidden-employment-container', 'employment_preference[]', state.employment);
}

function updateHiddenInputs(containerId, inputName, list) {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        elements.form.appendChild(container);
    }
    container.innerHTML = '';
    list.forEach(val => {
        const inp = document.createElement('input');
        inp.type = 'hidden';
        inp.name = inputName;
        inp.value = val;
        container.appendChild(inp);
    });
}

// --- PHOTO PREVIEW ---
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photo-preview').src = e.target.result;
            document.getElementById('photo-preview').classList.remove('hidden');
            document.getElementById('photo-icon').classList.add('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// --- SUBMIT HANDLING ---
elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    elements.submitBtn.disabled = true;
    elements.submitBtn.innerHTML = '<span class="inline-block animate-pulse">Saving Profile...</span>';

    const formData = new FormData(elements.form);

    // Append localized JSON list values if not already covered
    formData.delete('languages[]'); // replace with actual files
    state.languages.forEach(l => formData.append('languages[]', l));

    try {
        const response = await fetch(elements.form.getAttribute('action'), {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert(data.message);
            window.location.href = data.redirect_url;
        } else {
            alert(data.message || 'Onboarding failed. Please check inputs.');
            elements.submitBtn.disabled = false;
            elements.submitBtn.innerHTML = 'Connect & Complete';
        }
    } catch (err) {
        console.error(err);
        alert('Network connection error.');
        elements.submitBtn.disabled = false;
        elements.submitBtn.innerHTML = 'Connect & Complete';
    }
});

// Initialize UI
updateWizardUI();
</script>
@endsection
