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
        $query = AdminPost::with('creator')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $posts = $query->paginate(15);

        return response()->json([
            'success' => true,
            'posts'   => $posts,
            'stats'   => [
                'total'     => AdminPost::count(),
                'published' => AdminPost::where('status', 'published')->count(),
                'draft'     => AdminPost::where('status', 'draft')->count(),
                'archived'  => AdminPost::where('status', 'archived')->count(),
            ],
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
        $post = AdminPost::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|string|max:255',
            'body'         => 'sometimes|string',
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
