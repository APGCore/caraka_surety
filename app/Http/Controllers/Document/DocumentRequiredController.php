<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document\RequiredDoc;
use App\Models\Product\ProductType;
use App\Models\RelatedParties\Principal;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DocumentRequiredController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $requiredDocs = RequiredDoc::with('productType')
            ->when($request->exists('search'), function ($query) use ($request) {
                return $query->whereLike('name', '%'.$request->search.'%');
            })
            ->when($request->exists('per_page'), function ($query) use ($request) {
                return $query->limit($request->per_page);
            }, function ($query) {
                return $query->limit(10);
            })
            ->get();

        return inertia('admin/documents/general/index', [
            'page_settings' => [
                'title' => 'Dokumen Perusahaan',
            ],
            'reqDocs' => $requiredDocs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'product_type_id' => 'nullable|exists:product_types,id',
            'is_required' => 'nullable|boolean',
        ]);

        RequiredDoc::create([
            'name' => $request->name,
            'description' => $request->description,
            'product_type_id' => $request->product_type_id,
            'is_required' => $request->boolean('is_required'),
        ]);

        flashMessage('Data Dokumen Perusahaan', 'Produk berhasil ditambahkan !');
        activity()
            ->useLog('dokumen-required')
            ->performedOn(new RequiredDoc)
            ->causedBy(auth()->user())
            ->log('Menambahkan data Dokumen Perusahaan');

        return redirect()->route('document.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $productTypes = ProductType::all();

        return inertia('admin/documents/general/create/index', [
            'page_settings' => [
                'title' => 'Tambah Dokumen Perusahaan',
            ],
            'productTypes' => $productTypes,
        ]);
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
                'title' => 'Edit Dokumen Perusahaan',
            ],
            'reqDoc' => $requiredDoc,
            'productType' => $productTypes ?? null,
        ]);
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
            flashMessage('Dokumen Perusahaan', 'Dokumen Perusahaan berhasil dihapus');
            activity()
                ->useLog('dokumen-required')
                ->performedOn($requiredDoc)
                ->causedBy(auth()->user())
                ->log('Menghapus data Dokumen Perusahaan');
            Log::info('Produk Delete: '.json_encode($requiredDoc, JSON_PRETTY_PRINT));
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Required Document', 'Terjadi kesalahan saat menghapus document required', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Produk Delete: ', $error);
        } finally {
            return redirect()->back();
        }
    }

    public function getByPrincipal(Principal $principal)
    {
        $requiredDocs = RequiredDoc::with('productType')->get();

        return inertia('admin/documents/principal/index', [
            'page_settings' => [
                'title' => 'Dokumen Perusahaan Berdasarkan Principal',
            ],
            'reqDocs' => $requiredDocs,
            'principal' => $principal,
        ]);
    }

    public function getFile()
    {
        $response = Http::withHeaders([
            'token' => '03f7b0b2fbf076fec3f55b8d19615316',
        ])->get('http://bprbonding.my.id/api/file', ['path' => 'principal/4-CV_RAFANDRA_PERDANA/documents/1742356147_Laporan_Keuangan_2023.pdf']);

        // get file from response
        $raw = $response->body();
        // save to storage and delete after download
        $directory = storage_path('app/public/temporary/');

        // Cek apakah folder sudah ada, jika belum buat dulu
        if (! file_exists($directory)) {
            mkdir($directory, 0777, true);
        }

        // Simpan file
        $path = $directory.'1742356147_Laporan_Keuangan_2023.pdf';
        file_put_contents($path, $raw);

        return response()->download($path);
    }

    public function updateNo(Request $request, RequiredDoc $requiredDoc): JsonResponse
    {
        $request->validate([
            'no' => 'required|integer|min:1|unique:required_docs,no,'.$requiredDoc->getAttribute('id'),
        ]);

        try {
            DB::beginTransaction();
            $requiredDoc->update([
                'no' => $request->get('no'),
            ]);
            activity()
                ->useLog('dokumen-required')
                ->performedOn($requiredDoc)
                ->causedBy(auth()->user())
                ->log('Mengubah nomor Dokumen Perusahaan');
            DB::commit();

            return $this->responseSuccess("Berhasil mengubah nomor urut dokumen {$requiredDoc->name}");
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Dokumen Perusahaan Update No: ', $error);

            return $this->responseError('Gagal mengubah nomor dokumen', 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RequiredDoc $requiredDoc)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'product_type_id' => 'nullable|exists:product_types,id',
            'is_required' => 'nullable|boolean',
        ]);

        $requiredDoc->update([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'product_type_id' => $validatedData['product_type_id'],
            'is_required' => $request->boolean('is_required'),
        ]);

        flashMessage('Data Dokumen Perusahaan', 'Produk berhasil diperbarui !');
        activity()
            ->useLog('dokumen-required')
            ->performedOn($requiredDoc)
            ->causedBy(auth()->user())
            ->log('Mengubah data Dokumen Perusahaan');

        return redirect()->route('document.index');
    }
}
