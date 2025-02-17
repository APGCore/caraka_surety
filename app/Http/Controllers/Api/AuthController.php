<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $credentials = $request->only('username', 'password');

        if (! Auth::attempt($credentials)) {
            return $this->responseError('Username atau password salah');
        }

        $token = Auth::user()->createToken('authToken')->plainTextToken;

        return $this->responseSuccess('Login success', ['access_token' => $token]);
    }

    public function logout(): JsonResponse
    {
        Auth::user()->tokens()->delete();

        return $this->responseSuccess('Logout success');
    }
}
