<?php

use App\Http\Controllers\Products\ProductTipeController;
use Illuminate\Support\Facades\Route;

Route::prefix('product-type-management')
    ->name('api.product-type-management.')
    ->group(function () {
        Route::controller(ProductTipeController::class)
            ->prefix('product-type')
            ->name('product-type.')
            ->group(function () {

                // NAME : api.product-type-management.product-type.search-product-type
                // PATH : /api/product-type-management/product-type/search-product-type
                Route::get('search-product-type', 'apiSearch')->name('search-product-type');
            });
    });
