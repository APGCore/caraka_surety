<?php

namespace App\Services\Location;

use App\Http\Resources\Location\RegencyResource;
use App\Repositories\Location\Regency\RegencyRepositoryInterface;

class RegencyService
{
    /**
     * @var RegencyRepositoryInterface
     */
    protected $repository;

    /**
     * RegencyService constructor.
     */
    public function __construct(RegencyRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Search regencies by name
     *
     * @return array
     */
    public function searchRegencies(string $search = '', int $perPage = 10, int $page = 1, ?int $provinceId = null)
    {
        $regencies = $this->repository->search($search, $perPage, $page, $provinceId);
        $regencyResource = RegencyResource::collection($regencies);

        return [
            'data' => $regencyResource,
            'meta' => [
                'current_page' => $regencies->currentPage(),
                'from' => $regencies->firstItem(),
                'to' => $regencies->lastItem(),
                'last_page' => $regencies->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $regencies->total(),
            ],
        ];
    }
}
