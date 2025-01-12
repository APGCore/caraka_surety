<?php

use App\Http\Controllers\Guarantor\BlankController;
use Illuminate\Support\Facades\Route;

Route::prefix('blank-management')->name('kepala-cabang.blank-management')->group(function () {
    Route::controller(BlankController::class)
        ->prefix('blank')->name('.blank')
        ->group(function () {
            Route::get('/', 'getByOffice')->name('.index');
            Route::post('/approve', 'approveBlanks')->name('.approve');
        });
});
