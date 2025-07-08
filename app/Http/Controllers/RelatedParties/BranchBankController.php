<?php

namespace App\Http\Controllers\RelatedParties;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bank\StoreRequest;
use App\Http\Requests\Bank\UpdateRequest;
use App\Http\Resources\Bank\BankResource;
use App\Models\RelatedParties\Bank;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class BranchBankController extends Controller
{
    protected string $prefixComp = 'admin/bank-management/branch';

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Bank $bank): Response
    {
        $banks = Bank::search($request->get('search'))
            ->query(function ($query) use ($bank) {
                $query->with(['province', 'regency', 'district'])
                    ->where('headquarter_id', $bank->getAttribute('id'));
            })
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $bankResource = BankResource::collection($banks);

        $component = $this->prefixComp.'/index';
        $bankName = $bank->getAttribute('name');

        return inertia($component, [
            'page_settings' => [
                'title' => 'Kelola Cabang Bank '.$bankName,
            ],
            'banks' => fn () => $bankResource,
            'bank' => $bank,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Bank $bank): Response
    {
        $component = $this->prefixComp.'/create/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Cabang Bank '.$bank->getAttribute('name'),
            ],
            'bank' => $bank,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();
            $requestValid = $request->validated();

            Bank::query()
                ->create($requestValid);
            activity()
                ->useLog('branch-bank')
                ->performedOn(new Bank)
                ->causedBy(auth()->user())
                ->log('Menambahkan data cabang bank baru');
            flashMessage('Berhasil', 'Penambahan data cabang bank berhasil');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data cabang bank gagal', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('BranchBankController@store: ', $error);
        } finally {
            return redirect()->route('bank.branch.index', ['bank' => $request->get('headquarter_id')]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $branch): Response
    {
        $bank = $branch->load('head');
        $component = $this->prefixComp.'/edit/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Cabang Bank '.$bank->getAttribute('name'),
            ],
            'branch' => $branch,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Bank $branch): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            $branch->update($requestValid);
            activity()
                ->useLog('branch-bank')
                ->performedOn($branch)
                ->causedBy(auth()->user())
                ->log('Mengubah data cabang bank');
            flashMessage('Berhasil', 'Perubahan data cabang bank berhasil');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data cabang bank gagal', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('BranchBankController@update: ', $error);
        } finally {
            return redirect()->route('bank.branch.index', ['bank' => $branch->getAttribute('headquarter_id')]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $branch): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $branch->delete();
            activity()
                ->useLog('branch-bank')
                ->performedOn($branch)
                ->causedBy(auth()->user())
                ->log('Menghapus data cabang bank');
            flashMessage('Data cabang bank di hapus', 'Data cabang bank di hapus');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal menghapus Cabang Bank', 'Terjadi kesalahan saat menghapus cabang bank', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('BranchBankController@destroy: ', $error);
        } finally {
            return redirect()->route('bank.branch.index', ['bank' => $branch->getAttribute('headquarter_id')]);
        }
    }
}
