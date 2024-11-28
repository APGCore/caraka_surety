<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document\DocumentFormat;
use App\Models\Guarantor\Guarantor;
use Illuminate\Http\Request;

class DocumentFormatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::query()->select('id', 'name')
            ->get();
        $guarantorSelected = (int) ($request->get('guarantor_id') ?? $guarantors->first()?->id);
        $guarantor = $guarantors->find($guarantorSelected)->load(['guarantorToProductTypes', 'guarantorToProductTypes.product']);
        $guarantorProducts = $guarantor->guarantorToProductTypes->pluck('product')->unique()->values();
        $guarantorProductSelected = (int) ($request->get('guarantor_product_id') ?? collect($guarantorProducts)->first()?->id);
        $guarantorProductTypes = $guarantor->guarantorToProductTypes->where('product_id', $guarantorProductSelected)->values();
        $guarantorProductTypeSelected = (int) ($request->get('guarantor_product_type_id') ?? collect($guarantorProductTypes)->first()?->id);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Format Dokumen',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'guarantorProducts' => $guarantorProducts,
            'guarantorProductSelected' => $guarantorProductSelected,
            'guarantorProductTypes' => $guarantorProductTypes,
            'guarantorProductTypeSelected' => $guarantorProductTypeSelected,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(DocumentFormat $principalDocumentFormating)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentFormat $principalDocumentFormating)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentFormat $principalDocumentFormating)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentFormat $principalDocumentFormating)
    {
        //
    }
}
