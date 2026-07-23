<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDeviceToken extends Model
{
    use HasFactory;

    protected $table = 'user_device_tokens';

    protected $fillable = [
        'user_id',
        'fcm_token',
        'device_type',
        'device_name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the User that owns the device token.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
