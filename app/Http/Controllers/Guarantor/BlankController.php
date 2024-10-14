<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guarantor\BlankResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use Illuminate\Http\Request;

class BlankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::all();
        $guarantorSelected = (int) ($request->get('guarantor_id') ?? $guarantors->first()->id);

        $blanks = Blank::search($request->get('search'))
            ->where('guarantor_id', $guarantorSelected)
            ->orderBy('number')
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
    public function show(Blank $blank)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blank $blank)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blank $blank)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blank $blank)
    {
        //
    }
}
