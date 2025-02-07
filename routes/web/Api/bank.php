<?php

use App\Http\Controllers\RelatedParties\BankController;
use Illuminate\Support\Facades\Route;

Route::prefix('bank-management')
    ->name('api.bank-management.')
    ->group(function () {
        Route::controller(BankController::class)
            ->prefix('bank')
            ->name('bank.') // Use a descriptive and consistent name prefix
            ->group(function () {
                Route::get('/all', 'apiGetAllBank')->name('all'); // The full name will be 'bank-management.bank.all'
            });
    });
