<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule daily profile completion reminder push notifications every day at 09:00 AM
Schedule::command('send:profile-completion-reminders')->dailyAt('09:00');
