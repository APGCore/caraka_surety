<?php

use App\Http\Controllers\Api\SubmissionController;
use App\Http\Middleware\Api\HandleSubmissionAccess;
use Illuminate\Support\Facades\Route;

Route::middleware(HandleSubmissionAccess::class)->group(function () {
    Route::controller(SubmissionController::class)
        ->prefix('submission')->name('submission.')
        ->group(function () {
            Route::post('callback', 'callback')->name('callback');
            Route::get('post-to-get-callback', 'postToGetCallback')->name('post-to-get-callback');
        });
    Route::controller(\App\Http\Controllers\Submission\SubmissionController::class)
        ->prefix('submission')->name('submission.')
        ->group(function () {
            Route::post('send/{submissionId}', 'send')->name('send');
        });
});
