<?php

namespace App\Http\Resources\Scoring;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ScoringQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array

    {
        // Set locale to Indonesian for Carbon
        Carbon::setLocale('id');

        return [
            ...parent::toArray($request),
            "count_options" => $this->resource->options()->count(),
            "created_at" => $this->resource->created_at->translatedFormat('d F Y'),
        ];
    }
}
