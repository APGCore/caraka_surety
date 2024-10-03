<?php

namespace App\Http\Controllers\Region;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProvinceResource;
use App\Models\Region\Province;
use App\Traits\RegionTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $component = $request->path().'/index';

        return inertia($component, [
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
            'code' => 'required|string|unique:provinces,code',
            'name' => 'required|string|unique:provinces,name',
        ], [
            'code.required' => 'Kode Provinsi wajib diisi',
            'code.string' => 'Kode Provinsi harus berupa string',
            'code.unique' => 'Kode Provinsi sudah ada',
            'name.required' => 'Nama Provinsi wajib diisi',
            'name.string' => 'Nama Provinsi harus berupa string',
            'name.unique' => 'Nama Provinsi sudah ada',
        ]);

        try {
            DB::beginTransaction();
            $province = Province::query()
                ->create($request->only('code', 'name'));
            flashMessage('Provinsi Ditambahkan', 'Provinsi berhasil ditambahkan');
            Log::info('Provinsi Store: '.json_encode($province, JSON_PRETTY_PRINT));
            DB::commit();
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Provinsi', 'Terjadi kesalahan saat menambahkan provinsi', 'error');
            Log::error('Provinsi Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();
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
            'code' => 'required|string|unique:provinces,code,'.$province->getAttribute('id'),
            'name' => 'required|string|unique:provinces,name,'.$province->getAttribute('id'),
        ], [
            'code.required' => 'Kode Provinsi wajib diisi',
            'code.string' => 'Kode Provinsi harus berupa string',
            'code.unique' => 'Kode Provinsi sudah ada',
            'name.required' => 'Nama Provinsi wajib diisi',
            'name.string' => 'Nama Provinsi harus berupa string',
            'name.unique' => 'Nama Provinsi sudah ada',
        ]);

        try {
            DB::beginTransaction();

            $province->update($request->only('code', 'name'));

            DB::commit();
            flashMessage('Provinsi Diperbarui', 'Provinsi berhasil diperbarui');
            Log::info('Provinsi Update: '.json_encode($province, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            DB::rollBack();
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
            DB::beginTransaction();

            $province->delete();

            DB::commit();
            flashMessage('Provinsi Dihapus', 'Provinsi berhasil dihapus');
            Log::info('Provinsi Delete: '.json_encode($province, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Provinsi', 'Terjadi kesalahan saat menghapus provinsi', 'error');
            Log::error('Provinsi Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('provinces.index');
        }
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize()
    {
        try {
            DB::beginTransaction();
            $responses = $this->syncApi('provinsi');

            // Ambil hasil dari permintaan
            $provinces = (object) $responses[0]->json();

            foreach ($provinces->value as $province) {
                Province::query()->updateOrCreate([
                    'code' => $province['id'],
                ], [
                    'name' => $province['name'],
                ]);
            }

            DB::commit();
            flashMessage('Provinsi Tersinkron', 'Provinsi berhasil disinkronisasi');
            Log::info('Provinsi Synchronized: '.json_encode($provinces, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menyinkronkan Provinsi', 'Terjadi kesalahan saat menyinkronkan provinsi', 'error');
            Log::error('Provinsi Synchronized: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('provinces.index');
        }
    }
}
