<?php

use App\Http\Controllers\Location\DistrictController;
use App\Http\Controllers\Location\ProvinceController;
use App\Http\Controllers\Location\RegencyController;
use Illuminate\Support\Facades\Route;

Route::prefix('references')->name('references.')->group(function () {

    // references.province.*
    Route::controller(ProvinceController::class)->prefix('province')
        ->name('province.')->group(function () {
            Route::get('all', 'all')->name('all');
        });

    // references.regency.*
    Route::controller(RegencyController::class)->prefix('regency')
        ->name('regency.')->group(function () {
            Route::get('get-by-province/{province_id}', 'getByProvince')->name('by-province');
        });

    // references.district.*
    Route::controller(DistrictController::class)->prefix('district')
        ->name('district.')->group(function () {
            Route::get('get-by-regency/{regency_id}', 'getByRegency')->name('by-regency');
        });
});
