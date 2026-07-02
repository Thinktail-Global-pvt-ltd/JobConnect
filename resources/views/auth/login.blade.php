@extends('layouts.app')

@section('title', 'Sign In')

@section('content')
<div class="flex flex-col justify-center min-h-[50vh] px-4 py-8">
    <div class="text-center mb-8">
        <h2 class="font-outfit font-bold text-3xl text-gray-900 tracking-tight">Welcome to JobConnect</h2>
        <p class="text-gray-500 mt-2 text-sm">Enter your mobile number to receive a one-time passcode</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form action="{{ route('login.submit') }}" method="POST" data-ajax>
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

            <div class="mb-6">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Login Role</label>
                <div class="flex flex-col gap-3">
                    <!-- Option 1: Register as Chef -->
                    <label class="cursor-pointer">
                        <input type="radio" name="login_role" value="chef" class="peer sr-only" {{ old('login_role') === 'chef' ? 'checked' : '' }}>
                        <div class="peer-checked:border-green-600 peer-checked:bg-green-50/40 peer-checked:text-green-800 border border-gray-200 rounded-xl p-3.5 flex items-center gap-3.5 transition hover:bg-gray-50 text-gray-500">
                            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shrink-0">👨‍🍳</div>
                            <div class="flex-grow text-left">
                                <span class="block text-xs font-extrabold text-gray-800 uppercase tracking-wide">Register as Chef</span>
                                <span class="block text-[10px] text-gray-400 mt-0.5 leading-normal">Showcase your culinary skills to top employers</span>
                            </div>
                        </div>
                    </label>

                    <!-- Option 2: Talent / Job Seeker -->
                    <label class="cursor-pointer">
                        <input type="radio" name="login_role" value="job_seeker" class="peer sr-only" checked {{ old('login_role') === 'job_seeker' ? 'checked' : '' }}>
                        <div class="peer-checked:border-blue-600 peer-checked:bg-blue-50/40 peer-checked:text-blue-800 border border-gray-200 rounded-xl p-3.5 flex items-center gap-3.5 transition hover:bg-gray-50 text-gray-500">
                            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shrink-0">🔍</div>
                            <div class="flex-grow text-left">
                                <span class="block text-xs font-extrabold text-gray-800 uppercase tracking-wide">Talent</span>
                                <span class="block text-[10px] text-gray-400 mt-0.5 leading-normal">Explore hospitality job opportunities</span>
                            </div>
                        </div>
                    </label>

                    <!-- Option 3: Post a Job / Employer -->
                    <label class="cursor-pointer">
                        <input type="radio" name="login_role" value="employer" class="peer sr-only" {{ old('login_role') === 'employer' ? 'checked' : '' }}>
                        <div class="peer-checked:border-purple-600 peer-checked:bg-purple-50/40 peer-checked:text-purple-800 border border-gray-200 rounded-xl p-3.5 flex items-center gap-3.5 transition hover:bg-gray-50 text-gray-500">
                            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shrink-0">💼</div>
                            <div class="flex-grow text-left">
                                <span class="block text-xs font-extrabold text-gray-800 uppercase tracking-wide">Post a Job</span>
                                <span class="block text-[10px] text-gray-400 mt-0.5 leading-normal">Hire talent for your kitchen</span>
                            </div>
                        </div>
                    </label>
                </div>
                @error('login_role')
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
