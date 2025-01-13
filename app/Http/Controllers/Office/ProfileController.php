<?php

namespace App\Http\Controllers\Office;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Office\StoreRequest;
use App\Http\Requests\Office\UpdateRequest;
use App\Http\Resources\Office\EmployeeResource;
use App\Http\Resources\Office\ProfileResource;
use App\Models\OfficePairing;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function index(Request $request): Response
    {

        $component = 'admin/office-management/branch-office/index';

        $profiles = Profile::search($request->get('search'))
            ->where('office_type', OfficeType::BRANCH->value)
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        // Get the profile IDs
        $profileIds = collect($profiles->items())->pluck('id');

        // Fetch all user counts in one query
        $userCounts = User::select('profile_id', DB::raw('COUNT(*) as users_count'))
            ->whereIn('profile_id', $profileIds)
            ->groupBy('profile_id')
            ->pluck('users_count', 'profile_id');

        // Assign user counts to profiles
        collect($profiles->items())->each(function ($profile) use ($userCounts) {
            $profile->users_count = $userCounts[$profile->id] ?? 0;
        });

        $profileResource = ProfileResource::collection($profiles);

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Cabang BPR',
                'breadcrumb' => [
                    [
                        'title' => 'Unit Bisnis Cabang BPR',
                        'link' => '#',
                    ],
                ],
            ],
            'profiles' => fn () => $profileResource,
        ]);
    }

    // create
    public function create(Request $request): Response
    {
        $component = '';
        $page_settings = [];

        $type = $request->get('type');

        switch ($type) {
            case 'marketing-partner':
                $component = 'admin/office-management/marketing-partner-office/create/index';
                $page_settings = [
                    'title' => 'Mitra Pemasaran',
                    'breadcrumb' => [
                        [
                            'title' => 'Unit Bisnis Mitra Pemasaran',
                            'link' => '#',
                        ],
                        [
                            'title' => 'Tambah Mitra Pemasaran',
                            'link' => '#',
                        ],
                    ],
                ];
                break;
            case 'agent-partner':
                $component = 'admin/office-management/agent-partner-office/create/index';
                $page_settings = [
                    'title' => 'Mitra Agen',
                    'breadcrumb' => [
                        [
                            'title' => 'Unit Bisnis Mitra Agen',
                            'link' => '#',
                        ],
                        [
                            'title' => 'Tambah Mitra Agen',
                            'link' => '#',
                        ],
                    ],
                ];
                break;
            default:
                $component = 'admin/office-management/branch-office/create/index';
                $page_settings = [
                    'title' => 'Cabang BPR',
                    'breadcrumb' => [
                        [
                            'title' => 'Cabang',
                            'link' => '#',
                        ],
                        [
                            'title' => 'Tambah Cabang',
                            'link' => '#',
                        ],
                    ],
                ];
                break;
        }

        return inertia($component, [
            'page_settings' => fn () => $page_settings,
        ]);
    }

    private function routeRedirect(array $requestValidated): string
    {
        $officeType = $requestValidated['office_type'];

        return match ($officeType) {
            OfficeType::BRANCH->value => 'branch.index',
            OfficeType::MARKETING_PARTNER->value => 'branch.mitra-pemasaran',
            OfficeType::AGENT_PARTNER->value => 'branch.mitra-agen',
            default => 'branch.index',
        };
    }

    private function prepareData(array $requestValidated): array
    {
        return array_intersect_key($requestValidated, array_flip([
            'code',
            'name',
            'email',
            'phone',
            'address',
            'postal_code',
            'province_id',
            'regency_id',
            'district_id',
            'village',
            'office_type',
        ]));
    }

    private function createPairing($requestValidated, $profile): void
    {
        foreach ($requestValidated['pairing_guarantor'] as $guarantor) {
            if (! isset($guarantor['branches'])) {
                throw new ThrottleRequestsException('Cabang tidak ditemukan');
            }
            foreach ($guarantor['branches'] as $branch) {
                OfficePairing::query()->create([
                    'office_id' => $profile->id, // Reference to the office
                    'guarantor_id' => $branch['id'], // Reference to the guarantor branch
                ]);
            }
        }
    }

    public function store(StoreRequest $request)
    {

        try {
            DB::beginTransaction();

            $requestValidated = $request->validated();

            $redirectRoute = $this->routeRedirect($requestValidated);

            $data = $this->prepareData($requestValidated);

            $profile = Profile::query()
                ->create($data);

            $this->createPairing($requestValidated, $profile);

            activity()
                ->useLog('profile')
                ->performedOn(new Profile)
                ->causedBy(auth()->user())
                ->log('Menambahkan Kantor Cabang');

            flashMessage('Berhasil', 'Berhasil ditambahkan');
            DB::commit();

            return redirect()->route($redirectRoute);
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan', 'Terjadi kesalahan saat menambahkan', 'error');
            Log::error('Profil Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();

            return redirect()->back();
        }
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request, Profile $profile): Response
    {
        $component = $request->path();
        $profile->load(['guarantors:id,headquarter_id,name', 'guarantors.head:id,headquarter_id,name', 'guarantors.head.branch:id,headquarter_id,name']);
        $headGuarantors = $profile->guarantors->pluck('head')->unique()->values();
        $pairingGuarantor = $headGuarantors->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'branches' => $item->branch->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                    ];
                }),
            ];
        });
        $profile->setAttribute('pairing_guarantor', $pairingGuarantor);
        $component = substr($component, 0, strrpos($component, '/')).'/index';

        return inertia($component, [
            'profile' => $profile,
        ]);
    }

    public function update(UpdateRequest $request, Profile $profile)
    {
        try {
            DB::beginTransaction();
            $requestValidated = $request->validated();
            $redirectRoute = $this->routeRedirect($requestValidated);
            $data = $this->prepareData($requestValidated);

            $profileUpdated = $profile->update($data);

            if ($profileUpdated) {
                OfficePairing::query()->where('office_id', $profile->id)->delete();
                $this->createPairing($requestValidated, $profile);
            }

            activity()
                ->useLog('profile')
                ->performedOn($profile)
                ->causedBy(auth()->user())
                ->log('Mengubah Kantor Cabang');
            flashMessage('Berhasil', 'Berhasil diperbarui');
            DB::commit();

            return redirect()->route($redirectRoute);
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Diperbarui', 'Terjadi kesalahan saat memperbarui', 'error');
            Log::error('Profil Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            return redirect()->back()->withErrors($th->getMessage());
        }
    }

    public function destroy(Profile $profile)
    {
        try {
            DB::beginTransaction();

            if ($profile->exists) {
                $profile->delete();
            } else {
                throw new ThrottleRequestsException('Data tidak ditemukan');
            }
            activity()
                ->useLog('profile')
                ->performedOn($profile)
                ->causedBy(auth()->user())
                ->log('Menghapus Kantor Cabang');
            flashMessage('Hapus', 'Berhasil dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus', 'Terjadi kesalahan saat menghapus', 'error');
            Log::error('Profil Destroy: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }

    public function all(): JsonResponse
    {
        $profile = Profile::all();

        return $this->responseSuccess('Berhasil mengambil data profiles', $profile);
    }

    public function displayMitraPemasaran(Request $request): Response
    {
        $component = 'admin/office-management/marketing-partner-office/index';

        $profiles = Profile::search($request->get('search'))
            ->where('office_type', OfficeType::MARKETING_PARTNER->value)
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        // Get the profile IDs
        $profileIds = collect($profiles->items())->pluck('id');

        // Fetch all user counts in one query
        $userCounts = User::select('profile_id', DB::raw('COUNT(*) as users_count'))
            ->whereIn('profile_id', $profileIds)
            ->groupBy('profile_id')
            ->pluck('users_count', 'profile_id');

        // Assign user counts to profiles
        collect($profiles->items())->each(function ($profile) use ($userCounts) {
            $profile->users_count = $userCounts[$profile->id] ?? 0;
        });

        $profileResource = ProfileResource::collection($profiles);

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Mitra Pemasaran',
                'breadcrumb' => [
                    [
                        'title' => 'Unit Bisnis Mitra Pemasaran',
                        'link' => '#',
                    ],
                ],
            ],
            'profiles' => fn () => $profileResource,
        ]);
    }

    public function displayMitraAgen(Request $request): Response
    {
        $component = 'admin/office-management/agent-partner-office/index';

        $profiles = Profile::search($request->get('search'))
            ->where('office_type', OfficeType::AGENT_PARTNER->value)
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        // Get the profile IDs
        $profileIds = collect($profiles->items())->pluck('id');

        // Fetch all user counts in one query
        $userCounts = User::select('profile_id', DB::raw('COUNT(*) as users_count'))
            ->whereIn('profile_id', $profileIds)
            ->groupBy('profile_id')
            ->pluck('users_count', 'profile_id');

        // Assign user counts to profiles
        collect($profiles->items())->each(function ($profile) use ($userCounts) {
            $profile->users_count = $userCounts[$profile->id] ?? 0;
        });

        $profileResource = ProfileResource::collection($profiles);

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Mitra Agen',
                'breadcrumb' => [
                    [
                        'title' => 'Unit Bisnis Mitra Agen',
                        'link' => '#',
                    ],
                ],
            ],
            'profiles' => fn () => $profileResource,
        ]);
    }

    public function employee(Request $request, Profile $profile)
    {
        $officeSelected = $profile->getAttribute('id');
        $employees = User::search($request->get('search'))
            ->query(function ($query) use ($officeSelected) {
                $query->with('role')
                    ->where('role_id', '!=', 1)
                    ->where('profile_id', $officeSelected);
            })
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $employeeResource = EmployeeResource::collection($employees);

        $component = 'admin/office-management/employee/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Pengguna Cabang '.$profile->getAttribute('name'),
            ],
            'officeSelected' => $officeSelected,
            'employees' => fn () => $employeeResource,
        ]);
    }
}
