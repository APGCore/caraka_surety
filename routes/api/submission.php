<?php

use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::controller(SubmissionController::class)->prefix('submission')->name('submission.')
    ->group(function () {
        Route::get('/{submission}', 'show')->name('show');
    });
