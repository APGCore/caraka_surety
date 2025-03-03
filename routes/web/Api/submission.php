<?php

use App\Http\Controllers\Submission\SubmissionController;

Route::controller(SubmissionController::class)
    ->prefix('submission-management')
    ->name('api.submission-management.')
    ->group(function () {
        Route::post('{submission}', 'send')->name('send');
    });
