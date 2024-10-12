<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Scoring\ScoringQuestionResource;
use App\Models\Scoring;
use App\Models\ScoringOption;
use App\Models\ScoringQuestion;
use App\Models\ScoringQuestionCategory;
use Illuminate\Http\Request;

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
    }
}
