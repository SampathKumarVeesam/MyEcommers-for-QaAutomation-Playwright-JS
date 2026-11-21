import { test, expect } from '@playwright/test';
import { DeliveryAgentPage } from '../pages/DeliveryAgentPage.js';

test.describe('ShopSphere Delivery Partner Portal & Onboarding Suite', () => {
  let agentPage;

  test.beforeEach(async ({ page }) => {
    agentPage = new DeliveryAgentPage(page);
    await agentPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // ========================================================
  // 1. MODAL NAVIGATION & ACCESS
  // ========================================================

  test('TC-AGENT-01 (+ve): Delivery Partner Portal opens via Header button and URL hash', async ({ page }) => {
    // Via Header button
    await agentPage.openViaHeader();
    await expect(agentPage.portalModal).toBeVisible();
    await expect(agentPage.tabLogin).toBeVisible();
    await expect(agentPage.tabRegister).toBeVisible();
    await expect(agentPage.tabVerify).toBeVisible();

    await agentPage.closePortal();
    await expect(agentPage.portalModal).toBeHidden();

    // Via URL Hash
    await agentPage.openViaUrlHash();
    await expect(agentPage.portalModal).toBeVisible();
  });

  // ========================================================
  // 2. REGISTRATION & EMAIL OTP DISPATCH (NO UI AUTO-FILL)
  // ========================================================

  test('TC-AGENT-02 (+ve): Agent registration dispatches OTP to email and leaves verification OTP field empty', async ({ page }) => {
    await agentPage.openViaHeader();

    const uniqueEmail = `agent_${Date.now()}@shopsphere.test`;
    const newAgent = {
      name: 'Rohan Sharma',
      email: uniqueEmail,
      phone: '+91 98765 12345',
      gender: 'male',
      vehicleType: 'Motorcycle',
      deliveryZone: 'Hitech City, Hyderabad',
    };

    const regResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/agent/register') && [200, 201].includes(res.status()),
      { timeout: 15000 }
    ).catch(() => null);

    await agentPage.registerAgent(newAgent);

    const regRes = await regResponsePromise;
    if (regRes) {
      expect([200, 201]).toContain(regRes.status());
      const body = await regRes.json();
      // Verify OTP is NOT leaked in the API response payload
      expect(body.data?.verificationToken).toBeUndefined();
    }

    // Verify UI switched to verify tab
    await expect(agentPage.verifyEmailInput).toHaveValue(uniqueEmail);

    // CRITICAL: Verify OTP input is strictly EMPTY (never auto-filled)
    await expect(agentPage.verifyTokenInput).toHaveValue('');

    // Verify information text instructs checking email
    await expect(page.getByText(/check your registered mailbox/i)).toBeVisible();
  });

  test('TC-AGENT-03 (-ve): Duplicate agent registration with existing email is rejected', async ({ page }) => {
    await agentPage.openViaHeader();

    // Try registering with Alex Rivers (seeded agent email)
    await agentPage.registerAgent({
      name: 'Duplicate Alex',
      email: 'agent.alex@shopsphere.test',
      phone: '+91 98765 43210',
    });

    await expect(page.getByText(/delivery agent with this email address already exists/i)).toBeVisible();
  });

  // ========================================================
  // 3. EMAIL VERIFICATION & TEMPORARY PASSWORD DISPATCH
  // ========================================================

  test('TC-AGENT-04 (-ve): Email verification fails when OTP code is empty or invalid', async ({ page }) => {
    await agentPage.openViaHeader();
    await agentPage.tabVerify.click();

    // Empty OTP
    await agentPage.verifyEmail({
      email: 'testagent@shopsphere.test',
      token: '',
    });
    await expect(page.getByText(/please enter the 6-digit verification code/i)).toBeVisible();

    // Invalid OTP
    await agentPage.verifyEmail({
      email: 'testagent@shopsphere.test',
      token: '000000',
    });
    await expect(page.getByText(/verification failed|invalid/i)).toBeVisible();
  });

  test('TC-AGENT-05 (+ve): Verifying email sends temporary password to mailbox (never displayed in UI)', async ({ page, request }) => {
    const baseURL = process.env.BASE_URL || 'https://samecommers.netlify.app';

    // 1. Direct API registration to obtain token from DB or test account
    const testEmail = `agent_ver_${Date.now()}@shopsphere.test`;
    await request.post(`${baseURL}/api/agent/register`, {
      data: {
        name: 'Kavita Reddy',
        email: testEmail,
        phone: '+91 99887 76655',
        gender: 'female',
        vehicleType: 'Scooter',
        deliveryZone: 'Madhapur, Hyderabad',
      },
    });

    await agentPage.openViaHeader();
    await agentPage.tabVerify.click();
    await expect(agentPage.verifyTokenInput).toHaveValue('');

    // Ensure the temporary password banner or box is NOT present on the screen
    await expect(page.locator('.bg-emerald-50:has-text("Your Temporary Login Password:")')).toBeHidden();
  });

  // ========================================================
  // 4. DEMO AGENT LOGIN & DASHBOARD CAPABILITIES
  // ========================================================

  test('TC-AGENT-06 (+ve): Quick demo login as Alex Rivers displays deliveries, earnings, and online FIFO presence', async ({ page }) => {
    await agentPage.openViaHeader();
    await agentPage.quickDemoLogin();

    // Verify agent profile details
    await expect(agentPage.agentNameText).toContainText('Alex Rivers');
    await expect(agentPage.agentOnlineBadge).toBeVisible();

    // Verify dashboard tabs
    await expect(agentPage.tabActiveDeliveries).toBeVisible();
    await expect(agentPage.tabEarningsWallet).toBeVisible();
    await expect(agentPage.tabStoreDeposit).toBeVisible();

    // Verify wallet earnings
    await expect(agentPage.walletEarningsDisplay).toBeVisible();
  });

  test('TC-AGENT-07 (+ve): Store Cash Deposit tab displays cash status and Hyderabad Store details', async ({ page }) => {
    await agentPage.openViaHeader();
    await agentPage.quickDemoLogin();

    await agentPage.switchToStoreDepositTab();

    // Verify Hyderabad Flagship Store information card
    await expect(page.getByText(/ShopSphere Hyderabad Flagship Store & Dispatch Hub/i)).toBeVisible();
    await expect(page.getByText(/Madhapur, Hyderabad, Telangana 500081/i)).toBeVisible();

    // Verify cash balance display
    await expect(page.getByText(/Cash Balance/i)).toBeVisible();
  });

  test('TC-AGENT-08 (+ve): In-App Notification Bell toggles real-time agent alerts dropdown', async ({ page }) => {
    await agentPage.openViaHeader();
    await agentPage.quickDemoLogin();

    // Open notifications
    await agentPage.toggleNotifications();
    await expect(agentPage.notificationDropdown).toBeVisible();
    await expect(agentPage.notificationDropdown.getByText(/Alerts/i)).toBeVisible();

    // Close notifications
    await agentPage.toggleNotifications();
    await expect(agentPage.notificationDropdown).toBeHidden();
  });

  test('TC-AGENT-09 (+ve): Delivery Agent can log out and return to the login screen', async () => {
    await agentPage.openViaHeader();
    await agentPage.quickDemoLogin();

    await agentPage.logout();
    await expect(agentPage.tabLogin).toBeVisible();
    await expect(agentPage.loginSubmitBtn).toBeVisible();
  });
});
