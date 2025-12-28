<?php

use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//  $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();
Schedule::command('app:clear-activity')->monthlyOn();
Schedule::command('telescope:clear')->weeklyOn(0, '00:00');
Schedule::command('app:send-finance-report')->everyMinute();
