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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->foreignIdFor(Province::class)->constrained()
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Regency::class, 'regency_id')->constrained()
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(District::class, 'district_id')->constrained()
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->string('village')->nullable();
            $table->string('postal_code')->nullable();
            $table->boolean('is_central')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
