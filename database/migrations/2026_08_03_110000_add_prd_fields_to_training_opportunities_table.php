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
        Schema::table('training_opportunities', function (Blueprint $table) {
            if (!Schema::hasColumn('training_opportunities', 'employer_details')) {
                $table->text('employer_details')->nullable();
            }
            if (!Schema::hasColumn('training_opportunities', 'skills_covered')) {
                $table->text('skills_covered')->nullable();
            }
            if (!Schema::hasColumn('training_opportunities', 'benefits')) {
                $table->text('benefits')->nullable();
            }
            if (!Schema::hasColumn('training_opportunities', 'placement_opportunities')) {
                $table->text('placement_opportunities')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_opportunities', function (Blueprint $table) {
            $table->dropColumn([
                'employer_details',
                'skills_covered',
                'benefits',
                'placement_opportunities'
            ]);
        });
    }
};
