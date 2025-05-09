<?php

use App\Http\Controllers\Office\OfficeRateController;
use Illuminate\Support\Facades\Route;

Route::controller(OfficeRateController::class)->prefix('office-rate')
    ->name('office-rate.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('create', 'create')->name('create');
    });
