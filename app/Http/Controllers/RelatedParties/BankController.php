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
use Illuminate\Support\Facades\Storage;
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
                $requestValid['picture'] = $request->file('upload_picture')->store('banks', 'public');
            }

            Bank::query()
                ->create($requestValid);

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
                if (Storage::exists($picture)) {
                    Storage::delete($picture);
                }
                $requestValid['picture'] = $request->file('upload_picture')->store('guarantors', 'public');
            }
            $bank->update($requestValid);

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
                if (Storage::exists($picture)) {
                    Storage::delete($picture);
                }
                $bank->delete();
            } else {
                throw new ThrottleRequestsException('Data bank tidak ditemukan');
            }

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
}
