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
        Schema::create('employer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('business_name');
            $table->string('industry_segment');
            $table->string('business_location');
            $table->string('contact_person_name');
            $table->string('business_mobile');
            $table->string('business_email')->nullable();
            $table->string('preferred_language');
            $table->string('company_logo_path')->nullable();
            $table->json('operational_locations')->nullable();
            $table->string('nominee_name');
            $table->string('nominee_relationship');
            $table->string('nominee_mobile');
            $table->boolean('is_completed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employer_profiles');
    }
};
