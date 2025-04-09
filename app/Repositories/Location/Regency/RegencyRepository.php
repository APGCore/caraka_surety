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
   *
   * @param Regency $model
   */
  public function __construct(Regency $model)
  {
    $this->model = $model;
  }

  /**
   * Search regencies with pagination
   *
   * @param string $search
   * @param int $perPage
   * @param int $page
   * @return LengthAwarePaginator
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
   * Get regencies by province ID
   *
   * @param int $provinceId
   * @return Collection
   */
  public function getByProvince(int $provinceId): Collection
  {
    return $this->model
      ->where('province_id', $provinceId)
      ->orderBy('name')
      ->get();
  }
}
