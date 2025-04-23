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

                    // NAME : api.office-management.office.all
                    // PATH : /api/office-management/office/all
                    Route::get('all', 'all')->name('all');

                    // NAME : api.office-management.office.get-by-type
                    // PATH : /api/office-management/office/get-by-type
                    Route::get('get-by-type', 'apiGetOfficeByType')->name('get-by-type');

                    // NAME : api.office-management.office.get-office-types
                    // PATH : /api/office-management/office/get-office-types
                    Route::get('get-office-types', 'apiGetOfficeTypes')->name('get-office-types');

                    // NAME : api.office-management.office.search-office
                    // PATH : /api/office-management/office/search-office
                    Route::get('search-office', 'apiSearch')->name('search-office');
                });
        });
});
