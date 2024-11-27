<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('direksi-submission-')
        ->group(function () {
            // Route::get('/list', 'displaySubmissionByDireksi')->name('list.submission');
            Route::get('/history', 'displayHistoryByDireksi')->name('history.submission');
            Route::get('/create', 'displayCreateByStaff')->name('create.submission');
            Route::get('/draft', 'displayDocumentDraftByStaff')->name('document-draft.submission');
            Route::get('/detail/{id}', 'showDetailSubmissionDireksi')->name('detail.submission');
            Route::get('/draft-doc/{id}', 'showDetailDocsSubmissionDireksi')->name('docs.submission');
        });
});
