<?php

use App\Http\Controllers\Office\EmployeeController;
use App\Http\Controllers\Office\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('office-management')->group(function () {
    Route::controller(ProfileController::class)->prefix('branch-office')
        ->name('branch.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/mitra-pemasaran', 'displayMitraPemasaran')->name('mitra-pemasaran');
            Route::get('/mitra-agen', 'displayMitraAgen')->name('mitra-agen');
            Route::post('/', 'store')->name('store');
            Route::get('create', 'create')->name('create');
            Route::get('edit/{profile}', 'edit')->name('edit');
            Route::patch('{profile}', 'update')->name('update');
            Route::delete('{profile}', 'destroy')->name('destroy');
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

    Route::controller(ProfileController::class)->prefix('branch-mitra-pemasaran')
        ->name('branch-mitra-pemasaran.')->group(function () {
            Route::get('/', 'displayMitraPemasaran')->name('index');
            Route::get('create', 'create')->name('create');
        });

    Route::controller(ProfileController::class)->prefix('branch-mitra-agen')
        ->name('branch-mitra-agen.')->group(function () {
            Route::get('/', 'displayMitraAgen')->name('index');
            Route::get('create', 'create')->name('create');
        });
});
