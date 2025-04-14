<?php

use App\Http\Controllers\JobGroupController;
use Illuminate\Support\Facades\Route;



Route::prefix('job-group-management')
  ->name('api.job-group-management.')
  ->group(function () {

    Route::controller(JobGroupController::class)
      ->prefix('job-group')
      ->name('job-group.')->group(function () {
        // api.job-group-management.job-group.get-all
        Route::get('get-all', 'apiGetAll')->name('get-all');
      });
  });
