<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Region\DistrictController;
use App\Http\Controllers\Region\RegencyController;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Profile;
use App\Models\Region\District;
use App\Models\Region\Province;
use App\Models\Region\Regency;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $profile = Profile::query()
            ->where('is_central', true)
            ->first();
        $provinces = Province::query()
            ->get();

        $regencies = collect();
        if ($profile->province_id) {
            $regencies = Regency::query()
                ->where('province_id', $profile->province_id)
                ->get();
        } elseif ($request->get('province_id')) {
            $regenciesQuery = Regency::query();

            $regencies = $regenciesQuery->where('province_id', $request->get('province_id'))
                ->get();
            if ($regencies->count() == 0) {
                $province = $provinces->where('id', $request->get('province_id'))->first();
                $regencyController = new RegencyController;
                $regencyController->synchronize($request->merge(['code' => $province->code]));
            }
            $regencies = $regenciesQuery->where('province_id', $request->get('province_id'))
                ->get();
        }

        $districts = collect();
        if ($profile->regency_id) {
            $districts = District::query()
                ->where('regency_id', $profile->regency_id)
                ->get();
        } elseif ($request->get('regency_id')) {
            $districtsQuery = District::query();

            $districts = $districtsQuery->where('regency_id', $request->get('regency_id'))
                ->get();
            if ($districts->count() == 0 && $request->get('district_id') == null) {
                $regency = $regencies->where('id', $request->get('regency_id'))->first();
                $districtController = new DistrictController;
                $districtController->synchronize($request->merge(['code' => $regency->code]));
            }
            $districts = $districtsQuery->where('regency_id', $request->get('regency_id'))
                ->get();
        }

        return inertia('profile/edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profile' => $profile,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
        ]);
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

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updateBpr(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'province_id' => 'required|exists:provinces,id',
            'regency_id' => 'required|exists:regencies,id',
            'district_id' => 'required|exists:districts,id',
        ]);

        try {
            DB::beginTransaction();
            $profile = Profile::query()
                ->where('is_central', true)
                ->update($request->only('name', 'email', 'phone', 'address', 'province_id', 'regency_id', 'district_id'));

            DB::commit();
            flashMessage('Profil Diperbarui', 'Profil berhasil diperbarui');
            Log::info('Profil Update: '.json_encode($profile, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Profil', 'Terjadi kesalahan saat memperbarui profil', 'error');
            Log::error('Profil Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('profile.edit');
        }
    }
}
