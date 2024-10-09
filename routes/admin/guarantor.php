<?php

use App\Http\Controllers\GuarantorController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')->group(function () {
    Route::resource('guarantor', GuarantorController::class);
    Route::prefix('guarantor')->name('guarantor.')->group(function () {
        Route::post('upload-picture/{guarantor}', [GuarantorController::class, 'uploadPicture'])->name('upload.picture');
    });
});
