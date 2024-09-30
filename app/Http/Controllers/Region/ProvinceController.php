<?php

namespace App\Http\Controllers\Region;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProvinceResource;
use App\Models\Region\Province;
use App\Traits\RegionTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProvinceController extends Controller
{
    use RegionTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $provinces = Province::search($request->search)
            ->orderBy('name')
            ->paginate($request->perpage ?? 10)
            ->appends('query', null)
            ->withQueryString();
        $provincesResource = ProvinceResource::collection($provinces);

        return inertia('admin/wilayah/provinsi/index', [
            'page_settings' => [
                'title' => 'Provinsi',
            ],
            'provinces' => fn () => $provincesResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'name' => 'required|string',
        ]);

        try {
            $province = Province::create($request->only('code', 'name'));
            flashMessage('Provinsi Ditambahkan', 'Provinsi berhasil ditambahkan');
            Log::info('Provinsi Store: '.json_encode($province, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Provinsi', 'Terjadi kesalahan saat menambahkan provinsi', 'error');
            Log::error('Provinsi Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('provinces.index');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Province $province)
    {
        $request->validate([
            'code' => 'required|string',
            'name' => 'required|string',
        ]);

        try {
            $province->update($request->only('code', 'name'));
            flashMessage('Provinsi Diperbarui', 'Provinsi berhasil diperbarui');
            Log::info('Provinsi Update: '.json_encode($province, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Provinsi', 'Terjadi kesalahan saat memperbarui provinsi', 'error');
            Log::error('Provinsi Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('provinces.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Province $province)
    {
        try {
            $province->delete();
            flashMessage('Provinsi Dihapus', 'Provinsi berhasil dihapus');
            Log::info('Provinsi Delete: '.json_encode($province, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menghapus Provinsi', 'Terjadi kesalahan saat menghapus provinsi', 'error');
            Log::error('Provinsi Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('provinces.index');
        }
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize(): void
    {
        try {
            //            $provinceLast = Province::latest()->first('created_at');
            //            if ($provinceLast && $provinceLast->created_at->diffInMinutes(now()) < (60 * 24 * 7)) {
            //                flashMessage(
            //                    'Gagal Menyinkronkan Provinsi',
            //                    'Anda hanya dapat menyinkronkan provinsi setiap 7 hari sekali',
            //                    'error'
            //                );
            //
            //                return;
            //            }

            $responses = $this->syncApi('provinsi');

            // Ambil hasil dari permintaan
            $provinces = (object) $responses[0]->json();

            flashMessage('Provinsi Tersinkron', 'Provinsi berhasil disinkronisasi');

            foreach ($provinces->value as $province) {
                Province::updateOrCreate([
                    'code' => $province['id'],
                ], [
                    'name' => $province['name'],
                ]);
            }

            Log::info('Provinsi Synchronized: '.json_encode($provinces, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menyinkronkan Provinsi', 'Terjadi kesalahan saat menyinkronkan provinsi', 'error');
            Log::error('Provinsi Synchronized: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        }
    }
}
