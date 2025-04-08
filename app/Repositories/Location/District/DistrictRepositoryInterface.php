<?php

namespace App\Repositories\Location\District;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DistrictRepositoryInterface
{
  /**
   * Search districts with pagination
   *
   * @param string $search
   * @param int $perPage
   * @param int $page
   * @return LengthAwarePaginator
   */
  public function search(string $search = '', int $perPage = 10, int $page = 1): LengthAwarePaginator;

  /**
   * Get districts by regency ID
   *
   * @param int $regencyId
   * @return mixed
   */
  public function getByRegency(int $regencyId);
}
