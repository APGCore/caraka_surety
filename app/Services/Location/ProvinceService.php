<?php

namespace App\Services\Location;

use App\Http\Resources\Location\ProvinceResource;
use App\Repositories\Location\Province\ProvinceRepositoryInterface;

class ProvinceService
{
    /**
     * @var ProvinceRepositoryInterface
     */
    protected $repository;

    /**
     * ProvinceService constructor.
     */
    public function __construct(ProvinceRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Search provinces by name
     *
     * @return array
     */
    public function searchProvinces(string $search = '', int $perPage = 10, int $page = 1)
    {
        $provinces = $this->repository->search($search, $perPage, $page);
        $provinceResource = ProvinceResource::collection($provinces);

        return [
            'data' => $provinceResource,
            'meta' => [
                'current_page' => $provinces->currentPage(),
                'from' => $provinces->firstItem(),
                'to' => $provinces->lastItem(),
                'last_page' => $provinces->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $provinces->total(),
            ],
        ];
    }
}
