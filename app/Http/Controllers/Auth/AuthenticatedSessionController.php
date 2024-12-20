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
            'username' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        // Error message to display if the credentials are invalid
        $errorMessage = [
            'username' => 'Username Tidak Terdaftar.',
            'password' => 'Atau Password Salah.',
        ];

        // Check if the username exists
        $user = User::where('username', $validatedData['username'])->first();

        // Check if the user exists
        if (! $user) {
            flashMessage('Gagal Login!', 'Username Tidak Ditemukan.', 'error');

            // Return an error message if the email doesn't exist
            return redirect()->back()->withErrors($errorMessage);
        }

        // Check if the password matches
        if (! Hash::check($validatedData['password'], $user->password)) {
            flashMessage('Gagal Login!', 'Password.', 'error');

            // Return an error message if the password is incorrect
            return redirect()->back()->withErrors($errorMessage);
        }

        // If the credentials are valid, log in the user
        Auth::login($user);

        // Regenerate session upon successful login
        $request->session()->regenerate();

        // Redirect to the intended page (e.g., dashboard)

        $userLogin = User::find(Auth::id());

        $userRole = $userLogin->role_id;

        if ($userRole == 1) {
            $this->activityLogin('Login sebagai Admin');
            flashMessage('Berhasil Login sebagai Admin!', 'Anda berhasil login sebagai Admin.');

            return redirect()->intended(route('admin.index', absolute: false));
        } elseif ($userRole == 2) {
            $this->activityLogin('Login sebagai Direksi');
            flashMessage('Berhasil Login sebagai Direksi!', 'Anda berhasil login sebagai Direksi.');

            return redirect()->intended(route('direksi.index', absolute: false));
        } elseif ($userRole == 3) {
            $this->activityLogin('Login sebagai Kepala Cabang');
            flashMessage('Berhasil Login sebagai Kepala Cabang!', 'Anda berhasil login sebagai Kepala Cabang.');

            return redirect()->intended(route('kepala-cabang.index', absolute: false));
        } elseif ($userRole == 4) {
            $this->activityLogin('Login sebagai Manager');
            flashMessage('Berhasil Login sebagai Manager!', 'Anda berhasil login sebagai Manager.');

            return redirect()->intended(route('manager.index', absolute: false));
        } elseif ($userRole == 5) {
            $this->activityLogin('Login sebagai Staff');
            flashMessage('Berhasil Login sebagai Staff!', 'Anda berhasil login sebagai Staff.');

            return redirect()->intended(route('staff.index', absolute: false));
        } elseif ($userRole == 6) {
            $this->activityLogin('Login sebagai Staff Cabang');
            flashMessage('Berhasil Login sebagai Staff Cabang!', 'Anda berhasil login sebagai Staff Cabang.');

            return redirect()->intended(route('staff.index', absolute: false));
        }

        return redirect()->intended(route('login', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    /**
     * Activity Login.
     */
    private function activityLogin($description): void
    {
        activity()
            ->useLog('authentication')
            ->performedOn(new User)
            ->causedBy(auth()->user())
            ->log($description);
    }
}
