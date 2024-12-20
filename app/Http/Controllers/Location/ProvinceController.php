<?php

namespace App\Http\Controllers\Location;

use App\Http\Controllers\Controller;
use App\Http\Resources\Location\ProvinceResource;
use App\Models\Location\Province;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProvinceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $provinces = Province::search($request->get('search'))
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
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
            Province::query()
                ->create($request->only('code', 'name'));
            activity()
                ->useLog('province')
                ->performedOn(new Province)
                ->causedBy(auth()->user())
                ->log('menambahkan data provinsi');
            flashMessage('Provinsi Ditambahkan', 'Provinsi berhasil ditambahkan');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menambahkan Provinsi', 'Terjadi kesalahan saat menambahkan provinsi', 'error');
            Log::error('Provinsi Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('province.index');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Province $province)
    {
        $request->validate([
            'code' => 'required|string|unique:provinces,code,'.$province->getAttribute('id').',id',
            'name' => 'required|string|unique:provinces,name,'.$province->getAttribute('id').',id',
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
            activity()
                ->useLog('province')
                ->performedOn($province)
                ->causedBy(auth()->user())
                ->log('memperbarui data provinsi');
            flashMessage('Provinsi Diperbarui', 'Provinsi berhasil diperbarui');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Provinsi', 'Terjadi kesalahan saat memperbarui provinsi', 'error');
            Log::error('Provinsi Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('province.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Province $province)
    {
        try {
            DB::beginTransaction();

            // tambahkan kondisi jika provinsi memiliki relasi jangan di hapus
            if ($province->regency()->count() > 0) {
                flashMessage('Gagal Menghapus Provinsi', 'Provinsi memiliki relasi dengan kabupaten', 'error');

                return redirect()->route('province.index');
            }
            if ($province->profile()->count() > 0) {
                flashMessage('Gagal Menghapus Provinsi', 'Provinsi memiliki relasi dengan kantor cabang', 'error');

                return redirect()->route('province.index');
            }

            if ($province->exists) {
                $province->delete();
            } else {
                throw new ThrottleRequestsException('Provinsi tidak ditemukan');
            }
            activity()
                ->useLog('province')
                ->performedOn($province)
                ->causedBy(auth()->user())
                ->log('menghapus data provinsi');
            flashMessage('Provinsi Dihapus', 'Provinsi berhasil dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Provinsi', 'Terjadi kesalahan saat menghapus provinsi', 'error');
            Log::error('Provinsi Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->route('province.index');
        }
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize(): void
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

            flashMessage('Provinsi Tersinkron', 'Provinsi berhasil disinkronisasi');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menyinkronkan Provinsi', 'Terjadi kesalahan saat menyinkronkan provinsi', 'error');
            Log::error('Provinsi Synchronized: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        }
    }

    public function all(): JsonResponse
    {
        if (Province::query()->count() === 0) {
            $this->synchronize();
        }
        $provinces = Province::all();

        return response()->json($provinces);
    }
}
