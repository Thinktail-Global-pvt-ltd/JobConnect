<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserNotificationHistory extends Model
{
    use HasFactory;

    protected $table = 'user_notification_histories';

    protected $fillable = [
        'user_id',
        'type',
        'recipient',
        'title',
        'body',
        'status',
        'is_read',
        'metadata',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'metadata' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            self::ensureTableExists();
        });
    }

    /**
     * Ensure user_notification_histories table & columns exist automatically on MySQL database.
     */
    public static function ensureTableExists()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('user_notification_histories')) {
                \Illuminate\Support\Facades\Schema::create('user_notification_histories', function ($table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string('type')->default('fcm');
                    $table->string('recipient')->nullable();
                    $table->string('title')->nullable();
                    $table->text('body')->nullable();
                    $table->string('status')->default('sent');
                    $table->boolean('is_read')->default(false);
                    $table->json('metadata')->nullable();
                    $table->timestamps();
                });
            } else {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('user_notification_histories', 'is_read')) {
                    \Illuminate\Support\Facades\Schema::table('user_notification_histories', function ($table) {
                        $table->boolean('is_read')->default(false);
                    });
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ensureTableExists Exception: ' . $e->getMessage());
        }
    }

    /**
     * Get the recipient User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
