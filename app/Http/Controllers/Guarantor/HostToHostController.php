<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Resources\HostToHostResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\HostToHost;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HostToHostController extends Controller
{
    protected object $components;

    public function __construct()
    {
        $this->components = (object) [
            'list' => 'admin/host-to-host-management/host-to-host/list/index',
        ];
    }

    public function apiSearch(Request $request)
    {
        // request
        $search = $request->get('search') ?? '';
        $isPageAble = $request->get('is_page_able') ?? 'false';
        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;

        // query
        $query = HostToHost::search($search)
            ->orderBy('created_at');

        // if is page able is true, then paginate the data
        $hostToHost = $isPageAble !== 'false'
          ? $query->paginate(
              perPage: $perPage,
              page: $page
          )
          : $query->get();

        // if is page able is true, then return the resource, otherwise return the data
        $hostToHostResource = HostToHostResource::collection($hostToHost);

        // if is page able is true, then return the resource, otherwise return the data
        $response = $isPageAble !== 'false' ? [
            'data' => $hostToHostResource,
            'meta' => [
                'current_page' => $hostToHost->currentPage(),
                'from' => $hostToHost->firstItem(),
                'to' => $hostToHost->lastItem(),
                'last_page' => $hostToHost->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $hostToHost->total(),
            ],
        ] : $hostToHostResource;

        // return response
        return $this->responseSuccess('Sukses get All Host To Host', $response);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $inertiaProps = [
            'page_settings' => [
                'title' => 'Host To Host',
            ],

        ];

        return inertia($this->components->list, $inertiaProps);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'guarantor_id' => 'required|integer|exists:guarantors,id',
            'guarantor_url_host' => 'required|string',
            'auth_prefix' => 'nullable|string',
            'token' => 'nullable|string',
        ]);

        // Selected Guarantor
        $guarantorId = $request->get('guarantor_id');
        $guarantor = Guarantor::query()->find($guarantorId, ['id', 'name']);

        DB::beginTransaction();
        try {
            HostToHost::query()->create(
                array_merge(
                    $request->only([
                        'guarantor_id',
                        'guarantor_url_host',
                        'auth_prefix',
                        'token',
                    ]),
                    [
                        'guarantor_name' => $guarantor->getAttribute('name'),
                    ]
                )
            );
            activity()
                ->useLog('Host To Host')
                ->performedOn(new HostToHost)
                ->causedBy(auth()->user())
                ->log('Menambahkan data host to host');
            flashMessage('success', 'Data Host To Host Berhasil Ditambahkan');
            DB::commit();

            return redirect()->route('host-to-host.index');
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('HostToHostController@store: ', $error);
            flashMessage('error', 'Data Host To Host Gagal Ditambahkan');
            DB::rollBack();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HostToHost $hostToHost)
    {
        $request->validate([
            'guarantor_id' => 'required|integer|exists:guarantors,id',
            'guarantor_url_host' => 'required|string',
            'auth_prefix' => 'nullable|string',
            'token' => 'nullable|string',
        ]);

        // Selected Guarantor
        $guarantorId = $request->get('guarantor_id');
        $guarantor = Guarantor::query()->find($guarantorId, ['id', 'name']);

        DB::beginTransaction();
        try {
            $hostToHost->update(
                array_merge(
                    [
                        'guarantor_id' => $guarantorId,
                    ],
                    $request->only([
                        'guarantor_url_host',
                        'auth_prefix',
                        'token',
                    ]),
                    [
                        'guarantor_name' => $guarantor->getAttribute('name'),
                    ]
                )
            );
            activity()
                ->useLog('Host To Host')
                ->performedOn($hostToHost)
                ->causedBy(auth()->user())
                ->log('Mengubah data host to host');

            flashMessage('success', 'Data Host To Host Berhasil Diubah');
            DB::commit();

            return redirect()->route('host-to-host.index');
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('HostToHostController@update: ', $error);
            flashMessage('error', 'Data Host To Host Gagal Diubah');
            DB::rollBack();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HostToHost $hostToHost)
    {
        DB::beginTransaction();
        try {
            if ($hostToHost->exists) {
                $hostToHost->delete();
                activity()
                    ->useLog('Host To Host')
                    ->performedOn($hostToHost)
                    ->causedBy(auth()->user())
                    ->log('Menghapus data host to host');
                flashMessage('success', 'Data Host To Host Berhasil Dihapus');
            }
            DB::commit();

            return redirect()->route('host-to-host.index');
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('HostToHostController@destroy: ', $error);
            flashMessage('error', 'Data Host To Host Gagal Dihapus');
            DB::rollBack();
        }
    }
}
