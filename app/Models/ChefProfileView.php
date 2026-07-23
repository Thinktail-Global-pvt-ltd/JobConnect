<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChefProfileView extends Model
{
    use HasFactory;

    protected $table = 'chef_profile_views';

    protected $fillable = [
        'chef_id',
        'employer_id',
        'viewed_at',
    ];

    /**
     * Get the Chef user.
     */
    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    /**
     * Get the Employer user who viewed the profile.
     */
    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
