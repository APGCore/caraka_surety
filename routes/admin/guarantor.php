<?php

use App\Http\Controllers\GuarantorController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')->group(function () {
    Route::resource('guarantor', GuarantorController::class);
});
