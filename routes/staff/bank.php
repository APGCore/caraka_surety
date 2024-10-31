<?php

use App\Http\Controllers\RelatedParties\BankController;
use Illuminate\Support\Facades\Route;

Route::prefix('bank-management')->group(function () {
    Route::controller(BankController::class)->prefix('bank')
        ->name('staff-bank-')->group(function () {
            Route::get('/all', 'getAllBank')->name('get.all');
        });
});
