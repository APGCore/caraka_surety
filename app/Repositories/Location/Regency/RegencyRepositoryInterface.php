<?php

namespace App\Repositories\Location\Regency;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RegencyRepositoryInterface
{
  /**
   * Search regencies with pagination
   *
   * @param string $search
   * @param int $perPage
   * @param int $page
   * @return LengthAwarePaginator
   */
  public function search(string $search = '', int $perPage = 10, int $page = 1): LengthAwarePaginator;

  /**
   * Get regencies by province ID
   *
   * @param int $provinceId
   * @return mixed
   */
  public function getByProvince(int $provinceId);
}
