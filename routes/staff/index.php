<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('staff')->group(function () {
    require_once __DIR__ . '/dashboard.php';
    require_once __DIR__ . '/submission.php';
    require_once __DIR__ . '/scoring.php';
    require_once __DIR__ . '/products.php';
    require_once __DIR__ . '/guarantor.php';
    require_once __DIR__ . '/obligee.php';
    require_once __DIR__ . '/bank.php';
});
