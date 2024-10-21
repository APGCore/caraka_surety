<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('staff-cabang')->group(function () {
    require_once __DIR__ . '/dashboard.php';
    require_once __DIR__ . '/submission.php';
});
