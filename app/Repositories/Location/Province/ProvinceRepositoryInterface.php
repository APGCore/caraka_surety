<?php

namespace App\Repositories\Location\Province;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProvinceRepositoryInterface
{
    /**
     * Search provinces with pagination
     */
    public function search(string $search = '', int $perPage = 10, int $page = 1): LengthAwarePaginator;

    /**
     * Get all provinces
     *
     * @return mixed
     */
    public function getAllProvince();
}
