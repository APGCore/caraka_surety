<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('direksi-submission-')
        ->group(function () {
            Route::get('/list', 'displaySubmission')->name('list.submission');
            Route::get('/history', 'displayHistory')->name('history.submission');
            Route::get('/detail/{id}', 'showDetailSubmission')->name('detail.submission');

            Route::post('/approve/{submission}', 'approve')->name('approve');
            Route::post('/reject/{submission}', 'reject')->name('reject');
            Route::post('/check/{submission}', 'check')->name('check');

            Route::post('/save-content', 'saveDocument')->name('save.content');
        });
});
