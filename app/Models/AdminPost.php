<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminPost extends Model
{
    protected $table = 'admin_posts';

    protected $fillable = [
        'title',
        'body',
        'post_type',   // announcement, update, training, banner, general
        'image_url',
        'cta_label',
        'cta_url',
        'status',      // published | draft | archived
        'publish_at',
        'inject_every', // after how many feed job items to inject
        'created_by',
    ];

    protected $casts = [
        'publish_at'   => 'datetime',
        'inject_every' => 'integer',
    ];

    /**
     * Relationship — who created this admin post.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope — only published posts that are ready to show.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->where(function ($q) {
                         $q->whereNull('publish_at')
                           ->orWhere('publish_at', '<=', now());
                     });
    }
}
