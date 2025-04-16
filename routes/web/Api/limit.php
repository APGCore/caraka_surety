<?php

use App\Http\Controllers\Guarantor\GuarantorProductTypeLimitController;
use Illuminate\Support\Facades\Route;

Route::prefix('limit-management')
    ->name('api.limit-management.')
    ->group(function () {

        Route::controller(GuarantorProductTypeLimitController::class)
            ->prefix('guarantor-product-type-limit')
            ->name('guarantor-product-type-limit.')->group(function () {

                // api.limit.guarantor-product-type-limit.search-guarantor-product-type-limit
                Route::get('search-guarantor-product-type-limit', 'apiSearch')
                    ->name('search-guarantor-product-type-limit');
            });
    });
