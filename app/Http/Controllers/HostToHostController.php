<?php

namespace App\Http\Controllers;

use App\Http\Resources\HostToHostResource;
use App\Models\Guarantor\Guarantor;
use App\Models\HostToHost;
use Illuminate\Http\Request;

class HostToHostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $hostToHost = HostToHost::search($request->get('search'))
            ->query(function ($query) {
                return $query
                    ->with([
                        'guarantor',
                    ]);
            })
            ->orderBy('guarantor_name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = HostToHostResource::collection($hostToHost);
        $component = 'admin/host-to-host-management/host-to-host/list/index';
        $inertiaProps = [
            'page_settings' => [
                'title' => 'Host To Host',
            ],

            'hostToHosts' => fn() => $resource,
        ];

        return inertia($component, $inertiaProps);
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
        $request = $request->validate([
            'guarantor_id' => 'required',
            'guarantor_name' => 'required',
            'guarantor_url_host' => 'required',
            'token' => 'nullable',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(HostToHost $hostToHost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HostToHost $hostToHost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HostToHost $hostToHost)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HostToHost $hostToHost)
    {
        //
    }
}
