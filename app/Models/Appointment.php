<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'chef_id',
        'employer_id',
        'meeting_date',
        'meeting_time',
        'purpose',
        'status',
    ];

    /**
     * Relationship with the Chef.
     */
    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    /**
     * Relationship with the Employer.
     */
    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
