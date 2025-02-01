<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('kepala-cabang.submission.')
        ->group(function () {
            Route::get('/list', 'displaySubmissionByKepalaCabang')->name('list');
            Route::get('/history', 'displayHistoryByManager')->name('history');
            Route::get('/draft', 'displayDocumentDraftByStaff')->name('document-draft');

            Route::post('/approve/{submission}', 'approve')->name('approve');
            Route::post('/reject/{submission}', 'reject')->name('reject');
            Route::post('/check/{submission}', 'check')->name('check');

            Route::get('/detail/{id}', 'showDetailSubmissionKepalaCabang')->name('detail');
        });
});
