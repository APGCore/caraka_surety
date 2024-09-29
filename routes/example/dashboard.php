<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/example', [Controllers\ExampleController::class, 'index'])
    ->name('example.index');
