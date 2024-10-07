<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\ProductType;
use App\Models\RequiredDoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DocumentRequiredController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requiredDocs = RequiredDoc::with('productType')->get();

        return inertia('admin/documents/general/index', [
            'reqDocs' => $requiredDocs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $productTypes = ProductType::all();

        return inertia('admin/documents/general/create/index', [
            'productTypes' => $productTypes,
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
            'product_type_id' => 'nullable|exists:product_types,id',
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
    public function show(RequiredDoc $requiredDoc)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RequiredDoc $requiredDoc)
    {
        $component = 'admin/documents/general/edit/index';

        $requiredDoc->load('productType');
        $productTypes = ProductType::all();

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Dokumen Required',
            ],
            'reqDoc' => $requiredDoc,
            'productType' => $productTypes ?? null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RequiredDoc $requiredDoc)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'product_type_id' => 'nullable|exists:product_types,id',
        ]);

        $requiredDoc->update([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'product_type_id' => $validatedData['product_type_id'],
        ]);

        flashMessage('Data Required Dokumen', 'Produk berhasil diperbarui !');

        return redirect()->route('document.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RequiredDoc $requiredDoc)
    {
        try {
            DB::beginTransaction();
            $requiredDoc->delete();

            DB::commit();
            flashMessage('Required Dokumen', 'Required Dokumen berhasil dihapus');
            Log::info('Produk Delete: '.json_encode($requiredDoc, JSON_PRETTY_PRINT));
            Log::info('Produk Delete: '.json_encode($requiredDoc, JSON_PRETTY_PRINT));
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Required Document', 'Terjadi kesalahan saat menghapus document required', 'error');
            Log::error('Produk Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            Log::error('Produk Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }
}
