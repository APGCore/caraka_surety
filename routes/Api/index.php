<?php

use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    foreach (glob(__DIR__ . '/*.php') as $file) {
        require_once $file;
    }
});
