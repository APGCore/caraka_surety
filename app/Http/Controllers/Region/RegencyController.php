<?php

namespace App\Http\Controllers\Region;

use App\Http\Controllers\Controller;
use App\Http\Resources\RegencyResource;
use App\Models\Region\Province;
use App\Models\Region\Regency;
use App\Traits\RegionTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RegencyController extends Controller
{
    use RegionTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $provinces = Province::all();
        $regencies = Regency::search($request->search)
            ->orderBy('code')
            ->paginate($request->perpage ?? 10)
            ->appends('query', null)
            ->withQueryString();

        $regenciesResource = RegencyResource::collection($regencies);

        return inertia('admin/wilayah/kabupaten/index', [
            'page_settings' => [
                'title' => 'Kabupaten',
            ],
            'provinces' => fn () => $provinces,
            'regencies' => fn () => $regenciesResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = validator($request->all(), [
            'province_id' => 'required|exists:provinces,id',
            'code' => 'required|string|unique:regencies,code',
            'name' => 'required|string|unique:regencies,name',
        ]);

        if ($validatedData->fails()) {
            flashMessage('Gagal Menambahkan Kabupaten', '', 'error');

            return redirect()->back()->withErrors($validatedData->errors());
        }

        $reqValidated = $validatedData->validated();

        $regency = Regency::create([
            'province_id' => $reqValidated['province_id'],
            'code' => $reqValidated['code'],
            'name' => $reqValidated['name'],
        ]);

        if (! $regency) {
            flashMessage('Gagal Menambahkan Kabupaten', 'Kabupaten sudah ada', 'error');

            return redirect()->back()->withErrors($validatedData->errors());
        }

        flashMessage('Kabupaten Ditambahkan', 'Kabupaten berhasil ditambahkan');
        Log::info('Kabupaten Store: '.json_encode($regency, JSON_PRETTY_PRINT));

        return redirect()->route('regencies.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Regency $regency)
    {
        try {
            $request->validate([
                'province_id' => 'required|exists:provinces,id',
                'code' => 'required|string|unique:regencies,code,'.$regency->id,
                'name' => 'required|string|unique:regencies,name,'.$regency->id,
            ]);

            $regency->update($request->only('province_id', 'code', 'name'));
            flashMessage('Kabupaten Diperbarui', 'Kabupaten berhasil diperbarui');
            Log::info('Kabupaten Update: '.json_encode($regency, JSON_PRETTY_PRINT));

            return redirect()->back();
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Kabupaten', 'Terjadi kesalahan saat memperbarui kabupaten', 'error');
            Log::error('Kabupaten Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            return redirect()->back()->withErrors($th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Regency $regency)
    {
        try {
            $regency->delete();
            flashMessage('Kabupaten Dihapus', 'Kabupaten berhasil dihapus');
            Log::info('Kabupaten Delete: '.json_encode($regency, JSON_PRETTY_PRINT));

            return redirect()->back();
        } catch (\Throwable $th) {
            flashMessage('Gagal Menghapus Kabupaten', 'Terjadi kesalahan saat menghapus kabupaten', 'error');
            Log::error('Kabupaten Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            return redirect()->back()->withErrors($th->getMessage());
        }
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize(Request $request): void
    {
        try {
            $request->validate([
                'code' => 'required|exists:provinces,code',
            ]);

            $responses = $this->syncApi('kabupaten', [
                'id_provinsi' => $request->code,
            ]);

            // Ambil hasil dari permintaan
            $province = Province::where('code', $request->code)->first();
            $regencies = (object) $responses[0]->json();

            foreach ($regencies->value as $regency) {
                Regency::updateOrCreate([
                    'code' => $regency['id'],
                ], [
                    'province_id' => $province->id,
                    'code' => $regency['id'],
                    'name' => $regency['name'],
                ]);
            }

            flashMessage('Kabupaten Disinkronkan', 'Kabupaten berhasil disinkronkan');
            Log::info('Kabupaten Synchronized: '.json_encode($regencies, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menyinkronkan Kabupaten', json_encode($th->getMessage(), JSON_PRETTY_PRINT), 'error');
            Log::error('Kabupaten Sync: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        }
    }
}
