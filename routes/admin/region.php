<?php

use App\Http\Controllers\Region\ProvinceController;
use Illuminate\Support\Facades\Route;

Route::prefix('wilayah')->name('provinces.')->group(function () {
    Route::resource('provinsi', ProvinceController::class)->names([
        'index' => 'index',
        'create' => 'create',
        'store' => 'store',
        'show' => 'show',
        'edit' => 'edit',
        'update' => 'update',
        'destroy' => 'destroy',
    ]);
    Route::controller(ProvinceController::class)->prefix('provinsi/option')->group(function () {
        Route::get('sync', 'synchronize')->name('sync');
    });

});
