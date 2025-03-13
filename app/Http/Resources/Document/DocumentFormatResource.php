<?php

namespace App\Http\Resources\Document;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentFormatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if ($this->resource->guarantor_id !== null && $this->resource->product_id === null && $this->resource->produk_type_id === null) {
            $type = 'Per Asuransi';
        } elseif ($this->resource->product_id !== null && $this->resource->produk_type_id === null) {
            $type = 'Per Produk';
        } elseif ($this->resource->produk_type_id !== null) {
            $type = 'Per Jenis Jaminan';
        } else {
            $type = 'Umum';
        }

        return [
            ...parent::toArray($request),
            'type' => $type,
            'created_at' => $this->resource->created_at?->format('d F Y'),
        ];
    }
}
