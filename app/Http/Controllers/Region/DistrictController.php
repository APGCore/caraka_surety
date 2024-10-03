<?php

namespace App\Http\Controllers\Region;

use App\Http\Controllers\Controller;
use App\Http\Resources\DistrictResource;
use App\Models\Region\District;
use App\Models\Region\Regency;
use App\Traits\RegionTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class DistrictController extends Controller
{
    use RegionTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $regencies = Regency::all();
        $districts = District::search($request->search)
            ->orderBy('code')
            ->paginate($request->perpage ?? 10)
            ->appends('query', null)
            ->withQueryString();

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
    public function store(Request $request)
    {
        $validatedData = validator($request->all(), [
            'regency_id' => 'required|exists:regencies,id',
            'code' => 'required|string|unique:districts,code',
            'name' => 'required|string|unique:districts,name',
        ]);

        if ($validatedData->fails()) {
            flashMessage('Gagal Menambahkan kecamatan', '', 'error');

            return redirect()->back()->withErrors($validatedData->errors());
        }

        $reqValidated = $validatedData->validated();

        $regency = District::create([
            'regency_id' => $reqValidated['regency_id'],
            'code' => $reqValidated['code'],
            'name' => $reqValidated['name'],
        ]);

        if (! $regency) {
            flashMessage('Gagal Menambahkan Kecamatan', 'Kecamatan sudah ada', 'error');

            return redirect()->back()->withErrors($validatedData->errors());
        }

        flashMessage('Kecamatan Ditambahkan', 'Kecamatan berhasil ditambahkan');
        Log::info('Kecamatan Store: '.json_encode($regency, JSON_PRETTY_PRINT));

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district)
    {
        $request->validate([
            'regency_id' => 'required|exists:regencies,id',
            'code' => 'required|string',
            'name' => 'required|string',
        ]);

        try {
            $district->update($request->only('regency_id', 'code', 'name'));
            flashMessage('Kecamatan Diperbarui', 'Kecamatan berhasil diperbarui');
            Log::info('Kecamatan Update: '.json_encode($district, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Kecamatan', 'Terjadi kesalahan saat memperbarui kecamatan', 'error');
            Log::error('Kecamatan Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        try {
            $district->delete();
            flashMessage('Kecamatan Dihapus', 'Kecamatan berhasil dihapus');
            Log::info('Kecamatan Delete: '.json_encode($district, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menghapus Kecamatan', 'Terjadi kesalahan saat menghapus kecamatan', 'error');
            Log::error('Kecamatan Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize(Request $request)
    {
        try {
            $request->validate([
                'code' => 'required|exists:regencies,code',
            ]);

            $responses = $this->syncApi('kecamatan', [
                'id_kabupaten' => $request->code,
            ]);

            // Ambil hasil dari permintaan
            $regency = Regency::where('code', $request->code)->first();
            $districts = (object) $responses[0]->json();

            foreach ($districts->value as $district) {
                District::updateOrCreate([
                    'code' => $district['id'],
                ], [
                    'regency_id' => $regency->id,
                    'code' => $district['id'],
                    'name' => $district['name'],
                ]);
            }

            flashMessage('Kecamatan Disinkronkan', 'Kecamatan berhasil disinkronkan');
            Log::info('Kecamatan Synchronized: '.json_encode($districts, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menyinkronkan Kecamatan', json_encode($th->getMessage(), JSON_PRETTY_PRINT), 'error');
            Log::error('Kecamatan Sync: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        }
    }
}
