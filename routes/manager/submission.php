<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('manager-submission-')
        ->group(function () {
            Route::get('/list', 'displaySubmissionByManager')->name('list.submission');
            Route::get('/history', 'displayHistoryByStaff')->name('history.submission');
            Route::get('/draft', 'displayDocumentDraftByStaff')->name('document-draft.submission');

            Route::post('/approve/{submission}', 'approve')->name('approve');
            Route::post('/reject/{submission}', 'reject')->name('reject');
        });
});
