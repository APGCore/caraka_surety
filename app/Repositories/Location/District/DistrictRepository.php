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
    public function search(string $search = '', int $perPage = 10, int $page = 1, ?int $regencyId = null): LengthAwarePaginator
    {
        return $this->model
            ->search($search)
            ->query(function ($query) use ($regencyId) {
                return $query
                    ->with(['regency:id,name,province_id'])
                    ->when($regencyId, function ($query) use ($regencyId) {
                        $query->where('regency_id', $regencyId);
                    });
            })
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

    public function getAllDistrict(): Collection
    {
        return $this->model
            ->orderBy('name')
            ->get();
    }
}
