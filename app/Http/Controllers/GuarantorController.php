<?php

namespace App\Http\Controllers;

use App\Http\Requests\Guarantor\StoreRequest;
use App\Http\Requests\Guarantor\UpdateRequest;
use App\Http\Resources\Guarantor\GuarantorResource;
use App\Models\Guarantor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuarantorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::search($request->get('search'))
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = GuarantorResource::collection($guarantors);
        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Data Penjamin',
            ],
            'guarantors' => fn () => $resource,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        $component = request()->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Penjamin',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            Guarantor::query()
                ->create($request->validated());

            flashMessage('Berhasil', 'Penambahan data penjamin berhasil');
            DB::commit();

            return redirect()->route('guarantor.index');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data penjamin gagal', 'error');
            Log::error('GuarantorController@store: ', ['message' => $e->getMessage()]);

            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guarantor $guarantor)
    {
        $component = str_replace('/'.$guarantor->getAttribute('id'), '', request()->path()).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Penjamin',
            ],
            'guarantor' => fn () => $guarantor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Guarantor $guarantor)
    {
        try {
            DB::beginTransaction();
            $guarantor->update($request->validated());

            flashMessage('Berhasil', 'Perubahan data penjamin berhasil');
            DB::commit();

            return redirect()->route('guarantor.index');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data penjamin gagal', 'error');
            Log::error('GuarantorController@update: ', ['message' => $e->getMessage()]);

            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guarantor $guarantor)
    {
        try {
            DB::beginTransaction();
            $guarantor->delete();

            flashMessage('Berhasil', 'Data penjamin berhasil dihapus');
            DB::commit();

            return redirect()->route('guarantor.index');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Data penjamin gagal dihapus', 'error');
            Log::error('GuarantorController@destroy: ', ['message' => $e->getMessage()]);

            return back()->withErrors($e->getMessage());
        }
    }
}
