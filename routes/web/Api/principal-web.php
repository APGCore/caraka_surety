<?php

use App\Http\Controllers\RelatedParties\PrincipalController;
use Illuminate\Support\Facades\Route;

Route::prefix('principal-management')
  ->name('api.principal-management.')
  ->group(function () {

    Route::controller(PrincipalController::class)
      ->prefix('principal')
      ->name('principal.')
      ->group(function () {

        // NAME: api.principal-management.principal.search
        // PATH: /principal-management/principal/search-principal
        Route::get('search-principal', 'apiSearch')->name('search');
      });
  });
