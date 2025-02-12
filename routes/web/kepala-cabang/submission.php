<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('kepala-cabang-submission.')
        ->group(function () {
            Route::get('/list', 'displaySubmissionByKepalaCabang')->name('list.index');
            Route::get('/history', 'displayHistoryByKepalaCabang')->name('history.index');
            Route::get('/draft', 'displaySubmissionByKepalaCabang')->name('document-draft');

            Route::post('/approve/{submission}', 'approve')->name('approve');
            Route::post('/reject/{submission}', 'reject')->name('reject');
            Route::post('/check/{submission}', 'check')->name('check');

            Route::get('/detail/{id}', 'showDetailSubmissionKepalaCabang')->name('detail');
        });
});
