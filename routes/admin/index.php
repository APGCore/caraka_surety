<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExportController;

Route::middleware('auth')->prefix('admin')->group(function () {
    require_once __DIR__.'/dashboard.php';
    require_once __DIR__.'/location.php';
    require_once __DIR__.'/products.php';
    require_once __DIR__.'/profile.php';
    require_once __DIR__.'/submission.php';
    require_once __DIR__ . '/office.php';
    require_once __DIR__.'/document.php';

});

