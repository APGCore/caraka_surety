<?php

namespace App\Repositories\Location\District;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DistrictRepositoryInterface
{
    /**
     * Search districts with pagination
     */
    public function search(string $search = '', int $perPage = 10, int $page = 1, ?int $regencyId = null): LengthAwarePaginator;

    /**
     * Get districts by regency ID
     *
     * @return mixed
     */
    public function getByRegency(int $regencyId);

    /**
     * Get all districts
     *
     * @return mixed
     */
    public function getAllDistrict();
}
