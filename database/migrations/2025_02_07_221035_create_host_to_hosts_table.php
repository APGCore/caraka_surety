<?php

use App\Models\Guarantor\Guarantor;
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
        Schema::create('host_to_hosts', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete();
            $table->string('guarantor_name');
            $table->string('guarantor_url_host');
            $table->string('token')->nullable();
            $table->date('accessed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('host_to_hosts');
    }
};
