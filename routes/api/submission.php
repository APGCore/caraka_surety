<?php

use App\Http\Controllers\Api\SubmissionController;
use App\Http\Middleware\Api\HandleSubmissionAccess;
use Illuminate\Support\Facades\Route;

Route::controller(SubmissionController::class)
    ->prefix('submission')->name('submission.')
    ->group(function () {
        Route::get('{submission}', 'show')->name('show');
        Route::middleware(HandleSubmissionAccess::class)
            ->post('callback', 'callback')->name('callback');
    });
