<?php

namespace App\Http\Controllers\Location;

use App\Http\Controllers\Controller;
use App\Http\Resources\Location\RegencyResource;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Services\Location\RegencyService;
use Exception;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class RegencyController extends Controller
{

  protected $regencyService;

  public function __construct(RegencyService $regencyService)
  {
    $this->regencyService = $regencyService;
  }


  public function apiSearch(Request $request): JsonResponse
  {
    $search = $request->get('search') ?? '';
    $perPage = $request->get('per_page') ?? 10;
    $page = $request->get('page') ?? 1;
    $provinceId = $request->get('province_id') ? (int) $request->get('province_id') : null;

    $result = $this->regencyService->searchRegencies($search, $perPage, $page, $provinceId);
    $msg = "Berhasil mengambil data kabupaten!";

    return $this->responseSuccess($msg, $result);
  }


  /**
   * Display a listing of the resource.
   */
  public function index(Request $request): Response
  {
    $provinces = Province::all();
    $regencies = Regency::search($request->get('search'))
      ->query(function ($query) {
        return $query->with('province');
      })
      ->orderBy('code')
      ->paginate($request->per_page ?? 10)
      ->appends('query', null)
      ->appends($request->all());

    $regenciesResource = RegencyResource::collection($regencies);

    $component = $request->path() . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Kabupaten',
      ],
      'provinces' => fn() => $provinces,
      'regencies' => fn() => $regenciesResource,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $rules = [
      'province_id' => 'required|exists:provinces,id',
      'code' => 'required|string|unique:regencies,code',
      'name' => 'required|string|unique:regencies,name',
    ];

    $messages = [
      'province_id.required' => 'Provinsi wajib diisi',
      'province_id.exists' => 'Provinsi tidak ditemukan',
      'code.required' => 'Kode Kabupaten wajib diisi',
      'code.string' => 'Kode Kabupaten harus berupa string',
      'code.unique' => 'Kode Kabupaten sudah ada',
      'name.required' => 'Nama Kabupaten wajib diisi',
      'name.string' => 'Nama Kabupaten harus berupa string',
      'name.unique' => 'Nama Kabupaten sudah ada',
    ];

    $request->validate($rules, $messages);

    try {
      DB::beginTransaction();
      $regency = Regency::query()
        ->create([
          'province_id' => $request->get('province_id'),
          'code' => $request->get('code'),
          'name' => $request->get('name'),
        ]);

      activity()
        ->useLog('regency')
        ->performedOn($regency)
        ->causedBy(auth()->user())
        ->log('Menambahkan Kabupaten');
      flashMessage('Kabupaten Ditambahkan', 'Kabupaten berhasil ditambahkan');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal Menambahkan Kabupaten', 'Terjadi kesalahan saat menambahkan kabupaten', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Kabupaten Store: ', $error);
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
      'code' => 'required|string|unique:regencies,code,' . $regency->id,
      'name' => 'required|string|unique:regencies,name,' . $regency->id,
    ], [
      'province_id.required' => 'Provinsi wajib diisi',
      'province_id.exists' => 'Provinsi tidak ditemukan',
      'code.required' => 'Kode Kabupaten wajib diisi',
      'code.string' => 'Kode Kabupaten harus berupa string',
      'code.unique' => 'Kode Kabupaten sudah ada',
      'name.required' => 'Nama Kabupaten wajib diisi',
      'name.string' => 'Nama Kabupaten harus berupa string',
      'name.unique' => 'Nama Kabupaten sudah ada',
    ]);

    try {
      DB::beginTransaction();

      $regency->update($request->only('province_id', 'code', 'name'));

      flashMessage('Kabupaten Diperbarui', 'Kabupaten berhasil diperbarui');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal Memperbarui Kabupaten', 'Terjadi kesalahan saat memperbarui kabupaten', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Kabupaten Update: ', $error);
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
      DB::beginTransaction();

      if ($regency->exists) {
        $regency->delete();
      } else {
        throw new ThrottleRequestsException('Kabupaten tidak ditemukan');
      }

      flashMessage('Kabupaten Dihapus', 'Kabupaten berhasil dihapus');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal Menghapus Kabupaten', 'Terjadi kesalahan saat menghapus kabupaten', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Kabupaten Delete: ', $error);
    } finally {
      return redirect()->route('regency.index');
    }
  }

  /**
   * Synchronize the provinces data from the external API.
   */
  public function synchronize(Request $request): void
  {
    $request->validate([
      'code' => 'required|exists:provinces,code',
    ], [
      'code.required' => 'Kode Provinsi wajib diisi',
      'code.exists' => 'Provinsi tidak ditemukan',
    ]);
    try {
      DB::beginTransaction();
      $responses = $this->syncApi('kabupaten', [
        'id_provinsi' => $request->get('code'),
      ]);

      // Ambil hasil dari permintaan
      $province = Province::query()
        ->where('code', $request->get('code'))->first();
      $regencies = (object) $responses[0]->json();

      foreach ($regencies->value as $regency) {
        Regency::query()
          ->updateOrCreate([
            'code' => $regency['id'],
          ], [
            'province_id' => $province->id,
            'code' => $regency['id'],
            'name' => $regency['name'],
          ]);
      }

      flashMessage('Kabupaten Disinkronkan', 'Kabupaten berhasil disinkronkan');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal Menyinkronkan Kabupaten', json_encode($e->getMessage(), JSON_PRETTY_PRINT), 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Kabupaten Sync: ', $error);
    }
  }

  public function getByProvince($provinceId): JsonResponse
  {
    $province = Province::query()->findOrFail($provinceId);
    $regencies = Regency::query()->where('province_id', $provinceId)->get();

    if ($regencies->isEmpty()) {
      $this->synchronize(new Request(['code' => $province->code]));
      $regencies = Regency::query()->where('province_id', $provinceId)->get();
    }

    return response()->json($regencies);
  }
}
