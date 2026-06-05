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
        $response = $this->get('/dev/login');

        $response->assertStatus(200);
        $response->assertSee('Job Seeker');
        $response->assertSee('Employer');
    }

    /**
     * Test submit login validation fails without role.
     */
    public function test_submit_login_fails_without_role(): void
    {
        $response = $this->post('/dev/login', [
            'mobile_number' => '9999999999',
        ]);

        $response->assertSessionHasErrors(['login_role']);
    }

    /**
     * Test submit login success redirects with role and mobile.
     */
    public function test_submit_login_success_redirects_with_role(): void
    {
        $response = $this->post('/dev/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'employer',
        ]);

        $response->assertRedirect('/verify-otp?mobile=9999999999&login_role=employer');
        $response->assertSessionHas('demo_otp');
    }

    /**
     * Test verify otp for employer redirects to profile with posted jobs.
     */
    public function test_verify_otp_for_employer_redirects_correctly(): void
    {
        // 1. Submit login to generate OTP
        $this->post('/dev/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'employer',
        ]);

        $cachedOtp = Cache::get('web_otp_9999999999');
        $this->assertNotNull($cachedOtp);

        // 2. Submit OTP verify
        $response = $this->post('/verify-otp', [
            'mobile_number' => '9999999999',
            'otp' => $cachedOtp,
            'login_role' => 'employer',
        ]);

        $response->assertRedirect('/profile?section=my_posted_jobs');
        
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
        $this->post('/dev/login', [
            'mobile_number' => '9999999999',
            'login_role' => 'job_seeker',
        ]);

        $cachedOtp = Cache::get('web_otp_9999999999');
        $this->assertNotNull($cachedOtp);

        // 2. Submit OTP verify
        $response = $this->post('/verify-otp', [
            'mobile_number' => '9999999999',
            'otp' => $cachedOtp,
            'login_role' => 'job_seeker',
        ]);

        $response->assertRedirect('/');
        
        // Assert user was created and has active job seeker role
        $user = User::where('mobile_number', '9999999999')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasActiveRole(UserRole::ROLE_JOB_SEEKER));
        $this->assertFalse($user->hasActiveRole(UserRole::ROLE_EMPLOYER));
    }
}
