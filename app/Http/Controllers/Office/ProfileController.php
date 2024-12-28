<?php

namespace App\Http\Controllers\Office;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Office\StoreRequest;
use App\Http\Requests\Office\UpdateRequest;
use App\Http\Resources\Office\ProfileResource;
use App\Models\OfficePairing;
use App\Models\Profile;
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
        $profiles = Profile::search($request->get('search'))
            ->where('office_type', OfficeType::BRANCH->value)
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $profileResource = ProfileResource::collection($profiles);

        $component = $request->path().'/index';

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

    public function store(StoreRequest $request)
    {

        try {
            DB::beginTransaction();

            $requestValidated = $request->validated();

            $officeType = $requestValidated['office_type'];

            $redirectRoute = match ($officeType) {
                OfficeType::BRANCH->value => 'branch.index',
                OfficeType::MARKETING_PARTNER->value => 'branch.mitra-pemasaran',
                OfficeType::AGENT_PARTNER->value => 'branch.mitra-agen',
                default => 'branch.index',
            };

            $data = [
                'code' => $requestValidated['code'],
                'name' => $requestValidated['name'],
                'email' => $requestValidated['email'],
                'phone' => $requestValidated['phone'],
                'address' => $requestValidated['address'],
                'postal_code' => $requestValidated['postal_code'],
                'province_id' => $requestValidated['province_id'],
                'regency_id' => $requestValidated['regency_id'],
                'district_id' => $requestValidated['district_id'],
                'village' => $requestValidated['village'],
                'office_type' => $officeType,
            ];

            $profile = Profile::query()
                ->create($data);

            foreach ($requestValidated['pairingGuarantor'] as $guarantor) {
                if (! isset($guarantor['branches'])) {
                    throw new ThrottleRequestsException('Cabang tidak ditemukan');
                }
                foreach ($guarantor['branches'] as $branch) {

                    OfficePairing::create([
                        'office_id' => $profile->id, // Reference to the office
                        'guarantor_id' => $branch['id'], // Reference to the guarantor branch
                    ]);
                }
            }

            activity()
                ->useLog('profile')
                ->performedOn(new Profile)
                ->causedBy(auth()->user())
                ->log('Menambahkan Kantor Cabang');

            flashMessage('Kantor Cabang Ditambahkan', 'Kantor Cabang berhasil ditambahkan');
            DB::commit();

            return redirect()->route($redirectRoute);
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Kantor Cabang', 'Terjadi kesalahan saat menambahkan kantor cabang', 'error');

            dd($th);
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
            $profile->update($requestValidated);
            activity()
                ->useLog('profile')
                ->performedOn($profile)
                ->causedBy(auth()->user())
                ->log('Mengubah Kantor Cabang');
            flashMessage('Kantor Cabang Diperbarui', 'Kantor Cabang berhasil diperbarui');
            DB::commit();

            return redirect()->route('branch.index');
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Kantor Cabang', 'Terjadi kesalahan saat memperbarui kantor cabang', 'error');
            Log::error('Profil Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            return redirect()->back();
        }
    }

    public function destroy(Profile $profile)
    {
        try {
            DB::beginTransaction();

            if ($profile->exists) {
                $profile->delete();
            } else {
                throw new ThrottleRequestsException('Kantor Cabang tidak ditemukan');
            }
            activity()
                ->useLog('profile')
                ->performedOn($profile)
                ->causedBy(auth()->user())
                ->log('Menghapus Kantor Cabang');
            flashMessage('Kantor Cabang Dihapus', 'Kantor Cabang berhasil dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
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
}
