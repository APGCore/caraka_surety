<?php

use Illuminate\Support\Facades\Route;

Route::name('api')->group(function () {
    foreach (glob(__DIR__.'/api/*.php') as $file) {
        require_once $file;
    }
});
