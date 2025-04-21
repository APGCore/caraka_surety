<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use Exception;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function apiSearch(Request $request)
    {
        // get request parameters
        $search = $request->get('search') ?? '';
        $perPage = (int) ($request->get('per_page') ?? 10);
        $isPageAble = $request->get('is_page_able') ?? 'false';
        $page = (int) ($request->get('page') ?? 1);

        // Selected Guarantor
        $guarantor = Guarantor::first();
        $guarantorId = $guarantor ? $guarantor->id : null;

        // build base query
        $query = Product::search($search)
            ->query(function ($query) use ($guarantorId) {
                // if guarantor_id is provided, filter by guarantor
                if ($guarantorId) {
                    return $query->whereHas('guarantorToProductType', function ($query) use ($guarantorId) {
                        $query->where('guarantor_id', $guarantorId);
                    });
                }

                // if no guarantor_id, return all products
                return $query;
            })
            ->orderBy('created_at');

        // if is page able is true, then paginate the data
        $products = $isPageAble === 'true'
          ? $query->paginate(
              perPage: $perPage,
              page: $page
          )
          : $query->get();

        // if is page able is true, then return the resource, otherwise return the data
        $productResource = ProductResource::collection($products);

        // if is page able is true, then return the resource, otherwise return the data
        $datas = $isPageAble !== 'false' ? [
            'data' => $productResource,
            'meta' => [
                'current_page' => $products->currentPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
                'last_page' => $products->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $products->total(),
            ],
        ] : $productResource;

        return $this->responseSuccess('Berhasil mengambil data produk', $datas);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $component = 'admin/product-management/products/index';

        $products = Product::search($request->get('search'))
            ->orderBy('created_at', 'desc')
            ->paginate((int) $request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $productResource = ProductResource::collection($products);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Produk',
            ],
            'products' => fn () => $productResource,
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
                'title' => 'Tambah Produk',
            ],

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'productTypes.*.id' => 'required|integer|exists:product_types,id',
            'productTypes.*.name' => 'required|string|exists:product_types,name',
        ], [
            'name.required' => 'Nama Produk wajib diisi',
            'name.string' => 'Nama Produk harus berupa string',
            'description.required' => 'Deskripsi Produk wajib diisi',
            'description.string' => 'Deskripsi Produk harus berupa string',
            'productTypes.*.id.required' => 'ID Jenis Produk wajib diisi',
            'productTypes.*.id.integer' => 'ID Jenis Produk harus berupa angka',
            'productTypes.*.id.exists' => 'ID Jenis Produk tidak ditemukan',
            'productTypes.*.name.required' => 'Nama Jenis Produk wajib diisi',
            'productTypes.*.name.string' => 'Nama Jenis Produk harus berupa string',
            'productTypes.*.name.exists' => 'Nama Jenis Produk tidak ditemukan',
        ]);

        try {
            DB::beginTransaction();

            // Create Product
            $product = Product::query()
                ->create($request->only('name', 'description'));

            // Insert Product Type to Producr
            foreach ($request->productTypes as $productType) {
                $product->productTypeToProduct()->create([
                    'product_type_id' => $productType['id'],
                ]);
            }
            activity()
                ->useLog('product')
                ->performedOn(new Product)
                ->causedBy(auth()->user())
                ->log('Menambahkan data produk');
            flashMessage('Produk Ditambahkan', 'Produk berhasil ditambahkan');
            DB::commit();

            return redirect()->route('products.index');
        } catch (Exception $e) {
            flashMessage('Gagal Menambahkan Produk', 'Terjadi kesalahan saat menambahkan produk', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Produk Store: ', $error);

            DB::rollBack();

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product, Request $request)
    {
        $component = 'admin/product-management/products/edit/index';

        // Load the 'productTypeToProduct' relationship
        $product->load('productType');

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Produk',
            ],

            'product' => $product,
            // Include the product type in the response
            'product_types' => $product->productType ?? null, // Adjust 'product_type' to match the actual attribute
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {

        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'productTypes.*.id' => 'required|integer|exists:product_types,id',
            'productTypes.*.name' => 'required|string|exists:product_types,name',
        ], [
            'name.required' => 'Nama Produk wajib diisi',
            'name.string' => 'Nama Produk harus berupa string',
            'description.required' => 'Deskripsi Produk wajib diisi',
            'description.string' => 'Deskripsi Produk harus berupa string',
            'productTypes.*.id.required' => 'ID Jenis Produk wajib diisi',
            'productTypes.*.id.integer' => 'ID Jenis Produk harus berupa angka',
            'productTypes.*.id.exists' => 'ID Jenis Produk tidak ditemukan',
            'productTypes.*.name.required' => 'Nama Jenis Produk wajib diisi',
            'productTypes.*.name.string' => 'Nama Jenis Produk harus berupa string',
            'productTypes.*.name.exists' => 'Nama Jenis Produk tidak ditemukan',
        ]);

        try {
            DB::beginTransaction();

            if ($product->exists) {

                $product->update($request->only('name', 'description'));

                $product->productTypeToProduct()->delete();

                // Insert Product Type to Producr
                foreach ($request->productTypes as $productType) {
                    $product->productTypeToProduct()->create([
                        'product_type_id' => $productType['id'],
                    ]);
                }
            } else {
                throw new ThrottleRequestsException('Kantor Cabang tidak ditemukan');
            }
            activity()
                ->useLog('product')
                ->performedOn(new Product)
                ->causedBy(auth()->user())
                ->log('Mengubah data produk');
            flashMessage('Produk Diperbarui', 'Produk berhasil diperbarui');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Produk', 'Terjadi kesalahan saat memperbarui Produk', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Produk Update: ', $error);
        } finally {
            return redirect()->route('products.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
        try {
            DB::beginTransaction();

            if ($product->exists) {
                $product->delete();
            } else {
                throw new ThrottleRequestsException('Kantor Cabang tidak ditemukan');
            }
            activity()
                ->useLog('product')
                ->performedOn(new Product)
                ->causedBy(auth()->user())
                ->log('Menghapus data produk');
            flashMessage('Produk Dihapus', 'Produk berhasil dihapus');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Produk', 'Terjadi kesalahan saat menghapus Produk', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Produk Delete: ', $error);
        } finally {
            return redirect()->back();
        }
    }

    public function getAllProducts(Request $request)
    {
        $guarantorId = $request->get('guarantor_id');

        $products = Product::query()
            ->when($guarantorId != null, function ($query) use ($guarantorId) {
                $query->whereHas('guarantorToProductType', function ($query) use ($guarantorId) {
                    $query->where('guarantor_id', $guarantorId);
                });
            })->get();

        return $this->responseSuccess('Berhasil mengambil data produk', $products);
    }
}
