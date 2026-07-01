<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RoleLoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test login page view renders correctly.
     */
    public function test_login_page_renders_with_role_options(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
        $response->assertSee('Job Seeker');
        $response->assertSee('Employer');
    }

    /**
     * Test submit login validation fails without role.
     */
    public function test_submit_login_fails_without_role(): void
    {
        $response = $this->post('/api/login', [
            'mobile_number' => '9999999999',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['login_role']);
    }

    /**
     * Test submit login success redirects with role and mobile.
     */
    public function test_submit_login_success_redirects_with_role(): void
    {
        $response = $this->post('/api/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'employer',
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'success' => true,
        ]);
        $response->assertSessionHas('demo_otp');
    }

    /**
     * Test verify otp for employer redirects to profile with posted jobs.
     */
    public function test_verify_otp_for_employer_redirects_correctly(): void
    {
        // 1. Submit login to generate OTP
        $this->post('/api/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'employer',
        ]);

        $cachedOtp = Cache::get('web_otp_9999999999');
        $this->assertNotNull($cachedOtp);

        // 2. Submit OTP verify
        $response = $this->post('/api/verify-otp', [
            'mobile_number' => '9999999999',
            'otp' => $cachedOtp,
            'login_role' => 'employer',
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'success' => true,
        ]);
        
        // Assert user was created and has active employer role
        $user = User::where('mobile_number', '9999999999')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasActiveRole(UserRole::ROLE_EMPLOYER));
        $this->assertFalse($user->hasActiveRole(UserRole::ROLE_JOB_SEEKER));
    }

    /**
     * Test verify otp for job seeker redirects to home feed.
     */
    public function test_verify_otp_for_job_seeker_redirects_correctly(): void
    {
        // 1. Submit login to generate OTP
        $this->post('/api/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'job_seeker',
        ]);

        $cachedOtp = Cache::get('web_otp_9999999999');
        $this->assertNotNull($cachedOtp);

        // 2. Submit OTP verify
        $response = $this->post('/api/verify-otp', [
            'mobile_number' => '9999999999',
            'otp' => $cachedOtp,
            'login_role' => 'job_seeker',
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'success' => true,
        ]);
        
        // Assert user was created and has active job seeker role
        $user = User::where('mobile_number', '9999999999')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasActiveRole(UserRole::ROLE_JOB_SEEKER));
        $this->assertFalse($user->hasActiveRole(UserRole::ROLE_EMPLOYER));
    }

    /**
     * Test JSON response format for submit login.
     */
    public function test_submit_login_returns_json_when_requested(): void
    {
        $response = $this->postJson('/api/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'employer',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'demo_otp',
            'mobile',
            'login_role',
        ]);
        $response->assertJsonFragment([
            'success' => true,
            'mobile' => '9999999999',
            'login_role' => 'employer',
        ]);
    }

    /**
     * Test JSON response format for verify OTP.
     */
    public function test_submit_verify_returns_json_when_requested(): void
    {
        // 1. Generate OTP
        $this->postJson('/api/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'employer',
        ]);

        $cachedOtp = Cache::get('web_otp_9999999999');
        $this->assertNotNull($cachedOtp);

        // 2. Verify OTP
        $response = $this->postJson('/api/verify-otp', [
            'mobile_number' => '9999999999',
            'otp' => $cachedOtp,
            'login_role' => 'employer',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'token',
            'user' => [
                'id',
                'mobile_number',
                'active_role',
            ],
        ]);
        $response->assertJsonFragment([
            'success' => true,
        ]);
    }

    /**
     * Test submit login when already logged in returns JSON directly.
     */
    public function test_submit_login_when_already_logged_in_returns_json(): void
    {
        // 1. Create a user and authenticate them
        $user = User::create([
            'mobile_number' => '8799730966',
            'is_suspended' => false,
        ]);
        
        $this->actingAs($user);

        // 2. Submit login with the same mobile number
        $response = $this->post('/api/login', [
            'mobile_number' => '8799730966',
            'login_role' => 'employer',
        ]);

        // 3. Assert JSON response indicating already logged in with token and user details
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'success' => true,
            'message' => 'Already logged in.',
        ]);
        $response->assertJsonStructure([
            'success',
            'message',
            'token',
            'user' => [
                'id',
                'mobile_number',
                'active_role',
            ],
        ]);
    }

    /**
     * Test Sanctum token revocation on API logout.
     */
    public function test_api_logout_invalidates_sanctum_token(): void
    {
        $user = \App\Models\User::create([
            'mobile_number' => '7777777777',
            'full_name' => 'Test User',
            'is_suspended' => false,
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->postJson('/api/logout');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Logged out and token revoked successfully.',
        ]);

        // Assert token is revoked in database
        $this->assertEquals(0, $user->tokens()->count());
    }
}
