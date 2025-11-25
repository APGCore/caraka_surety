<?php

namespace App\Http\Resources\Submission;

use App\Enums\SubmissionStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $employeeLimit = $this->resource->relationLoaded('employeeLimit') ? $this->resource->employeeLimit->firstWhere('employee_id', auth()->id()) : null;
        $productLimit = $this->resource->relationLoaded('guarantorProductTypeLimit') ? $this->resource->guarantorProductTypeLimit : null;
        $employeeLimit = $employeeLimit ? ($this->resource->submission_inherit_id ? $employeeLimit->limit_inherit : $employeeLimit->limit) : 0;
        $productLimit = $productLimit ? ($this->resource->submission_inherit_id ? $productLimit->limit_inherit : $productLimit->limit) : 0;

        return [
            ...parent::toArray($request),
            'no_guarantee' => $this->resource->status === SubmissionStatus::PROCESS->value ? str_pad('X', 16, 'X') : $this->resource->no_guarantee,
            'status_label' => SubmissionStatus::getLabels()[$this->resource->status] ?? null,
            'start_date' => $this->resource->start_date ? Carbon::parse($this->resource->start_date)->format('d F Y') : null,
            'end_date' => $this->resource->end_date ? Carbon::parse($this->resource->end_date)->format('d F Y') : null,
            'created_at' => $this->resource->created_at ? Carbon::parse($this->resource->created_at)->format('d F Y H:i') : null,
            'approved_at' => $this->resource->approved_at ? Carbon::parse($this->resource->approved_at)->format('d F Y H:i') : null,
            'rejected_at' => $this->resource->rejected_at ? Carbon::parse($this->resource->rejected_at)->format('d F Y H:i') : null,
            'send_to_guarantor_at' => $this->resource->send_to_guarantor_at ? Carbon::parse($this->resource->send_to_guarantor_at)->format('d F Y H:i') : null,
            'blank' => $this->resource->relationLoaded('blank') ? $this->resource->blank : null,
            'principal' => $this->resource->relationLoaded('principal') ? [
                'id' => $this->resource->principal->id,
                'name' => $this->resource->principal->name,
            ] : null,
            'guarantor' => $this->resource->relationLoaded('guarantor') ? [
                'id' => $this->resource->guarantor->id,
                'name' => $this->resource->guarantor->name,
            ] : null,
            'guarantor_branch' => $this->resource->relationLoaded('guarantorBranch') ? [
                'id' => $this->resource->guarantorBranch->id,
                'name' => $this->resource->guarantorBranch->name,
            ] : null,
            'product' => $this->resource->relationLoaded('product') ? [
                'id' => $this->resource->product->id,
                'name' => $this->resource->product->name,
            ] : null,
            'product_type' => $this->resource->relationLoaded('guarantorToProductType') ? [
                'id' => $this->resource->guarantorToProductType->id,
                'name' => $this->resource->guarantorToProductType->name,
                'full_name' => $this->resource->guarantorToProductType->full_name,
            ] : null,
            'obligee' => $this->resource->relationLoaded('obligee') ? [
                'id' => $this->resource->obligee->id,
                'name' => $this->resource->obligee->name,
            ] : null,
            'staff' => $this->resource->relationLoaded('staff') ? [
                'id' => $this->resource->staff->id,
                'name' => $this->resource->staff->name,
            ] : null,
            'office' => $this->resource->relationLoaded('office') ? [
                'id' => $this->resource->office->id,
                'name' => $this->resource->office->name,
                'code' => $this->resource->office->code,
                'office_type' => $this->resource->office->office_type,
            ] : null,
            'submission_before' => $this->resource->relationLoaded('submissionBefore') ? [
                'id' => $this->resource->submissionBefore->id,
                'blank' => $this->resource->submissionBefore->blank,
            ] : null,
            'employee_limit' => $employeeLimit,
            'product_limit' => $productLimit,
            'beyond_the_limit' => $employeeLimit < $this->resource->guarantee_value,
            'can_revised' => $this->resource->can_revised,
        ];
    }
}
