<?php

namespace App\Http\Controllers;

use App\Http\Resources\HostToHostResource;
use App\Models\Guarantor\Guarantor;
use App\Models\HostToHost;
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
        $inertiaProps = [
            'page_settings' => [
                'title' => 'Host To Host',
            ],

            'hostToHosts' => fn () => $resource,
        ];

        return inertia($this->components->list, $inertiaProps);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'guarantor_id' => 'required:exists:'.Guarantor::class.',id',
            'guarantor_url_host' => 'required|string',
            'auth_prefix' => 'nullable|string',
            'token' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $guarantor = Guarantor::query()->find($request->get('guarantor_id'), ['name']);
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
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('HostToHostController@store: ', $error);
            flashMessage('error', 'Data Host To Host Gagal Ditambahkan');
            DB::rollBack();
        } finally {
            return $this->index($request);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HostToHost $hostToHost)
    {
        $request->validate([
            'guarantor_id' => 'required:exists:'.Guarantor::class.',id',
            'guarantor_url_host' => 'required|string',
            'auth_prefix' => 'nullable|string',
            'token' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $guarantor = Guarantor::query()->find($request->get('guarantor_id'), ['name']);
            $hostToHost->update(
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
                ->performedOn($hostToHost)
                ->causedBy(auth()->user())
                ->log('Mengubah data host to host');
            flashMessage('success', 'Data Host To Host Berhasil Diubah');
            DB::commit();
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('HostToHostController@update: ', $error);
            flashMessage('error', 'Data Host To Host Gagal Diubah');
            DB::rollBack();
        } finally {
            return $this->index($request);
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
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('HostToHostController@destroy: ', $error);
            flashMessage('error', 'Data Host To Host Gagal Dihapus');
            DB::rollBack();
        } finally {
            return $this->index(request());
        }
    }
}
