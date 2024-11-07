<?php

/** @noinspection ALL */

namespace App\Http\Controllers\Location;

use App\Http\Controllers\Controller;
use App\Http\Resources\Location\DistrictResource;
use App\Models\Location\District;
use App\Models\Location\Regency;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class DistrictController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $regencies = Regency::all();
        $districts = District::search($request->get('search'))
            ->orderBy('code')
            ->paginate($request->per_page ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $districtResource = DistrictResource::collection($districts);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Kecamatan',
            ],
            'regencies' => fn () => $regencies,
            'districts' => fn () => $districtResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws ValidationException
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {

        $request->validate([
            'regency_id' => 'required|exists:regencies,id',
            'code' => 'required|string|unique:districts,code',
            'name' => 'required|string|unique:districts,name',
        ], [
            'regency_id.required' => 'Kabupaten wajib diisi',
            'regency_id.exists' => 'Kabupaten tidak ditemukan',
            'code.required' => 'Kode Kecamatan wajib diisi',
            'code.string' => 'Kode Kecamatan harus berupa string',
            'code.unique' => 'Kode Kecamatan sudah ada',
            'name.required' => 'Nama Kecamatan wajib diisi',
            'name.string' => 'Nama Kecamatan harus berupa string',
            'name.unique' => 'Nama Kecamatan sudah ada',
        ]);

        try {
            DB::beginTransaction();
            $regency = District::query()
                ->create([
                    'regency_id' => $reqValidated['regency_id'],
                    'code' => $reqValidated['code'],
                    'name' => $reqValidated['name'],
                ]);

            if (! $regency) {
                flashMessage('Gagal Menambahkan Kecamatan', 'Kecamatan sudah ada', 'error');

                return redirect()->back()->withErrors($validatedData->errors());
            }

            flashMessage('Kecamatan Ditambahkan', 'Kecamatan berhasil ditambahkan');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menambahkan Kecamatan', 'Terjadi kesalahan saat menambahkan kecamatan', 'error');
            Log::error('Kecamatan Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'regency_id' => 'required|exists:regencies,id',
            'code' => 'required|string',
            'name' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $district->update($request->only('regency_id', 'code', 'name'));

            flashMessage('Kecamatan Diperbarui', 'Kecamatan berhasil diperbarui');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Kecamatan', 'Terjadi kesalahan saat memperbarui kecamatan', 'error');
            Log::error('Kecamatan Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district): \Illuminate\Http\RedirectResponse
    {
        try {
            DB::beginTransaction();

            if ($district->exists) {
                $district->delete();
            } else {
                throw new ThrottleRequestsException('Kantor Cabang tidak ditemukan');
            }

            flashMessage('Kecamatan Dihapus', 'Kecamatan berhasil dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kecamatan', 'Terjadi kesalahan saat menghapus kecamatan', 'error');
            Log::error('Kecamatan Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize(Request $request): void
    {
        $request->validate([
            'code' => 'required|exists:regencies,code',
        ], [
            'code.required' => 'Kode Kabupaten wajib diisi',
            'code.exists' => 'Kabupaten tidak ditemukan',
        ]);

        try {
            DB::beginTransaction();
            $responses = $this->syncApi('kecamatan', [
                'id_kabupaten' => $request->get('code'),
            ]);

            // Ambil hasil dari permintaan
            $regency = Regency::query()
                ->where('code', $request->get('code'))->first();
            $districts = (object) $responses[0]->json();

            foreach ($districts->value as $district) {
                District::query()
                    ->updateOrCreate([
                        'code' => $district['id'],
                    ], [
                        'regency_id' => $regency->id,
                        'code' => $district['id'],
                        'name' => $district['name'],
                    ]);
            }

            flashMessage('Kecamatan Disinkronkan', 'Kecamatan berhasil disinkronkan');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menyinkronkan Kecamatan', json_encode($th->getMessage(), JSON_PRETTY_PRINT), 'error');
            Log::error('Kecamatan Sync: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        }
    }

    public function getByRegency($regencyId): JsonResponse
    {
        $regency = Regency::query()->findOrFail($regencyId);
        $districts = District::query()
            ->where('regency_id', $regencyId)
            ->get();
        if ($districts->isEmpty()) {
            $this->synchronize(new Request(['code' => $regency->code]));
            $districts = District::query()
                ->where('regency_id', $regencyId)
                ->get();
        }

        return response()->json($districts);
    }
}
