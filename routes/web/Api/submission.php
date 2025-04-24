<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::controller(SubmissionController::class)
    ->prefix('submission-management')
    ->name('api.submission-management.')
    ->group(function () {
        Route::put('document/{submissionDoc}', 'updateDocument')->name('document');
        Route::post('{submission}', 'send')->name('send');
    });
