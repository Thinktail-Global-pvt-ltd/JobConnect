<?php

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
        Schema::create('training_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('program_name');
            $table->string('provider_name');
            $table->text('description');
            $table->text('contact_information');
            $table->string('location')->nullable();
            $table->string('price')->nullable();
            $table->string('external_link')->nullable();
            $table->timestamps();

            // Performance index
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_opportunities');
    }
};
