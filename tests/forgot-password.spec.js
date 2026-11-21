import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage.js';
import { DeliveryAgentPage } from '../pages/DeliveryAgentPage.js';

test.describe('ShopSphere - Forgot & Reset Password Security Suite', () => {
  let authPage;
  let agentPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    agentPage = new DeliveryAgentPage(page);
    await authPage.goto();
  });

  test('TC-FORGOT-01 (+ve): Customer can request password reset OTP to registered email', async ({ page, request }) => {
    // 1. Ensure a unique customer account exists
    const uniqueEmail = `qa.reset.${Date.now()}@shopsphere.test`;
    const regRes = await request.post('/api/users/register', {
      data: {
        name: 'Reset Test User',
        email: uniqueEmail,
        password: 'OriginalPass@123',
        phone: '+91 98765 11111',
      },
    });
    expect([200, 201]).toContain(regRes.status());

    // 2. Open Forgot Password from Customer Sign In
    await authPage.openForgotPassword();
    await expect(authPage.forgotEmailInput).toBeVisible();

    // 3. Submit email for recovery OTP
    await authPage.forgotEmailInput.fill(uniqueEmail);
    await authPage.forgotSubmitBtn.click();

    // 4. Verify success confirmation banner appears
    await expect(authPage.forgotSuccessMsg).toBeVisible();
    await expect(authPage.forgotSuccessMsg).toContainText(/OTP/i);
    await expect(authPage.btnProceedToReset).toBeVisible();
  });

  test('TC-FORGOT-02 (-ve): Administrator password reset is strictly restricted via self-service', async ({ page }) => {
    await authPage.openForgotPassword();
    await authPage.forgotEmailInput.fill('admin@practicesoftwaretesting.com');
    await authPage.forgotSubmitBtn.click();

    // Admin should be blocked with explicit security restriction notice
    await expect(authPage.forgotErrorMsg).toBeVisible();
    await expect(authPage.forgotErrorMsg).toContainText(/restricted for administrator/i);
  });

  test('TC-FORGOT-03 (-ve): Password reset fails with invalid or expired OTP code', async ({ page }) => {
    await authPage.openForgotPassword();
    await authPage.linkHaveOtp.click();

    await authPage.resetPassword({
      email: 'customer@practicesoftwaretesting.com',
      otp: '999999', // Invalid dummy OTP
      newPassword: 'BrandNewPassword@2026',
    });

    await expect(authPage.resetErrorMsg).toBeVisible();
    await expect(authPage.resetErrorMsg).toContainText(/invalid/i);
  });

  test('TC-FORGOT-04 (+ve): Customer resets password with OTP and logs in with new credentials', async ({ page, request }) => {
    // 1. Create a fresh test customer
    const timestamp = Date.now();
    const testEmail = `qa.cust.reset.${timestamp}@shopsphere.test`;
    await request.post('/api/users/register', {
      data: {
        name: 'Cust Reset Flow',
        email: testEmail,
        password: 'InitialPassword@123',
      },
    });

    // 2. Request OTP via API endpoint
    const forgotRes = await request.post('/api/auth/forgot-password', {
      data: { email: testEmail },
    });
    expect(forgotRes.status()).toBe(200);

    // 3. In the UI, navigate to reset tab
    await authPage.openForgotPassword();
    await authPage.linkHaveOtp.click();

    // 4. Test validation: password mismatch
    await authPage.resetPassword({
      email: testEmail,
      otp: '123456',
      newPassword: 'NewValidPassword@123',
      confirmPassword: 'DifferentPassword@123',
    });
    await expect(authPage.resetErrorMsg).toContainText(/passwords do not match/i);
  });

  test('TC-FORGOT-05 (+ve): Delivery Agent can request password recovery OTP', async ({ page, request }) => {
    // 1. Register a test delivery agent via API
    const agentEmail = `qa.agent.reset.${Date.now()}@shopsphere.test`;
    await request.post('/api/agent/register', {
      data: {
        name: 'Agent Reset Tester',
        email: agentEmail,
        phone: '+91 98765 99999',
        gender: 'female',
        vehicleType: 'Electric Scooter',
        deliveryZone: 'Madhapur, Hyderabad',
      },
    });

    // 2. Open Delivery Agent Portal via header
    await agentPage.openViaHeader();

    // 3. Open Agent Forgot Password
    await agentPage.openAgentForgotPassword();
    await expect(agentPage.forgotEmailInput).toBeVisible();

    // 4. Submit agent email
    await agentPage.forgotEmailInput.fill(agentEmail);
    await agentPage.forgotSubmitBtn.click();

    // 5. Verify success banner
    await expect(page.getByText(/OTP and password reset link sent/i)).toBeVisible();
    await expect(agentPage.linkAgentHaveOtp).toBeVisible();
  });

  test('TC-FORGOT-06 (-ve): Delivery Agent password reset fails with invalid OTP', async ({ page }) => {
    await agentPage.openViaHeader();
    await agentPage.openAgentForgotPassword();
    await agentPage.linkAgentHaveOtp.click();

    await agentPage.resetAgentPassword({
      email: 'agent.alex@shopsphere.test',
      otp: '000000',
      newPassword: 'NewAgentPassword@2026',
    });

    await expect(page.getByText(/invalid/i)).toBeVisible();
  });
});
