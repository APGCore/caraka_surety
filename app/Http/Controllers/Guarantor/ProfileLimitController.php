<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Office\ProfileResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProfileLimitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::with('profileLimit')->get();
        $guarantorSelected = (int)($request->get('guarantor_id') ?? $guarantors->first()?->id);

        $profiles = Profile::search($request->get('search'))
                ->query(function (Builder $query) use ($guarantorSelected) {
                    return $query->with(['guarantorLimit' => function ($query) use ($guarantorSelected) {
                        $query->where('guarantor_id', $guarantorSelected);
                    }]);
                })
                ->orderBy('id')
                ->paginate($request->get('per_page') ?? 10)
                ->appends('query', null)
                ->appends($request->all());

//        dd($profiles);
        $profileResource = ProfileResource::collection($profiles);

        $component = $request->path() . '/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Pembagian Limit per Kantor',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'profiles' => fn() => $profileResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): void
    {
        try {
            DB::beginTransaction();

            $limit = (int)str_replace('.', '', $request->get('limit'));
            ProfileLimit::query()->create(
                [
                    'guarantor_id' => $request->get('guarantor_id'),
                    'profile_id' => $request->get('profile_id'),
                    'limit' => $limit,
                ]
            );

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error store profile limit', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProfileLimit $profileLimit): void
    {
        try {
            DB::beginTransaction();

            $limit = (int) str_replace('.', '', $request->get('limit'));
            $updated = $profileLimit->update(
                [
                    'limit' => $limit,
                ]
            );
            if(!$updated) {
                throw new \Exception('Failed to update profile limit');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error update profile limit', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProfileLimit $profileLimit)
    {
        try {
            DB::beginTransaction();

            $deleted = $profileLimit->delete();
            if(!$deleted) {
                throw new \Exception('Failed to delete profile limit');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error delete profile limit', ['error' => $e->getMessage()]);
        }
    }
}
