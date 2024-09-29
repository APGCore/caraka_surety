<?php

\Illuminate\Support\Facades\Route::prefix('admin')->group(function () {
    require_once __DIR__.'/dashboard.php';
    require_once __DIR__.'/region.php';
});
