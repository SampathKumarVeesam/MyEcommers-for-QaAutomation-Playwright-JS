export class AuthPage {
  constructor(page) {
    this.page = page;

    // 1. Header triggers (Priority 1: getByRole scoped to <header>)
    const header = page.locator('header');
    this.signInNavBtn = header.getByRole('button', { name: 'Sign In' });
    this.registerNavBtn = header.getByRole('button', { name: 'Register' });
    this.adminLoginNavBtn = header.getByRole('button', { name: /admin login|administrator login/i });
    this.demoAccountsBtn = header.getByRole('button', { name: /customer demos/i });

    // 2. Logged-in User / Admin Profile Menu & Dropdown
    this.userMenuTrigger = header.locator('.relative.shrink-0 button:has(svg.lucide-chevron-down)');
    this.userMenuDropdown = page.locator('div[data-testid="user-menu-dropdown"]');
    this.userProfileName = this.userMenuDropdown.locator('p').first();
    this.userProfileEmail = this.userMenuDropdown.locator('p').nth(1);
    this.signOutBtn = this.userMenuDropdown.getByRole('button', { name: 'Sign Out' });

    // 3. Modal container & tabs (Priority 1: getByRole with exact: true scoped to the tab bar)
    this.modal = page.locator('div[data-testid="auth-modal"]');
    const modalTabBar = this.modal.locator('div.flex.p-1.rounded-xl');
    this.loginTab = modalTabBar.getByRole('button', { name: 'Sign In', exact: true });
    this.registerTab = modalTabBar.getByRole('button', { name: 'Register', exact: true });
    this.adminTab = modalTabBar.getByRole('button', { name: 'Admin', exact: true });
    this.closeModalBtn = this.modal.locator('button:has(svg.lucide-x)');

    // 4. Register form fields & inline errors
    this.registerNameInput = this.modal.getByPlaceholder(/sarah connor/i);
    this.registerEmailInput = this.modal.getByPlaceholder('sarah@example.com');
    this.registerPasswordInput = this.modal.getByPlaceholder('Minimum 6 characters');
    this.registerPasswordToggle = this.modal.getByRole('button', { name: /show password|hide password/i }).first();
    this.registerPhoneInput = this.modal.getByPlaceholder('+1 (555) 000-0000');
    this.registerSubmitBtn = this.modal.getByRole('button', { name: 'Create Free Account' });
    this.registerEmailError = this.modal.getByText('Email address already in use');
    this.registerPasswordError = this.modal.getByText('Password must be at least 6 characters');

    // 5. Customer Login form fields inside auth-modal
    this.loginEmailInput = this.modal.getByTestId('login-email-input');
    this.loginPasswordInput = this.modal.getByTestId('login-password-input');
    this.loginSubmitBtn = this.modal.locator('form button[type="submit"]');

    // 5b. Forgot & Reset Password Form Fields
    this.forgotPasswordLink = this.modal.getByTestId('link-forgot-password');
    this.forgotEmailInput = this.modal.getByTestId('forgot-email-input');
    this.forgotSubmitBtn = this.modal.getByTestId('forgot-submit-button');
    this.forgotSuccessMsg = this.modal.getByTestId('forgot-success-message');
    this.forgotErrorMsg = this.modal.getByTestId('forgot-error-message');
    this.btnProceedToReset = this.modal.getByTestId('btn-proceed-to-reset');
    this.linkHaveOtp = this.modal.getByTestId('link-have-otp');

    this.resetEmailInput = this.modal.getByTestId('reset-email-input');
    this.resetOtpInput = this.modal.getByTestId('reset-otp-input');
    this.resetPasswordInput = this.modal.getByTestId('reset-password-input');
    this.resetConfirmPasswordInput = this.modal.getByTestId('reset-confirm-password-input');
    this.resetSubmitBtn = this.modal.getByTestId('reset-submit-button');
    this.resetSuccessMsg = this.modal.getByTestId('reset-success-message');
    this.resetErrorMsg = this.modal.getByTestId('reset-error-message');

    // 6. Admin Login form fields inside auth-modal
    this.adminIdentifierInput = this.modal.getByTestId('admin-login-identifier-input');
    this.adminPasswordInput = this.modal.getByTestId('admin-login-password-input');
    this.adminPasswordToggle = this.modal.getByRole('button', { name: /show password|hide password/i }).first();
    this.adminSubmitBtn = this.modal.getByTestId('admin-login-submit-button').or(this.modal.getByRole('button', { name: /Sign In to Admin Dashboard|LOGIN AS ADMIN|LOGIN/i }));
  }

  async goto() {
    await this.page.goto('/');
  }

  async openRegisterModal() {
    await this.registerNavBtn.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async openSignInModal() {
    await this.signInNavBtn.click();
    await this.modal.waitFor({ state: 'visible' });
    await this.loginTab.click();
  }

  async openAdminModal(viaTab = false) {
    const isNavBtnVisible = await this.adminLoginNavBtn.isVisible().catch(() => false);
    if (!isNavBtnVisible || viaTab) {
      await this.openSignInModal();
      await this.adminTab.click();
    } else {
      await this.adminLoginNavBtn.click();
      await this.modal.waitFor({ state: 'visible' });
    }
  }

  async register({ name, email, password, phone }) {
    await this.openRegisterModal();
    if (name !== undefined) {
      await this.registerNameInput.fill(name);
    }
    if (email !== undefined) {
      await this.registerEmailInput.fill(email);
    }
    if (password !== undefined) {
      await this.registerPasswordInput.fill(password);
    }
    if (phone !== undefined) {
      await this.registerPhoneInput.fill(phone);
    }
    await this.registerSubmitBtn.click();
  }

  async login({ email, password }) {
    await this.openSignInModal();
    if (email !== undefined) {
      await this.loginEmailInput.fill(email);
    }
    if (password !== undefined) {
      await this.loginPasswordInput.fill(password);
    }
    await this.loginSubmitBtn.click();
  }

  async loginAsAdmin({ identifier, password, viaTab = false }) {
    await this.openAdminModal(viaTab);
    if (identifier !== undefined) {
      await this.adminIdentifierInput.fill(identifier);
    }
    if (password !== undefined) {
      await this.adminPasswordInput.fill(password);
    }
    await this.adminSubmitBtn.click();
  }

  async logout() {
    await this.userMenuTrigger.click();
    await this.userMenuDropdown.waitFor({ state: 'visible' });
    await this.signOutBtn.click();
  }

  async openForgotPassword() {
    await this.openSignInModal();
    await this.forgotPasswordLink.click();
    await this.forgotEmailInput.waitFor({ state: 'visible' });
  }

  async requestPasswordReset(email) {
    await this.openForgotPassword();
    if (email !== undefined) {
      await this.forgotEmailInput.fill(email);
    }
    await this.forgotSubmitBtn.click();
  }

  async resetPassword({ email, otp, newPassword, confirmPassword = newPassword }) {
    if (email !== undefined) {
      await this.resetEmailInput.fill(email);
    }
    if (otp !== undefined) {
      await this.resetOtpInput.fill(otp);
    }
    if (newPassword !== undefined) {
      await this.resetPasswordInput.fill(newPassword);
    }
    if (confirmPassword !== undefined) {
      await this.resetConfirmPasswordInput.fill(confirmPassword);
    }
    await this.resetSubmitBtn.click();
  }
}