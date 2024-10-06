<?php

use App\Http\Controllers\Office\EmployeeController;
use App\Http\Controllers\Office\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('office-management')->group(function () {
    Route::controller(ProfileController::class)->prefix('branch-office')
        ->name('branch.')->group(function () {
            Route::get('/', 'index')->name('index');
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
            Route::get('edit/{user}', 'edit')->name('edit');
            Route::patch('{user}', 'update')->name('update');
            Route::delete('{user}', 'destroy')->name('destroy');
        });
});
