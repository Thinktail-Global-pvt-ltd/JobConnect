<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminPostController extends Controller
{
    /**
     * GET /admin/community-posts
     * List all admin community posts with pagination.
     */
    public function index(Request $request)
    {
        $feedItems = collect();

        // 1. Job Posts
        try {
            $jobPosts = \App\Models\JobPost::with('creator')->latest()->get();
            foreach ($jobPosts as $job) {
                $statusStr = $job->status === 'approved' ? 'Published' : ($job->status === 'rejected' ? 'Archived' : 'Draft');
                
                $creatorRole = strtolower(trim($job->submitted_by_role ?: ($job->creator ? ($job->creator->active_profile ?: $job->creator->user_role) : '')));
                $isReferral = (bool)$job->is_referral || 
                              $job->category === 'community' || 
                              in_array($creatorRole, ['chef', 'cook', 'job_seeker', 'jobseeker', 'talent', 'candidate']);

                $catLabel = strtoupper($job->category ?: 'INDIA');
                $postType = $isReferral ? "REFERRAL JOB ({$catLabel})" : "JOB LISTING ({$catLabel})";

                $feedItems->push([
                    'id'         => 'job_' . $job->id,
                    'raw_id'     => $job->id,
                    'source'     => 'job_post',
                    'uid'        => 'JOB-' . sprintf('%04d', $job->id),
                    'title'      => $job->title,
                    'body'       => ($job->company ?? ($job->creator ? $job->creator->full_name : 'Employer')) . ' • ' . ($job->location ?? 'India'),
                    'post_type'  => $postType,
                    'is_referral' => $isReferral,
                    'status'     => $statusStr,
                    'is_pinned'  => (bool)$job->is_pinned,
                    'created_at' => $job->created_at ? $job->created_at->toIso8601String() : null,
                    'timestamp'  => $job->created_at ? $job->created_at->timestamp : 0,
                    'date'       => $job->created_at ? $job->created_at->format('M d, Y') : 'Recently',
                ]);
            }
        } catch (\Throwable $e) {}

        // 2. Admin Posts
        try {
            $adminPosts = AdminPost::latest()->get();
            foreach ($adminPosts as $post) {
                $statusStr = $post->status === 'published' ? 'Published' : ($post->status === 'archived' ? 'Archived' : 'Draft');
                $feedItems->push([
                    'id'         => 'post_' . $post->id,
                    'raw_id'     => $post->id,
                    'source'     => 'admin_post',
                    'uid'        => 'AN-' . sprintf('%04d', $post->id),
                    'title'      => $post->title,
                    'body'       => $post->body,
                    'post_type'  => $post->post_type ?? 'Community Announcement',
                    'status'     => $statusStr,
                    'is_pinned'  => (bool)$post->is_pinned,
                    'created_at' => $post->created_at ? $post->created_at->toIso8601String() : null,
                    'timestamp'  => $post->created_at ? $post->created_at->timestamp : 0,
                    'date'       => $post->created_at ? $post->created_at->format('M d, Y') : 'Recently',
                ]);
            }
        } catch (\Throwable $e) {}

        // 3. Training Opportunities
        try {
            $trainings = \App\Models\TrainingOpportunity::latest()->get();
            foreach ($trainings as $train) {
                $feedItems->push([
                    'id'         => 'train_' . $train->id,
                    'raw_id'     => $train->id,
                    'source'     => 'training',
                    'uid'        => 'TO-' . sprintf('%04d', $train->id),
                    'title'      => $train->program_name ?? 'Training Program',
                    'body'       => ($train->provider_name ?? 'Jobrito') . ' • ' . ($train->location ?? 'Overseas'),
                    'post_type'  => 'Training & Overseas',
                    'status'     => 'Published',
                    'is_pinned'  => (bool)$train->is_pinned,
                    'created_at' => $train->created_at ? $train->created_at->toIso8601String() : null,
                    'timestamp'  => $train->created_at ? $train->created_at->timestamp : 0,
                    'date'       => $train->created_at ? $train->created_at->format('M d, Y') : 'Recently',
                ]);
            }
        } catch (\Throwable $e) {}

        $sortedItems = $feedItems->sort(function($a, $b) {
            if ($a['is_pinned'] !== $b['is_pinned']) {
                return $b['is_pinned'] ? 1 : -1;
            }
            return $b['timestamp'] - $a['timestamp'];
        })->values();

        return response()->json([
            'success' => true,
            'posts'   => $sortedItems,
            'stats'   => [
                'total'     => $sortedItems->count(),
                'published' => $sortedItems->where('status', 'Published')->count(),
                'drafts'    => $sortedItems->where('status', 'Draft')->count(),
                'archived'  => $sortedItems->where('status', 'Archived')->count(),
                'pinned'    => $sortedItems->where('is_pinned', true)->count(),
            ]
        ]);
    }

    /**
     * POST /admin/community-posts
     * Create a new admin post to inject into the community feed.
     *
     * Body params:
     *   title        (required)  string
     *   body         (required)  string
     *   post_type    (optional)  announcement|update|training|banner|general
     *   image_url    (optional)  url
     *   cta_label    (optional)  string  e.g. "Register Now"
     *   cta_url      (optional)  url
     *   status       (optional)  published|draft|archived  (default: published)
     *   publish_at   (optional)  datetime  ISO 8601 for future scheduling
     *   inject_every (optional)  integer   default 2  (every N job posts, inject this)
     */
    public function store(Request $request)
    {
        // Admin-only guard (simple check — strengthen with middleware in production)
        $user = $request->user();
        if (!$user || $user->role_type !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title'        => 'required|string|max:255',
            'body'         => 'required|string',
            'post_type'    => 'nullable|string|in:announcement,update,training,banner,general',
            'image_url'    => 'nullable|url',
            'cta_label'    => 'nullable|string|max:100',
            'cta_url'      => 'nullable|url',
            'status'       => 'nullable|string|in:published,draft,archived',
            'publish_at'   => 'nullable|date',
            'inject_every' => 'nullable|integer|min:1|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $post = AdminPost::create(array_merge($validator->validated(), [
            'created_by'   => $user->id,
            'status'       => $request->status ?? 'published',
            'post_type'    => $request->post_type ?? 'announcement',
            'inject_every' => $request->inject_every ?? 2,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Admin post created successfully.',
            'post'    => $post,
        ], 201);
    }

    /**
     * PUT /admin/community-posts/{id}
     * Update an existing admin post.
     */
    public function update(Request $request, $id)
    {
        if (str_starts_with($id, 'job_')) {
            $rawId = str_replace('job_', '', $id);
            $job = \App\Models\JobPost::find($rawId);
            if ($job) {
                $status = strtolower($request->status ?? 'approved');
                $dbStatus = ($status === 'published' || $status === 'approved') ? 'approved' : (($status === 'archived' || $status === 'rejected') ? 'rejected' : 'pending');
                $job->update(['status' => $dbStatus]);
                return response()->json(['success' => true, 'job' => $job, 'status' => 'Published']);
            }
        }

        $cleanId = str_replace(['job_', 'post_'], '', $id);
        $post = AdminPost::find($cleanId);
        if (!$post) {
            $job = \App\Models\JobPost::find($cleanId);
            if ($job) {
                $status = strtolower($request->status ?? 'approved');
                $dbStatus = ($status === 'published' || $status === 'approved') ? 'approved' : (($status === 'archived' || $status === 'rejected') ? 'rejected' : 'pending');
                $job->update(['status' => $dbStatus]);
                return response()->json(['success' => true, 'job' => $job, 'status' => 'Published']);
            }
            return response()->json(['success' => false, 'message' => 'Post not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|string|max:255',
            'body'         => 'sometimes|string',
            'post_type'    => 'nullable|string|in:announcement,update,training,banner,general',
            'image_url'    => 'nullable|url',
            'cta_label'    => 'nullable|string|max:100',
            'cta_url'      => 'nullable|url',
            'status'       => 'nullable|string',
            'publish_at'   => 'nullable|date',
            'inject_every' => 'nullable|integer|min:1|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $post->update($validator->validated());

        return response()->json(['success' => true, 'post' => $post]);
    }

    /**
     * DELETE /admin/community-posts/{id}
     */
    public function destroy($id)
    {
        AdminPost::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Post deleted.']);
    }

    /**
     * POST /admin/community-posts/{id}/publish
     * Quick-publish a draft post.
     */
    public function publish($id)
    {
        $post = AdminPost::findOrFail($id);
        $post->update(['status' => 'published', 'publish_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Post published.']);
    }
}
