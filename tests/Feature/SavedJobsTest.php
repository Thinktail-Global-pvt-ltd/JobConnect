<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SavedJobsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper to create a user.
     */
    protected function createUser(string $mobile = '9876543210')
    {
        $user = \App\Models\User::create([
            'mobile_number' => $mobile,
            'full_name' => 'Test User',
            'email' => 'test-' . $mobile . '@example.com',
            'city' => 'London',
            'experience_range' => '0-2 Years',
            'preferred_role' => 'Chef',
            'is_suspended' => false,
        ]);

        // Give them a default active role context
        \App\Models\UserRole::create([
            'user_id' => $user->id,
            'role_type' => 'job_seeker',
            'is_active' => true,
        ]);

        return $user;
    }

    /**
     * Helper to create a job post.
     */
    protected function createJobPost($creatorId)
    {
        return \App\Models\JobPost::create([
            'created_by' => $creatorId,
            'title' => 'Test Job Title',
            'category' => 'india',
            'company' => 'Test Company',
            'salary' => '1000',
            'location' => 'Mumbai',
            'contact_info' => 'test@test.com',
            'description' => 'This is a test job description for testing purposes.',
            'job_type' => 'Full-time',
            'status' => 'approved',
        ]);
    }

    /**
     * Guest cannot toggle save on a job.
     */
    public function test_guest_cannot_toggle_save(): void
    {
        $creator = $this->createUser();
        $job = $this->createJobPost($creator->id);

        $response = $this->postJson("/api/jobs/{$job->id}/save");

        $response->assertStatus(401);
    }

    /**
     * Authenticated user can save and unsave a job.
     */
    public function test_authenticated_user_can_toggle_save(): void
    {
        $user = $this->createUser('8799730966');
        $creator = $this->createUser('9999999999');
        $job = $this->createJobPost($creator->id);

        // 1. Save
        $response = $this->actingAs($user)
            ->postJson("/api/jobs/{$job->id}/save");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'saved' => true,
                'message' => 'Job saved to your favorites!'
            ]);

        $this->assertDatabaseHas('saved_jobs', [
            'user_id' => $user->id,
            'job_post_id' => $job->id
        ]);

        // 2. Unsave
        $response = $this->actingAs($user)
            ->postJson("/api/jobs/{$job->id}/save");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'saved' => false,
                'message' => 'Job removed from saved list.'
            ]);

        $this->assertDatabaseMissing('saved_jobs', [
            'user_id' => $user->id,
            'job_post_id' => $job->id
        ]);
    }

    /**
     * Authenticated user can view their saved jobs page.
     */
    public function test_authenticated_user_can_view_saved_jobs_page(): void
    {
        $user = $this->createUser('8799730966');
        $creator = $this->createUser('9999999999');
        $job = $this->createJobPost($creator->id);
        
        // Save job
        $user->savedJobPosts()->attach($job->id);

        $response = $this->actingAs($user)
            ->get('/profile/saved');

        $response->assertStatus(200)
            ->assertSee($job->title)
            ->assertSee($job->company);
    }

    /**
     * Authenticated user can view their saved jobs via JSON API.
     */
    public function test_authenticated_user_can_view_saved_jobs_json(): void
    {
        $user = $this->createUser('8799730966');
        $creator = $this->createUser('9999999999');
        $job = $this->createJobPost($creator->id);
        
        // Save job
        $user->savedJobPosts()->attach($job->id);

        $response = $this->actingAs($user)
            ->getJson('/api/profile/saved');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'user_id',
                'mobile_number',
                'saved_jobs',
            ])
            ->assertJsonFragment([
                'success' => true,
                'user_id' => $user->id,
            ]);
    }

    /**
     * Guest cannot view applications via JSON API.
     */
    public function test_guest_cannot_view_applications_json(): void
    {
        $response = $this->getJson('/api/profile/applications');
        $response->assertStatus(401);
    }

    /**
     * Authenticated user can view their applications list via JSON API.
     */
    public function test_authenticated_user_can_view_applications_json(): void
    {
        $user = $this->createUser('8799730966');
        $creator = $this->createUser('9999999999');
        $job = $this->createJobPost($creator->id);

        // Apply to job
        \App\Models\JobApplication::create([
            'applicant_id' => $user->id,
            'job_post_id' => $job->id,
            'employer_id' => $creator->id,
            'status' => 'new',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/profile/applications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'user_id',
                'mobile_number',
                'applications',
            ])
            ->assertJsonFragment([
                'success' => true,
                'user_id' => $user->id,
            ]);
    }
}
