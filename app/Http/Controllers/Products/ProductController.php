<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //


        $products = Product::search($request->get('search'))
            ->paginate($request->perpage ?? 10)
            ->appends('query', null)
            ->withQueryString();

        $productResource = ProductResource::collection($products);


        $component = $request->path() . '/index';
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
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
