<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('admin')->group(function () {
    require_once __DIR__.'/dashboard.php';
    require_once __DIR__.'/region.php';
    require_once __DIR__.'/products.php';
});
