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

        // api.location-management.province.search
        Route::get('search-province', 'apiSearch')->name('search');
      });

    Route::controller(RegencyController::class)
      ->prefix('regency')
      ->name('regency.')
      ->group(function () {
        // api.location-management.regency.all
        Route::get('by-province/{province_id}', 'getByProvince')->name('by-province');

        // api.location-management.regency.search
        Route::get('search-regency/{province_id}', 'apiSearch')->name('search');
      });

    Route::controller(DistrictController::class)
      ->prefix('district')
      ->name('district.')
      ->group(function () {
        // api.location-management.district.all
        Route::get('by-regency/{regency_id}', 'getByRegency')->name('by-regency');

        // api.location-management.district.search
        Route::get('search-district/{regency_id}', 'apiSearch')->name('search');
      });
  });
