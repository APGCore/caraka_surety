<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Product\StoreRequest;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product;
use Illuminate\Http\Request;

class GuarantorToProductTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guarantors = Guarantor::all();
        $products = Product::all();

        $component = request()->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Data Produk Penjamin',
            ],
            'guarantors' => $guarantors,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $requestValid = $request->validated();
        try {

            $guarantorToProductType = GuarantorToProductType::query()
                ->create($requestValid);

            return response()->json([
                'message' => 'Data produk penjamin berhasil disimpan',
                'data' => $guarantorToProductType,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data produk penjamin gagal disimpan',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(GuarantorToProductType $guarantorToProductType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GuarantorToProductType $guarantorToProductType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GuarantorToProductType $guarantorToProductType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GuarantorToProductType $guarantorToProductType)
    {
        //
    }
}
