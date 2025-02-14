<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('agent-partner-submission.')
        ->group(function () {
            Route::get('/create', 'displayCreateByAgentPartner')->name('create.index');
            Route::get('/history', 'displayHistoryByAgentPartner')->name('history.index');
            Route::get('/draft', 'displayDocumentDraftByAgentPartner')->name('document-draft');
            Route::get('/getAllBanks', 'getAllBanks')->name('getbanks');
            Route::post('/store', 'store')->name('form.store');
            Route::get('/detail/{id}', 'showDetailSubmission')->name('detail');
            Route::get('/draft-doc/{id}', 'showDetailDocsSubmission')->name('docs');
            Route::post('/save-content', 'saveDocument')->name('save.content');

        });
});
