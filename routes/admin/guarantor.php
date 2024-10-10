<?php

use App\Http\Controllers\Guarantor\GuarantorController;
use App\Http\Controllers\Guarantor\GuarantorToProductTypeController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')->group(function () {
    Route::resource('guarantor', GuarantorController::class);
    Route::prefix('guarantor')->name('guarantor.')->group(function () {
        Route::post('upload-picture/{guarantor}', [GuarantorController::class, 'uploadPicture'])->name('upload.picture');
    });

    Route::prefix('product-guarantor')->name('product-guarantor.')->group(function () {
        Route::get('/', [GuarantorToProductTypeController::class, 'index'])->name('index');
        Route::post('store', [GuarantorToProductTypeController::class, 'store'])->name('store');
        Route::put('update/{guarantorToProductType}', [GuarantorToProductTypeController::class, 'update'])->name('update');
        Route::delete('destroy/{guarantorToProductType}', [GuarantorToProductTypeController::class, 'destroy'])->name('destroy');
    });
});
