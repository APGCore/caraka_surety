<?php

use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
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
         Schema::create('submission_principals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('headquarter_id')->nullable();
            $table->foreignIdFor(Province::class, 'province_id')->nullable()
                ->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Regency::class, 'regency_id')->nullable()
                ->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(District::class, 'district_id')->nullable()
                ->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->string('village')->nullable();
            $table->string('name');
            $table->string('address');
            $table->string('postal_code');
            $table->string('telephone');
            $table->string('fax')->nullable();
            $table->string('pic')->nullable();
            $table->string('npwp')->nullable();
            $table->string('nib')->nullable();
            $table->string('siup_siujk')->nullable();
            $table->string('head_name')->nullable();
            $table->string('business_fields')->nullable();
            $table->string('director_name');
            $table->string('director_position')->nullable();
            $table->string('director_phone')->nullable();
            $table->string('commissioner')->nullable();
            $table->string('year_established')->nullable();
            $table->string('est_deed')->nullable();
            $table->string('last_deed')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->text('picture')->nullable();
            $table->foreignIdFor(\App\Models\User::class, 'created_by')->nullable()
                ->references('id')->on('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_principal');
    }
};
