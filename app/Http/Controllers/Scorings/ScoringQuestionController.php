<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Scoring\ScoringQuestionResource;
use App\Models\Scoring;
use App\Models\ScoringOption;
use App\Models\ScoringQuestion;
use App\Models\ScoringQuestionCategory;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScoringQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $component = $request->path() . '/index';

        $selectedScoring = Scoring::query()
            ->when($request->get("scoring_id"), function ($query, $scoringId) {
                // If scoring_id is present, filter by it
                return $query->where('id', $scoringId);
            })
            ->first();

        $scoringQuestionCategoryId = $request->get("scoring_question_category_id");

        // If scoring_question_category_id is null, set $selectedScoringQuestionCategory to null or a default value
        $selectedScoringQuestionCategory = null;
        $scoringQuestion = null;

        if (!is_null($scoringQuestionCategoryId)) {
            $selectedScoringQuestionCategory = ScoringQuestionCategory::query()
                ->where('id', $scoringQuestionCategoryId)
                ->first();
        }

        // If no scoring question category is selected, return an empty paginated result
        if (is_null($selectedScoringQuestionCategory)) {
            $scoringQuestion = collect(); // Return an empty collection for pagination
        } else {
            // Continue with the query only if a valid category is selected
            $scoringQuestion = ScoringQuestion::search($request->get('search'))
                ->where('scoring_question_category_id', $selectedScoringQuestionCategory->id)
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page') ?? 10)
                ->appends('query', null)
                ->appends($request->all());
        }

        // Use an empty resource collection if no questions are found
        $scoringQuestionResource = ScoringQuestionResource::collection($scoringQuestion);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Pertanyaan Skoring',
            ],
            'scoringQuestions' => $scoringQuestionResource,
            'initialSelectedScoring' => $selectedScoring,
            'initialSelectedScoringQuestionCategory' => $selectedScoringQuestionCategory,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $component = $request->path() . '/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Pertanyaan Skoring',
            ],

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string',
            'scoring_question_category_id' => 'required|integer',
        ], [
            'name.required' => 'Nama Skoring wajib diisi',
            'name.string' => 'Nama Skoring harus berupa string',
            'scoring_question_category_id.required' => 'Id Scoring wajib diisi',
        ]);

        try {
            DB::beginTransaction();

            // Create Scoring Question Category
            ScoringQuestion::query()
                ->create($request->only('name', 'scoring_question_category_id'));

            flashMessage('Pertanyaan Skoring Ditambahkan', 'Pertanyaan Skoring berhasil ditambahkan');

            DB::commit();

            return redirect()->route('scoring-question.index');
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Pertanyaan Skoring', 'Terjadi kesalahan saat menambahkan pertanyaan skoring', 'error');
            Log::error('Scoring Question Store: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();
            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ScoringQuestion $scoringQuestion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScoringQuestion $scoringQuestion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScoringQuestion $scoringQuestion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScoringQuestion $scoringQuestion)
    {
        //
        try {
            DB::beginTransaction();

            if ($scoringQuestion->exists) {
                $scoringQuestion->delete();
                DB::commit();
                flashMessage('Pertanyaan Skoring Dihapus', 'Pertanyaan Skoring berhasil dihapus');
            } else {
                throw new ThrottleRequestsException('Pertanyaan Skoring tidak ditemukan');
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Pertanyaan Skoring', 'Terjadi kesalahan saat menghapus Pertanyaan Skoring', 'error');
            Log::error('Scoring Question Delete: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }
}
