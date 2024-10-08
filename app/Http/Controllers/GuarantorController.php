<?php

namespace App\Http\Controllers;

use App\Models\Guarantor;
use Illuminate\Http\Request;

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

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Data Penjamin',
            ],
            'guarantors' => fn () => $guarantors,
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Guarantor $guarantor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guarantor $guarantor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Guarantor $guarantor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guarantor $guarantor)
    {
        //
    }
}
