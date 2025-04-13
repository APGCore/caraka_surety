<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('kepala-cabang-submission-')
        ->group(function () {
            Route::get('/list', 'displaySubmissionByKepalaCabang')->name('list.submission');
            Route::get('/history', 'displayHistoryByKepalaCabang')->name('history.submission');
            Route::get('/draft', 'displayDocumentDraftByKepalaCabang')->name('document-draft.submission');

            Route::post('/approve/{submission}', 'approve')->name('approve');
            Route::post('/reject/{submission}', 'reject')->name('reject');
            Route::post('/check/{submission}', 'check')->name('check');

            Route::get('/detail/{id}', 'showDetailSubmissionKepalaCabang')->name('detail.submission');
            // Route::get('/detail-doc/{id}', 'showDetailDocsSubmissionKepalaCabang')->name('detail.submission');
            Route::get('/draft-doc/{id}', 'showDetailDocsSubmissionKepalaCabang')->name('docs.submission');

            Route::post('/save-doc', 'saveDocSignatured')->name('save-permohonan-doc.submission');
        });
});
