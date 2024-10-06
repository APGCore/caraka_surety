<?php

namespace App\Http\Controllers\Office;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Location\DistrictController;
use App\Http\Controllers\Location\RegencyController;
use App\Http\Requests\Office\StoreRequest;
use App\Http\Requests\Office\UpdateRequest;
use App\Http\Resources\Office\ProfileResource;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Profile;
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
            ->appends($request->all());
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
            if ($regencies->count() == 0) {
                $province = $provinces->where('id', $request->get('province_id'))->first();
                $regencyController = new RegencyController;
                $regencyController->synchronize($request->merge(['code' => $province->code]));

                $regencies = Regency::query()
                    ->where('province_id', $request->get('province_id'))
                    ->get();
            }
        }

        $districts = collect();
        if ($request->get('regency_id')) {
            $districts = District::query()
                ->where('regency_id', $request->get('regency_id'))
                ->get();
            if ($districts->count() == 0 && $request->get('district_id') == null) {
                $regency = $regencies->where('id', $request->get('regency_id'))->first();
                $districtController = new DistrictController;
                $districtController->synchronize($request->merge(['code' => $regency->code]));

                $districts = District::query()
                    ->where('regency_id', $request->get('regency_id'))
                    ->get();
            }
        }

        $component = $request->path().'/index';

        return inertia($component, [
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
        ]);
    }

    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $requestValidated = $request->validated();
            Profile::query()
                ->create($requestValidated);

            flashMessage('Kantor Cabang Ditambahkan', 'Kantor Cabang berhasil ditambahkan');
            DB::commit();

            return redirect()->route('branch.index');
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Kantor Cabang', 'Terjadi kesalahan saat menambahkan kantor cabang', 'error');
            Log::error('Profil Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();

            return redirect()->back();
        }
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request, Profile $profile): Response
    {
        $profileId = $profile?->id;

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

        $component = $request->path();
        $component = substr($component, 0, strrpos($component, '/')).'/index';

        return inertia($component, [
            'profile' => $profile,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
        ]);
    }

    public function update(UpdateRequest $request, Profile $profile)
    {
        try {
            DB::beginTransaction();
            $requestValidated = $request->validated();
            $profile->update($requestValidated);

            flashMessage('Kantor Cabang Diperbarui', 'Kantor Cabang berhasil diperbarui');
            DB::commit();

            return redirect()->route('branch.index');
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Kantor Cabang', 'Terjadi kesalahan saat memperbarui kantor cabang', 'error');
            Log::error('Profil Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();

            return redirect()->back();
        }
    }

    public function destroy(Profile $profile)
    {
        try {
            DB::beginTransaction();
            $profile->delete();

            flashMessage('Kantor Cabang Dihapus', 'Kantor Cabang berhasil dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
            Log::error('Profil Destroy: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();
        } finally {
            return redirect()->back();
        }
    }
}
