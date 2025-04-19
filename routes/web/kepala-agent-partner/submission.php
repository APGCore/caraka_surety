<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('kepala-agent-partner-submission.')
        ->group(function () {
            Route::get('/list', 'displaySubmission')->name('list.index');
            Route::get('/history', 'displayHistory')->name('history.index');
            Route::get('/draft', 'displayDocumentDraftByKepalaAgentPartner')->name('document-draft');

            Route::post('/approve/{submission}', 'approve')->name('approve');
            Route::post('/reject/{submission}', 'reject')->name('reject');
            Route::post('/check/{submission}', 'check')->name('check');

            Route::get('/detail/{id}', 'showDetailSubmissionKepalaAgentPartner')->name('detail');
        });
});
