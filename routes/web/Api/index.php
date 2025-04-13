<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('api')->group(function () {
    foreach (glob(__DIR__.'/*.php') as $file) {
        require_once $file;
    }
});
