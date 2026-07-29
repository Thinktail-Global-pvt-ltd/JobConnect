<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSocial extends Model
{
    protected $table = 'user_socials';

    protected $fillable = [
        'user_id',
        'linkedin',
        'instagram',
        'facebook',
        'twitter',
        'youtube',
        'website',
        'github',
        'others',
    ];

    /**
     * Relationship with User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
