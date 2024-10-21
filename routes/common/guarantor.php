<?php

use App\Http\Controllers\Guarantor\GuarantorController;
use Illuminate\Support\Facades\Route;

Route::prefix('references')->name('references.')->group(function () {
    Route::controller(GuarantorController::class)->prefix('guarantor')->name('guarantor.')->group(function () {
        Route::get('all', 'getAll')->name('all');
    });
});
