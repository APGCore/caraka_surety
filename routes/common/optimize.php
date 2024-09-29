<?php


use App\Http\Controllers;
use Illuminate\Support\Facades\Route;


Route::get('/cache-clear', [Controllers\OptimizeController::class, 'cacheClear'])->name('cache-clear');
