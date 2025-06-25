<?php

namespace App\Http\Resources\Principal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrincipalResource extends JsonResource
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
            'documents' => $this->whenLoaded('documents', function () {
                return PrincipalDocumentResource::collection($this->resource->documents)->resolve();
            }),
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
