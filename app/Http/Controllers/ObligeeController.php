<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Location\DistrictController;
use App\Http\Controllers\Location\RegencyController;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Obligee;
use Illuminate\Http\Request;
use Inertia\Response;

class ObligeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $obligees = Obligee::all();

        return inertia('admin/obligee-management/index', [
            'obligees' => $obligees,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {

        $obligees = Obligee::all();
        $provinces = Province::query()
            ->get();

        $regencies = collect();
        if ($request->get('province_id')) {
            $regencies = Regency::query()
                ->where('province_id', $request->get('province_id'))
                ->get();
            if ($regencies->count() == 0) {
                $province = $provinces->where('id', $request->get('province_id'))->first();
                $regencyController = new RegencyController;
                $regencyController->synchronize($request->merge(['code' => $province->code]));

                $regencies = Regency::query()
                    ->where('province_id', $request->get('province_id'))
                    ->get();
            }
        }

        $districts = collect();
        if ($request->get('regency_id')) {
            $districts = District::query()
                ->where('regency_id', $request->get('regency_id'))
                ->get();
            if ($districts->count() == 0 && $request->get('district_id') == null) {
                $regency = $regencies->where('id', $request->get('regency_id'))->first();
                $districtController = new DistrictController;
                $districtController->synchronize($request->merge(['code' => $regency->code]));

                $districts = District::query()
                    ->where('regency_id', $request->get('regency_id'))
                    ->get();
            }
        }

        return inertia('admin/obligee-management/create/index', [
            'obligees' => $obligees,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,

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
    public function show(Obligee $obligee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Obligee $obligee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obligee $obligee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obligee $obligee)
    {
        //
    }
}
