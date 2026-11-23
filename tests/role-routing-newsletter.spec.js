import { test, expect } from '@playwright/test';

test.describe('ShopSphere - Role-Based URLs, Top Bar Removal & VIP Newsletter Suite', () => {
  const BASE_URL = process.env.BASE_URL || 'https://samecommers.netlify.app';

  // =========================================================================
  // 1. TOP ANNOUNCEMENT BAR GLOBAL REMOVAL
  // =========================================================================

  test('TC-TOPBAR-01 (+ve): Top announcement bar is completely removed globally with no top gap', async ({ page }) => {
    await page.goto('/');

    // 1. Text from removed bar should not exist in viewport
    await expect(page.getByText(/FLASH SALE.*SPHERE20.*at checkout/i)).toBeHidden();
    await expect(page.getByText(/\+1 \(800\) 555-SHOP/i)).toBeHidden();
    await expect(page.getByText(/Free Worldwide Express over \$50/i)).toBeHidden();

    // 2. Sticky header should start directly at top (0px)
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(box).toBeTruthy();
    expect(box.y).toBeLessThanOrEqual(2);
  });

  // =========================================================================
  // 2. SEPARATE ROLE-BASED URLS & PORTALS
  // =========================================================================

  test('TC-ROUTING-01 (+ve): Customer Storefront at root / has clean navbar without cross-role Delivery/Admin buttons', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    // Logo, search, cart, and customer auth should be present
    await expect(header.getByTestId('nav-logo')).toBeVisible();
    await expect(header.getByPlaceholder(/search/i)).toBeVisible();

    // Cross-role buttons must be absent from customer navbar
    await expect(header.getByTestId('nav-delivery-portal')).toBeHidden();
    await expect(header.getByTestId('nav-admin-login')).toBeHidden();
    await expect(header.getByTestId('nav-admin-dashboard')).toBeHidden();
  });

  test('TC-ROUTING-02 (+ve): Delivery Agent Portal at /delivery renders dedicated portal and back navigation', async ({ page }) => {
    await page.goto('/delivery');

    // Should render delivery agent portal directly
    const agentModal = page.getByTestId('delivery-agent-portal-modal');
    await expect(agentModal).toBeVisible();
    await expect(page.getByText(/ShopSphere Delivery Partner Portal/i)).toBeVisible();

    // Customer catalog and hero should not be rendered
    await expect(page.getByTestId('catalog-title')).toBeHidden();

    // Back to storefront button works
    const backBtn = page.getByTestId('btn-delivery-back-storefront');
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/?$|localhost:\\d+/?$`));
    }
  });

  test('TC-ROUTING-03 (+ve): Admin Portal at /admin renders dedicated login with role protection', async ({ page }) => {
    await page.goto('/admin');

    // Dedicated admin console / sign-in screen should be visible
    await expect(page.getByText(/ShopSphere Administrator Portal|Admin & Analytics Console/i)).toBeVisible();

    // Customer catalog and newsletter should not be rendered
    await expect(page.getByTestId('catalog-title')).toBeHidden();
    await expect(page.getByTestId('newsletter-email-input')).toBeHidden();
  });

  // =========================================================================
  // 3. VIP NEWSLETTER SUBSCRIPTION BACKEND API CONTRACT
  // =========================================================================

  test('TC-NEWSLETTER-01 (+ve): POST /api/newsletter/subscribe accepts new email and returns SPHERE20 coupon', async ({ request }) => {
    const testEmail = `shopper_${Date.now()}@shopsphere.test`;
    const res = await request.post(`${BASE_URL}/api/newsletter/subscribe`, {
      data: {
        email: testEmail,
        source: 'storefront_test',
      },
    });

    // 201 Created on new subscription or 200 on duplicate
    expect([200, 201]).toContain(res.status());
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.couponCode).toBe('SPHERE20');
    expect(json.message).toMatch(/VIP|SPHERE20/i);
  });

  test('TC-NEWSLETTER-02 (+ve): Duplicate subscription gracefully returns 200 with coupon code', async ({ request }) => {
    const testEmail = `shopper_duplicate_${Date.now()}@shopsphere.test`;

    // 1st call
    await request.post(`${BASE_URL}/api/newsletter/subscribe`, {
      data: { email: testEmail },
    });

    // 2nd call (duplicate)
    const dupRes = await request.post(`${BASE_URL}/api/newsletter/subscribe`, {
      data: { email: testEmail },
    });

    expect(dupRes.status()).toBe(200);
    const json = await dupRes.json();
    expect(json.success).toBe(true);
    expect(json.alreadySubscribed).toBe(true);
    expect(json.couponCode).toBe('SPHERE20');
  });

  test('TC-NEWSLETTER-03 (-ve): Rejects invalid email format with HTTP 400', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/newsletter/subscribe`, {
      data: { email: 'invalid-email-format' },
    });

    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/valid email/i);
  });

  test('TC-NEWSLETTER-04 (+ve): Direct alias POST /api/subscribe works identically', async ({ request }) => {
    const aliasEmail = `shopper_alias_${Date.now()}@shopsphere.test`;
    const res = await request.post(`${BASE_URL}/api/subscribe`, {
      data: { email: aliasEmail },
    });

    expect([200, 201]).toContain(res.status());
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.couponCode).toBe('SPHERE20');
  });

  // =========================================================================
  // 4. FRONTEND NEWSLETTER COMPONENT & CUSTOMER-ONLY RESTRICTION
  // =========================================================================

  test('TC-NEWSLETTER-05 (+ve): Frontend newsletter section submits email and displays inline confirmation', async ({ page }) => {
    await page.goto('/');

    // Scroll to newsletter section
    const emailInput = page.getByTestId('newsletter-email-input');
    await expect(emailInput).toBeVisible();

    const uniqueEmail = `ui_vip_${Date.now()}@shopsphere.test`;
    await emailInput.fill(uniqueEmail);
    await page.getByTestId('newsletter-submit-button').click();

    // Confirmation banner appears with coupon
    await expect(page.getByTestId('newsletter-success-message')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('newsletter-success-message')).toContainText(/SPHERE20/i);
  });
});
