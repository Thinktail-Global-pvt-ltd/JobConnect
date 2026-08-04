<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChefProfile extends Model
{
    protected $fillable = [
        'user_id',
        'cuisine_specialty',
        'operational_experties',
        'bio',
        'calendly_link',
        'availability_info',
        'approval_status', // pending, approved, rejected
    ];

    /**
     * Relationship with user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for approved profiles.
     */
    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    /**
     * Scope for pending profiles.
     */
    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }
}
