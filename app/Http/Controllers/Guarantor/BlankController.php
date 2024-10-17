<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Blank\StoreMultiRequest;
use App\Http\Requests\Guarantor\Blank\StoreRequest;
use App\Http\Requests\Guarantor\Blank\UpdateRequest;
use App\Http\Resources\Guarantor\BlankResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BlankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $guarantors = Guarantor::all();
        $guarantorSelected = (int) ($request->get('guarantor_id') ?? $guarantors->first()?->id);

        $blanks = Blank::search($request->get('search'))
            ->where('guarantor_id', $guarantorSelected)
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $blankResource = BlankResource::collection($blanks);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Blangko',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'blanks' => fn () => $blankResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $requestValidated = $request->validated();
        DB::beginTransaction();
        try {
            Blank::query()
                ->create($requestValidated);

            DB::commit();

            return $this->responseSuccess('Blangko berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error store blank', [$e->getMessage()]);
            DB::rollBack();

            return $this->responseError('Blangko gagal ditambahkan', [$e->getMessage()]);
        }
    }

    /**
     * Store Multi Blanks
     */
    public function storeMulti(StoreMultiRequest $request): JsonResponse
    {
        $requestValidated = $request->validated();

        DB::beginTransaction();
        try {

            $start = $requestValidated['number_start'];
            $end = $requestValidated['number_end'];

            $diff = (int) $end - (int) $start;

            for ($i = 0; $i <= $diff; $i++) {
                Blank::query()
                    ->create([
                        'guarantor_id' => $requestValidated['guarantor_id'],
                        'number' => $start + $i,
                    ]);
            }

            DB::commit();

            return $this->responseSuccess('Blangko berhasil ditambahkan', 'Blangko berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error store multi blank', [$e->getMessage()]);
            DB::rollBack();

            return $this->responseError('Blangko gagal ditambahkan', [$e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Blank $blank): JsonResponse
    {
        $requestValidated = $request->validated();
        DB::beginTransaction();
        try {
            $blank->update($requestValidated);

            DB::commit();

            return $this->responseSuccess('Blangko berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error update blank', [$e->getMessage()]);
            DB::rollBack();

            return $this->responseError('Blangko gagal diubah', [$e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blank $blank): void
    {
        DB::beginTransaction();
        try {
            $blank->delete();

            DB::commit();
        } catch (\Exception $e) {
            Log::error('Error destroy blank', [$e->getMessage()]);
            DB::rollBack();
        }
    }
}
