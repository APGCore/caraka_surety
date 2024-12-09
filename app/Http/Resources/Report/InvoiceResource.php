<?php

namespace App\Http\Resources\Report;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'blank' => $this->whenLoaded('blank', function () {
                return [
                    'id' => $this->resource->blank->id,
                    'number' => $this->resource->blank->number,
                ];
            }),
            'principal' => $this->whenLoaded('principal', function () {
                return [
                    'id' => $this->resource->principal->id,
                    'name' => $this->resource->principal->name,
                ];
            }),
            'obligee' => $this->whenLoaded('obligee', function () {
                return [
                    'id' => $this->resource->obligee->id,
                    'name' => $this->resource->obligee->name,
                ];
            }),
            'no_guarantee' => $this->resource->no_guarantee,
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
