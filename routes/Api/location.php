<?php

use App\Http\Controllers\Location\DistrictController;
use App\Http\Controllers\Location\ProvinceController;
use App\Http\Controllers\Location\RegencyController;
use Illuminate\Support\Facades\Route;

Route::prefix('location-management')
    ->name('api.location-management.')
    ->group(function () {

        Route::controller(ProvinceController::class)
            ->prefix('province')
            ->name('location-management.province.')
            ->group(function () {
                Route::get('all', 'all')->name('all');
            });


        Route::controller(RegencyController::class)
            ->prefix('regency')
            ->name('location-management.regency.')
            ->group(function () {
                Route::get('by-province/{province_id}', 'getByProvince')->name('by-province');
            });


        Route::controller(DistrictController::class)
            ->prefix('district')
            ->name('location-management.district.')
            ->group(function () {
                Route::get('by-regency/{regency_id}', 'getByRegency')->name('by-regency');
            });
    });
