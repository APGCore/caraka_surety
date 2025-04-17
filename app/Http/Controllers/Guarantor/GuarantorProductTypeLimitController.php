<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Http\Resources\Guarantor\GuarantorToProductTypeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuarantorProductTypeLimitController extends Controller
{

  public function apiSearch(Request $request)
  {
    // get request parameters
    $product_id = $request->get('product_id') ?? null;
    $job_group = $request->get('job_group') ?? null;
    $search = $request->get('search') ?? '';
    $isPageAble = $request->get('is_page_able') ?? "false";
    $perPage = $request->get('per_page') ?? 10;
    $page = $request->get('page') ?? 1;

    // Selected Guarantor
    $guarantor = Guarantor::first();
    $guarantor_id = $guarantor ? $guarantor->id : null;

    // query to get guarantor product type limits
    $query = GuarantorToProductType::search($search)
      ->query(function ($query) use ($guarantor_id, $product_id, $job_group) {
        $query->with('limit')
          ->where('guarantor_id', $guarantor_id)
          ->where('product_id', $product_id)
          ->where('job_group', $job_group)
          ->select('id', 'guarantor_id', 'no', 'code', 'full_name', 'name', 'job_group', 'job_type', 'created_at', 'updated_at');
      })
      ->orderBy('no');



    // if is page able is true, then paginate the data
    $guarantorProductTypes = $isPageAble !== "false"
      ? $query->paginate(
        perPage: $perPage,
        page: $page
      )
      : $query->get();

    // if is page able is true, then return the resource, otherwise return the data
    $guarantorResource = GuarantorToProductTypeResource::collection($guarantorProductTypes);

    // if is page able is true, then return the resource, otherwise return the data
    $datas = $isPageAble !== "false" ? [
      'data' => $guarantorResource,
      'meta' => [
        'current_page' => $guarantorProductTypes->currentPage(),
        'from' => $guarantorProductTypes->firstItem(),
        'to' => $guarantorProductTypes->lastItem(),
        'last_page' => $guarantorProductTypes->lastPage(),
        'per_page' => (int) $perPage,
        'total' => $guarantorProductTypes->total(),
      ],
    ] : $guarantorResource;

    return $this->responseSuccess('Berhasil mengambil data limit produk asuransi', $datas);
  }


  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $guarantors = Guarantor::with(['product', 'productType'])->whereNull('headquarter_id')->get();
    $guarantor = $guarantors->find($request->get('guarantor_id')) ?? $guarantors->first();

    $products = $guarantor?->product?->unique()->values();
    $product = $products?->find($request->get('product_id')) ?? $products?->first();

    $guarantorSelected = $guarantor->id ?? null;
    $productSelected = $product->id ?? null;

    $jobGroups = JobGroup::getValues();
    $jobGroupSelected = $request->get('job_group', count($jobGroups) > 0 ? $jobGroups[0] : null);
    $jobTypes = JobType::getValues();
    $jobTypeSelected = $request->get('job_type', count($jobTypes) > 1 ? $jobTypes[1] : null);

    $guarantorProductTypes = GuarantorToProductType::search($request->get('search'))
      ->query(function ($query) use ($guarantorSelected, $productSelected, $jobGroupSelected) {
        $query->with('limit')
          ->where('guarantor_id', $guarantorSelected)
          ->where('product_id', $productSelected)
          ->when($jobGroupSelected, function ($query) use ($jobGroupSelected) {
            $query->where('job_group', $jobGroupSelected);
          })
          //                    ->when($jobTypeSelected, function ($query) use ($jobTypeSelected) {
          //                        $query->where('job_type', $jobTypeSelected);
          //                    })
          ->select('id', 'guarantor_id', 'no', 'code', 'full_name', 'name', 'job_group', 'job_type', 'created_at', 'updated_at');
      })
      ->orderBy('no')
      ->paginate($request->get('per_page') ?? 10)
      ->appends('query', null)
      ->appends($request->all());

    $resource = GuarantorToProductTypeResource::collection($guarantorProductTypes);

    $component = request()->path() . '/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Setting Limit Produk Asuransi',
      ],
      'guarantors' => $guarantors,
      'guarantorSelected' => $guarantorSelected,
      'products' => $products,
      'productSelected' => $productSelected,
      'jobGroups' => $jobGroups,
      'jobGroupSelected' => $jobGroupSelected,
      'jobTypes' => $jobTypes,
      'jobTypeSelected' => $jobTypeSelected,
      'guarantorProductTypes' => fn() => $resource,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $request->validate([
      'guarantor_id' => 'required|exists:' . Guarantor::class . ',id',
      'guarantor_to_product_type_id' => 'required|exists:' . GuarantorToProductType::class . ',id',
      'limit' => 'required',
    ]);

    try {
      DB::beginTransaction();
      $limit = (float) str_replace('.', '', $request->get('limit'));
      $limitInherit = $request->get('limit_inherit')
        ? (float) str_replace('.', '', $request->get('limit_inherit'))
        : $limit;
      $guarantorProductTypeLimit = GuarantorProductTypeLimit::create([
        'guarantor_id' => $request->get('guarantor_id'),
        'guarantor_to_product_type_id' => $request->get('guarantor_to_product_type_id'),
        'limit' => $limit,
        'limit_inherit' => $limitInherit,
      ]);
      $guarantorProductType = $guarantorProductTypeLimit->guarantorToProductType;

      activity()
        ->useLog('guarantor-product-type-limit')
        ->performedOn(new GuarantorToProductType)
        ->causedBy(auth()->user())
        ->log('Menambahkan limit produk asuransi');
      flashMessage('success', 'Limit berhasil disimpan');
      DB::commit();

      return redirect()->route('guarantor-product-type-limit.index', [
        'guarantor_id' => $guarantorProductType->getAttribute('guarantor_id'),
        'product_id' => $guarantorProductType->getAttribute('product_id'),
        'job_group' => $guarantorProductType->getAttribute('job_group'),
      ])->with('success', 'Limit berhasil disimpan');
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('error', 'Limit gagal disimpan', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Error store limit: ', $error);

      return redirect()->back()->with('error', 'Limit gagal disimpan');
    }
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, GuarantorProductTypeLimit $guarantorProductTypeLimit)
  {
    $request->validate([
      'limit' => 'required',
    ]);

    try {
      DB::beginTransaction();
      $limit = (float) str_replace('.', '', $request->get('limit'));
      $limitInherit = $request->get('limit_inherit')
        ? (float) str_replace('.', '', $request->get('limit_inherit'))
        : $limit;
      $guarantorProductTypeLimit->update([
        'limit' => $limit,
        'limit_inherit' => $limitInherit,
      ]);
      $guarantorProductType = $guarantorProductTypeLimit->guarantorToProductType;
      activity()
        ->useLog('guarantor-product-type-limit')
        ->performedOn($guarantorProductTypeLimit)
        ->causedBy(auth()->user())
        ->log('Mengubah limit produk asuransi');
      flashMessage('success', 'Limit berhasil diubah');
      DB::commit();

      return redirect()->route('guarantor-product-type-limit.index', [
        'guarantor_id' => $guarantorProductType->getAttribute('guarantor_id'),
        'product_id' => $guarantorProductType->getAttribute('product_id'),
        'job_group' => $guarantorProductType->getAttribute('job_group'),
      ])->with('success', 'Limit berhasil diubah');
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('error', 'Limit gagal diubah', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Error update limit: ', $error);

      return redirect()->back()->with('error', 'Limit gagal diubah');
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(GuarantorProductTypeLimit $guarantorProductTypeLimit)
  {
    try {
      $guarantorProductTypeLimit->delete();
      flashMessage('success', 'Limit berhasil dihapus');

      return redirect()->back()->with('success', 'Limit berhasil dihapus');
    } catch (Exception $e) {
      flashMessage('error', 'Limit gagal dihapus', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Error delete limit: ', $error);

      return redirect()->back()->with('error', 'Limit gagal dihapus');
    }
  }
}
