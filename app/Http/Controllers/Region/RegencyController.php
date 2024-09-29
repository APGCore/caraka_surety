<?php

namespace App\Http\Controllers\Region;

use App\Http\Resources\RegencyResource;
use App\Models\Region\Regency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RegencyController extends RegionController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $regencies = Regency::search($request->search)
            ->orderBy('name')
            ->paginate($request->perpage ?? 10)
            ->appends('query', null)
            ->withQueryString();
        $regenciesResource = RegencyResource::collection($regencies);

        return inertia('admin/wilayah/kabupaten/index', [
            'page_settings' => [
                'title' => 'Kabupaten',
            ],
            'regencies' => fn () => $regenciesResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'province_id' => 'required|exists:provinces,id',
            'code' => 'required|string',
            'name' => 'required|string',
        ]);

        try {
            $regency = Regency::create($request->only('province_id', 'code', 'name'));
            flashMessage('Kabupaten Ditambahkan', 'Kabupaten berhasil ditambahkan');
            Log::info('Kabupaten Store: '.json_encode($regency, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Kabupaten', 'Terjadi kesalahan saat menambahkan kabupaten', 'error');
            Log::error('Kabupaten Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('regency.index');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Regency $regency)
    {
        $request->validate([
            'province_id' => 'required|exists:provinces,id',
            'code' => 'required|string',
            'name' => 'required|string',
        ]);

        try {
            $regency->update($request->only('province_id', 'code', 'name'));
            flashMessage('Kabupaten Diperbarui', 'Kabupaten berhasil diperbarui');
            Log::info('Kabupaten Update: '.json_encode($regency, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Kabupaten', 'Terjadi kesalahan saat memperbarui kabupaten', 'error');
            Log::error('Kabupaten Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('regency.index');
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
        } catch (\Throwable $th) {
            flashMessage('Gagal Menghapus Kabupaten', 'Terjadi kesalahan saat menghapus kabupaten', 'error');
            Log::error('Kabupaten Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('regency.index');
        }
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize(Request $request): void
    {
        try {
            $request->validate([
                'province_id' => 'required|exists:provinces,id',
            ]);

            $responses = $this->syncApi('kabupaten', [
                'province_id' => $request->province_id,
            ]);

            // Ambil hasil dari permintaan
            $regencies = (object) $responses[0]->json();

            foreach ($regencies->value as $regency) {
                Regency::updateOrCreate([
                    'code' => $regency['id'],
                ], [
                    'province_id' => $request->province_id,
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
