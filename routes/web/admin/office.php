<?php

use App\Http\Controllers\Office\EmployeeController;
use App\Http\Controllers\Office\OfficeRateController;
use App\Http\Controllers\Office\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('office-management')->group(function () {
    // cabang
    Route::controller(ProfileController::class)->prefix('branch-office')
        ->name('branch.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('create', 'create')->name('create');
            Route::get('edit/{profile}', 'edit')->name('edit');
            Route::patch('{profile}', 'update')->name('update');
            Route::delete('{profile}', 'destroy')->name('destroy');
        });
    // pengguna cabang
    Route::controller(EmployeeController::class)->prefix('branch-office/employee')
        ->name('branch.employee.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::get('edit/{employee}', 'edit')->name('edit');
        });

    // mitra agen
    Route::controller(ProfileController::class)->prefix('branch-mitra-agen')
        ->name('branch-mitra-agen.')->group(function () {
            Route::get('/', 'displayMitraAgen')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('edit/{profile}', 'edit')->name('edit');
            Route::patch('{profile}', 'update')->name('update');
            Route::delete('{profile}', 'destroy')->name('destroy');
        });
    // pengguna mitra agen
    Route::controller(EmployeeController::class)->prefix('branch-mitra-agen/employee')
        ->name('branch-mitra-agen.employee.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::get('edit/{employee}', 'edit')->name('edit');
        });

    // mitra pemasaran
    Route::controller(ProfileController::class)->prefix('branch-mitra-pemasaran')
        ->name('branch-mitra-pemasaran.')->group(function () {
            Route::get('/', 'displayMitraPemasaran')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('edit/{profile}', 'edit')->name('edit');
            Route::patch('{profile}', 'update')->name('update');
            Route::delete('{profile}', 'destroy')->name('destroy');
        });
    // pengguna mitra pemasaran
    Route::controller(EmployeeController::class)->prefix('branch-mitra-pemasaran/employee')
        ->name('branch-mitra-pemasaran.employee.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::get('edit/{employee}', 'edit')->name('edit');
        });

    Route::controller(EmployeeController::class)->prefix('employee')
        ->name('employee.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('create', 'create')->name('create');
            Route::get('edit/{employee}', 'edit')->name('edit');
            Route::patch('{employee}', 'update')->name('update');
            Route::delete('{employee}', 'destroy')->name('destroy');
        });

    Route::controller(OfficeRateController::class)->prefix('office-rate')
        ->name('office-rate.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('create', 'create')->name('create');
        });
});
