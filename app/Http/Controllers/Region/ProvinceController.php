<?php

namespace App\Http\Controllers\Region;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProvinceResource;
use App\Models\Region\Province;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProvinceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $provinces = Province::search($request->search)
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Province $province)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Province $province)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Province $province)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Province $province)
    {
        //
    }

    /**
     * Synchronize the provinces data from the external API.
     */
    public function synchronize(): void
    {
        try {
            $provinceLast = Province::latest()->first('created_at');
            if ($provinceLast && $provinceLast->created_at->diffInMinutes(now()) < (60 * 24 * 7)) {
                flashMessage('Gagal Menyinkronkan Provinsi', 'Anda hanya dapat menyinkronkan provinsi setiap 7 hari sekali');

                return;
            }

            $responses = Http::pool(fn (Pool $pool) => [
                $pool->get(env('BINDER_BYTE_API_URL').'/provinsi', [
                    'api_key' => env('BINDER_BYTE_API_KEY'),
                ]),
                // Tambahkan permintaan lain di sini jika perlu
            ]);

            // Ambil hasil dari permintaan
            $provinces = (object) $responses[0]->json();

            flashMessage('Provinsi Tersinkron', 'Provinsi berhasil disinkronisasi');

            foreach ($provinces->value as $province) {
                Province::updateOrCreate([
                    'id' => $province['id'],
                ], [
                    'name' => $province['name'],
                ]);
            }

            Log::info('Provinsi Synchronized: '.json_encode($provinces, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            flashMessage('Gagal Menyinkronkan Provinsi', 'Terjadi kesalahan saat menyinkronkan provinsi');
            Log::error('Provinsi Synchronized: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        }
    }
}
