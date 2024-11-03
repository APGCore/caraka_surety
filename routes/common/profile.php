<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Check if the user is authenticated
    if (! Auth::check()) {
        return redirect()->route('login'); // Redirect to login if not authenticated
    }
    $user = \App\Models\User::query()->find(Auth::id());

    $route = $user?->role->route_name ?? 'login';

    return redirect()->intended(route($route, absolute: false));
});

// Route::get('/dashboard', function () {
//     return Inertia::render('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile-bpr', [UserController::class, 'updateCenter'])->name('profile.update.bpr');
    Route::patch('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');
});
