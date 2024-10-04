<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Region\DistrictController;
use App\Http\Controllers\Region\RegencyController;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use App\Models\Region\District;
use App\Models\Region\Province;
use App\Models\Region\Regency;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function index(Request $request): Response
    {
        $profiles = Profile::search($request->get('search'))
            ->where('is_central', false)
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->withQueryString();
        $profileResource = ProfileResource::collection($profiles);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Profile Cabang',
            ],
            'profiles' => fn () => $profileResource,
        ]);
    }

    // create
    public function create(Request $request): Response
    {
        $provinces = Province::query()
            ->get();

        $regencies = collect();
        if ($request->get('province_id')) {
            $regencies = Regency::query()
                ->where('province_id', $request->get('province_id'))
                ->get();
        }

        $districts = collect();
        if ($request->get('regency_id')) {
            $districts = District::query()
                ->where('regency_id', $request->get('regency_id'))
                ->get();
        }

        $component = $request->path().'/create';

        return inertia($component, [
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $profileId = $request->get('profile_id');

        if ($profileId) {
            $profile = Profile::query()
                ->find($profileId);
        } else {
            $profile = Profile::query()
                ->where('is_central', true)
                ->first();
        }

        $provinces = Province::query()
            ->get();

        $regencies = collect();
        if ($request->get('province_id')) {
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
            $profile->setAttribute('province_id', (int) $request->get('province_id'));
        } elseif ($profile->province_id) {
            $regencies = Regency::query()
                ->where('province_id', $profile->province_id)
                ->get();
        }

        $districts = collect();
        if ($request->get('regency_id')) {
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
            $profile->setAttribute('regency_id', (int) $request->get('regency_id'));
        } elseif ($profile->regency_id) {
            $districts = District::query()
                ->where('regency_id', $profile->regency_id)
                ->get();
        }

        if ($request->get('district_id')) {
            $profile->setAttribute('district_id', (int) $request->get('district_id'));
        }

        $component = $request->path().'/edit';

        return inertia($component, [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profile' => $profile,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
        ]);
    }

    public function update(Request $request)
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
            Profile::query()
                ->where('is_central', true)
                ->update($request->only('name', 'email', 'phone', 'address', 'province_id', 'regency_id', 'district_id'));

            DB::commit();
            flashMessage('Profil Diperbarui', 'Profil berhasil diperbarui');
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Profil', 'Terjadi kesalahan saat memperbarui profil', 'error');
            Log::error('Profil Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('profile.edit');
        }
    }
}
