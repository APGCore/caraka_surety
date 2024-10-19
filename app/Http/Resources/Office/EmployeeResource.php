<?php

namespace App\Http\Resources\Office;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
            'position' => $this->resource->role->name,
            'employee_limit' => $this->whenLoaded('employeeLimit', function () {
                return $this->resource->employeeLimit->first();
            }),
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
