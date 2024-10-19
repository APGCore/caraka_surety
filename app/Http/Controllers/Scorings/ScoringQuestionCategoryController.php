<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Scoring\ScoringQuestionCategoryResource;
use App\Models\Scoring\Scoring;
use App\Models\Scoring\ScoringQuestionCategory;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScoringQuestionCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $component = $request->path().'/index';

        $selectedScoring = Scoring::query()
            ->when($request->get('scoring_id'), function ($query, $scoringId) {
                // If scoring_id is present, filter by it
                return $query->where('id', $scoringId);
            })
            ->first();

        $scoringQuestionCategories = ScoringQuestionCategory::search($request->get('search'))
            ->where('scoring_id', $selectedScoring->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $scoringQuestionCategoriesResource = ScoringQuestionCategoryResource::collection($scoringQuestionCategories);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Kategori Pertanyaan Skoring',
            ],
            'scoringQuestionCategories' => fn () => $scoringQuestionCategoriesResource,
            'initialSelectedScoring' => fn () => $selectedScoring,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Kategori Pertanyaan Skoring',
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
            'max_point' => 'required|integer',
            'scoring_id' => 'required|integer',
        ], [
            'name.required' => 'Nama Skoring wajib diisi',
            'name.string' => 'Nama Skoring harus berupa string',
            'max_point.required' => 'Poin maksimal wajib diisi',
            'max_point.integer' => 'Poin maksimal harus berupa angka',
            'scoring_id.required' => 'Id Scoring wajib diisi',
        ]);

        try {
            DB::beginTransaction();

            // Create Scoring Question Category
            ScoringQuestionCategory::query()
                ->create($request->only('name', 'max_point', 'scoring_id'));

            DB::commit();

            return $this->responseSuccess('Kategori Pertanyaan Skoring berhasil ditambahkan!');
        } catch (\Throwable $e) {
            Log::error('Scoring Question Category Store: '.json_encode($e->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return $this->responseError('Kategori Pertanyaan Skoring gagal ditambahkan', [$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ScoringQuestionCategory $scoringQuestionCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScoringQuestionCategory $scoringQuestionCategory)
    {
        $component = 'admin/scoring-management/scoring-question-category/edit/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Kategori Pertanyaan Skoring',
            ],

            'scoringQuestionCategory' => fn () => $scoringQuestionCategory,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScoringQuestionCategory $scoringQuestionCategory)
    {
        $request->validate([
            'name' => 'required|string',
            'max_point' => 'required|integer',
            'scoring_id' => 'required|integer',
        ], [
            'name.required' => 'Nama Skoring wajib diisi',
            'name.string' => 'Nama Skoring harus berupa string',
            'max_point.required' => 'Poin maksimal wajib diisi',
            'max_point.integer' => 'Poin maksimal harus berupa angka',
            'scoring_id.required' => 'Id Scoring wajib diisi',
        ]);

        try {
            DB::beginTransaction();

            if ($scoringQuestionCategory->exists) {
                $scoringQuestionCategory->update($request->only('name', 'max_point', 'scoring_id'));

                DB::commit();

                return $this->responseSuccess('Kategori Pertanyaan Skoring berhasil ditambahkan!');
            } else {
                throw new ThrottleRequestsException('Kategori Pertanyaan Skoring tidak ditemukan');
            }
        } catch (\Throwable $e) {

            Log::error('Scoring Question Category Update: '.json_encode($e->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return $this->responseError('Kategori Pertanyaan Skoring gagal ditambahkan', [$e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScoringQuestionCategory $scoringQuestionCategory)
    {
        //
        try {
            DB::beginTransaction();

            if ($scoringQuestionCategory->exists) {
                $scoringQuestionCategory->delete();
                DB::commit();
                flashMessage('Kategori Pertanyaan Skoring Dihapus', 'Kategori Pertanyaan Skoring berhasil dihapus');
            } else {
                throw new ThrottleRequestsException('Kategori Pertanyaan Skoring tidak ditemukan');
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kategori Pertanyaan Skoring', 'Terjadi kesalahan saat menghapus Kategori Pertanyaan Skoring', 'error');
            Log::error('Scoring Question Category Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    public function getAllScoringQuestionCategory()
    {
        $scoringQuestionsCategories = ScoringQuestionCategory::query()->get();

        return response()->json($scoringQuestionsCategories);
    }

    public function getByScoring($scoringId)
    {
        $scoringQuestionCategories = ScoringQuestionCategory::query()
            ->whereHas('scoring', function ($query) use ($scoringId) {
                $query->where('scoring_id', $scoringId);
            })
            ->get();

        return response()->json($scoringQuestionCategories);
    }
}
