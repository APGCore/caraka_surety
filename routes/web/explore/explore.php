<?php

use App\Http\Controllers\ExplorController;
use Illuminate\Support\Facades\Route;

Route::get('/explore', [ExplorController::class, 'index'])
  ->name('explore.index');
