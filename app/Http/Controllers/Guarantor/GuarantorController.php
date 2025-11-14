<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\StoreRequest;
use App\Http\Requests\Guarantor\UpdateRequest;
use App\Http\Resources\Guarantor\GuarantorResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\Product;
use App\Models\RelatedParties\OfficePairing;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class GuarantorController extends Controller
{
  /**
   * Get guarantors
   */
  public function apiGetGuarantors(Request $request)
  {

    // get request parameters
    $is_head = $request->get('is_head') ?? 'false';
    $search = $request->get('search') ?? '';
    $isPageAble = $request->get('is_page_able') ?? 'false';
    $perPage = $request->get('per_page') ?? 10;
    $page = $request->get('page') ?? 1;

    // query to get guarantors
    $query = Guarantor::search($search)
      ->query(function ($query) use ($is_head) {
        return $query->when(
          $is_head === 'true',
          fn($query) => $query->whereNull('headquarter_id'), // success condition
          fn($query) => $query->whereNotNull('headquarter_id') // failed condition
        );
      })
      ->orderBy('name');

    // if is page able is true, then paginate the data
    $guarantors = $isPageAble === 'true'
      ? $query->paginate(
        perPage: $perPage,
        page: $page
      )
      : $query->get();

    // if is page able is true, then return the resource, otherwise return the data
    $guarantorResource = GuarantorResource::collection($guarantors);

    // if is page able is true, then return the resource, otherwise return the data
    $datas = $isPageAble === 'true' ? [
      'data' => $guarantorResource,
      'meta' => [
        'current_page' => $guarantors->currentPage(),
        'from' => $guarantors->firstItem(),
        'to' => $guarantors->lastItem(),
        'last_page' => $guarantors->lastPage(),
        'per_page' => (int) $perPage,
        'total' => $guarantors->total(),
      ],
    ] : $guarantorResource;

    return $this->responseSuccess('Berhasil mengambil data penjamin', $datas);
  }

  public function index(Request $request)
  {
    $guarantors = Guarantor::search($request->get('search'))
      ->query(function ($query) {
        return $query
          ->whereNull('headquarter_id')
          ->with([
            'head',
            'province',
            'regency',
            'district',
          ]);
      })
      ->orderBy('name')
      ->paginate($request->get('per_page') ?? 10)
      ->appends('query', null)
      ->appends($request->all());

    $resource = GuarantorResource::collection($guarantors);
    $component = $request->path() . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Data Asuransi',
      ],
      'guarantors' => fn() => $resource,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreRequest $request): void
  {
    try {
      DB::beginTransaction();

      $requestValid = $request->validated();
      if ($request->hasFile('upload_picture')) {
        $fileName = 'guarantor_' . str_replace(' ', '_', $requestValid['name']);
        $path = $this->uploadFile($request->file('upload_picture'), 'guarantors', $fileName);
        $requestValid['picture'] = $path;
      }

      $guarantor = Guarantor::query()
        ->create($requestValid)
        ->load('pattern');

      // pattern
      $guarantor->pattern()->create([
        'prefix' => $requestValid['prefix'] ?? '',
        'content' => $requestValid['content'] ?? '',
        'suffix' => $requestValid['suffix'] ?? '',
      ]);

      // pairing banks
      if ($request->has('pairing_banks')) {
        $pairingBanks = collect($requestValid['pairing_banks'])->map(function ($item) {
          return ['bank_id' => $item['id']];
        })->toArray();
        $guarantor->guarantorPairings()->createMany($pairingBanks);
      }

      activity()
        ->useLog('guarantor')
        ->performedOn($guarantor)
        ->causedBy(auth()->user())
        ->log('Menambahkan data asuransi');
      flashMessage('Berhasil', 'Penambahan data asuransi berhasil');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal', 'Penambahan data asuransi gagal', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('GuarantorController@store: ', $error);
    }
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create(): Response
  {
    $component = request()->path() . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Tambah Asuransi',
      ],
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Guarantor $guarantor)
  {
    $picture = $guarantor->getAttribute('picture') ?
      Storage::url($guarantor->getAttribute('picture')) : '';
    $guarantor->setAttribute('picture', $picture);
    $guarantor->load(['pattern', 'bank:id,name']);

    $component = str_replace('/' . $guarantor->getAttribute('id'), '', request()->path()) . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Edit Asuransi',
      ],
      'guarantor' => fn() => $guarantor,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateRequest $request, Guarantor $guarantor): void
  {
    try {
      DB::beginTransaction();

      $requestValid = $request->validated();
      if ($request->hasFile('upload_picture')) {
        $picture = $guarantor->getAttribute('picture') ?? null;
        $this->deleteFile($picture);
        $fileName = 'guarantor_' . str_replace(' ', '_', $requestValid['name']);
        $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'guarantors', $fileName);
      } else {
        unset($requestValid['picture']);
      }

      $guarantor->update($requestValid);
      $guarantor->load('pattern');

      $patternData = [
        'prefix' => $requestValid['prefix'],
        'content' => $requestValid['content'],
        'suffix' => $requestValid['suffix'],
      ];

      if ($guarantor->pattern === null) {
        $guarantor->pattern()->create($patternData);
      } else {
        $guarantor->pattern->update($patternData);
      }

      // pairing banks
      if ($request->has('pairing_banks')) {
        $pairingBanks = collect($requestValid['pairing_banks'])->map(function ($item) {
          return ['bank_id' => $item['id']];
        })->toArray();
        $guarantor->guarantorPairings()->delete();
        $guarantor->guarantorPairings()->createMany($pairingBanks);
      }

      activity()
        ->useLog('guarantor')
        ->performedOn($guarantor)
        ->causedBy(auth()->user())
        ->log('Mengubah data asuransi');
      flashMessage('Berhasil', 'Perubahan data asuransi berhasil');
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      $error = $this->handleErrorMessage($e);
      Log::error('GuarantorController@update: ', $error);
      flashMessage('Gagal', 'Perubahan data asuransi gagal', 'error');
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Guarantor $guarantor)
  {
    try {
      DB::beginTransaction();
      $picture = $guarantor->getAttribute('picture') ?? '';
      $this->deleteFile($picture);
      $guarantor->delete();

      activity()
        ->useLog('guarantor')
        ->performedOn($guarantor)
        ->causedBy(auth()->user())
        ->log('Menghapus data asuransi');
      flashMessage('Berhasil', 'Data asuransi berhasil dihapus');
      DB::commit();

      return redirect()->route('guarantor.index');
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal', 'Data asuransi gagal dihapus', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('GuarantorController@destroy: ', $error);

      return back()->withErrors($e->getMessage());
    }
  }

  public function getAll(Request $request)
  {
    $isHead = $request->get('is_head');
    $hostNotExist = $request->get('host_not_exist');
    $hostToHostId = $request->get('host_to_host_id');

    $guarantors = Guarantor::query()
      ->when($isHead, fn($query) => $query->whereNull('headquarter_id'), fn($query) => $query->whereNotNull('headquarter_id'))
      ->when($hostNotExist, fn($query) => $hostToHostId ? $query->whereDoesntHave('hostToHost', fn($query) => $query->whereNot('id', $hostToHostId)) : $query->doesntHave('hostToHost'))
      ->orderBy('name')
      ->get();

    return $this->responseSuccess('Berhasil mengambil data penjamin', $guarantors);
  }

  public function getAllBranch()
  {
    $guarantors = Guarantor::query()
      ->whereNotNull('headquarter_id')
      ->orderBy('name')
      ->get();

    return $this->responseSuccess('Berhasil mengambil data semua cabang', $guarantors);
  }

  public function product(Guarantor $guarantor)
  {
    $guarantor->load('product:id,name');

    // unique product
    $product = $guarantor->product->unique('id')->values();

    return $this->responseSuccess('Berhasil mengambil data produk', $product);
  }

  public function productType(Guarantor $guarantor, Product $product)
  {
    $guarantorProductType = GuarantorToProductType::query()
      ->where('guarantor_id', $guarantor->getAttribute('id'))
      ->where('product_id', $product->getAttribute('id'))
      ->get(['id', 'code', 'name', 'job_group', 'full_name']);

    return $this->responseSuccess('Berhasil mengambil data produk asuransi', $guarantorProductType);
  }

  public function getGuarantorByProductId(Product $product)
  {
    $guarantors = GuarantorToProductType::query()
      ->where('product_id', $product->id)
      ->with('guarantorHead:id,headquarter_id,name')
      ->get(['guarantor_id']);

    $guarantors = $guarantors->pluck('guarantorHead')->unique()->filter(fn($data) => $data != null)->values();

    return $this->responseSuccess('Berhasil mengambil data penjamin', $guarantors);
  }

  public function getGuarantorBranchByHeadIsPairing(Guarantor $guarantor)
  {
    $season = auth()->user();
    $staff = User::query()->with('office')->firstWhere('id', $season->getAuthIdentifier());

    $guarantor->load('branch');
    $guarantorBranch = $guarantor->getRelation('branch');

    if ($staff->office->getAttribute('office_type') === OfficeType::HEADQUARTER->value) {
      return $this->responseSuccess('Berhasil mengambil data cabang penjamin pairing pusat', $guarantorBranch);
    }

    $guarantorBranchIds = $guarantor->getRelation('branch')->pluck('id');
    $guarantorOffice = OfficePairing::query()
      ->where('office_id', $staff->getAttribute('profile_id'))
      ->whereIn('guarantor_id', $guarantorBranchIds)
      ->with('office:id,name', 'guarantor:id,name')
      ->get(['office_id', 'guarantor_id']);

    $guarantorBranch = $guarantorOffice->pluck('guarantor')->unique()->filter(fn($data) => $data != null)->values();

    return $this->responseSuccess('Berhasil mengambil data cabang penjamin', $guarantorBranch);
  }

  public function getGuarantorBranchByHeadIsPairingSearch(Guarantor $guarantor, Request $request)
  {
    $season = auth()->user();
    $search = $request->get('search') ?? '';
    $staff = User::query()->with('office')->firstWhere('id', $season->getAuthIdentifier());

    if ($staff->office->getAttribute('office_type') === OfficeType::HEADQUARTER->value) {
      // For headquarters, search and limit from all branches
      $guarantorBranch = Guarantor::query()
        ->where('headquarter_id', $guarantor->getAttribute('id'))
        ->when($search, fn($query) => $query->where('name', 'like', "%{$search}%"))
        ->orderBy('name')
        ->limit(10)
        ->get();

      return $this->responseSuccess('Berhasil mengambil data cabang penjamin pairing pusat', $guarantorBranch);
    }

    // For non-headquarters, get paired guarantor branches with search and limit
    $guarantorBranchIds = Guarantor::query()
      ->where('headquarter_id', $guarantor->getAttribute('id'))
      ->pluck('id');

    $guarantorOffice = OfficePairing::query()
      ->where('office_id', $staff->getAttribute('profile_id'))
      ->whereIn('guarantor_id', $guarantorBranchIds)
      ->with(['guarantor' => function ($query) use ($search) {
        $query->select('id', 'name')
          ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
          ->orderBy('name');
      }])
      ->limit(10)
      ->get(['office_id', 'guarantor_id']);

    $guarantorBranch = $guarantorOffice->pluck('guarantor')->unique('id')->filter(fn($data) => $data != null)->values()->take(10);

    return $this->responseSuccess('Berhasil mengambil data cabang penjamin', $guarantorBranch);
  }
}
