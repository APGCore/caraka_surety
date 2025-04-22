<?php

namespace App\Http\Resources\Office;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $limit = $this->profileLimit->first();

    return [
      'id' => $this->id,
      'name' => $this->name,
      'office_name' => $this->name,
      'profile_limit_id' => $limit ? $limit->id : null,
      'limit' => $limit ? $limit->limit : 0,
      'limit_inherit' => $limit ? $limit->limit_inherit : 0,
      'product_type' => $limit?->guarantorToProductType?->productType?->name ?? 'Belum diatur',
      'created_at' => $this->created_at->format('d-m-Y'),
    ];
  }
}
