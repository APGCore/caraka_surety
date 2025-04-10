<?php

namespace App\Repositories\Location\District;

use App\Models\Location\District;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class DistrictRepository implements DistrictRepositoryInterface
{
    /**
     * @var District
     */
    protected $model;

    /**
     * DistrictRepository constructor.
     */
    public function __construct(District $model)
    {
        $this->model = $model;
    }

    /**
     * Search districts with pagination
     */
    public function search(string $search = '', int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        return $this->model
            ->search($search)
            ->orderBy('name')
            ->paginate(
                perPage: $perPage,
                page: $page
            );
    }

    /**
     * Get districts by regency ID
     */
    public function getByRegency(int $regencyId): Collection
    {
        return $this->model
            ->where('regency_id', $regencyId)
            ->orderBy('name')
            ->get();
    }
}
