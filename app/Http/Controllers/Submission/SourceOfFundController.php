<?php

namespace App\Http\Controllers\Submission;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Resources\Submission\SourceOfFundsResource;
use App\Models\Submission\SourceOfFund;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SourceOfFundController extends Controller
{
    public function index(Request $request)
    {
        $sourceOfFunds = SourceOfFund::search($request->get('search'))
            ->orderBy('created_at', 'desc')
            ->paginate((int) $request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $sourceOfFundsResource = SourceOfFundsResource::collection($sourceOfFunds);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Sumber Dana',
            ],
            'sourceOfFunds' => fn () => $sourceOfFundsResource,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            SourceOfFund::create($request->all());
            activity()
                ->useLog('source-of-found')
                ->performedOn(new SourceOfFund)
                ->causedBy(auth()->user())
                ->log('Menambahkan sumber dana baru');
            DB::commit();

            return $this->responseSuccess('Sumber Dana berhasil ditambahkan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('SourceOfFundController@store: ', $error);

            return $this->responseError('Sumber Dana gagal ditambahkan');
        }
    }

    public function update(Request $request, SourceOfFund $sourceOfFund)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            $sourceOfFund->update($request->all());
            activity()
                ->useLog('source-of-found')
                ->performedOn($sourceOfFund)
                ->causedBy(auth()->user())
                ->log('Mengubah sumber dana');
            DB::commit();

            return $this->responseSuccess('Sumber Dana berhasil diubah');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('SourceOfFundController@update: ', $error);

            return $this->responseError('Sumber Dana gagal diubah');
        }
    }

    public function destroy(SourceOfFund $sourceOfFund)
    {
        try {
            DB::beginTransaction();
            $sourceOfFund->delete();
            activity()
                ->useLog('source-of-found')
                ->performedOn($sourceOfFund)
                ->causedBy(auth()->user())
                ->log('Menghapus sumber dana');
            flashMessage('Success', 'Sumber Dana berhasil dihapus');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Error', 'Sumber Dana gagal dihapus', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('SourceOfFundController@destroy: ', $error);
        }
    }

    public function getAll()
    {
        $user = auth()->user()->load('office:id,office_type');
        $office = $user->office;
        $isBranch = $office->office_type == OfficeType::BRANCH->value;
        $sourceOfFunds = SourceOfFund::query()
            ->when($isBranch, function ($query) {
                return $query->where('name', 'APBN');
            })
            ->get();

        return $this->responseSuccess('Data Sumber Dana', $sourceOfFunds);
    }
}
