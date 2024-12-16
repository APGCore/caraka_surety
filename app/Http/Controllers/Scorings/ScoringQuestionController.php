<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Scoring\ScoringQuestionOptionResource;
use App\Http\Resources\Scoring\ScoringQuestionResource;
use App\Models\Scoring\Scoring;
use App\Models\Scoring\ScoringOption;
use App\Models\Scoring\ScoringQuestion;
use App\Models\Scoring\ScoringQuestionCategory;
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
        $component = $request->path().'/index';

        $selectedScoring = Scoring::query()
            ->when($request->get('scoring_id'), function ($query, $scoringId) {
                // If scoring_id is present, filter by it
                return $query->where('id', $scoringId);
            })
            ->first();

        $scoringQuestionCategoryId = $request->get('scoring_question_category_id');

        // If scoring_question_category_id is null, set $selectedScoringQuestionCategory to null or a default value
        $selectedScoringQuestionCategory = null;
        $scoringQuestion = null;

        if (! is_null($scoringQuestionCategoryId)) {
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
                ->query(function ($query) {
                    return $query->with(['category', 'category.scoring', 'options']);
                })
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
        $component = $request->path().'/index';

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
            activity()
                ->performedOn(new ScoringQuestion)
                ->causedBy(auth()->user())
                ->log('Menambahkan Pertanyaan Skoring');
            DB::commit();

            return $this->responseSuccess('Pertanyaan Skoring berhasil ditambah!');
        } catch (\Throwable $e) {

            Log::error('Scoring Question Store: '.json_encode($e->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return $this->responseError('Pertanyaan Skoring gagal ditambahkan', [$e->getMessage()]);
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
        $component = 'admin/scoring-management/scoring-question/edit/index';

        // Eager load the related category
        $scoringQuestion->load('category.scoring');

        // Extract necessary fields directly
        $category = $scoringQuestion->category; // Store the category in a variable to avoid repeated calls
        $scoring = $category ? $category->scoring : null; // Get the scoring directly

        $simplifiedData = [
            'id' => $scoringQuestion->id,
            'name' => $scoringQuestion->name,
            'category_id' => $category->id ?? null, // Get only the category ID
            'scoring_id' => $scoring->id ?? null, // Get only the scoring ID
            'count_options' => $scoringQuestion->options()->count(),
            'created_at' => $scoringQuestion->created_at->translatedFormat('d F Y'),
        ];

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Pertanyaan Skoring',
            ],

            'scoringQuestion' => fn () => $simplifiedData,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScoringQuestion $scoringQuestion)
    {
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

            if ($scoringQuestion->exists) {
                $scoringQuestion->update($request->only('name', 'scoring_question_category_id'));
                activity()
                    ->performedOn($scoringQuestion)
                    ->causedBy(auth()->user())
                    ->log('Mengubah Pertanyaan Skoring');
                DB::commit();

                return $this->responseSuccess('Pertanyaan Skoring berhasil diedit!');
            } else {
                throw new ThrottleRequestsException('Pertanyaan Skoring tidak ditemukan!');
            }
        } catch (\Throwable $e) {

            Log::error('Scoring Question Edit: '.json_encode($e->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return $this->responseError('Pertanyaan Skoring gagal diedit!', [$e->getMessage()]);
        }
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
                activity()
                    ->performedOn($scoringQuestion)
                    ->causedBy(auth()->user())
                    ->log('Menghapus Pertanyaan Skoring');
                flashMessage('Pertanyaan Skoring Dihapus', 'Pertanyaan Skoring berhasil dihapus');
                DB::commit();
            } else {
                throw new ThrottleRequestsException('Pertanyaan Skoring tidak ditemukan');
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Pertanyaan Skoring', 'Terjadi kesalahan saat menghapus Pertanyaan Skoring', 'error');
            Log::error('Scoring Question Delete: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    public function showEditScoringOption(Request $request, ScoringQuestion $scoringQuestion)
    {

        $component = 'admin/scoring-management/scoring-question/edit-option/index';

        $scoringOptions = ScoringOption::search($request->get('search'))
            ->where('scoring_question_id', $scoringQuestion->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $scoringQuestionOptionResource = ScoringQuestionOptionResource::collection($scoringOptions);

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Pilihan Pertanyaan '.$scoringQuestion->name,
            ],
            'scoringOptions' => fn () => $scoringQuestionOptionResource,
            'selectedScoringQuestion' => fn () => $scoringQuestion,
        ]);
    }

    public function showUpdateScoringOption(Request $request, ScoringQuestion $scoringQuestion, ScoringOption $scoringOption)
    {

        $component = 'admin/scoring-management/scoring-question/edit-option/edit-option-update/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Pilihan Pertanyaan '.$scoringQuestion->name,
            ],

            'scoringOption' => fn () => $scoringOption,
            'selectedScoringQuestion' => fn () => $scoringQuestion,
        ]);
    }

    public function updateScoringOption(Request $request, ScoringQuestion $scoringQuestion, ScoringOption $scoringOption)
    {
        $request->validate([
            'name' => 'required|string',
            'point' => 'required|integer',
        ], [
            'name.required' => 'Nama Pilihan wajib diisi',
            'name.string' => 'Nama Pilihan harus berupa string',
            'point.required' => 'Poin Pilihan wajib diisi',
        ]);

        try {
            DB::beginTransaction();

            if ($scoringOption->exists) {
                $scoringOption->update($request->only('name', 'point'));
                activity()
                    ->performedOn($scoringOption)
                    ->causedBy(auth()->user())
                    ->log('Mengubah Pilihan Pertanyaan');
                flashMessage('Pilihan Pertanyaan Diperbarui', 'Pilihan Pertanyaan berhasil diperbarui');
                DB::commit();

                return redirect()->route('scoring-question.edit-options', [
                    'scoringQuestion' => $scoringQuestion->id,
                ]);
            } else {
                throw new ThrottleRequestsException('Pilihan Pertanyaan tidak ditemukan');
            }
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Pilihan Pertanyaan', 'Terjadi kesalahan saat memperbarui pilihan pertanyaan', 'error');
            Log::error('Scoring Question Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    public function storeScoringOption(Request $request, ScoringQuestion $scoringQuestion)
    {
        $request->validate([
            'name' => 'required|string',
            'point' => 'required|integer',
            'scoring_question_id' => 'required|integer',
        ], [
            'name.required' => 'Nama Pilihan wajib diisi',
            'name.string' => 'Nama Pilihan harus berupa string',
            'point.required' => 'Poin Pilihan wajib diisi',
            'scoring_question_id.required' => 'Scoring Id wajib diisi',
        ]);

        try {
            DB::beginTransaction();

            // Create Scoring Question Category
            ScoringOption::query()
                ->create($request->only('name', 'point', 'scoring_question_id'));
            activity()
                ->performedOn(new ScoringOption)
                ->causedBy(auth()->user())
                ->log('Menambahkan Pilihan Pertanyaan');
            flashMessage('Pilihan Pertanyaan Ditambahkan', 'Pilihan Pertanyaan berhasil ditambahkan');
            DB::commit();

            return redirect()->route('scoring-question.edit-options', [
                'scoringQuestion' => $scoringQuestion->id,
            ]);
        } catch (\Throwable $th) {
            flashMessage('Gagal Memperbarui Pilihan Pertanyaan', 'Terjadi kesalahan saat memperbarui pilihan pertanyaan', 'error');
            Log::error('Scoring Question Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            DB::rollBack();

            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    public function showStoreScoringOption(Request $request, ScoringQuestion $scoringQuestion)
    {

        $component = 'admin/scoring-management/scoring-question/edit-option/create/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Pilihan Pertanyaan '.$scoringQuestion->name,
            ],
            'selectedScoringQuestion' => fn () => $scoringQuestion,
        ]);
    }
}
