<?php

namespace App\Http\Controllers\RelatedParties;

use App\Http\Controllers\Controller;
use App\Http\Requests\Obligee\StoreRequest;
use App\Http\Requests\Obligee\UpdateRequest;
use App\Http\Resources\Obligee\ObligeeResource;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\SubmissionObligee;
use Exception;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class ObligeeController extends Controller
{
  public function apiSearch(Request $request)
  {
    // request
    $search = $request->get('search') ?? '';
    $isPageAble = $request->get('is_page_able') ?? 'false';
    $perPage = $request->get('per_page') ?? 10;
    $page = $request->get('page') ?? 1;

    // query
    $query = Obligee::search($search)
      ->orderBy('created_at');

    // if is page able is true, then paginate the data
    $obligee = $isPageAble !== 'false'
      ? $query->paginate(
        perPage: $perPage,
        page: $page
      )
      : $query->get();

    // if is page able is true, then return the resource, otherwise return the data
    $obligeeResource = ObligeeResource::collection($obligee);

    // if is page able is true, then return the resource, otherwise return the data
    $response = $isPageAble !== 'false' ? [
      'data' => $obligeeResource,
      'meta' => [
        'current_page' => $obligee->currentPage(),
        'from' => $obligee->firstItem(),
        'to' => $obligee->lastItem(),
        'last_page' => $obligee->lastPage(),
        'per_page' => (int) $perPage,
        'total' => $obligee->total(),
      ],
    ] : $obligeeResource;

    // return response
    return $this->responseSuccess('Sukses get All Obligee', $response);
  }

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request): Response
  {
    $obligee = Obligee::search($request->get('search'))
      ->orderBy('name')
      ->paginate($request->get('per_page') ?? 10)
      ->appends('query', null)
      ->appends($request->all());
    $obligeeResource = ObligeeResource::collection($obligee);

    $component = $request->path() . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Obligee',
      ],
      'obligees' => fn() => $obligeeResource,
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create(Request $request): Response
  {

    $obligees = Obligee::all();

    $component = $request->path() . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Tambah Data Obligee',
      ],
      'obligees' => $obligees,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreRequest $request)
  {
    try {
      DB::beginTransaction();
      $requestValid = $request->validated();
      if ($request->hasFile('upload_picture')) {
        $fileName = str_replace(' ', '_', $requestValid['name']);
        $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'obligees', $fileName);
      }

      Obligee::query()
        ->create($requestValid);
      activity()
        ->useLog('obligee')
        ->performedOn(new Obligee)
        ->causedBy(auth()->user())
        ->log('Menambahkan data obligee');
      flashMessage('Berhasil', 'Penambahan data obligee berhasil');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal', 'Penambahan data obligee gagal', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('ObligeeController@store: ', $error);
    } finally {
      return redirect()->route('obligee.index');
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(Obligee $obligee)
  {
    $obligee = Obligee::with('province', 'regency', 'district')->findOrFail($obligee->id);

    return inertia('admin/obligee-management/obligee/detail/index', [
      'page_settings' => [
        'title' => 'Detail Obligee',
      ],
      'obligee' => $obligee,
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Obligee $obligee, Request $request)
  {
    $component = $request->path();
    $component = substr($component, 0, strrpos($component, '/')) . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Edit Obligee',
      ],
      'obligee' => $obligee,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateRequest $request, Obligee $obligee)
  {
    try {
      DB::beginTransaction();

      $requestValid = $request->validated();
      if ($request->hasFile('upload_picture')) {
        $picture = $obligee->getAttribute('picture') ?? '';
        $this->deleteFile($picture);

        $fileName = str_replace(' ', '_', $requestValid['name']);
        $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'obligees', $fileName);
      }
      $obligee->update($requestValid);
      activity()
        ->useLog('obligee')
        ->performedOn($obligee)
        ->causedBy(auth()->user())
        ->log('Mengubah data obligee');
      flashMessage('Berhasil', 'Perubahan data obligee berhasil');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal', 'Perubahan data obligee gagal', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('ObligeeController@update: ', $error);
    } finally {
      return redirect()->route('obligee.index');
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Obligee $obligee)
  {
    try {
      DB::beginTransaction();

      if ($obligee->exists) {
        $picture = $obligee->getAttribute('picture') ?? '';
        $this->deleteFile($picture);
        $obligee->delete();
      } else {
        throw new ThrottleRequestsException('Data Obligee tidak ditemukan');
      }
      activity()
        ->useLog('obligee')
        ->performedOn($obligee)
        ->causedBy(auth()->user())
        ->log('Menghapus data obligee');
      flashMessage('Data Obligee Dihapus', 'Data Obligee dihapus');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Profil Destroy: ', $error);
    } finally {
      return redirect()->back();
    }
  }

  public function getObligee(Request $request)
  {
    $obligee = Obligee::query()
      ->get();

    return $this->responseSuccess('Sukses get All Obligee', $obligee);
  }

  public function apiSearchByName(Request $request)
  {
    $search = $request->get('search') ?? '';
    $obligee = Obligee::query()
      ->where('name', 'like', "%{$search}%")
      ->limit(10)
      ->get();

    return $this->responseSuccess('Sukses get All Obligee', $obligee);
  }
  //    public function getObligee(Request $request)
  //    {
  //        $obligee = SubmissionObligee::query()
  //            ->get();
  //
  //        return $this->responseSuccess('Sukses get All Obligee', $obligee);
  //    }
}
