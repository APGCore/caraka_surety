<?php

use App\Http\Controllers\Guarantor\BlankController;
use Illuminate\Support\Facades\Route;

Route::prefix('blank-management')
    ->name('api.blank-management.')
    ->group(function () {
        Route::controller(BlankController::class)
            ->prefix('blank')
            ->name('blank.') // Use a descriptive and consistent name prefix
            ->group(function () {
                Route::get('/all', 'apiGetBlank')->name('all'); // The full name will be 'bank-management.bank.all'
            });
    });
