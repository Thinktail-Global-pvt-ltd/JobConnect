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
        Schema::create('chef_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('cuisine_specialty');
            $table->text('bio')->nullable();
            $table->string('calendly_link')->nullable();
            $table->text('availability_info')->nullable();
            $table->string('approval_status')->default('pending'); // pending, approved, rejected
            $table->timestamps();

            // Performance index
            $table->index(['approval_status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chef_profiles');
    }
};
