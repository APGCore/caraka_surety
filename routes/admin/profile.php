<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('company-management')->group(function () {
    Route::controller(ProfileController::class)->prefix('branch-office')
        ->name('branch.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('create', 'create')->name('create');
            Route::get('edit/{profile}', 'edit')->name('edit');
            Route::patch('{profile}', 'update')->name('update');
            Route::delete('{profile}', 'destroy')->name('destroy');
        });
});
