<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\Auth\ProfileUpdateRequest;
use App\Models\Profile;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function edit(Request $request): \Inertia\Response
    {
        $profile = Profile::query()
            ->where('is_central', true)
            ->first();

        $component = $request->path();

        if ($request->user()->hasRole(RoleEnum::Admin)) {
            $component .= '/edit';
        } elseif ($request->user()->hasRole(RoleEnum::Staff)) {
            $component .= '/edit-staff';
        }

        return inertia($component, [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profile' => $profile,
        ]);
    }

    public function updateCenter(Request $request)
    {
        $requestValidated = $request->validate([
            'code' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:profiles,email,1,id,deleted_at,NULL'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:255'],
            'province_id' => ['required', 'integer', 'exists:provinces,id'],
            'regency_id' => ['required', 'integer', 'exists:regencies,id'],
            'district_id' => ['required', 'integer', 'exists:districts,id'],
            'village' => ['required', 'string', 'max:255'],
        ]);

        try {
            DB::beginTransaction();
            $profile = Profile::query()
                ->where('is_central', true)
                ->first();
            $profile->update($requestValidated);

            flashMessage('Kantor Pusat Diperbarui', 'Kantor Pusat berhasil diperbarui');
            DB::commit();

            return redirect()->route('profile.edit');
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Kantor Cabang', 'Terjadi kesalahan saat memperbarui kantor cabang', 'error');
            Log::error('Profil Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();

            return redirect()->back();
        }
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->forceDelete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
