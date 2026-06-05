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
        // First delete the default Laravel create_jobs_table migration if it exists
        // Wait, the skeleton has "0001_01_01_000002_create_jobs_table.php" which is Laravel's queue jobs table!
        // Do NOT overwrite queue jobs table. We will name our table "job_posts".
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('category'); // india, overseas, community
            $table->string('company');
            $table->string('salary')->nullable();
            $table->string('location')->nullable();
            $table->text('company_logo_url')->nullable();
            $table->text('contact_info');
            $table->text('description');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->boolean('is_pinned')->default(false);

            // Overseas-specific fields (nullable)
            $table->string('country')->nullable();
            $table->boolean('visa_assistance')->default(false);
            $table->boolean('accommodation_available')->default(false);
            $table->string('contract_duration')->nullable();
            $table->string('experience_range')->nullable();
            $table->json('requirements')->nullable();
            $table->json('benefits')->nullable();

            // Dynamic presentation fields
            $table->string('job_type')->default('Full-time');
            $table->text('showcase_image_url')->nullable();
            $table->text('map_image_url')->nullable();

            $table->timestamps();

            // Performance Indexes
            $table->index(['status', 'is_pinned', 'created_at']);
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};
