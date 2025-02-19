<?php

use App\Http\Controllers\HostToHostController;
use Illuminate\Support\Facades\Route;

Route::prefix('host-to-host-management')->group(function () {
    Route::controller(HostToHostController::class)
        ->prefix('host-to-host')
        ->name('host-to-host.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('store', 'store')->name('store');
            Route::put('update/{hostToHost}', 'update')->name('update');
            Route::delete('delete/{hostToHost}', 'destroy')->name('delete');
        });
});

// host-to-host.index
