<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Scoring\ScoringQuestionCategoryResource;
use App\Models\Scoring;
use App\Models\ScoringQuestionCategory;
use Illuminate\Http\Request;

class ScoringQuestionCategoryController extends Controller
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
            'scoringQuestionCategories' => fn() => $scoringQuestionCategoriesResource,
            'initialSelectedScoring' => fn() => $selectedScoring,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ScoringQuestionCategory $scoringCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScoringQuestionCategory $scoringCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScoringQuestionCategory $scoringCategory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScoringQuestionCategory $scoringCategory)
    {
        //
    }
}
