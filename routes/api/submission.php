<?php

use App\Http\Controllers\Api\SubmissionController;
use App\Http\Middleware\Api\HandleSubmissionAccess;
use Illuminate\Support\Facades\Route;

Route::controller(SubmissionController::class)
    ->prefix('submission')->name('submission.')
    ->group(function () {
        Route::get('post-to-get-callback', 'postToGetCallback')->name('post-to-get-callback');
        Route::get('check-for-send-data/{submissionId}', 'checkForSendData')->name('check-for-send-data');
        Route::get('submission-before', 'getByPrincipalAndBeforeProductType')->name('submission-before');
    });
Route::controller(\App\Http\Controllers\Submission\SubmissionController::class)
    ->prefix('submission')->name('submission.')
    ->group(function () {
        Route::middleware(HandleSubmissionAccess::class)
            ->post('send/{submissionId}', 'send')->name('send');
    });
