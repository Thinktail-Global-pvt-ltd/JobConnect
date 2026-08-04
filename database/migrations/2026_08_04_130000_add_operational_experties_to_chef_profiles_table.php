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
        if (Schema::hasTable('chef_profiles')) {
            if (!Schema::hasColumn('chef_profiles', 'operational_experties')) {
                Schema::table('chef_profiles', function (Blueprint $table) {
                    $table->text('operational_experties')->nullable()->after('cuisine_specialty');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('chef_profiles')) {
            if (Schema::hasColumn('chef_profiles', 'operational_experties')) {
                Schema::table('chef_profiles', function (Blueprint $table) {
                    $table->dropColumn('operational_experties');
                });
            }
        }
    }
};
