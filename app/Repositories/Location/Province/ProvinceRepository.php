<?php

namespace App\Repositories\Location\Province;

use App\Models\Location\Province;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProvinceRepository implements ProvinceRepositoryInterface
{
  /**
   * @var Province
   */
  protected $model;

  /**
   * ProvinceRepository constructor.
   */
  public function __construct(Province $model)
  {
    $this->model = $model;
  }

  /**
   * Search provinces with pagination
   *
   * @param string $search
   * @param int $perPage
   * @param int $page
   * @return LengthAwarePaginator
   */
  public function search(string $search = '', int $perPage = 10, int $page = 1): LengthAwarePaginator
  {

    return $this->model::search($search)
      ->orderBy('name')
      ->paginate(
        perPage: $perPage,
        page: $page
      );
  }

  public function getAllProvince(): Collection
  {
    return $this->model
      ->orderBy('name')
      ->get();
  }
}
