<?php

namespace App\Http\Controllers\Document;

use App\Models\DocumentRequired;
use App\Models\ProductType;
use App\Http\Controllers\Controller;
use App\Models\RequiredDoc;
use Illuminate\Http\Request;

class DocumentRequiredController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requiredDocs = RequiredDoc::all();
        return inertia('admin/documents/general/index', [
            'reqDocs' => $requiredDocs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $productTypes = ProductType::all();
        return inertia('admin/documents/general/create/index', [
            'productTypes' => $productTypes
        ]);
     }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'product_type_id' => 'required|integer|exists:product_types,id',
        ]);

        RequiredDoc::create([
            'name' => $request->name,
            'description' => $request->description,
            'product_type_id' => $request->product_type_id,
        ]);

        flashMessage('Data Required Dokumen', 'Produk berhasil ditambahkan !');
        return redirect()->route('document.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentRequired $documentRequired)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentRequired $documentRequired)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentRequired $documentRequired)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentRequired $documentRequired)
    {
        //
    }
}
