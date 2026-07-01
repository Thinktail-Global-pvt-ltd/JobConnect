@extends('layouts.app')

@section('title', 'Post a Job')

@section('content')
<div class="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col justify-between pb-8">
    
    <!-- Top App Bar -->
    <header class="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div class="flex items-center gap-3">
            <a href="{{ route('profile') }}" class="text-gray-400 hover:text-gray-600 transition" id="back-button-link">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </a>
            <span class="font-outfit font-bold text-lg text-gray-900" id="header-title">Post a Job</span>
        </div>
        <div class="text-[10px] font-extrabold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider" id="draft-pill">
            Draft
        </div>
    </header>

    <!-- Global Progress Bar -->
    <div class="w-full bg-gray-100 h-1 sticky top-[52px] z-50">
        <div class="bg-green-500 h-full transition-all duration-300" id="progress-fill" style="width: 33%;"></div>
    </div>

    <!-- Step Sub-header -->
    <div class="bg-gray-100/60 px-4 py-2 text-[10px] font-bold text-gray-500 tracking-wider uppercase border-b border-gray-200/50 sticky top-[56px] z-40" id="step-sub-header">
        STEP 1 OF 3: SELECT REGION & JOB INFO
    </div>

    <!-- Onboarding Form Form -->
    <form action="{{ route('jobs.store') }}" method="POST" id="job-post-form" class="flex-grow flex flex-col justify-between px-4 pt-5">
        @csrf
        
        <!-- Hidden/Default Form fields -->
        <input type="hidden" name="category" id="hidden-category" value="india">
        <input type="hidden" name="company" value="{{ $user->employerProfile->business_name ?? 'My Establishment' }}">
        <input type="hidden" name="company_logo_url" value="{{ $user->employerProfile->company_logo_path ?? '' }}">
        <input type="hidden" name="contact_info" value="{{ $user->employerProfile->business_email ?? $user->email ?? 'careers@hospitality.com' }}">
        <input type="hidden" name="job_type" value="Full-time">

        <!-- Step Container -->
        <div class="flex-grow">
            
            <!-- STEP 1: Job Information -->
            <div class="step-pane" id="step-pane-1">
                <!-- Select Region Pills -->
                <div class="mb-5">
                    <label class="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5">Select Region *</label>
                    <div class="flex flex-wrap gap-2">
                        <button type="button" onclick="selectRegion('India', 'india')" class="region-pill px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition active:scale-95 select-none" id="pill-india">
                            India
                        </button>
                        <button type="button" onclick="selectRegion('KSA', 'overseas')" class="region-pill px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition active:scale-95 select-none" id="pill-ksa">
                            KSA
                        </button>
                        <button type="button" onclick="selectRegion('Dubai', 'overseas')" class="region-pill px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition active:scale-95 select-none" id="pill-dubai">
                            Dubai
                        </button>
                        <button type="button" onclick="selectRegion('Europe', 'overseas')" class="region-pill px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition active:scale-95 select-none" id="pill-europe">
                            Europe
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">work</span> Job Title *
                        </label>
                        <input type="text" name="title" id="input-title" 
                               class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                               placeholder="e.g. Senior Head Chef" required>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">location_on</span> Location *
                        </label>
                        <input type="text" name="location" id="input-location" 
                               class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                               placeholder="e.g. Mumbai, India" required>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Salary Range *</label>
                            <input type="text" name="salary" id="input-salary" 
                                   class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                   placeholder="e.g. INR 45k pm" required>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Experience *</label>
                            <select name="experience_range" id="input-experience" 
                                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition" required>
                                <option value="Entry Level">Entry Level</option>
                                <option value="1-3 Years">1-3 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                                <option value="5+ Years" selected>5+ Years</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Open Positions *</label>
                        <input type="number" name="open_positions" id="input-open-positions" min="1" value="1"
                               class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition" required>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Job Description *</label>
                        <textarea name="description" id="input-description" rows="4" 
                                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                  placeholder="Describe the role, responsibilities, and perks..." required></textarea>
                    </div>
                </div>
            </div>

            <!-- STEP 2: Review & Post -->
            <div class="step-pane hidden" id="step-pane-2">
                <div class="mb-5 flex justify-between items-center">
                    <h3 class="font-outfit font-bold text-lg text-gray-900 tracking-tight">Review & Post</h3>
                </div>

                <div class="space-y-4">
                    <!-- Job Details Card -->
                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 relative">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider" id="review-region-label">India Jobs</span>
                            <button type="button" onclick="goToStep(1)" class="text-xs font-bold text-green-600 hover:text-green-700 transition flex items-center gap-0.5">
                                <span class="material-symbols-outlined text-sm">edit</span> Edit
                            </button>
                        </div>
                        
                        <div class="space-y-3">
                            <div class="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Position Title</span>
                                    <p class="text-xs font-extrabold text-gray-800" id="review-title">Senior Head Chef</p>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                                    <p class="text-xs font-extrabold text-gray-800" id="review-location">Mumbai, India</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-3 gap-3 border-b border-gray-100 pb-3">
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Salary</span>
                                    <p class="text-xs font-extrabold text-gray-800" id="review-salary">INR 45k pm</p>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Experience</span>
                                    <p class="text-xs font-extrabold text-gray-800" id="review-experience">5+ Years</p>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Openings</span>
                                    <p class="text-xs font-extrabold text-gray-800" id="review-openings">2 Positions</p>
                                </div>
                            </div>

                            <div>
                                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Job Description</span>
                                <p class="text-xs font-medium text-gray-600 leading-relaxed whitespace-pre-line" id="review-description">
                                    Seeking a passionate head chef...
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Business Contact Card -->
                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                        <div class="flex justify-between items-center mb-3">
                            <span class="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Business Contact</span>
                            <a href="{{ route('profile.personal.edit') }}" class="text-xs font-bold text-green-600 hover:text-green-700 transition flex items-center gap-0.5">
                                <span class="material-symbols-outlined text-sm">edit</span> Edit
                            </a>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                @if($user->employerProfile && $user->employerProfile->company_logo_path)
                                    <img src="{{ $user->employerProfile->company_logo_path }}" class="w-full h-full object-cover">
                                @else
                                    <span class="material-symbols-outlined text-gray-400 text-2xl">apartment</span>
                                @endif
                            </div>
                            <div>
                                <h4 class="font-bold text-xs text-gray-900">{{ $user->employerProfile->business_name ?? 'My Establishment' }}</h4>
                                <p class="text-[10px] text-gray-500 font-semibold mt-0.5 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-xs">person</span> {{ $user->employerProfile->contact_person_name ?? $user->full_name }}
                                </p>
                                <p class="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-xs">call</span> {{ $user->employerProfile->business_mobile ?? $user->mobile_number }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Guidelines disclaimer -->
                <div class="mt-5 bg-green-50/60 border border-green-100 rounded-2xl p-4 flex gap-3">
                    <svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.085l-.04.02-.041.02a.75.75 0 01-1.085-1.085l.04-.02zM12 21.75a9.75 9.75 0 110-19.5 9.75 9.75 0 010 19.5z" />
                    </svg>
                    <p class="text-[10px] text-green-800 leading-relaxed font-semibold">
                        Your job post will be visible to our community of 500+ hospitality professionals. By submitting, you agree to our terms of service and professional community guidelines.
                    </p>
                </div>
            </div>

            <!-- STEP 3: Job Submitted Successfully -->
            <div class="step-pane hidden" id="step-pane-3">
                <div class="text-center mb-8 flex flex-col items-center pt-8">
                    <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-green-600 animate-bounce" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    
                    <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight mb-2">🎉 Job Submitted Successfully</h2>
                    
                    <div class="bg-white rounded-3xl border border-gray-100 p-5 mt-4 text-center max-w-sm mx-auto shadow-sm">
                        <p class="text-xs text-gray-500 leading-relaxed">
                            Your job has been submitted for <span class="font-bold text-gray-800">admin review</span>. 
                            Once approved, it will be published in the community feed and notifications will be sent to matched staff.
                        </p>
                    </div>
                </div>

                <div class="space-y-3 pt-4">
                    <button type="button" onclick="resetJobWizard()" 
                            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2">
                        <span>Post a new job</span>
                    </button>
                    <a href="{{ route('profile', ['section' => 'my_posted_jobs']) }}" 
                       class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition flex items-center justify-center">
                        Go to Dashboard
                    </a>
                </div>
            </div>

        </div>

        <!-- Sticky Bottom Action Button -->
        <div class="pt-6" id="bottom-action-container">
            <button type="button" id="next-button" onclick="handleNextStep()"
                    class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-green-200/50 transition flex items-center justify-center gap-2">
                <span id="button-label">Submit For Approval</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" id="button-arrow">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    </form>
</div>

<script>
let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', () => {
    // Select India by default
    selectRegion('India', 'india');
});

function selectRegion(label, category) {
    // Reset all pills
    document.querySelectorAll('.region-pill').forEach(pill => {
        pill.classList.remove('bg-green-500', 'text-white', 'border-green-600');
        pill.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
    });

    // Highlight selected pill
    let activeId = 'pill-' + label.toLowerCase();
    let pill = document.getElementById(activeId);
    if (pill) {
        pill.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
        pill.classList.add('bg-green-500', 'text-white', 'border-green-600');
    }

    // Update hidden field
    document.getElementById('hidden-category').value = category;
    document.getElementById('review-region-label').textContent = `${label} Jobs`;
}

function validateStep1() {
    return document.getElementById('input-title').value.trim() !== '' &&
           document.getElementById('input-location').value.trim() !== '' &&
           document.getElementById('input-salary').value.trim() !== '' &&
           document.getElementById('input-experience').value !== '' &&
           document.getElementById('input-description').value.trim() !== '';
}

function goToStep(step) {
    document.querySelectorAll('.step-pane').forEach(p => p.classList.add('hidden'));
    document.getElementById(`step-pane-${step}`).classList.remove('hidden');

    currentStep = step;
    const fill = document.getElementById('progress-fill');
    const headerTitle = document.getElementById('header-title');
    const stepSubHeader = document.getElementById('step-sub-header');
    const btnLabel = document.getElementById('button-label');
    const bottomBtn = document.getElementById('bottom-action-container');
    const draftPill = document.getElementById('draft-pill');
    const backBtn = document.getElementById('back-button-link');

    if (step === 1) {
        fill.style.width = '33%';
        stepSubHeader.textContent = 'STEP 1 OF 3: SELECT REGION & JOB INFO';
        btnLabel.textContent = 'Submit For Approval';
        bottomBtn.classList.remove('hidden');
        draftPill.classList.remove('hidden');
        backBtn.setAttribute('href', "{{ route('profile') }}");
    } else if (step === 2) {
        fill.style.width = '66%';
        stepSubHeader.textContent = 'STEP 2 OF 3: CONTACT & REVIEW';
        btnLabel.textContent = 'Submit Job';
        bottomBtn.classList.remove('hidden');
        draftPill.classList.remove('hidden');
        
        // Populate review labels
        document.getElementById('review-title').textContent = document.getElementById('input-title').value;
        document.getElementById('review-location').textContent = document.getElementById('input-location').value;
        document.getElementById('review-salary').textContent = document.getElementById('input-salary').value;
        document.getElementById('review-experience').textContent = document.getElementById('input-experience').value;
        document.getElementById('review-openings').textContent = document.getElementById('input-open-positions').value + ' Positions';
        document.getElementById('review-description').textContent = document.getElementById('input-description').value;

        // Custom back click handler
        backBtn.removeAttribute('href');
        backBtn.onclick = (e) => {
            e.preventDefault();
            goToStep(1);
        };
    } else if (step === 3) {
        fill.style.width = '100%';
        stepSubHeader.textContent = '100% COMPLETE';
        bottomBtn.classList.add('hidden');
        draftPill.classList.add('hidden');
        headerTitle.textContent = 'Success';
    }
}

function handleNextStep() {
    if (currentStep === 1) {
        if (!validateStep1()) {
            alert('Please fill out all mandatory fields.');
            return;
        }
        goToStep(2);
    } else if (currentStep === 2) {
        submitJobForm();
    }
}

async function submitJobForm() {
    const form = document.getElementById('job-post-form');
    const submitBtn = document.getElementById('next-button');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-block animate-pulse">Submitting vacancy...</span>';

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
            goToStep(3);
        } else {
            if (data.errors) {
                let errs = [];
                Object.keys(data.errors).forEach(k => errs.push(data.errors[k][0]));
                alert('Validation errors:\n\n' + errs.join('\n'));
            } else {
                alert(data.message || 'Job submission failed.');
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (err) {
        console.error(err);
        alert('An unexpected error occurred during submission.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function resetJobWizard() {
    document.getElementById('job-post-form').reset();
    selectRegion('India', 'india');
    goToStep(1);
    document.getElementById('header-title').textContent = 'Post a Job';
}
</script>
@endsection
