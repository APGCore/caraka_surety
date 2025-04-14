<?php

use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Products\ProductTipeController;
use Illuminate\Support\Facades\Route;

Route::prefix('product-management')
  ->name('api.product-management.')
  ->group(function () {
    Route::controller(ProductController::class)
      ->prefix('product')
      ->name('product.')
      ->group(function () {
        // api.product-management.product.all
        Route::get('all', 'getAllProducts')->name('all');


        // api.product-management.product.search
        Route::get('search', 'apiSearch')->name('search');
      });

    Route::controller(ProductTipeController::class)
      ->prefix('product-type')
      ->name('product-type.')
      ->group(function () {

        // api.product-type-management.product-type.all
        Route::get('all', 'index')->name('all');

        // api.product-type-management.product-type.from-product-and-guarantor
        Route::get('/get-by-product-and-guarantor/{productId}/guarantor/{guarantorId}', 'getByProductAndGuarantor')->name('from-product-and-guarantor');
      });
  });
