<?php

namespace App\Http\Controllers\Office;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Office\StoreRequest;
use App\Http\Requests\Office\UpdateRequest;
use App\Http\Resources\Office\ProfileResource;
use App\Models\OfficePairing;
use App\Models\Profile\Profile;
use App\Models\User;
use Exception;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class ProfileController extends Controller
{


  public function apiGetOfficeTypes(Request $request)
  {
    $officeTypes = ['Kantor Pusat', 'Kantor Cabang', 'Mitra Agen', 'Mitra Pemasaran'];

    return $this->responseSuccess('Berhasil mengambil data tipe kantor', $officeTypes);
  }

  /**
   * Display the user's profile.
   */
  public function apiGetOfficeByType(Request $request)
  {
    // Request
    $officeType = $request->get('office_type');
    $perPage = $request->get('per_page') ?? 10;
    $search = $request->get('search') ?? '';
    $page = $request->get('page') ?? 1;

    // Validate the office type
    if (! OfficeType::tryFrom($officeType)) {
      return $this->responseError('Tipe kantor tidak valid!.', null, 400);
    }

    // Get the offices
    $offices = Profile::search($search)
      ->where('office_type', $officeType)
      ->orderBy('name')
      ->paginate(
        perPage: $perPage,
        page: $page
      )
      ->appends($request->except('page'));

    // Get the profile IDs
    $profileIds = collect($offices->items())->pluck('id');

    // Fetch all user counts in one query
    $userCounts = User::select('profile_id', DB::raw('COUNT(*) as users_count'))
      ->whereIn('profile_id', $profileIds)
      ->groupBy('profile_id')
      ->pluck('users_count', 'profile_id');

    // Assign user counts to profiles
    collect($offices->items())->each(function ($office) use ($userCounts) {
      $office->users_count = $userCounts[$office->id] ?? 0;
    });

    // Return the profile resource
    $officeResource = ProfileResource::collection($offices);

    return $this->responseSuccess('Berhasil mengambil data profiles! ', [
      'data' => $officeResource,
      'meta' => [
        'current_page' => $offices->currentPage(),
        'from' => $offices->firstItem(),
        'to' => $offices->lastItem(),
        'last_page' => $offices->lastPage(),
        'per_page' => (int) $perPage,
        'total' => $offices->total(),
      ],
    ]);
  }

  public function index()
  {
    $component = 'admin/office-management/branch-office/index';

    return inertia($component, [
      'page_settings' => fn() => [
        'title' => 'Cabang BPR',
        'breadcrumb' => [
          [
            'title' => 'Unit Bisnis Cabang BPR',
            'link' => '#',
          ],
        ],
      ],
      'officeType' => fn() => OfficeType::BRANCH->value,
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
      'page_settings' => fn() => $page_settings,
    ]);
  }

  private function routeRedirect(array $requestValidated): string
  {
    $officeType = $requestValidated['office_type'];

    return match ($officeType) {
      OfficeType::MARKETING_PARTNER->value => 'branch-mitra-pemasaran.index',
      OfficeType::AGENT_PARTNER->value => 'branch-mitra-agen.index',
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

      $profile = Profile::query()
        ->create($requestValidated);

      foreach ($requestValidated['pairing_guarantor'] as $guarantor) {
        OfficePairing::query()->create([
          'office_id' => $profile->id,
          'guarantor_id' => $guarantor['id'],
        ]);
      }

      activity()
        ->useLog('profile')
        ->performedOn(new Profile)
        ->causedBy(auth()->user())
        ->log('Menambahkan Kantor Cabang');

      flashMessage('Berhasil', 'Berhasil ditambahkan');
      DB::commit();
    } catch (Exception $e) {
      flashMessage('Gagal Menambahkan', 'Terjadi kesalahan saat menambahkan', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Profil Store: ', $error);
      DB::rollBack();
    }
  }

  /**
   * Display the user's profile form.
   */
  public function edit(Request $request, Profile $profile): Response
  {

    $component = 'admin/office-management/branch-office/edit/index';

    $officeData = [
      'id' => $profile->id,
      'code' => $profile->code,
      'name' => $profile->name,
      'email' => $profile->email,
      'phone' => $profile->phone,
      'province_id' => $profile->province_id,
      'regency_id' => $profile->regency_id,
      'district_id' => $profile->district_id,
      'village' => $profile->village,
      'address' => $profile->address,
      'postal_code' => $profile->postal_code,
    ];

    $officeData['pairing_guarantor'] = $profile->guarantors->map(function ($item) {
      return [
        'id' => $item->id,
        'name' => $item->name,
      ];
    });

    return inertia($component, [
      'office' => $officeData,
    ]);
  }

  public function update(UpdateRequest $request, Profile $profile)
  {
    try {
      DB::beginTransaction();
      $requestValidated = $request->validated();

      $profileUpdated = $profile->update($requestValidated);

      if ($profileUpdated) {
        OfficePairing::query()->where('office_id', $profile->id)->delete();

        foreach ($requestValidated['pairing_guarantor'] as $guarantor) {
          OfficePairing::query()->create([
            'office_id' => $profile->id,
            'guarantor_id' => $guarantor['id'],
          ]);
        }
      }

      activity()
        ->useLog('profile')
        ->performedOn($profile)
        ->causedBy(auth()->user())
        ->log('Mengubah Kantor Cabang');
      flashMessage('Berhasil', 'Berhasil diperbarui');
      DB::commit();

      // return redirect()->route($redirectRoute);
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal Diperbarui', 'Terjadi kesalahan saat memperbarui', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Profil Update: ', $error);

      // return redirect()->back()->withErrors($th->getMessage());
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
    } catch (Exception $e) {
      DB::rollBack();
      flashMessage('Gagal Menghapus', 'Terjadi kesalahan saat menghapus', 'error');
      $error = $this->handleErrorMessage($e);
      Log::error('Profil Destroy: ', $error);
    } finally {
      return redirect()->back();
    }
  }

  public function all(): JsonResponse
  {
    $profile = Profile::all();

    return $this->responseSuccess('Berhasil mengambil data profiles', $profile);
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
      'page_settings' => fn() => [
        'title' => 'Mitra Agen',
        'breadcrumb' => [
          [
            'title' => 'Unit Bisnis Mitra Agen',
            'link' => '#',
          ],
        ],
      ],
      'profiles' => fn() => $profileResource,
    ]);
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
      'page_settings' => fn() => [
        'title' => 'Mitra Pemasaran',
        'breadcrumb' => [
          [
            'title' => 'Unit Bisnis Mitra Pemasaran',
            'link' => '#',
          ],
        ],
      ],
      'profiles' => fn() => $profileResource,
    ]);
  }
}
