<?php

use App\Http\Controllers\Office\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::prefix('office-management')
        ->name('api.office-management.')
        ->group(function () {
            Route::controller(ProfileController::class)
                ->prefix('office')
                ->name('office.')->group(function () {

                    // api.office-management.office.all
                    Route::get('all', 'all')->name('all');

                    // api.office-management.office.get-by-type
                    Route::get('get-by-type', 'apiGetOfficeByType')->name('get-by-type');
                });
        });
});
