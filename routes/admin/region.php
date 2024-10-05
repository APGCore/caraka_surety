<?php

/** @noinspection ALL */

use App\Http\Controllers\Region\DistrictController;
use App\Http\Controllers\Region\ProvinceController;
use App\Http\Controllers\Region\RegencyController;
use Illuminate\Support\Facades\Route;

Route::prefix('location')->group(function () {
    Route::controller(ProvinceController::class)->prefix('province')
        ->name('province.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{province}', 'update')->name('update');
            Route::delete('{province}', 'destroy')->name('destroy');
            Route::post('sync', 'synchronize')->name('sync');
        });

    Route::controller(RegencyController::class)->prefix('regency')
        ->name('regency.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{regency}', 'update')->name('update');
            Route::delete('{regency}', 'destroy')->name('destroy');
            Route::post('sync', 'synchronize')->name('sync');
        });

    Route::controller(DistrictController::class)->prefix('district')
        ->name('district.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{district}', 'update')->name('update');
            Route::delete('{district}', 'destroy')->name('destroy');
            Route::post('sync', 'synchronize')->name('sync');
        });
});
