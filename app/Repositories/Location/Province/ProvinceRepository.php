<?php

namespace App\Repositories\Location\Province;

use App\Models\Location\Province;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProvinceRepository implements ProvinceRepositoryInterface
{
  /**
   * @var Province
   */
  protected $model;

  /**
   * ProvinceRepository constructor.
   *
   * @param Province $model
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
    return $this->model
      ->search($search)
      ->orderBy('name')
      ->paginate(
        perPage: $perPage,
        page: $page
      );
  }
}
