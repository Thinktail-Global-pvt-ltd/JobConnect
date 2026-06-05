@extends('layouts.app')

@section('title', 'Verify Passcode')

@section('content')
<div class="flex flex-col justify-center min-h-[50vh] px-4 py-8">
    
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

    <div class="text-center mb-8">
        <h2 class="font-outfit font-bold text-3xl text-gray-900 tracking-tight">Enter OTP</h2>
        <p class="text-gray-500 mt-2 text-sm">Sent to <code class="font-mono font-bold text-gray-700">+91 {{ $mobile }}</code></p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form action="{{ route('verify-otp.submit') }}" method="POST" data-ajax>
            @csrf
            <input type="hidden" name="mobile_number" value="{{ $mobile }}">
            <input type="hidden" name="login_role" value="{{ $loginRole }}">

            <div class="mb-6">
                <label for="otp" class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">4-Digit Passcode</label>
                <input type="text" name="otp" id="otp" 
                       class="w-full text-center py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-3xl font-extrabold tracking-widest text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                       placeholder="••••" 
                       maxlength="4"
                       required
                       oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4);"
                       autofocus>
                @error('otp')
                    <span class="text-red-500 text-xs font-semibold mt-2 text-center block">{{ $message }}</span>
                @enderror
            </div>

            <button type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition">
                Verify & Log In
            </button>
        </form>
    </div>

    <div class="text-center mt-6">
        <a href="{{ route('login') }}" class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            ← Change Mobile Number
        </a>
    </div>
</div>
@endsection
