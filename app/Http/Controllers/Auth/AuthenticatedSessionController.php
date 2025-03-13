<?php

namespace App\Http\Controllers\Auth;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginAdminRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Guarantor\Guarantor;
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
    public function create(Request $request)
    {

        $guarantorId = session('guarantor_id');

        if (! $guarantorId) {
            return redirect()->route('onboarding');
        }

        // $guarantorId = $request->get('guarantor_id');
        // if ($guarantorId) {
        //     session(['guarantor_id' => $guarantorId]);
        // } else {
        //     $guarantorId = session('guarantor_id');
        // }
        // $guarantors = Guarantor::whereNull('headquarter_id')->get(['id', 'name', 'picture']);

        return Inertia::render('auth/login/index', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'guarantors' => [],
            'guarantorSelected' => 0,
        ]);
    }

    public function createAdmin(Request $request): Response
    {
        // $guarantorId = $request->get('guarantor_id');
        // if ($guarantorId) {
        //     session(['guarantor_id' => $guarantorId]);
        // } else {
        //     $guarantorId = session('guarantor_id');
        // }
        // $guarantors = Guarantor::whereNull('headquarter_id')->get(['id', 'name', 'picture']);

        return Inertia::render('auth/login/admin/index', [
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
        $validatedData = $request->validated();

        // Error message to display if the credentials are invalid
        $errorMessage = [
            'username' => 'Username Tidak Terdaftar.',
            'password' => 'Atau Password Salah.',
            // 'id asuransi' => 'Asuransi Tidak Dipilih.',
        ];

        // Check if the username exists
        $user = User::where('username', $validatedData['username'])
            ->with('role')->whereHas('role', function ($query) {
                $query->whereNot('name', RoleEnum::Admin);
            })->first();

        return $this->afterChackUser($user, $validatedData, $errorMessage, $request);
    }

    public function storeAdmin(LoginAdminRequest $request)
    {
        // Validate the incoming request
        $validatedData = $request->validated();

        // Error message to display if the credentials are invalid
        $errorMessage = [
            'username' => 'Username Tidak Terdaftar.',
            'password' => 'Atau Password Salah.',
        ];

        // Check if the username exists
        $user = User::where('username', $validatedData['username'])
            ->with('role')->whereHas('role', function ($query) {
                $query->where('name', RoleEnum::Admin);
            })->first();

        return $this->afterChackUser($user, $validatedData, $errorMessage, $request);
    }

    public function afterChackUser($user, $validatedData, $errorMessage, $request)
    {
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

        $userRole = $user->getRelation('role');
        $roleRoute = RoleEnum::getRoute();

        if ($userRole) {
            $userRole = $userRole->getAttribute('name');
            $route = $roleRoute[$userRole];
            $this->activityLogin('Login sebagai '.$userRole);
            flashMessage('Berhasil Login sebagai '.$userRole.'!', 'Anda berhasil login sebagai '.$userRole.'.');

            return redirect()->intended(route($route, absolute: false));
        }

        return redirect()->intended(route('login', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        Auth::guard('web')->logout();

        if ($user && $user->role_id === 1) {
            return redirect()->route('login.adminn');
        }

        $guarantorId = session('guarantor_id');
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        session(['guarantor_id' => $guarantorId]);

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
