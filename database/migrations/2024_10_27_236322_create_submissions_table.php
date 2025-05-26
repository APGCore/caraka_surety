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
            $table->bigInteger('submission_before_id')->nullable()->unsigned();
            $table->bigInteger('submission_inherit_id')->nullable()->unsigned();
            $table->foreignIdFor(Principal::class, 'principal_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->noActionOnDelete();
            $table->foreignId('guarantor_branch_id')->references('id')->on('guarantors')->noActionOnDelete();
            $table->foreignIdFor(Product::class, 'product_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(GuarantorToProductType::class, 'guarantor_to_product_type_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Obligee::class, 'obligee_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Bank::class, 'bank_id')->nullable()->constrained()->noActionOnDelete();
            $table->foreignId('checked_by')->nullable()->references('id')->on('users')->noActionOnDelete();
            $table->foreignId('approved_by')->nullable()->references('id')->on('users')->noActionOnDelete();
            $table->foreignId('rejected_by')->nullable()->references('id')->on('users')->noActionOnDelete();
            $table->foreignId('staff_id')->nullable()->references('id')->on('users')->noActionOnDelete();
            $table->string('no_guarantee');
            $table->string('contract_doc_name')->nullable();
            $table->string('contract_doc_number')->nullable();
            $table->string('contract_doc_date')->nullable();
            $table->float('contract_value');
            $table->float('guarantee_value');
            $table->integer('time_period');
            $table->integer('difference_time_period');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('guarantee_issue_date')->nullable();
            $table->text('job_name')->nullable();
            $table->foreignId('job_location_province_id')->references('id')->on($province->getTable())->noActionOnDelete();
            $table->foreignId('job_location_regency_id')->references('id')->on($regency->getTable())->noActionOnDelete();
            $table->foreignId('job_location_district_id')->references('id')->on($district->getTable())->noActionOnDelete();
            $table->string('job_location_village');
            $table->text('job_location_address');
            $table->string('job_location_postal_code', 10);
            $table->foreignId('source_of_fund_id')->references('id')->on('source_of_funds')->noActionOnDelete();
            $table->enum('status', SubmissionStatus::getValues())->default(SubmissionStatus::PROCESS->value); // status
            $table->text('note')->nullable();
            $table->text('note_scoring')->nullable();
            $table->text('min_point_scoring')->nullable();
            $table->text('risk_mitigation')->nullable();
            $table->boolean('has_send_to_guarantor')->default(false);
            $table->boolean('is_revised')->default(false);
            $table->boolean('is_added_qrcode')->default(false);
            $table->text('revised_note')->nullable();
            $table->integer('first_year_ratio')->nullable();
            $table->integer('last_year_ratio')->nullable();
            $table->timestamp('publication_date')->nullable();
            $table->string('publication_place')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->foreign('submission_before_id')->references('id')->on('submissions')->nullOnDelete();
            $table->foreign('submission_inherit_id')->references('id')->on('submissions')->nullOnDelete();
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
