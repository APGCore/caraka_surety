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
        Schema::create('guarantors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('headquarter_id')->nullable();
            $table->foreignIdFor(Province::class, 'province_id')
                ->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Regency::class, 'regency_id')
                ->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(District::class, 'district_id')
                ->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->string('village')->nullable();
            $table->string('code', 32);
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('address');
            $table->string('postal_code');
            $table->string('telephone');
            $table->string('fax')->nullable();
            $table->string('pic');
            $table->text('picture')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('guarantors', function (Blueprint $table) {
            $table->foreign('headquarter_id')->references('id')->on('guarantors')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guarantors');
    }
};
