<?php

use App\Http\Controllers\RelatedParties\BankController;
use Illuminate\Support\Facades\Route;

Route::prefix('bank-management')
    ->name('api.bank-management.')
    ->group(function () {
        Route::controller(BankController::class)
            ->prefix('bank')
            ->name('bank.')
            ->group(function () {
                // api.bank-management.bank.all
                Route::get('/all', 'apiGetAllBank')->name('all');
            });
    });
