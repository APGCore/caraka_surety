<?php

use App\Http\Controllers\Guarantor\GuarantorController;
use App\Http\Controllers\Guarantor\GuarantorToProductTypeController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')->group(function () {
    Route::resource('guarantor', GuarantorController::class);

    Route::prefix('product-guarantor')->name('product-guarantor.')->group(function () {
        Route::get('/', [GuarantorToProductTypeController::class, 'index'])->name('index');
        Route::get('get-by-guarantor/{guarantorId}', [GuarantorToProductTypeController::class, 'getByGuarantor'])->name('get-by-guarantor');
        Route::post('store', [GuarantorToProductTypeController::class, 'store'])->name('store');
        Route::put('update/{guarantorToProductType}', [GuarantorToProductTypeController::class, 'update'])->name('update');
        Route::delete('destroy/{guarantorToProductType}', [GuarantorToProductTypeController::class, 'destroy'])->name('destroy');
    });
});
