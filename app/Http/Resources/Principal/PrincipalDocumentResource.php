<?php

namespace App\Http\Resources\Principal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PrincipalDocumentResource extends JsonResource
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
            'path' => $this->resource->url
              ? Storage::url($this->resource->url) : null,
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
