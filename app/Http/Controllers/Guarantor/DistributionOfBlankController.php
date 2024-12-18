<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guarantor\BlankResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DistributionOfBlankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::with('head')
            ->get()->each(fn ($guarantor) => $guarantor->name = $guarantor->head ? $guarantor->head->name.' - '.$guarantor->name : $guarantor->name);
        $guarantorSelected = (int) ($request->get('guarantor_id') ?? $guarantors->first()?->id);
        $offices = Profile::all();
        $officeSelected = (int) ($request->get('office_id') ?? $offices->first()?->id);
        $isAddBlank = $request->get('is_add_blank') === 'true';

        $blanks = Blank::search($request->get('search'))
            ->query(function ($query) use ($guarantorSelected, $officeSelected, $isAddBlank) {
                $query->where('guarantor_id', $guarantorSelected)
                    ->when($isAddBlank, function ($query) {
                        $query->whereNull('profile_id')
                            ->where('is_used', false);
                    })
                    ->when(! $isAddBlank, function ($query) use ($officeSelected) {
                        $query->where('profile_id', $officeSelected);
                    });
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $blankResource = BlankResource::collection($blanks);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Pembagian Blangko',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'offices' => $offices,
            'officeSelected' => $officeSelected,
            'blanks' => fn () => $blankResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $requestValid = $request->validate([
            'blanks.*.id' => 'required|integer|exists:'.Blank::class.',id',
            'office_id' => 'required|exists:'.Profile::class.',id',
        ]);

        try {
            DB::beginTransaction();

            $blankIds = collect($requestValid['blanks'])->pluck('id');
            Blank::query()
                ->whereIn('id', $blankIds)
                ->update([
                    'profile_id' => $requestValid['office_id'],
                ]);

            activity()
                ->performedOn(new Blank)
                ->causedBy(auth()->user())
                ->log('Pembagian blangko');
            flashMessage('Berhasil', 'Data berhasil disimpan');
            DB::commit();

            return redirect()->route('blank-management.distribution-of-blank.index', $requestValid);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error on DistributionOfBlankController@store: {$e->getMessage()}");
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');

            return back()->withErrors(['errors' => 'Gagal menyimpan data']);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blank $blank)
    {
        try {
            DB::beginTransaction();
            if ($blank->getAttribute('is_used')) {
                flashMessage('Gagal', 'Blangko sudah digunakan', 'error');

                return back()->withErrors(['errors' => 'Blangko sudah digunakan']);
            }
            $blank->update([
                'profile_id' => null,
            ]);

            flashMessage('Berhasil', 'Data berhasil dihapus');
            DB::commit();

            return redirect()->route('blank-management.distribution-of-blank.index', [
                'guarantor_id' => $blank->getAttribute('guarantor_id'),
                'office_id' => $blank->getAttribute('profile_id'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error on DistributionOfBlankController@destroy: {$e->getMessage()}");
            flashMessage('Gagal', 'Gagal menghapus data', 'error');

            return back()->withErrors(['errors' => 'Gagal menghapus data']);
        }
    }
}
