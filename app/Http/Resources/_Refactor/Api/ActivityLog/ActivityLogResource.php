<?php

namespace App\Http\Resources\_Refactor\Api\ActivityLog;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {

    return [
      ...parent::toArray($request),
    ];
  }
}
