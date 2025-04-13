<?php

namespace App\Repositories\Location\Regency;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RegencyRepositoryInterface
{
    /**
     * Search regencies with pagination
     */
    public function search(string $search = '', int $perPage = 10, int $page = 1, ?int $provinceId = null): LengthAwarePaginator;

    /**
     * Get regencies by province ID
     *
     * @return mixed
     */
    public function getByProvince(int $provinceId);

    /**
     * Get all regencies
     *
     * @return mixed
     */
    public function getAllRegency();
}
