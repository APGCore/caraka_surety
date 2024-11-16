<?php

namespace App\Http\Resources\Scoring;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScoringQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        Carbon::setLocale('id');
        // Get the category
        $category = $this->resource->category;

        // Handle case when there's no category
        if (is_null($category)) {
            return [
                'id' => $this->resource->id,
                'name' => $this->resource->name,
                'count_options' => count($this->resource->options),
                'created_at' => $this->resource->created_at->translatedFormat('d F Y'),
                'scoring_id' => null, // No scoring available if category is null
                'category_id' => null,
            ];
        }

        // If category exists, get the scoring
        $scoring = $category->scoring;

        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'count_options' => count($this->resource->options),
            'created_at' => $this->resource->created_at->translatedFormat('d F Y'),
            'scoring_id' => $scoring->id,
            'category_id' => $category->id,
        ];
    }
}
