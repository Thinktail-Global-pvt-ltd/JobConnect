<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class WebhookDeployTest extends TestCase
{
    protected string $logPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->logPath = storage_path('logs/webhook.log');
        if (file_exists($this->logPath)) {
            unlink($this->logPath);
        }
    }

    protected function tearDown(): void
    {
        if (file_exists($this->logPath)) {
            unlink($this->logPath);
        }
        parent::tearDown();
    }

    /**
     * Test webhook returns 403 when signature header is missing.
     */
    public function test_webhook_requires_signature_header(): void
    {
        $response = $this->postJson('/webhook/deploy', ['foo' => 'bar']);

        $response->assertStatus(403);
        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Signature header missing.',
        ]);

        $this->assertFileExists($this->logPath);
        $this->assertStringContainsString('Verification FAILED: Signature header missing.', file_get_contents($this->logPath));
    }

    /**
     * Test webhook returns 403 when signature header format is invalid.
     */
    public function test_webhook_rejects_invalid_signature_format(): void
    {
        $response = $this->postJson('/webhook/deploy', ['foo' => 'bar'], [
            'X-Hub-Signature-256' => 'invalidsignature',
        ]);

        $response->assertStatus(403);
        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Invalid signature format.',
        ]);

        $this->assertFileExists($this->logPath);
        $this->assertStringContainsString('Verification FAILED: Invalid signature format:', file_get_contents($this->logPath));
    }

    /**
     * Test webhook returns 403 when signature verification fails.
     */
    public function test_webhook_signature_verification_fails_with_wrong_secret(): void
    {
        putenv('GITHUB_WEBHOOK_SECRET=mysecret');

        $payload = json_encode(['ref' => 'refs/heads/main']);
        $invalidSignature = 'sha256=' . hash_hmac('sha256', $payload, 'wrongsecret');

        $response = $this->post('/webhook/deploy', [], [
            'X-Hub-Signature-256' => $invalidSignature,
            'CONTENT_TYPE' => 'application/json',
        ]);

        $response->assertStatus(403);
        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Signature verification failed.',
        ]);

        $this->assertFileExists($this->logPath);
        $this->assertStringContainsString('Verification FAILED: Signature mismatch.', file_get_contents($this->logPath));
    }

    /**
     * Test webhook executes deployment and returns logs with valid signature.
     */
    public function test_webhook_executes_deployment_on_valid_signature(): void
    {
        putenv('GITHUB_WEBHOOK_SECRET=testsecret');

        // Set up request payload
        $payload = json_encode(['ref' => 'refs/heads/main']);
        $validSignature = 'sha256=' . hash_hmac('sha256', $payload, 'testsecret');

        // Send raw request payload matching the signature calculation
        $response = $this->call('POST', '/webhook/deploy', [], [], [], [
            'HTTP_X-Hub-Signature-256' => $validSignature,
            'CONTENT_TYPE' => 'application/json',
        ], $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'log' => [
                '*' => [
                    'command',
                    'output',
                    'status',
                ],
            ],
        ]);

        // Assert custom log file is generated and contains logs of deployment
        $this->assertFileExists($this->logPath);
        $logContent = file_get_contents($this->logPath);
        
        $this->assertStringContainsString('DEPLOYMENT TRIGGERED', $logContent);
        $this->assertStringContainsString('Verification SUCCESS: Signature matches GITHUB_WEBHOOK_SECRET.', $logContent);
        $this->assertStringContainsString('Executing command: cd /var/www/jobconnect && git pull 2>&1', $logContent);
        $this->assertStringContainsString('DEPLOYMENT COMPLETED', $logContent);
    }
}
