<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/login/index', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        // Error message to display if the credentials are invalid
        $errorMessage = [
            'email' => 'Credentials do not match our records.',
            'password' => 'Credentials do not match our records.'
        ];

        // Check if the email exists
        $user = User::where('email', $validatedData['email'])->first();

        // Check if the user exists
        if (!$user) {
            flashMessage('Gagal Login!', 'Credentials do not match our records.', 'error');
            // Return an error message if the email doesn't exist
            return redirect()->back()->withErrors($errorMessage);
        }

        // Check if the password matches
        if (!Hash::check($validatedData['password'], $user->password)) {
            flashMessage('Gagal Login!', 'Credentials do not match our records.', 'error');
            // Return an error message if the password is incorrect
            return redirect()->back()->withErrors($errorMessage);
        }

        // If the credentials are valid, log in the user
        Auth::login($user);

        // Regenerate session upon successful login
        $request->session()->regenerate();

        // Redirect to the intended page (e.g., dashboard)
        flashMessage('Berhasil Login!', 'Successfully logged in.', type: 'success');
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
