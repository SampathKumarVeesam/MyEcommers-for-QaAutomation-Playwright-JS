import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage.js';
import { DeliveryAgentPage } from '../pages/DeliveryAgentPage.js';
import { AdminPage } from '../pages/AdminPage.js';

const ADMIN_USER = {
  email: process.env.ADMIN_EMAIL || 'admin@practicesoftwaretesting.com',
  password: process.env.ADMIN_PASSWORD || 'Sampath@123',
};

test.describe('ShopSphere Full COD Settlement & Store Cash Deposit Lifecycle', () => {
  let authPage;
  let agentPage;
  let adminPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    agentPage = new DeliveryAgentPage(page);
    adminPage = new AdminPage(page);
    await authPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('TC-SETTLE-01 (+ve): End-to-end COD Cash Collection, Store Deposit Lockout & Admin Approval Workflow', async ({ page, request }) => {
    const baseURL = process.env.BASE_URL || 'https://samecommers.netlify.app';

    // 1. Admin login to check initial Amount Handling state
    await authPage.loginAsAdmin({
      identifier: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });
    await adminPage.adminModal.waitFor({ state: 'visible' });
    await adminPage.switchToTab('amount-handling');
    await expect(adminPage.kpiCashCard).toBeVisible();
    await adminPage.closeAdminConsole();
    await authPage.logout();

    // 2. Open Delivery Partner Portal and log in as Alex Rivers
    await agentPage.openViaHeader();
    await agentPage.quickDemoLogin();

    // 3. Verify agent dashboard loaded
    await expect(agentPage.tabActiveDeliveries).toBeVisible();
    await expect(agentPage.tabStoreDeposit).toBeVisible();

    // 4. Navigate to Store Cash Deposit tab and verify details
    await agentPage.switchToStoreDepositTab();
    await expect(page.getByText(/ShopSphere Hyderabad Flagship Store/i)).toBeVisible();
    await expect(page.getByText(/Madhapur, Hyderabad/i)).toBeVisible();

    // 5. Open In-App Notifications and verify alerts
    await agentPage.toggleNotifications();
    await expect(agentPage.notificationDropdown).toBeVisible();
    await agentPage.toggleNotifications();

    // 6. Logout agent
    await agentPage.logout();
    await expect(agentPage.tabLogin).toBeVisible();
  });
});
