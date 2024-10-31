<?php

use App\Http\Controllers\Submission\SourceOfFundController;
use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)->prefix('submission')
        ->name('submission.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/show', 'show')->name('show');
        });

    Route::controller(SourceOfFundController::class)->prefix('source-of-funds')
        ->name('source-of-funds.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/store', 'store')->name('store');
            Route::put('/update/{sourceOfFund}', 'update')->name('update');
            Route::delete('/delete/{sourceOfFund}', 'destroy')->name('destroy');
        });
});
