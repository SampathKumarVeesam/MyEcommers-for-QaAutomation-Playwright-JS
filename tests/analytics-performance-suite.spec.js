import { test, expect } from '@playwright/test';

test.describe('ShopSphere - Unified Frosted-Glass Auth, Sapphire Executive UI & Analytics Suite', () => {
  const BASE_URL = process.env.BASE_URL || 'https://samecommers.netlify.app';
  const API_URL = 'https://myecommers-for-qaautomation.onrender.com';

  // =========================================================================
  // PART 1: UNIFIED LUMINOUS FROSTED-GLASS AUTHENTICATION UI
  // =========================================================================

  test('TC-AUTH-GLASS-01 (+ve): Customer Auth Modal renders luminous frosted-glass container with Customer Portal role pill', async ({ page }) => {
    await page.goto('/');

    // Click Sign In in the header
    await page.locator('[data-testid="nav-signin-btn"], [data-testid="nav-signin"], [data-test="nav-signin"]').first().click();

    const authModal = page.getByTestId('auth-modal');
    await expect(authModal).toBeVisible();

    // Verify Customer Portal role pill
    await expect(page.getByText('Customer Portal')).toBeVisible();

    // Verify glass capsule inputs
    await expect(page.locator('[data-testid="input-login-email"], [data-testid="login-email-input"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="input-login-password"], [data-testid="login-password-input"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="btn-login-submit"], [data-testid="login-submit-button"]').first()).toBeVisible();

    // Switch to Register tab
    await page.getByTestId('auth-tab-register').click();
    await expect(page.getByText('REGISTER')).toBeVisible();

    // Close modal
    await page.getByTestId('auth-close-button').click();
    await expect(authModal).toBeHidden();
  });

  test('TC-AUTH-GLASS-02 (+ve): Admin Portal at /admin renders Luminous Frosted-Glass Administrator Console', async ({ page }) => {
    await page.goto('/admin');

    // Should display Administrator Console role pill
    await expect(page.getByText('Administrator Console')).toBeVisible();

    // Verify inputs & tactile pill submit button
    await expect(page.getByTestId('admin-login-identifier')).toBeVisible();
    await expect(page.getByTestId('admin-login-password')).toBeVisible();
    await expect(page.getByTestId('btn-admin-login-submit')).toBeVisible();
    await expect(page.getByTestId('btn-quick-admin-demo')).toBeVisible();
  });

  // =========================================================================
  // PART 2: ADMIN EXECUTIVE OVERVIEW & USER ANALYTICS DOSSIER MODALS
  // =========================================================================

  test('TC-ADMIN-ANALYTICS-01 (+ve): Admin Overview displays 4-card KPI strip, stacked area chart, funnel, and COD flow', async ({ page }) => {
    await page.goto('/admin');

    // Quick sign in as admin
    await page.getByTestId('btn-quick-admin-demo').click();

    // Admin panel modal should open
    await expect(page.getByText(/ShopSphere Administrator Console/i)).toBeVisible({ timeout: 15000 });

    // Overview & Analytics tab should be active
    const overviewTab = page.getByTestId('admin-tab-overview');
    await expect(overviewTab).toBeVisible();
    await overviewTab.click();

    // 1. Verify 4-card KPI strip with Indian Rupee (₹) and tabular figures
    await expect(page.getByText(/Total Revenue/i)).toBeVisible();
    await expect(page.getByText(/Active Orders/i)).toBeVisible();
    await expect(page.getByText(/COD Settlement Rate/i)).toBeVisible();
    await expect(page.getByText(/Avg Dispatch Time/i)).toBeVisible();

    // 2. Verify Stacked Area Chart (Prepaid vs COD)
    await expect(page.getByText(/Prepaid vs. Cash on Delivery \(COD\) Revenue Stream/i)).toBeVisible();

    // 3. Verify Order Lifecycle Funnel
    await expect(page.getByText(/Order Lifecycle & Conversion Funnel/i)).toBeVisible();

    // 4. Verify COD Cash Settlement Ledger
    await expect(page.getByText(/COD Cash Settlement Ledger/i)).toBeVisible();
    await expect(page.getByText(/Total COD Cash/i)).toBeVisible();
    await expect(page.getByText(/Store Deposited/i)).toBeVisible();
  });

  test('TC-ADMIN-ANALYTICS-02 (+ve): Customer Activity table has View Analytics button opening Customer Dossier modal', async ({ page }) => {
    await page.goto('/admin');
    await page.getByTestId('btn-quick-admin-demo').click();
    await expect(page.getByText(/ShopSphere Administrator Console/i)).toBeVisible({ timeout: 15000 });

    // Switch to Customer Activity tab
    await page.getByTestId('admin-tab-analytics').click();

    // Wait for customer rows to appear
    const viewAnalyticsBtn = page.locator('button[data-testid^="btn-view-customer-analytics-"]').first();
    await expect(viewAnalyticsBtn).toBeVisible({ timeout: 10000 });

    // Click View Analytics to open modal
    await viewAnalyticsBtn.click();

    // Verify Dossier Modal Header & 365-Day Heatmap
    await expect(page.getByText(/Executive Customer Dossier/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/12-Month Expenditure Trajectory/i)).toBeVisible();
    await expect(page.getByText(/Peer Cohort Distribution/i)).toBeVisible();
    await expect(page.getByText(/365-Day Purchasing Ledger/i)).toBeVisible();

    // Close the Dossier Modal
    await page.locator('button:has-text("×")').first().click();
  });

  test('TC-ADMIN-ANALYTICS-03 (+ve): Delivery Agents table has View Analytics button opening Agent Dossier modal', async ({ page }) => {
    await page.goto('/admin');
    await page.getByTestId('btn-quick-admin-demo').click();
    await expect(page.getByText(/ShopSphere Administrator Console/i)).toBeVisible({ timeout: 15000 });

    // Switch to Delivery Agents tab
    await page.getByTestId('admin-tab-agents').click();

    // Wait for agent rows
    const viewAgentAnalyticsBtn = page.locator('button[data-testid^="btn-view-agent-analytics-"]').first();
    await expect(viewAgentAnalyticsBtn).toBeVisible({ timeout: 10000 });

    // Click View Analytics
    await viewAgentAnalyticsBtn.click();

    // Verify Agent Dossier Modal with SLA & Transfer Audit
    await expect(page.getByText(/Executive Delivery Agent Dossier/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/SLA Compliance Donut/i)).toBeVisible();
    await expect(page.getByText(/Agent Dispatch & Emergency Transfer Audit/i)).toBeVisible();
    await expect(page.getByText(/365-Day Delivery Fulfillment Ledger/i)).toBeVisible();

    // Close the Dossier Modal
    await page.locator('button:has-text("×")').first().click();
  });

  // =========================================================================
  // PART 3: DELIVERY AGENT "MY PERFORMANCE & EARNINGS HUB"
  // =========================================================================

  test('TC-AGENT-HUB-01 (+ve): Delivery Agent Portal features My Performance tab with COD Hero Banner, Donut & Heatmap', async ({ page }) => {
    await page.goto('/delivery');

    // Quick sign in as agent
    await page.getByTestId('btn-quick-agent-demo').click();

    // Should open agent dashboard
    await expect(page.getByText(/ShopSphere Delivery Partner Portal/i)).toBeVisible({ timeout: 15000 });

    // Click "My Performance" tab
    const perfTab = page.getByTestId('tab-agent-performance');
    await expect(perfTab).toBeVisible();
    await perfTab.click();

    // 1. Verify COD Cash-to-Deposit Hero Card
    await expect(page.getByText(/Store Cash Reconciliation/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Pending Cash to Deposit/i)).toBeVisible();

    // 2. Verify Duty Toggle Button
    await expect(page.getByText(/Duty: Online/i)).toBeVisible();

    // 3. Verify Delivery Commission Earnings chart & Store Rank Percentile
    await expect(page.getByText(/Delivery Commission Earnings/i)).toBeVisible();
    await expect(page.getByText(/Hub Standing/i)).toBeVisible();
    await expect(page.getByText(/3-Min FIFO Acceptance/i)).toBeVisible();

    // 4. Verify Delivery SLA Donut & Milestones Shelf
    await expect(page.getByText(/Delivery SLA Performance Ratio/i)).toBeVisible();
    await expect(page.getByText(/Clean Ledger Master/i)).toBeVisible();

    // 5. Verify 365-Day Delivery Activity Calendar
    await expect(page.getByText(/365-Day Delivery Activity Calendar/i)).toBeVisible();
  });

  // =========================================================================
  // PART 4: STRICT RBAC SECURITY ON BACKEND ENDPOINTS
  // =========================================================================

  test('TC-RBAC-01 (-ve): Admin Analytics endpoints reject unauthenticated or non-admin requests with 401/403', async ({ request }) => {
    // 1. Without token -> 401
    const unauthRes = await request.get(`${API_URL}/api/admin/analytics/overview`);
    expect(unauthRes.status()).toBe(401);

    // 2. Customer profile without token -> 401
    const unauthCust = await request.get(`${API_URL}/api/admin/analytics/customers/USR-1`);
    expect(unauthCust.status()).toBe(401);

    // 3. Agent my-analytics without token -> 401
    const unauthAgent = await request.get(`${API_URL}/api/agent/my-analytics`);
    expect(unauthAgent.status()).toBe(401);
  });
});
