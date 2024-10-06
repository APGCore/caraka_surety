<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('admin')->group(function () {
    require_once __DIR__.'/dashboard.php';
    require_once __DIR__.'/location.php';
    require_once __DIR__.'/products.php';
    require_once __DIR__ . '/office.php';
});
