<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Location\DistrictController;
use App\Http\Controllers\Location\RegencyController;
use App\Http\Requests\Bank\StoreRequest;
use App\Http\Requests\Bank\UpdateRequest;
use App\Http\Resources\Bank\BankResource;
use App\Models\Bank;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $bank = Bank::search($request->get('search'))
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $bankResource = BankResource::collection($bank);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Kelola Bank',
            ],
            'banks' => fn () => $bankResource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $bank = Bank::all();
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

        return inertia('admin/bank-management/bank/create/index', [
            'page_settings' => [
                'title' => 'Tambah Bank',
            ],
            'banks' => $bank,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            if ($request->hasFile('picture')) {
                $request->merge([
                    'picture' => $request->file('picture')
                        ->store('obligees', [
                            'disk' => 'private',
                        ]),
                ]);
            }

            Bank::query()
                ->create($request->validated());

            flashMessage('Berhasil', 'Penambahan data bank berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data bank gagal', 'error');
            Log::error('ObligeeController@store: ', ['message' => $e->getMessage()]);
        } finally {
            return redirect()->route('bank.index');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Bank $bank)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $bank, Request $request)
    {
        $provinces = Province::query()->get();

        $regencies = collect();
        if ($request->get('province_id')) {
            $regenciesQuery = Regency::query();

            $regencies = $regenciesQuery->where('province_id', $request->get('province_id'))->get();
            if ($regencies->count() == 0) {
                $province = $provinces->where('id', $request->get('province_id'))->first();
                $regencyController = new RegencyController;
                $regencyController->synchronize($request->merge(['code' => $province->code]));
            }
            $regencies = $regenciesQuery->where('province_id', $request->get('province_id'))->get();
            $bank->setAttribute('province_id', (int) $request->get('province_id'));
        } elseif ($bank->province_id) {
            $regencies = Regency::query()
                ->where('province_id', $bank->province_id)
                ->get();
        }

        $districts = collect();
        if ($request->get('regency_id')) {
            $districtsQuery = District::query();

            $districts = $districtsQuery->where('regency_id', $request->get('regency_id'))->get();
            if ($districts->count() == 0) {
                $regency = $regencies->where('id', $request->get('regency_id'))->first();
                $districtController = new DistrictController;
                $districtController->synchronize($request->merge(['code' => $regency->code]));
            }
            $districts = $districtsQuery->where('regency_id', $request->get('regency_id'))->get();
            $bank->setAttribute('regency_id', (int) $request->get('regency_id'));
        } elseif ($bank->regency_id) {
            $districts = District::query()
                ->where('regency_id', $bank->regency_id)
                ->get();
        }

        if ($request->get('district_id')) {
            $bank->setAttribute('district_id', (int) $request->get('district_id'));
        }

        $component = $request->path();
        $component = substr($component, 0, strrpos($component, '/')).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Bank',
            ],
            'bank' => $bank,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Bank $bank)
    {
        try {
            DB::beginTransaction();

            $bank->update($request->validated());

            flashMessage('Berhasil', 'Perubahan data bank berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data bank gagal', 'error');
            Log::error('ObligeeController@update: ', ['message' => $e->getMessage()]);
        } finally {
            return redirect()->route('bank.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank)
    {
        try {
            DB::beginTransaction();

            if ($bank->exists) {
                $bank->delete();
            } else {
                throw new ThrottleRequestsException('Data bank tidak ditemukan');
            }

            flashMessage('Data bank Dihapus', 'Data bank dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
            Log::error('Profil Destroy: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }
}
