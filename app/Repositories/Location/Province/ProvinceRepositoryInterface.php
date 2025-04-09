<?php

namespace App\Repositories\Location\Province;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProvinceRepositoryInterface
{
  /**
   * Search provinces with pagination
   *
   * @param string $search
   * @param int $perPage
   * @param int $page
   * @return LengthAwarePaginator
   */
  public function search(string $search = '', int $perPage = 10, int $page = 1): LengthAwarePaginator;
}
