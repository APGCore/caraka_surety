<?php

namespace App\Http\Controllers\RelatedParties;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bank\StoreRequest;
use App\Http\Requests\Bank\UpdateRequest;
use App\Http\Resources\Bank\BankResource;
use App\Models\RelatedParties\Bank;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $bank = Bank::search($request->get('search'))
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $bankResource = BankResource::collection($bank);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Kelola Bank',
            ],
            'banks' => fn () => $bankResource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $bank = Bank::all();

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Bank',
            ],
            'banks' => $bank,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $requestValid = $request->validated();
            if ($request->hasFile('upload_picture')) {
                $fileName = str_replace(' ', '_', $requestValid['name']);
                $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'banks', $fileName);
            }

            Bank::query()
                ->create($requestValid);
            activity()
                ->useLog('bank')
                ->performedOn(new Bank)
                ->causedBy(auth()->user())
                ->log('Menambahkan data bank baru');
            flashMessage('Berhasil', 'Penambahan data bank berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data bank gagal', 'error');
            Log::error('ObligeeController@store: ', ['message' => $e->getMessage()]);
        } finally {
            return redirect()->route('bank.index');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Bank $bank)
    {
        $bank = Bank::with('province', 'regency', 'district')->findOrFail($bank->getAttribute('id'));

        return inertia('admin/bank-management/bank/detail/index', [
            'page_settings' => [
                'title' => 'Detail Bank',
            ],
            'bank' => $bank,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $bank, Request $request)
    {
        $component = $request->path();
        $component = substr($component, 0, strrpos($component, '/')).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Bank',
            ],
            'bank' => $bank,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Bank $bank)
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            if ($request->hasFile('upload_picture')) {
                $picture = $bank->getAttribute('picture') ?? '';
                $this->deleteFile($picture);

                $fileName = str_replace(' ', '_', $requestValid['name']);
                $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'banks', $fileName);
            }
            $bank->update($requestValid);
            activity()
                ->useLog('bank')
                ->performedOn($bank)
                ->causedBy(auth()->user())
                ->log('Mengubah data bank');
            flashMessage('Berhasil', 'Perubahan data bank berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data bank gagal', 'error');
            Log::error('ObligeeController@update: ', ['message' => $e->getMessage()]);
        } finally {
            return redirect()->route('bank.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank)
    {
        try {
            DB::beginTransaction();

            if ($bank->exists) {
                $picture = $bank->getAttribute('picture') ?? '';
                $this->deleteFile($picture);
                $bank->delete();
            } else {
                throw new ThrottleRequestsException('Data bank tidak ditemukan');
            }
            activity()
                ->useLog('bank')
                ->performedOn($bank)
                ->causedBy(auth()->user())
                ->log('Menghapus data bank');
            flashMessage('Data bank Dihapus', 'Data bank dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
            Log::error('Profil Destroy: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    public function getAllBank()
    {
        $bank = Bank::query()
            ->get();

        return $this->responseSuccess('Success mendapatkan data bank!', $bank);
    }

    public function apiGetAllBank()
    {
        $bank = Bank::query()
            ->get();

        return $this->responseSuccess('Success mendapatkan data bank!', $bank);
    }
}
