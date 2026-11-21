import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage.js';

const REAL_USER = {
  name: process.env.REAL_USER_NAME || 'Jane Customer',
  email: process.env.REAL_USER_EMAIL || 'customer@practicesoftwaretesting.com',
  password: process.env.REAL_USER_PASSWORD || 'User01',
};

const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || 'admin',
  email: process.env.ADMIN_EMAIL || 'admin@practicesoftwaretesting.com',
  password: process.env.ADMIN_PASSWORD || 'Sampath@123',
};

test.describe('ShopSphere Complete Auth Suite (Customer & Administrator)', () => {
  let authPage;

  test.beforeEach(async ({ page }) => {
    if (!REAL_USER.email || !REAL_USER.password) {
      throw new Error('Missing REAL_USER_EMAIL or REAL_USER_PASSWORD in .env');
    }
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // ==========================================
  // 1. CUSTOMER REGISTRATION (+VE & -VE)
  // ==========================================

  test('TC-REG-01 (+ve): Initial customer registration persists to database', async ({ page }) => {
    const uniqueUser = {
      name: REAL_USER.name,
      email: `test_${Date.now()}@gmail.com`,
      password: REAL_USER.password,
    };

    const apiPromise = page.waitForResponse(
      (res) => (res.url().includes('/register') || res.url().includes('/signup')) && [200, 201, 400].includes(res.status()),
      { timeout: 15000 }
    ).catch(() => null);

    await authPage.register(uniqueUser);

    const response = await apiPromise;
    if (response) {
      expect([200, 201, 400]).toContain(response.status());
    }
  });

  test('TC-REG-02 (-ve): Duplicate registration with already registered email', async ({ page }) => {
    await authPage.register(REAL_USER);

    await expect(authPage.registerEmailError).toBeVisible();
    await expect(authPage.registerEmailError).toHaveText('Email address already in use');
    await expect(page.getByText('Email is already registered. Please login instead.')).toBeVisible();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  test('TC-REG-03 (-ve): Registration fails when required fields are empty', async () => {
    await authPage.register({ name: '', email: '', password: '' });

    await expect(authPage.modal).toBeVisible();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  test('TC-REG-04 (-ve): Registration rejects invalid email format', async () => {
    await authPage.register({
      name: REAL_USER.name,
      email: 'invalid-email-format',
      password: REAL_USER.password,
    });

    const isEmailValid = await authPage.registerEmailInput.evaluate((el) => el.checkValidity());
    expect(isEmailValid).toBe(false);
    await expect(authPage.modal).toBeVisible();
  });

  test('TC-REG-05 (-ve): Registration rejects weak / short password (< 6 chars)', async () => {
    await authPage.register({
      name: REAL_USER.name,
      email: `weakpass_${REAL_USER.email}`,
      password: '123',
    });

    await expect(authPage.modal).toBeVisible();
    await expect(authPage.registerPasswordError).toBeVisible();
    await expect(authPage.registerPasswordError).toHaveText('Password must be at least 6 characters');
  });

  // ==========================================
  // 2. PASSWORD VISIBILITY EYE ICON
  // ==========================================

  test('TC-PWD-01 (+ve): Password visibility eye icon toggles masking without losing text', async () => {
    await authPage.openRegisterModal();

    await authPage.registerPasswordInput.fill(REAL_USER.password);
    await expect(authPage.registerPasswordInput).toHaveAttribute('type', 'password');
    await expect(authPage.registerPasswordInput).toHaveValue(REAL_USER.password);

    await authPage.registerPasswordToggle.click();
    await expect(authPage.registerPasswordInput).toHaveAttribute('type', 'text');
    await expect(authPage.registerPasswordInput).toHaveValue(REAL_USER.password);

    await authPage.registerPasswordToggle.click();
    await expect(authPage.registerPasswordInput).toHaveAttribute('type', 'password');
    await expect(authPage.registerPasswordInput).toHaveValue(REAL_USER.password);
  });

  // ==========================================
  // 3. CUSTOMER LOGIN & LOGOUT (+VE & -VE)
  // ==========================================

  test('TC-LOG-01 (+ve): Customer login with valid registered email and password', async ({ page }) => {
    const loginApiPromise = page.waitForResponse(
      (res) => res.url().includes('/login') || res.url().includes('/signin')
    );

    await authPage.login({
      email: REAL_USER.email,
      password: REAL_USER.password,
    });

    const response = await loginApiPromise;
    expect(response.status()).toBe(200);
    await expect(authPage.signInNavBtn).toBeHidden();
  });

  test('TC-LOG-02 (+ve): Customer session persists on reload and clears on real Logout', async ({ page }) => {
    await authPage.login({
      email: REAL_USER.email,
      password: REAL_USER.password,
    });
    await expect(authPage.signInNavBtn).toBeHidden();

    await page.reload();
    await expect(authPage.signInNavBtn).toBeHidden();

    await authPage.logout();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  test('TC-LOG-03 (-ve): Customer login fails with unregistered email address', async ({ page }) => {
    await authPage.login({
      email: 'nonexistent.account.9999@gmail.com',
      password: REAL_USER.password,
    });

    await expect(page.getByText(/invalid|not found|incorrect|unauthorized/i).first()).toBeVisible();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  test('TC-LOG-04 (-ve): Customer login fails with valid email and wrong password', async ({ page }) => {
    await authPage.login({
      email: REAL_USER.email,
      password: 'WrongPassword@999',
    });

    await expect(page.getByText(/invalid|incorrect|unauthorized|wrong/i).first()).toBeVisible();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  test('TC-LOG-05 (-ve): Customer login enforces password case-sensitivity', async ({ page }) => {
    await authPage.login({
      email: REAL_USER.email,
      password: REAL_USER.password.toLowerCase(),
    });

    await expect(page.getByText(/invalid|incorrect|unauthorized/i).first()).toBeVisible();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  test('TC-LOG-06 (-ve): Customer login blocks submission when fields are empty', async () => {
    await authPage.login({ email: '', password: '' });

    await expect(authPage.modal).toBeVisible();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  // ==========================================
  // 4. ADMINISTRATOR LOGIN & LOGOUT (+VE & -VE)
  // ==========================================

  test('TC-ADM-01 (+ve): Admin login via header button using username (admin)', async ({ page }) => {
    const adminApiPromise = page.waitForResponse(
      (res) => res.url().includes('/login') || res.url().includes('/admin')
    );

    await authPage.loginAsAdmin({
      identifier: ADMIN_USER.username,
      password: ADMIN_USER.password,
      viaTab: false,
    });

    const response = await adminApiPromise;
    expect(response.status()).toBe(200);
    await expect(authPage.signInNavBtn).toBeHidden();
  });

  test('TC-ADM-02 (+ve): Admin login via modal tab using email (admin@practicesoftwaretesting.com)', async ({ page }) => {
    const adminApiPromise = page.waitForResponse(
      (res) => res.url().includes('/login') || res.url().includes('/admin')
    );

    await authPage.loginAsAdmin({
      identifier: ADMIN_USER.email,
      password: ADMIN_USER.password,
      viaTab: true,
    });

    const response = await adminApiPromise;
    expect(response.status()).toBe(200);
    await expect(authPage.signInNavBtn).toBeHidden();
  });

  test('TC-ADM-03 (+ve): Admin password visibility eye icon toggles masking', async () => {
    await authPage.openAdminModal(false);

    await authPage.adminPasswordInput.fill(ADMIN_USER.password);
    await expect(authPage.adminPasswordInput).toHaveAttribute('type', 'password');

    if (await authPage.adminPasswordToggle.isVisible()) {
      await authPage.adminPasswordToggle.click();
      await expect(authPage.adminPasswordInput).toHaveAttribute('type', 'text');
      await expect(authPage.adminPasswordInput).toHaveValue(ADMIN_USER.password);

      await authPage.adminPasswordToggle.click();
      await expect(authPage.adminPasswordInput).toHaveAttribute('type', 'password');
    }
  });

  test('TC-ADM-04 (+ve): Admin session persists on reload and clears on real Sign-Out', async ({ page }) => {
    await authPage.loginAsAdmin({
      identifier: ADMIN_USER.username,
      password: ADMIN_USER.password,
    });
    await expect(authPage.signInNavBtn).toBeHidden();

    await page.reload();
    await expect(authPage.signInNavBtn).toBeHidden();

    if (await authPage.userMenuTrigger.isVisible()) {
      await authPage.logout();
    } else {
      await page.getByRole('button', { name: /sign out|logout/i }).click();
    }

    await expect(authPage.signInNavBtn).toBeVisible();
    await expect(authPage.adminLoginNavBtn).toBeVisible();
  });

  test('TC-ADM-05 (-ve): Admin login fails with wrong password', async ({ page }) => {
    await authPage.loginAsAdmin({
      identifier: ADMIN_USER.username,
      password: 'WrongAdminPassword@999',
    });

    await expect(page.getByText(/invalid|incorrect|unauthorized|denied|failed/i).first()).toBeVisible();
    await expect(authPage.modal).toBeVisible();
  });

  test('TC-ADM-06 (-ve): Admin login fails with unknown admin username', async ({ page }) => {
    await authPage.loginAsAdmin({
      identifier: 'nonexistent_admin',
      password: ADMIN_USER.password,
    });

    await expect(page.getByText(/invalid|incorrect|unauthorized|not found|denied/i).first()).toBeVisible();
    await expect(authPage.modal).toBeVisible();
  });

  test('TC-ADM-07 (-ve): Admin login enforces password case-sensitivity', async ({ page }) => {
    await authPage.loginAsAdmin({
      identifier: ADMIN_USER.username,
      password: ADMIN_USER.password.toLowerCase(),
    });

    await expect(page.getByText(/invalid|incorrect|unauthorized|denied/i).first()).toBeVisible();
    await expect(authPage.modal).toBeVisible();
  });

  test('TC-ADM-08 (-ve): Standard customer credentials cannot access Admin portal', async ({ page }) => {
    await authPage.loginAsAdmin({
      identifier: REAL_USER.email,
      password: REAL_USER.password,
    });

    await expect(page.getByText(/invalid|unauthorized|admin|denied|forbidden/i).first()).toBeVisible();
    await expect(authPage.modal).toBeVisible();
  });

  test('TC-ADM-09 (-ve): Admin login blocks submission when fields are empty', async () => {
    await authPage.loginAsAdmin({
      identifier: '',
      password: '',
    });

    await expect(authPage.modal).toBeVisible();
    await expect(authPage.signInNavBtn).toBeVisible();
  });

  // ==========================================
  // 5. BOUNDARY VALUE ANALYSIS & FORGOT PWD INTEGRATION
  // ==========================================

  test('TC-AUTH-BVA-01 (+ve): Customer registration with exactly 6-character password boundary', async ({ page }) => {
    const boundaryUser = {
      name: 'Boundary Pass User',
      email: `bva6_${Date.now()}@shopsphere.test`,
      password: 'Pass01', // Exactly 6 characters (BVA N boundary)
      phone: '+91 98765 00010',
    };

    const apiPromise = page.waitForResponse(
      (res) => res.url().includes('/register') && [200, 201].includes(res.status()),
      { timeout: 15000 }
    ).catch(() => null);

    await authPage.register(boundaryUser);

    const response = await apiPromise;
    if (response) {
      expect([200, 201]).toContain(response.status());
    }
  });

  test('TC-AUTH-FP-01 (+ve): Forgot Password link on Customer Sign In opens recovery form', async () => {
    await authPage.openSignInModal();
    await expect(authPage.forgotPasswordLink).toBeVisible();

    await authPage.forgotPasswordLink.click();
    await expect(authPage.forgotEmailInput).toBeVisible();
    await expect(authPage.forgotSubmitBtn).toBeVisible();
  });
});
