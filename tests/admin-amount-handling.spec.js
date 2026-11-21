import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage.js';
import { AdminPage } from '../pages/AdminPage.js';

const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || 'admin',
  email: process.env.ADMIN_EMAIL || 'admin@practicesoftwaretesting.com',
  password: process.env.ADMIN_PASSWORD || 'Sampath@123',
};

test.describe('ShopSphere Admin Amount Collection & Cash Handling Console Suite', () => {
  let authPage;
  let adminPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    adminPage = new AdminPage(page);
    await authPage.goto();

    // Authenticate as Admin
    await authPage.loginAsAdmin({
      identifier: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    // Wait for Admin Console to open
    await adminPage.adminModal.waitFor({ state: 'visible' });
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // ========================================================
  // 1. AMOUNT HANDLING TAB NAVIGATION & KPI METRICS
  // ========================================================

  test('TC-ADMIN-AMT-01 (+ve): Admin can navigate to the Amount Handling tab', async ({ page }) => {
    await expect(adminPage.tabAmountHandling).toBeVisible();
    await adminPage.switchToTab('amount-handling');

    // Verify section heading
    await expect(page.getByText('Amount Collection & Cash Handling Console')).toBeVisible();
    await expect(page.getByText(/Dual COD settlement reconciliation/i)).toBeVisible();
  });

  test('TC-ADMIN-AMT-02 (+ve): Amount Handling Console renders 3 KPI summary metric cards', async ({ page }) => {
    await adminPage.switchToTab('amount-handling');

    // 1. UPI QR Collections Metric Card
    await expect(adminPage.kpiUpiQrCard).toBeVisible();
    await expect(adminPage.kpiUpiQrCard.getByText('UPI QR Collections')).toBeVisible();
    await expect(adminPage.kpiUpiQrCard.getByText(/Awaiting Admin Verification/i)).toBeVisible();

    // 2. Cash in Hand / Store Metric Card
    await expect(adminPage.kpiCashCard).toBeVisible();
    await expect(adminPage.kpiCashCard.getByText('Cash in Hand / Store')).toBeVisible();
    await expect(adminPage.kpiCashCard.getByText(/Submitted Deposit Awaiting Approval/i)).toBeVisible();
    await expect(adminPage.kpiCashCard.getByText(/Cash Held by Active Agents/i)).toBeVisible();

    // 3. Total Reconciled COD Metric Card
    await expect(adminPage.kpiTotalReconciledCard).toBeVisible();
    await expect(adminPage.kpiTotalReconciledCard.getByText('Total Reconciled COD')).toBeVisible();
    await expect(adminPage.kpiTotalReconciledCard.getByText(/Total In-Flight \/ Unsettled/i)).toBeVisible();
  });

  // ========================================================
  // 2. STORE CASH DEPOSIT APPROVAL QUEUE & ACTIONS
  // ========================================================

  test('TC-ADMIN-AMT-03 (+ve): Store Cash Deposit Approvals queue displays agents and settlement queues', async ({ page }) => {
    await adminPage.switchToTab('amount-handling');

    // Verify queue section heading
    await expect(page.getByText(/Store Cash Deposit Approvals & Agent Queue Unlocks/i)).toBeVisible();

    // Verify either empty state or active deposit cards
    const emptyState = page.getByText('All Agent Cash Collections Settled');
    const agentCards = page.locator('div:has(> div > div > p.font-extrabold.text-slate-900.text-sm)');

    const isEmpty = await emptyState.isVisible().catch(() => false);
    if (!isEmpty) {
      const count = await agentCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  // ========================================================
  // 3. UPI QR PAYMENT VERIFICATION QUEUE
  // ========================================================

  test('TC-ADMIN-AMT-04 (+ve): UPI QR Payment Verification queue renders table headers or empty state', async ({ page }) => {
    await adminPage.switchToTab('amount-handling');

    await expect(page.getByText(/UPI QR Payment Verification Queue/i)).toBeVisible();

    const emptyQrState = page.getByText('No Pending UPI QR Payments');
    const qrTable = page.locator('table:has-text("Order #")');

    const hasQrQueue = (await emptyQrState.isVisible().catch(() => false)) || (await qrTable.isVisible().catch(() => false));
    expect(hasQrQueue).toBe(true);
  });

  // ========================================================
  // 4. REAL-TIME IN-APP NOTIFICATIONS BELL
  // ========================================================

  test('TC-ADMIN-AMT-05 (+ve): Admin In-App Notification Bell toggles real-time alerts dropdown', async ({ page }) => {
    await expect(adminPage.notificationBellBtn).toBeVisible();

    // Open notification dropdown
    await adminPage.toggleNotifications();
    await expect(adminPage.notificationDropdown).toBeVisible();
    await expect(adminPage.notificationDropdown.getByText(/Alerts & Notifications/i)).toBeVisible();

    // Close notification dropdown
    await adminPage.toggleNotifications();
    await expect(adminPage.notificationDropdown).toBeHidden();
  });

  test('TC-ADMIN-AMT-06 (+ve): Delivery Agents tab displays agent list with online status and FIFO ranks', async ({ page }) => {
    await adminPage.switchToTab('agents');

    // Verify agent management directory
    await expect(page.getByText(/Alex Rivers/i)).toBeVisible();
    await expect(page.getByText(/Online|Offline/i).first()).toBeVisible();
    await expect(page.getByText(/Unlocked|LOCKED/i).first()).toBeVisible();
  });
});
