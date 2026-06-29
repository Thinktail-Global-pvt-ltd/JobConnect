<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedJob extends Model
{
    protected $fillable = ['user_id', 'job_post_id'];

    /**
     * Get the user who saved the job.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the saved job post details.
     */
    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }
}
