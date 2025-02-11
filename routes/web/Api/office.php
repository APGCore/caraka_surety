<?php

use App\Http\Controllers\Office\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('office-management')
    ->name('api.office-management.')
    ->group(function () {
        Route::controller(ProfileController::class)
            ->prefix('office')
            ->name('office.')->group(function () {
                Route::get('all', 'all')->name('all');
            });
    });
