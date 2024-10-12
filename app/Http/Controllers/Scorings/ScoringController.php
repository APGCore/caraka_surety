<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Http\Resources\Scoring\ScoringResource;
use App\Models\Scoring;
use Illuminate\Http\Request;

class ScoringController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $component = $request->path() . '/index';

        $scorings = Scoring::search($request->get('search'))
            ->orderBy('created_at', 'desc')
            ->paginate((int)$request->get('per_page') ?? 10)
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
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Scoring $scoring)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Scoring $scoring)
    {
        //
    }
}
