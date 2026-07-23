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
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the recipient User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
