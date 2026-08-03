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
        Schema::create('training_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('job_post_id')->nullable();
            $table->unsignedBigInteger('training_id')->nullable();
            $table->unsignedBigInteger('employer_id')->nullable();
            $table->string('status')->default('new');
            $table->string('preferred_call_time')->nullable();
            $table->boolean('is_training')->default(true);
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_applications');
    }
};
