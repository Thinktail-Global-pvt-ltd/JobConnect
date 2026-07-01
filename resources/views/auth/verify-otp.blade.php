@extends('layouts.app')

@section('title', 'Verify Number')

@section('content')
<div class="flex flex-col justify-center min-h-[60vh] px-4 py-8 max-w-sm mx-auto">
    
    <!-- Flashed Sandbox Demo Alert -->
    @if(session('demo_otp') || Cache::has("web_otp_{$mobile}"))
        @php 
            $otp = session('demo_otp') ?? Cache::get("web_otp_{$mobile}");
        @endphp
        <div class="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-5 rounded-2xl shadow-sm">
            <h4 class="font-bold text-sm flex items-center gap-1.5">
                <span>🤖</span> Testing Sandbox OTP
            </h4>
            <p class="text-xs text-blue-600 mt-1 leading-relaxed">
                Copy and enter this code to complete validation:
            </p>
            <div class="mt-3 flex items-center gap-3">
                <span class="font-mono text-3xl font-extrabold tracking-widest text-blue-800 bg-blue-100/60 px-4 py-1.5 rounded-xl border border-blue-200">
                    {{ $otp }}
                </span>
            </div>
        </div>
    @endif

    <!-- Header Section (Figma Styled) -->
    <div class="text-center mb-8 flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        </div>
        <h2 class="font-outfit font-bold text-2xl text-gray-900 tracking-tight">Verify your number</h2>
        <p class="text-gray-500 mt-2 text-sm max-w-[260px] leading-relaxed">
            We've sent a 6-digit verification code to <span class="font-semibold text-gray-800">+91 {{ $mobile }}</span>
        </p>
    </div>

    <!-- OTP Form -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6">
        <form action="{{ route('verify-otp.submit') }}" method="POST" id="verify-form">
            @csrf
            <input type="hidden" name="mobile_number" value="{{ $mobile }}">
            <input type="hidden" name="login_role" value="{{ $loginRole }}">

            <!-- 6 Boxes Input -->
            <div class="mb-8">
                <div class="flex justify-center gap-2" id="otp-inputs-wrapper">
                    <input type="text" maxlength="1" class="otp-box w-11 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition" required autofocus>
                    <input type="text" maxlength="1" class="otp-box w-11 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition" required>
                    <input type="text" maxlength="1" class="otp-box w-11 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition" required>
                    <input type="text" maxlength="1" class="otp-box w-11 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition" required>
                    <input type="text" maxlength="1" class="otp-box w-11 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition" required>
                    <input type="text" maxlength="1" class="otp-box w-11 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition" required>
                </div>
                <input type="hidden" name="otp" id="otp-full">
                
                @error('otp')
                    <span class="text-red-500 text-xs font-semibold mt-3 text-center block">{{ $message }}</span>
                @enderror
            </div>

            <!-- Verify Button -->
            <button type="submit" 
                    class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-green-200/50 transition flex items-center justify-center gap-2">
                <span>Verify OTP</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
            </button>
        </form>
    </div>

    <!-- Security Info Note -->
    <div class="mt-8 flex gap-3 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
        <svg class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span class="text-xs text-gray-500 leading-relaxed font-medium">
            Your data is secure. Verification ensures only legitimate employers can post hospitality job listings.
        </span>
    </div>

    <div class="text-center mt-6">
        <a href="{{ route('login') }}" class="text-sm font-bold text-green-600 hover:text-green-700 transition">
            ← Change Mobile Number
        </a>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('otp-inputs-wrapper');
    const boxes = wrapper.querySelectorAll('.otp-box');
    const otpFullInput = document.getElementById('otp-full');
    const form = document.getElementById('verify-form');

    // Auto-advance cursor script
    boxes.forEach((box, idx) => {
        box.addEventListener('input', (e) => {
            box.value = box.value.replace(/[^0-9]/g, '');
            if (box.value.length === 1 && idx < boxes.length - 1) {
                boxes[idx + 1].focus();
            }
            updateOtpVal();
        });

        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && box.value.length === 0 && idx > 0) {
                boxes[idx - 1].focus();
            }
        });

        // Paste support
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/[^0-9]/g, '');
            if (pasteData.length > 0) {
                const chars = pasteData.split('');
                boxes.forEach((b, i) => {
                    if (chars[i]) {
                        b.value = chars[i];
                    }
                });
                // Focus the correct box
                const nextFocus = Math.min(chars.length, boxes.length - 1);
                boxes[nextFocus].focus();
                updateOtpVal();
            }
        });
    });

    function updateOtpVal() {
        let val = '';
        boxes.forEach(b => val += b.value);
        otpFullInput.value = val;
    }

    // Intercept form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateOtpVal();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="inline-block animate-pulse">Verifying...</span>';

        // Clear existing errors
        form.querySelectorAll('.validation-error').forEach(el => el.remove());

        const formData = new FormData(form);

        try {
            const response = await fetch(form.getAttribute('action'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const errSpan = document.createElement('span');
                    errSpan.className = 'validation-error text-red-500 text-xs font-semibold mt-3 text-center block';
                    errSpan.textContent = data.errors.otp ? data.errors.otp[0] : (data.message || 'Verification failed.');
                    wrapper.after(errSpan);
                } else if (data.message) {
                    alert(data.message);
                }
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }

            // Success redirect handling
            if (data.success) {
                if (form.querySelector('[name="login_role"]').value === 'employer') {
                    if (data.has_completed_onboarding) {
                        window.location.href = '/profile?section=my_posted_jobs';
                    } else {
                        window.location.href = '/employer/onboarding';
                    }
                } else {
                    window.location.href = '/';
                }
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
});
</script>
@endsection
