<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/example/file', [Controllers\ExampleController::class, 'displayFile'])
    ->name('example.file');
