<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
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
        $component = $request->path() . '/index';

        $products = Product::search($request->get('search'))
            ->paginate(perPage: $request->perpage ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $productResource = ProductResource::collection($products);


        return inertia($component, [
            'page_settings' => [
                'title' => 'Produk',
            ],
            'products' => fn() => $productResource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $component = $request->path() . '/index';

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
        ], [
            'name.required' => 'Nama Produk wajib diisi',
            'name.string' => 'Nama Produk harus berupa string',
            'description.required' => 'Deskripsi Produk wajib diisi',
            'description.string' => 'Deskripsi Produk harus berupa string',
        ]);

        try {
            DB::beginTransaction();
            $product = Product::query()
                ->create($request->only('name', 'description'));
            flashMessage('Produk Ditambahkan', 'Produk berhasil ditambahkan');
            Log::info('Product Store: ' . json_encode($product, JSON_PRETTY_PRINT));
            DB::commit();
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Produk', 'Terjadi kesalahan saat menambahkan produk', 'error');
            Log::error('Produk Store: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();
        } finally {
            return redirect()->route('products.index');
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

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Produk',
            ],
            "product" => $product,

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
        ]);

        try {
            DB::beginTransaction();
            $product->update($request->only('name', 'description'));
            DB::commit();
            flashMessage('Produk Diperbarui', 'Produk berhasil diperbarui');
            Log::info('Produk Update: ' . json_encode($product, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Produk', 'Terjadi kesalahan saat memperbarui Produk', 'error');
            Log::error('Produk Update: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));
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
            $product->delete();

            DB::commit();
            flashMessage('Produk Dihapus', 'Produk berhasil dihapus');
            Log::info('Produk Delete: ' . json_encode($product, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Produk', 'Terjadi kesalahan saat menghapus Produk', 'error');
            Log::error('Produk Delete: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }
}
