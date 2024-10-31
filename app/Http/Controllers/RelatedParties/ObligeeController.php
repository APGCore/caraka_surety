<?php

namespace App\Http\Controllers\RelatedParties;

use App\Http\Controllers\Controller;
use App\Http\Requests\Obligee\StoreRequest;
use App\Http\Requests\Obligee\UpdateRequest;
use App\Http\Resources\Obligee\ObligeeResource;
use App\Models\RelatedParties\Obligee;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class ObligeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $obligee = Obligee::search($request->get('search'))
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $obligeeResource = ObligeeResource::collection($obligee);

        $component = $request->path() . '/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Obligee',
            ],
            'obligees' => fn() => $obligeeResource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {

        $obligees = Obligee::all();

        $component = $request->path() . '/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Data Obligee',
            ],
            'obligees' => $obligees,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $requestValid = $request->validated();
            if ($request->hasFile('upload_picture')) {
                $fileName = str_replace(' ', '_', $requestValid['name']);
                $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'obligees', $fileName);
            }

            Obligee::query()
                ->create($requestValid);

            flashMessage('Berhasil', 'Penambahan data obligee berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data obligee gagal', 'error');
            Log::error('ObligeeController@store: ', ['message' => $e->getMessage()]);
        } finally {
            return redirect()->route('obligee.index');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Obligee $obligee)
    {
        $obligee = Obligee::with('province', 'regency', 'district')->findOrFail($obligee->id);

        return inertia('admin/obligee-management/obligee/detail/index', [
            'page_settings' => [
                'title' => 'Detail Obligee',
            ],
            'obligee' => $obligee,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Obligee $obligee, Request $request)
    {
        $component = $request->path();
        $component = substr($component, 0, strrpos($component, '/')) . '/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Obligee',
            ],
            'obligee' => $obligee,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Obligee $obligee)
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            if ($request->hasFile('upload_picture')) {
                $picture = $obligee->getAttribute('picture') ?? '';
                $this->deleteFile($picture);

                $fileName = str_replace(' ', '_', $requestValid['name']);
                $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'obligees', $fileName);
            }
            $obligee->update($requestValid);

            flashMessage('Berhasil', 'Perubahan data obligee berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data obligee gagal', 'error');
            Log::error('ObligeeController@update: ', ['message' => $e->getMessage()]);
        } finally {
            return redirect()->route('obligee.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obligee $obligee)
    {
        try {
            DB::beginTransaction();

            if ($obligee->exists) {
                $picture = $obligee->getAttribute('picture') ?? '';
                $this->deleteFile($picture);
                $obligee->delete();
            } else {
                throw new ThrottleRequestsException('Data Obligee tidak ditemukan');
            }

            flashMessage('Data Obligee Dihapus', 'Data Obligee dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
            Log::error('Profil Destroy: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    public function getObligee(Request $request)
    {
        $obligee = Obligee::query()
            ->get();


        return $this->responseSuccess("Sukses get All Obligee", $obligee);
    }
}
