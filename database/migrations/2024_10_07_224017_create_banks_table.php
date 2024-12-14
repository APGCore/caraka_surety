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
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
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
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banks');
    }
};
