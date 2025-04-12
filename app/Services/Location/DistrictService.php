<?php

namespace App\Services\Location;

use App\Http\Resources\Location\DistrictResource;
use App\Repositories\Location\District\DistrictRepositoryInterface;

class DistrictService
{
    /**
     * @var DistrictRepositoryInterface
     */
    protected $repository;

    /**
     * DistrictService constructor.
     */
    public function __construct(DistrictRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Search districts by name
     *
     * @return array
     */
    public function searchDistricts(string $search = '', int $perPage = 10, int $page = 1, ?int $regencyId = null)
    {
        $districts = $this->repository->search($search, $perPage, $page, $regencyId);
        $districtResource = DistrictResource::collection($districts);

        return [
            'data' => $districtResource,
            'meta' => [
                'current_page' => $districts->currentPage(),
                'from' => $districts->firstItem(),
                'to' => $districts->lastItem(),
                'last_page' => $districts->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $districts->total(),
            ],
        ];
    }
}
