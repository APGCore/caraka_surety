<?php

namespace App\Http\Controllers\RelatedParties;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bank\StoreRequest;
use App\Http\Requests\Bank\UpdateRequest;
use App\Http\Resources\Bank\BankResource;
use App\Models\RelatedParties\Bank;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class BankController extends Controller
{
    protected string $prefixComp = 'admin/bank-management/bank';

    public function apiSearch(Request $request): JsonResponse
    {
        // request
        $search = $request->get('search') ?? '';
        $isPageAble = $request->get('is_page_able') ?? 'false';
        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;

        // query
        $query = Bank::search($search)
            ->orderBy('created_at');

        // if is page able is true, then paginate the data
        $bank = $isPageAble !== 'false'
          ? $query->paginate(
              perPage: $perPage,
              page: $page
          )
          : $query->get();

        // if is page able is true, then return the resource, otherwise return the data
        $bankResource = BankResource::collection($bank);

        // if is page able is true, then return the resource, otherwise return the data
        $response = $isPageAble !== 'false' ? [
            'data' => $bankResource,
            'meta' => [
                'current_page' => $bank->currentPage(),
                'from' => $bank->firstItem(),
                'to' => $bank->lastItem(),
                'last_page' => $bank->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $bank->total(),
            ],
        ] : $bankResource;

        // return response
        return $this->responseSuccess('Sukses get All Bank', $response);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $bank = Bank::search($request->get('search'))
            ->query(function ($query) {
                $query->with(['province', 'regency', 'district'])
                    ->whereNull('headquarter_id');
            })
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $bankResource = BankResource::collection($bank);

        $component = $this->prefixComp.'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Kelola Bank',
            ],
            'banks' => fn () => $bankResource,
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
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data bank gagal', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('BankController@store: ', $error);
        } finally {
            return redirect()->route('bank.index');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $component = $this->prefixComp.'/create/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Bank',
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $bank): Response
    {
        $component = $this->prefixComp.'/edit/index';

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
    public function update(UpdateRequest $request, Bank $bank): RedirectResponse
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
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data bank gagal', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('BankController@update: ', $error);
        } finally {
            return redirect()->route('bank.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $picture = $bank->getAttribute('picture') ?? '';
            $this->deleteFile($picture);
            $bank->delete();
            activity()
                ->useLog('bank')
                ->performedOn($bank)
                ->causedBy(auth()->user())
                ->log('Menghapus data bank');
            flashMessage('Data bank Dihapus', 'Data bank dihapus');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Bank', 'Terjadi kesalahan saat menghapus bank', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('BankController@destroy: ', $error);
        } finally {
            return redirect()->route('bank.index');
        }
    }

    public function getAllBank(): JsonResponse
    {
        $bank = Bank::query()
            ->get();

        return $this->responseSuccess('Success mendapatkan data bank!', $bank);
    }

    public function apiGetAllBank(Request $request): JsonResponse
    {
        $guarantor = $request->query('guarantor');
        $bank = Bank::query()
            ->with('branch')
            ->whereNull('headquarter_id')
            ->when($guarantor, function ($query) use ($guarantor) {
                return $query->whereHas('guarantor', function ($query) use ($guarantor) {
                    $query->where('guarantor_id', $guarantor);
                });
            })
            ->get();

        return $this->responseSuccess('Success mendapatkan data bank!', $bank);
    }
}
