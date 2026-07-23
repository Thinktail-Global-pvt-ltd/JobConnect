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
        Schema::create('user_notification_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('type'); // 'fcm' or 'whatsapp'
            $table->string('recipient')->nullable(); // Phone number or FCM token
            $table->string('title')->nullable(); // Notification title or template name
            $table->text('body')->nullable(); // Notification body or message content
            $table->string('status')->default('sent'); // 'sent', 'failed', 'delivered'
            $table->json('metadata')->nullable(); // API response details
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_notification_histories');
    }
};
