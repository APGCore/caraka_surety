<?php

use App\Enums\SubmissionStatus;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Product\Product;
use App\Models\RelatedParties\Bank;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $province = new Province;
        $regency = new Regency;
        $district = new District;
        Schema::create('submissions', function (Blueprint $table) use ($province, $regency, $district) {
            $table->id();
            $table->foreignIdFor(Principal::class, 'principal_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Product::class, 'product_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(GuarantorToProductType::class, 'guarantor_to_product_type_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Obligee::class, 'obligee_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Bank::class, 'bank_id')->nullable()->constrained()->noActionOnDelete();
            $table->string('contract_doc_name');
            $table->string('contract_doc_number');
            $table->string('contract_doc_date');
            $table->float('contract_value');
            $table->float('guarantee_value');
            $table->integer('time_period');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('guarantee_issue_date')->nullable();
            $table->foreignId('job_location_province_id')->references('id')->on($province->getTable())->noActionOnDelete();
            $table->foreignId('job_location_regency_id')->references('id')->on($regency->getTable())->noActionOnDelete();
            $table->foreignId('job_location_district_id')->references('id')->on($district->getTable())->noActionOnDelete();
            $table->string('job_location_village');
            $table->foreignId('source_of_fund_id')->references('id')->on('source_of_funds')->noActionOnDelete();
            $table->enum('status', SubmissionStatus::getValues())->default(SubmissionStatus::PROCESS->value); // status
            $table->text('note')->nullable();
            $table->text('note_scoring')->nullable();
            $table->text('min_point_scoring')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
