<?php

use App\Http\Controllers\Guarantor\BlankController;
use Illuminate\Support\Facades\Route;

Route::prefix('blank-management')
    ->name('api.blank-management.')
    ->group(function () {
        Route::controller(BlankController::class)
            ->prefix('blank')
            ->name('blank.')
            ->group(function () {
                // api.blank-management.blank.all
                Route::get('/all', 'apiGetBlank')->name('all');
            });
    });
