<?php

use App\Http\Controllers\Api\GuarantorProductTypeLimitController;
use App\Http\Controllers\Guarantor\GuarantorController;
use App\Http\Controllers\Guarantor\PatternController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')
  ->name('api.guarantor-management.')
  ->group(function () {

    Route::controller(GuarantorController::class)
      ->prefix('guarantor')
      ->name('guarantor.')->group(function () {
        // api.guarantor-management.guarantor.all
        Route::get('all', 'getAll')->name('all');

        // api.guarantor-management.guarantor.all-branch
        Route::get('branch', 'getAllBranch')->name('all-branch');


        // api.guarantor-management.guarantor.branch-from-headquarter
        Route::get('branch/{guarantor}', 'getGuarantorBranchByHeadIsPairing')->name('branch-from-headquarter');


        // api.guarantor-management.guarantor.branch-from-headquarter-search
        Route::get('branch-search/{guarantor}', 'getGuarantorBranchByHeadIsPairingSearch')->name('branch-from-headquarter-search');

        // api.guarantor-management.guarantor.search-guarantor
        Route::get('search-guarantor', 'apiGetGuarantors')->name('search-guarantor');

        // api.guarantor-management.guarantor.by-product
        Route::get('/guarantor-by-product/{product}', 'getGuarantorByProductId')->name('by-product');
      });

    Route::controller(PatternController::class)
      ->prefix('pattern')
      ->name('pattern.')->group(function () {
        // api.guarantor-management.pattern.convert
        Route::get('convert', 'convert')->name('convert');
      });

    Route::controller(GuarantorProductTypeLimitController::class)->prefix('guarantor-product-type-limit')
      ->name('guarantor-product-type-limit.')->group(function () {
        Route::get('show', 'show')->name('show');
      });
  });
