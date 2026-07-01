<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class EmployerOnboardingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper to create a user with a specific active role.
     */
    protected function createUser(string $role = 'employer')
    {
        $user = \App\Models\User::create([
            'mobile_number' => '8799730966',
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'city' => 'Delhi',
            'is_suspended' => false,
        ]);

        \App\Models\UserRole::create([
            'user_id' => $user->id,
            'role_type' => $role,
            'is_active' => true,
        ]);

        return $user;
    }

    /**
     * Guest cannot access onboarding.
     */
    public function test_guest_cannot_access_onboarding(): void
    {
        $response = $this->get('/employer/onboarding');
        $response->assertRedirect('/login');
    }

    /**
     * Non-employer role redirects with error.
     */
    public function test_non_employer_cannot_access_onboarding(): void
    {
        $user = $this->createUser('job_seeker');

        $response = $this->actingAs($user)
            ->get('/employer/onboarding');

        $response->assertRedirect('/profile');
        $response->assertSessionHas('error');
    }

    /**
     * Employer role can view onboarding page.
     */
    public function test_employer_can_access_onboarding(): void
    {
        $user = $this->createUser('employer');

        $response = $this->actingAs($user)
            ->get('/employer/onboarding');

        $response->assertStatus(200)
            ->assertSee('Complete Profile')
            ->assertSee('Business Information');
    }

    /**
     * Submitting the onboarding form validates and saves database records.
     */
    public function test_submitting_onboarding_saves_profile(): void
    {
        $user = $this->createUser('employer');

        $payload = [
            'business_name' => 'The Grand Resort',
            'industry_segment' => 'Hotel & Resort',
            'business_location' => 'Goa, India',
            'contact_person_name' => 'Aryan Jain',
            'business_mobile' => '9999999999',
            'business_email' => 'aryan@resort.com',
            'preferred_language' => 'English (UK)',
            'operational_locations' => [
                'Building 5, Resort Road, Goa',
                'Hotel Wing B, Panaji, Goa'
            ],
            'nominee_name' => 'Jane Nominee',
            'nominee_relationship' => 'General Manager',
            'nominee_mobile' => '8888888888',
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/employer/onboarding/save', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Onboarding completed successfully!',
            ]);

        // Check if database holds the new profile details
        $this->assertDatabaseHas('employer_profiles', [
            'user_id' => $user->id,
            'business_name' => 'The Grand Resort',
            'contact_person_name' => 'Aryan Jain',
            'is_completed' => true,
        ]);

        // Check if user was updated
        $user->refresh();
        $this->assertEquals('Aryan Jain', $user->full_name);
        $this->assertEquals('aryan@resort.com', $user->email);
        $this->assertEquals('Goa, India', $user->city);
    }
}
