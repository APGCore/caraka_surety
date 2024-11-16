<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Office\EmployeeResource;
use App\Models\Guarantor\EmployeeLimit;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeLimitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::all();
        $guarantorSelected = (int) ($request->get('guarantor_id') ?? $guarantors->first()?->id);
        $profiles = Profile::all();
        $profileSelected = (int) ($request->get('profile_id') ?? $profiles->first()?->id);
        $limit = ProfileLimit::query()
            ->where('guarantor_id', $guarantorSelected)
            ->where('profile_id', $profileSelected)
            ->first();
        if ($limit) {
            $limit_used = EmployeeLimit::query()
                ->where('guarantor_id', $guarantorSelected)
                ->where('profile_id', $profileSelected)
                ->sum('limit');

            $limit->setAttribute('limit_used', $limit_used);
        }

        $employees = User::search($request->get('search'))
            ->query(function (Builder $query) use ($guarantorSelected, $profileSelected) {
                return $query->whereIn('role_id', [2, 3, 4])
                    ->where('profile_id', $profileSelected)
                    ->with('role')
                    ->when($guarantorSelected && $profileSelected, function ($query) use ($guarantorSelected, $profileSelected) {
                        $query->with(['employeeLimit' => function ($query) use ($guarantorSelected, $profileSelected) {
                            $query->where('guarantor_id', $guarantorSelected)->where('profile_id', $profileSelected);
                        }]);
                    });
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $employeeResource = EmployeeResource::collection($employees);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Pembagian Limit per Karyawan',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'profiles' => $profiles,
            'profileSelected' => $profileSelected,
            'limit' => $limit,
            'employees' => fn () => $employeeResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $requestValid = $request->validate(
            [
                'guarantor_id' => 'required|exists:'.Guarantor::class.',id',
                'profile_id' => 'required|exists:'.Profile::class.',id',
                'employee_id' => 'required|exists:'.User::class.',id',
                'limit' => 'required',
            ],
            [
                'guarantor_id.required' => 'Kantor belum dipilih',
                'profile_id.required' => 'Profil belum dipilih',
                'employee_id.required' => 'Karyawan belum dipilih',
                'limit.required' => 'Limit wajib diisi',
            ]
        );

        try {
            DB::beginTransaction();

            $profileLimit = ProfileLimit::query()
                ->where('guarantor_id', $requestValid['guarantor_id'])
                ->where('profile_id', $requestValid['profile_id'])
                ->first();

            $limitUsed = EmployeeLimit::query()
                ->where('guarantor_id', $requestValid['guarantor_id'])
                ->where('profile_id', $requestValid['profile_id'])
                ->sum('limit');

            $limit = (int) str_replace('.', '', $requestValid['limit']);

            if (($limitUsed + $limit) > $profileLimit->getAttribute('limit')) {
                throw new \Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            EmployeeLimit::query()->create(
                [
                    'guarantor_id' => $requestValid['guarantor_id'],
                    'profile_id' => $requestValid['profile_id'],
                    'employee_id' => $requestValid['employee_id'],
                    'limit' => $limit,
                ]
            );

            DB::commit();

            return $this->responseSuccess('Berhasil menambahkan limit karyawan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error store profile limit', ['error' => $e->getMessage()]);

            return $this->responseError('Gagal menambahkan limit karyawan', ['message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmployeeLimit $employeeLimit): JsonResponse
    {
        $requestValid = $request->validate(
            ['limit' => 'required'],
            ['limit.required' => 'Limit wajib diisi']);

        try {
            DB::beginTransaction();

            $profileLimit = ProfileLimit::query()
                ->where('guarantor_id', $employeeLimit->getAttribute('guarantor_id'))
                ->where('profile_id', $employeeLimit->getAttribute('profile_id'))
                ->first();

            $limitUsed = EmployeeLimit::query()
                ->where('guarantor_id', $employeeLimit->getAttribute('guarantor_id'))
                ->where('profile_id', $employeeLimit->getAttribute('profile_id'))
                ->whereNot('employee_id', $employeeLimit->getAttribute('employee_id'))
                ->sum('limit');

            $limit = (int) str_replace('.', '', $requestValid['limit']);

            if (($limitUsed + $limit) > $profileLimit->getAttribute('limit')) {
                throw new \Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            $updated = $employeeLimit->update(
                [
                    'limit' => $limit,
                ]
            );
            if (! $updated) {
                throw new \Exception('Gagal mengubah limit karyawan');
            }

            DB::commit();

            return $this->responseSuccess('Berhasil mengubah limit karyawan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error update profile limit', ['error' => $e->getMessage()]);

            return $this->responseError('Gagal mengubah limit karyawan', ['message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeLimit $employeeLimit): void
    {
        try {
            DB::beginTransaction();

            $deleted = $employeeLimit->delete();
            if (! $deleted) {
                throw new \Exception('Gagal menghapus limit karyawan');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error delete profile limit', ['error' => $e->getMessage()]);
        }
    }
}
