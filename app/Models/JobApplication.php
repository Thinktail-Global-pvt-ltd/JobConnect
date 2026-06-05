<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'applicant_id',
        'job_post_id',
        'employer_id',
        'status', // new, contacted, shortlisted, hired, rejected
    ];

    /**
     * Relationship with applicant.
     */
    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    /**
     * Relationship with job post.
     */
    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }

    /**
     * Relationship with employer.
     */
    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
