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
      'limit' => $limit ? $limit->limit : 'Belum diatur',
      'limit_inherit' => $limit ? $limit->limit_inherit : 'Belum diatur',
      'product_type' => $limit?->guarantorToProductType?->productType?->name ?? 'Belum diatur',
      'created_at' => $this->created_at->format('d-m-Y'),
    ];
  }
}
