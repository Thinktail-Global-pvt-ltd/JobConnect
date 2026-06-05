@extends('layouts.app')

@section('title', 'Sign In')

@section('content')
<div class="flex flex-col justify-center min-h-[50vh] px-4 py-8">
    <div class="text-center mb-8">
        <h2 class="font-outfit font-bold text-3xl text-gray-900 tracking-tight">Welcome to JobConnect</h2>
        <p class="text-gray-500 mt-2 text-sm">Enter your mobile number to receive a one-time passcode</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form action="{{ route('login.submit') }}" method="POST">
            @csrf
            <div class="mb-5">
                <label for="mobile_number" class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                <div class="relative">
                    <span class="absolute left-4 top-3.5 text-gray-400 font-medium text-base">+91</span>
                    <input type="tel" name="mobile_number" id="mobile_number" 
                           class="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                           placeholder="9999999999" 
                           pattern="[0-9]{10}"
                           maxlength="10"
                           required
                           oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);"
                           value="{{ old('mobile_number') }}">
                </div>
                @error('mobile_number')
                    <span class="text-red-500 text-xs font-semibold mt-1 block">{{ $message }}</span>
                @enderror
            </div>

            <button type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2">
                Send OTP
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </form>
    </div>

    <div class="text-center mt-8">
        <span class="text-xs text-gray-400 font-medium">By continuing, you agree to our Terms & Privacy Policy</span>
    </div>
</div>
@endsection
