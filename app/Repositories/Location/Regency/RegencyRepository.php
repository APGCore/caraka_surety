<?php

namespace App\Repositories\Location\Regency;

use App\Models\Location\Regency;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class RegencyRepository implements RegencyRepositoryInterface
{
  /**
   * @var Regency
   */
  protected $model;

  /**
   * RegencyRepository constructor.
   */
  public function __construct(Regency $model)
  {
    $this->model = $model;
  }

  /**
   * Search regencies with pagination
   */
  public function search(string $search = '', int $perPage = 10, int $page = 1, int $provinceId = null): LengthAwarePaginator
  {
    return $this->model
      ->search($search)
      ->when($provinceId, function ($query) use ($provinceId) {
        $query->where('province_id', $provinceId);
      })
      ->orderBy('name')
      ->paginate(
        perPage: $perPage,
        page: $page
      );
  }

  /**
   * Get regencies by province ID
   */
  public function getByProvince(int $provinceId): Collection
  {
    return $this->model
      ->where('province_id', $provinceId)
      ->orderBy('name')
      ->get();
  }

  public function getAllRegency(): Collection
  {
    return $this->model
      ->orderBy('name')
      ->get();
  }
}
