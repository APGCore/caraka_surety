<?php

use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Check if the user is authenticated
    if (!Auth::check()) {
        return redirect()->route('login'); // Redirect to login if not authenticated
    }

    $userLogin = User::find(Auth::id());
    $userRole = $userLogin->role_id;

    $roleRoutes = [
        1 => 'admin.index',
        2 => 'direksi.index',
        3 => 'kepala-cabang.index',
        4 => 'manager.index',
        5 => 'staff.index',
        6 => 'staff.index',
    ];

    $route = $roleRoutes[$userRole] ?? 'login';

    return redirect()->intended(route($route, absolute: false));
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile-bpr', [UserController::class, 'updateCenter'])->name('profile.update.bpr');
    Route::patch('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');
});
