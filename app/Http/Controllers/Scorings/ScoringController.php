<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Scoring\ScoringResource;
use App\Models\Scoring\Scoring;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScoringController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $component = $request->path() . '/index';

        $scorings = Scoring::search($request->get('search'))
            ->orderBy('created_at', 'desc')
            ->paginate((int) $request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $scoringResource = ScoringResource::collection($scorings);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Skoring',
            ],
            'scorings' => fn() => $scoringResource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $component = $request->path() . '/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Skoring',
            ],

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'min_point' => 'required|integer',
        ], [
            'name.required' => 'Nama Skoring wajib diisi',
            'name.string' => 'Nama Skoring harus berupa string',
            'min_point.required' => 'Poin minimal wajib diisi',
            'min_point.integer' => 'Poin minimal harus berupa angka',
        ]);

        try {
            DB::beginTransaction();

            // Create Scoring
            Scoring::query()
                ->create($request->only('name', 'min_point'));

            DB::commit();

            return $this->responseSuccess('Skoring berhasil ditambahkan');
        } catch (\Throwable $e) {
            Log::error('Scoring Store: ' . json_encode($e->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return $this->responseError('Skoring gagal ditambahkan', [$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Scoring $scoring)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Scoring $scoring)
    {
        //
        $component = 'admin/scoring-management/scoring/edit/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Skoring',
            ],

            'scoring' => fn() => $scoring,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Scoring $scoring)
    {
        //
        $request->validate([
            'name' => 'required|string',
            'min_point' => 'required|integer',
        ], [
            'name.required' => 'Nama Skoring wajib diisi',
            'name.string' => 'Nama Skoring harus berupa string',
            'min_point.required' => 'Poin minimal wajib diisi',
            'min_point.integer' => 'Poin minimal harus berupa angka',
        ]);

        try {
            DB::beginTransaction();

            if ($scoring->exists) {
                $scoring->update($request->only('name', 'min_point'));

                DB::commit();

                return $this->responseSuccess('Skoring berhasil diedit!');
            } else {
                throw new ThrottleRequestsException('Skoring tidak ditemukan');
            }
        } catch (\Throwable $th) {

            Log::error('Scoring Update: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();



            return $this->responseSuccess('Skoring gagal diedit');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Scoring $scoring)
    {
        //
        try {
            DB::beginTransaction();

            if ($scoring->exists) {
                $scoring->delete();
                DB::commit();
                flashMessage('Skoring Dihapus', 'Skoring berhasil dihapus');
            } else {
                throw new ThrottleRequestsException('Skoring tidak ditemukan');
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Skoring', 'Terjadi kesalahan saat menghapus Skoring', 'error');
            Log::error('Scoring Delete: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    public function getAllScoring()
    {
        $scorings = Scoring::query()->get();

        return response()->json($scorings);
    }
}
