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
        // NAME: api.bank-management.bank.all
        // PATH: /bank-management/bank/all
        Route::get('/all', 'apiGetAllBank')->name('all');

        // NAME: api.bank-management.bank.search
        // PATH: /bank-management/bank/search-bank
        Route::get('/search-bank', 'apiSearch')->name('search');
      });
  });
