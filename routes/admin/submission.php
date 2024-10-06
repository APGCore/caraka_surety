<?php

use App\Http\Controllers\SubmissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('submission-management')->group(function (){
    Route::controller(SubmissionController::class)->prefix('submission')
    ->name('submission.')->group(function (){
        Route::get('/', 'index')->name('index');
        Route::get('/show', 'show')->name('show');
    });
});
