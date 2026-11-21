import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage.js';
import { DeliveryAgentPage } from '../pages/DeliveryAgentPage.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@practicesoftwaretesting.com';
const AGENT_EMAIL = process.env.AGENT_EMAIL || 'agent.alex@shopsphere.test';
const BASE_URL = process.env.BASE_URL || 'https://samecommers.netlify.app';

test.describe('ShopSphere - Comprehensive Forgot & Reset Password Suite (EP & BVA)', () => {
  let authPage;
  let agentPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    agentPage = new DeliveryAgentPage(page);
    await authPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // =========================================================================
  // 1. EQUIVALENCE PARTITIONING: FORGOT PASSWORD EMAIL REQUEST
  // =========================================================================

  test('TC-FP-EP-01 (+ve): [Valid Partition] Customer requests reset OTP for registered account', async ({ page, request }) => {
    const timestamp = Date.now();
    const uniqueEmail = `qa.cust.ep01.${timestamp}@shopsphere.test`;

    // 1. Pre-condition: Register unique customer
    const regRes = await request.post(`${BASE_URL}/api/users/register`, {
      data: {
        name: 'EP Test Customer',
        email: uniqueEmail,
        password: 'InitialPassword@123',
        phone: '+91 98765 00001',
      },
    });
    expect([200, 201]).toContain(regRes.status());

    // 2. Open forgot password tab
    await authPage.openForgotPassword();
    await expect(authPage.forgotEmailInput).toBeVisible();

    // 3. Submit valid registered email
    await authPage.forgotEmailInput.fill(uniqueEmail);
    await authPage.forgotSubmitBtn.click();

    // 4. Verify positive success confirmation
    await expect(authPage.forgotSuccessMsg).toBeVisible();
    await expect(authPage.forgotSuccessMsg).toContainText(/password reset OTP and reset link have been sent/i);
    await expect(authPage.btnProceedToReset).toBeVisible();
  });

  test('TC-FP-EP-02 (+ve): [Valid Partition] Delivery Agent requests recovery OTP via Agent Portal', async ({ page, request }) => {
    const timestamp = Date.now();
    const agentEmail = `qa.agent.ep02.${timestamp}@shopsphere.test`;

    // 1. Pre-condition: Register delivery agent
    await request.post(`${BASE_URL}/api/agent/register`, {
      data: {
        name: 'EP Agent Priya',
        email: agentEmail,
        phone: '+91 98765 00002',
        gender: 'female',
        vehicleType: 'Scooter',
        deliveryZone: 'Hitech City, Hyderabad',
      },
    });

    // 2. Open Agent Portal -> Forgot Password
    await agentPage.openViaHeader();
    await agentPage.openAgentForgotPassword();
    await expect(agentPage.forgotEmailInput).toBeVisible();

    // 3. Submit agent email
    await agentPage.forgotEmailInput.fill(agentEmail);
    await agentPage.forgotSubmitBtn.click();

    // 4. Verify agent recovery notification
    await expect(page.getByText(/password reset OTP and reset link have been sent/i)).toBeVisible();
    await expect(agentPage.linkAgentHaveOtp).toBeVisible();
  });

  test('TC-FP-EP-03 (-ve): [Security Partition] Administrator self-service reset is strictly blocked (HTTP 403)', async ({ page, request }) => {
    // 1. UI Check: Submit admin email
    await authPage.openForgotPassword();
    await authPage.forgotEmailInput.fill(ADMIN_EMAIL);
    await authPage.forgotSubmitBtn.click();

    // Verify explicit security restriction message
    await expect(authPage.forgotErrorMsg).toBeVisible();
    await expect(authPage.forgotErrorMsg).toContainText(/restricted for administrator accounts/i);

    // 2. Direct API Check: Ensure backend enforces HTTP 403 Forbidden
    const apiRes = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: { email: ADMIN_EMAIL },
    });
    expect(apiRes.status()).toBe(403);
    const body = await apiRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/restricted for administrator accounts/i);
  });

  test('TC-FP-EP-04 (-ve): [Invalid Partition] Unregistered email returns account not found', async ({ page, request }) => {
    const unknownEmail = `unknown.phantom.${Date.now()}@notregistered.test`;

    await authPage.openForgotPassword();
    await authPage.forgotEmailInput.fill(unknownEmail);
    await authPage.forgotSubmitBtn.click();

    await expect(authPage.forgotErrorMsg).toBeVisible();
    await expect(authPage.forgotErrorMsg).toContainText(/no registered account found/i);

    // Direct API verification
    const apiRes = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: { email: unknownEmail },
    });
    expect(apiRes.status()).toBe(404);
  });

  test('TC-FP-EP-05 (-ve): [Invalid Format Partition] Malformed email is rejected by client validation', async () => {
    await authPage.openForgotPassword();

    // Invalid format without domain
    await authPage.forgotEmailInput.fill('invalid-email-address');
    const isValid = await authPage.forgotEmailInput.evaluate((el) => el.checkValidity());
    expect(isValid).toBe(false);
  });

  // =========================================================================
  // 2. BOUNDARY VALUE ANALYSIS: PASSWORD LENGTH (MIN 6 CHARACTERS)
  // =========================================================================

  test('TC-FP-BVA-01 (-ve): [Lower Boundary: 5 Chars (N-1)] Password reset rejects 5-character password', async ({ page }) => {
    await authPage.openForgotPassword();
    await authPage.linkHaveOtp.click();

    // Attempt reset with 5 characters (1 below minimum boundary)
    await authPage.resetEmailInput.fill('customer@practicesoftwaretesting.com');
    await authPage.resetOtpInput.fill('123456');
    await authPage.resetPasswordInput.fill('12345');
    await authPage.resetConfirmPasswordInput.fill('12345');

    // Check HTML5 input constraint validation (minLength = 6)
    const isValid = await authPage.resetPasswordInput.evaluate((el) => el.checkValidity());
    expect(isValid).toBe(false);
  });

  test('TC-FP-BVA-02 (+ve): [Boundary: Exactly 6 Chars (N)] 6-character password satisfies minimum boundary', async ({ page, request }) => {
    const timestamp = Date.now();
    const testEmail = `qa.bva6.${timestamp}@shopsphere.test`;

    // 1. Create user
    await request.post(`${BASE_URL}/api/users/register`, {
      data: {
        name: 'BVA Tester',
        email: testEmail,
        password: 'OriginalPass@123',
      },
    });

    // 2. Request OTP via API
    await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: { email: testEmail },
    });

    // 3. Navigate to reset screen
    await authPage.openForgotPassword();
    await authPage.linkHaveOtp.click();

    // Fill valid boundary length (6 chars: "Pass01")
    await authPage.resetEmailInput.fill(testEmail);
    await authPage.resetOtpInput.fill('999999'); // intentional invalid OTP to check password length passed client gate
    await authPage.resetPasswordInput.fill('Pass01');
    await authPage.resetConfirmPasswordInput.fill('Pass01');
    await authPage.resetSubmitBtn.click();

    // Client accepts 6 chars; server evaluates OTP validity
    await expect(authPage.resetErrorMsg).toContainText(/invalid verification otp|expired/i);
  });

  test('TC-FP-EP-06 (-ve): [Equivalence: Password Mismatch] Passwords that do not match are blocked', async ({ page }) => {
    await authPage.openForgotPassword();
    await authPage.linkHaveOtp.click();

    await authPage.resetPassword({
      email: 'customer@practicesoftwaretesting.com',
      otp: '123456',
      newPassword: 'SecurePassword@2026',
      confirmPassword: 'DifferentPassword@2026',
    });

    await expect(authPage.resetErrorMsg).toBeVisible();
    await expect(authPage.resetErrorMsg).toContainText(/passwords do not match/i);
  });

  // =========================================================================
  // 3. BOUNDARY VALUE ANALYSIS: OTP INPUT (EXACTLY 6 NUMERIC DIGITS)
  // =========================================================================

  test('TC-FP-BVA-03 (-ve): [Lower Boundary: Empty OTP (0 Chars)] Empty OTP submission is blocked', async ({ page }) => {
    await authPage.openForgotPassword();
    await authPage.linkHaveOtp.click();

    await authPage.resetEmailInput.fill('customer@practicesoftwaretesting.com');
    await authPage.resetOtpInput.fill('');
    await authPage.resetPasswordInput.fill('BrandNewPassword@2026');
    await authPage.resetConfirmPasswordInput.fill('BrandNewPassword@2026');

    // Check HTML5 input constraint validation (required)
    const isValid = await authPage.resetOtpInput.evaluate((el) => el.checkValidity());
    expect(isValid).toBe(false);
  });

  test('TC-FP-BVA-04 (-ve): [Boundary: 5 Digits (N-1)] 5-digit OTP fails verification', async ({ page, request }) => {
    const timestamp = Date.now();
    const testEmail = `qa.otp5.${timestamp}@shopsphere.test`;

    await request.post(`${BASE_URL}/api/users/register`, {
      data: {
        name: 'OTP Boundary Tester',
        email: testEmail,
        password: 'PassWord@123',
      },
    });

    const apiRes = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        email: testEmail,
        otp: '12345', // 5 digits (BVA N-1)
        newPassword: 'NewSecurePassword@123',
      },
    });

    expect(apiRes.status()).toBe(400);
    const body = await apiRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/no active password reset request|invalid/i);
  });

  test('TC-FP-BVA-05 (-ve): [Boundary: 6 Digits (N) Incorrect] 6-digit incorrect OTP is rejected', async ({ page, request }) => {
    const timestamp = Date.now();
    const testEmail = `qa.otp6.${timestamp}@shopsphere.test`;

    await request.post(`${BASE_URL}/api/users/register`, {
      data: {
        name: 'OTP6 Tester',
        email: testEmail,
        password: 'PassWord@123',
      },
    });

    // Request reset OTP
    await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: { email: testEmail },
    });

    // Submit wrong 6-digit OTP
    const resetRes = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        email: testEmail,
        otp: '000000',
        newPassword: 'NewPassword@123',
      },
    });

    expect(resetRes.status()).toBe(400);
    const body = await resetRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid verification otp/i);
  });

  // =========================================================================
  // 4. DELIVERY AGENT FORGOT & RESET FLOW VIA AGENT PORTAL
  // =========================================================================

  test('TC-FP-AGENT-01 (-ve): Delivery Agent reset rejects invalid OTP via Portal modal', async ({ page }) => {
    await agentPage.openViaHeader();
    await agentPage.openAgentForgotPassword();
    await agentPage.linkAgentHaveOtp.click();

    await agentPage.resetAgentPassword({
      email: AGENT_EMAIL,
      otp: '000000',
      newPassword: 'BrandNewAgentPassword@123',
    });

    await expect(page.getByText(/invalid verification otp|no active password reset/i)).toBeVisible();
  });

  test('TC-FP-AGENT-02 (-ve): Delivery Agent reset validates matching passwords', async ({ page }) => {
    await agentPage.openViaHeader();
    await agentPage.openAgentForgotPassword();
    await agentPage.linkAgentHaveOtp.click();

    await agentPage.resetAgentPassword({
      email: AGENT_EMAIL,
      otp: '123456',
      newPassword: 'AgentPassword@1',
      confirmPassword: 'AgentPassword@2',
    });

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });
});
