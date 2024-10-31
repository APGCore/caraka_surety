<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product\Product;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //

        $products = Product::search($request->get('search'))
            ->orderBy('created_at', 'desc')
            ->paginate((int) $request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $productResource = ProductResource::collection($products);

        $component = $request->path().'/index';

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

            flashMessage('Produk Ditambahkan', 'Produk berhasil ditambahkan');

            DB::commit();

            return redirect()->route('products.index');
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Produk', 'Terjadi kesalahan saat menambahkan produk', 'error');
            Log::error('Produk Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return redirect()->back()->with('error', $th->getMessage());
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

            DB::commit();
            flashMessage('Produk Diperbarui', 'Produk berhasil diperbarui');
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Produk', 'Terjadi kesalahan saat memperbarui Produk', 'error');
            Log::error('Produk Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
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

            DB::commit();
            flashMessage('Produk Dihapus', 'Produk berhasil dihapus');
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Produk', 'Terjadi kesalahan saat menghapus Produk', 'error');
            Log::error('Produk Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    public function getAllProducts()
    {
        $products = Product::all();

        return $this->responseSuccess('Berhasil mengambil data produk', $products);
    }
}
