<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Resources\_Refactor\Api\Product\ProductTypeResource;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\ProductType;
use Exception;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductTipeController extends Controller
{
    public function apiSearch(Request $request)
    {
        // request parameters
        $search = $request->get('search') ?? '';
        $isPageAble = $request->get('is_page_able') ?? 'false';
        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;
        $productId = $request->get('product_id') ?? null;

        // search query
        $query = ProductType::search($search)
            ->query(function ($query) use ($productId) {
                if ($productId) {
                    $query->whereHas('product', function ($query) use ($productId) {
                        $query->where('product_id', $productId);
                    });
                }
            })
            ->orderBy('created_at');

        // if is page able is true, then paginate the data, otherwise get the data
        $productTypes = $isPageAble !== 'false'
          ? $query->paginate(
              perPage: $perPage,
              page: $page
          )
          : $query->get();

        // product type resource
        $productTypeResource = ProductTypeResource::collection($productTypes);

        // if is page able is true, then return the resource, otherwise return the data
        $response = $isPageAble !== 'false' ? [
            'data' => $productTypeResource,
            'meta' => [
                'current_page' => $productTypes->currentPage(),
                'from' => $productTypes->firstItem(),
                'to' => $productTypes->lastItem(),
                'last_page' => $productTypes->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $productTypes->total(),
            ],
        ] : $productTypeResource;

        return $this->responseSuccess('Berhasil mengambil data jenis produk', $response);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $component = $request->path().'/index';

        $productTypes = ProductType::search($request->get('search'))
            ->query(function ($query) {
                return $query->with(['product', 'guarantorToProductType']);
            })
            ->orderBy('created_at', 'desc')
            ->paginate((int) $request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $productTypeResource = ProductTypeResource::collection($productTypes);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Jenis Produk',
            ],
            'productTypes' => fn () => $productTypeResource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Jenis Produk',
            ],

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'no' => 'required|integer',
            'name' => 'required|string',
            'description' => 'required|string',
        ], [
            'no.required' => 'Nomor Urut wajib diisi',
            'name.required' => 'Nama Jenis Produk wajib diisi',
            'name.string' => 'Nama Jenis Produk harus berupa string',
            'description.required' => 'Deskripsi Jenis Produk wajib diisi',
            'description.string' => 'Deskripsi Jenis Produk harus berupa string',
        ]);

        try {
            DB::beginTransaction();
            ProductType::query()
                ->create($request->only('no', 'name', 'description'));
            activity()
                ->useLog('product-type')
                ->performedOn(new ProductType)
                ->causedBy(auth()->user())
                ->log('Menambahkan Jenis Produk');
            flashMessage('Jenis Produk Ditambahkan', 'Jenis Produk berhasil ditambahkan');
            DB::commit();
        } catch (Exception $e) {
            flashMessage('Gagal Menambahkan Jenis Produk', 'Terjadi kesalahan saat menambahkan jenis produk', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Jenis Produk Store: ', $error);
            DB::rollBack();
        } finally {
            return redirect()->route('product-types.index');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductType $productTipe)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductType $productTipe)
    {
        //
        $component = 'admin/product-management/product-types/edit/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Produk',
            ],
            'productType' => $productTipe,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductType $productTipe)
    {
        //
        $request->validate([
            'no' => 'required|integer',
            'name' => 'required|string',
            'description' => 'required|string',
        ], [
            'no.required' => 'Nomor Urut wajib diisi',
            'name.required' => 'Nama Jenis Produk wajib diisi',
            'name.string' => 'Nama Jenis Produk harus berupa string',
            'description.required' => 'Deskripsi Jenis Produk wajib diisi',
            'description.string' => 'Deskripsi Jenis Produk harus berupa string',
        ]);

        try {
            DB::beginTransaction();
            if ($productTipe->exists) {
                $productTipe->update($request->only('no', 'name', 'description'));
            } else {
                throw new ThrottleRequestsException('Jenis Cabang tidak ditemukan');
            }
            activity()
                ->useLog('product-type')
                ->performedOn($productTipe)
                ->causedBy(auth()->user())
                ->log('Mengubah Jenis Produk');
            flashMessage('Jenis Produk Diperbarui', 'Jenis Produk berhasil diperbarui');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Jenis Produk', 'Terjadi kesalahan saat memperbarui Jenis Produk', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Produk Update: ', $error);
        } finally {
            return redirect()->route('product-types.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductType $productTipe)
    {
        //

        try {
            DB::beginTransaction();

            if ($productTipe->exists) {
                $productTipe->delete();
            } else {
                throw new ThrottleRequestsException('Jenis Cabang tidak ditemukan');
            }
            activity()
                ->useLog('product-type')
                ->performedOn($productTipe)
                ->causedBy(auth()->user())
                ->log('Menghapus Jenis Produk');
            flashMessage('Jenis Produk Dihapus', 'Jenis Produk berhasil dihapus');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Jenis Produk', 'Terjadi kesalahan saat menghapus Jenis Produk', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Jenis Produk Delete: ', $error);
        } finally {
            return redirect()->back();
        }
    }

    public function getAllProductType()
    {
        $productTypes = ProductType::query()->get();

        return response()->json($productTypes);
    }

    public function getByProduct($productId)
    {
        $productTypes = ProductType::query()
            ->whereHas('product', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->get();

        return response()->json($productTypes);
    }

    public function getByProductAndGuarantor($productId, $guarantorId)
    {
        $guarantorToProductTypes = GuarantorToProductType::query()
            ->whereHas('product', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->whereHas('guarantorHead', function ($query) use ($guarantorId) {
                $query->where('guarantor_id', $guarantorId);
            })
            ->get();

        $productTypeIds = $guarantorToProductTypes->pluck('product_type_id')->toArray();
        $productTypes = ProductType::query()
            ->whereIn('id', $productTypeIds)
            ->get();
        $jobGroups = $guarantorToProductTypes->pluck('job_group')->unique()->values();
        $jobTypes = $guarantorToProductTypes->pluck('job_type')->unique()->values();

        $data = [
            'product_types' => $productTypes,
            'job_groups' => $jobGroups,
            'job_types' => $jobTypes,
        ];

        return $this->responseSuccess('Berhasil mengambil data produk asuransi', $data);
    }
}
