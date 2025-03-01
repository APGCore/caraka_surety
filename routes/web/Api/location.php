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
            ->name('province.')
            ->group(function () {
                // api.location-management.province.all
                Route::get('all', 'all')->name('all');
            });

        Route::controller(RegencyController::class)
            ->prefix('regency')
            ->name('regency.')
            ->group(function () {
                // api.location-management.regency.all
                Route::get('by-province/{province_id}', 'getByProvince')->name('by-province');
            });

        Route::controller(DistrictController::class)
            ->prefix('district')
            ->name('district.')
            ->group(function () {
                // api.location-management.district.all
                Route::get('by-regency/{regency_id}', 'getByRegency')->name('by-regency');
            });
    });
