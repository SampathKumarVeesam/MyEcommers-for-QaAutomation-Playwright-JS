export class DeliveryAgentPage {
  constructor(page) {
    this.page = page;

    // 1. Header Trigger & Modal Container
    const header = page.locator('header');
    this.navDeliveryPortalBtn = header.getByTestId('nav-delivery-portal');
    this.portalModal = page.getByTestId('delivery-agent-portal-modal');
    this.closeModalBtn = this.portalModal.locator('button:has(svg.lucide-x)').first();

    // 2. Authentication Tabs
    this.tabLogin = this.portalModal.getByTestId('tab-agent-login');
    this.tabRegister = this.portalModal.getByTestId('tab-agent-register');
    this.tabVerify = this.portalModal.getByTestId('tab-agent-verify');

    // 3. Agent Registration Form
    this.regNameInput = this.portalModal.getByTestId('input-agent-reg-name');
    this.regEmailInput = this.portalModal.getByTestId('input-agent-reg-email');
    this.regPhoneInput = this.portalModal.getByPlaceholder('+91 98765 43210');
    this.regVehicleSelect = this.portalModal.locator('select').first();
    this.regZoneSelect = this.portalModal.locator('select:has(option[value*="Hyderabad"])');
    this.regSubmitBtn = this.portalModal.getByTestId('btn-agent-register');

    // 4. Verification Form (OTP sent to email ONLY)
    this.verifyEmailInput = this.portalModal.getByTestId('input-verify-email');
    this.verifyTokenInput = this.portalModal.getByTestId('input-verify-token');
    this.verifySubmitBtn = this.portalModal.getByTestId('btn-verify-agent-email');

    // 5. Mandatory First-Login Password Change Screen
    this.newPermanentPasswordInput = this.portalModal.getByTestId('input-new-permanent-password');
    this.confirmPermanentPasswordInput = this.portalModal.getByTestId('input-confirm-permanent-password');
    this.savePermanentPasswordBtn = this.portalModal.getByTestId('btn-save-permanent-password');

    // 6. Sign In Form
    this.loginEmailInput = this.portalModal.getByTestId('input-agent-login-email');
    this.loginPasswordInput = this.portalModal.getByTestId('input-agent-login-password');
    this.loginSubmitBtn = this.portalModal.getByTestId('btn-agent-login');
    this.quickDemoLoginBtn = this.portalModal.getByTestId('btn-quick-demo-agent');

    // 6b. Agent Forgot & Reset Password Form
    this.forgotPasswordLink = this.portalModal.getByTestId('link-agent-forgot-password');
    this.forgotEmailInput = this.portalModal.getByTestId('input-agent-forgot-email');
    this.forgotSubmitBtn = this.portalModal.getByTestId('btn-agent-forgot-submit');
    this.linkAgentHaveOtp = this.portalModal.getByTestId('link-agent-have-otp');

    this.resetEmailInput = this.portalModal.getByTestId('input-agent-reset-email');
    this.resetOtpInput = this.portalModal.getByTestId('input-agent-reset-otp');
    this.resetPasswordInput = this.portalModal.getByTestId('input-agent-reset-password');
    this.resetConfirmPasswordInput = this.portalModal.getByTestId('input-agent-reset-confirm-password');
    this.resetSubmitBtn = this.portalModal.getByTestId('btn-agent-reset-submit');

    // 7. Dashboard Navigation Tabs
    this.tabActiveDeliveries = this.portalModal.getByTestId('tab-active-deliveries');
    this.tabEarningsWallet = this.portalModal.getByTestId('tab-earnings-wallet');
    this.tabStoreDeposit = this.portalModal.getByTestId('tab-store-deposit');

    // 8. Agent Info & Header Actions
    this.agentNameText = this.portalModal.locator('[data-test="agent-name"]').or(this.portalModal.locator('.font-extrabold.text-slate-900.text-sm').first());
    this.agentOnlineBadge = this.portalModal.getByText(/🟢 Online/i);
    this.walletEarningsDisplay = this.portalModal.locator('.font-mono.text-sm.font-extrabold.text-emerald-900');
    this.logoutBtn = this.portalModal.locator('button[title="Logout"]');
    this.profileBtn = this.portalModal.getByRole('button', { name: 'Profile' });

    // 9. Notifications Bell & Dropdown
    this.notificationBellBtn = this.portalModal.locator('button[title="Alerts & Notifications"]');
    this.notificationDropdown = this.portalModal.locator('.absolute.right-0.mt-2.w-80');
    this.markAllNotificationsReadBtn = this.notificationDropdown.getByRole('button', { name: /mark all read/i });

    // 10. Store Cash Deposit Tab Elements
    this.submitStoreDepositBtn = this.portalModal.getByTestId('btn-submit-store-deposit');
    this.cashDepositStatusBanner = this.portalModal.locator('div:has(> div > div > h4)');

    // 11. Banners & Messages
    this.successAlert = this.portalModal.locator('.bg-emerald-50, .text-emerald-800');
    this.errorAlert = this.portalModal.locator('.bg-rose-50, .text-rose-800');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openViaHeader() {
    const isHeaderBtnVisible = await this.navDeliveryPortalBtn.isVisible().catch(() => false);
    if (isHeaderBtnVisible) {
      await this.navDeliveryPortalBtn.click();
    } else {
      await this.page.goto('/delivery');
    }
    await this.portalModal.waitFor({ state: 'visible' });
  }

  async openViaUrlHash() {
    await this.page.goto('/delivery');
    await this.portalModal.waitFor({ state: 'visible' });
  }

  async openViaRoute() {
    await this.page.goto('/delivery');
    await this.portalModal.waitFor({ state: 'visible' });
  }

  async closePortal() {
    if (await this.closeModalBtn.isVisible()) {
      await this.closeModalBtn.click();
      await this.portalModal.waitFor({ state: 'hidden' });
    }
  }

  async selectGender(gender = 'male') {
    const genderBtn = this.portalModal.getByTestId(`agent-reg-gender-${gender}`);
    if (await genderBtn.isVisible()) {
      await genderBtn.click();
    }
  }

  async selectAvatar(index = 0) {
    const avatarBtn = this.portalModal.getByTestId(`reg-avatar-${index}`);
    if (await avatarBtn.isVisible()) {
      await avatarBtn.click();
    }
  }

  async registerAgent({ name, email, phone, gender = 'male', vehicleType = 'Motorcycle', deliveryZone = 'Hitech City, Hyderabad' }) {
    await this.tabRegister.click();
    if (name !== undefined) await this.regNameInput.fill(name);
    if (email !== undefined) await this.regEmailInput.fill(email);
    if (phone !== undefined) await this.regPhoneInput.fill(phone);
    await this.selectGender(gender);
    await this.selectAvatar(0);
    if (vehicleType) await this.regVehicleSelect.selectOption(vehicleType);
    if (deliveryZone) await this.regZoneSelect.selectOption(deliveryZone);
    await this.regSubmitBtn.click();
  }

  async verifyEmail({ email, token }) {
    await this.tabVerify.click();
    if (email !== undefined) await this.verifyEmailInput.fill(email);
    if (token !== undefined) await this.verifyTokenInput.fill(token);
    await this.verifySubmitBtn.click();
  }

  async completeMandatoryPasswordUpdate(newPassword, confirmPassword = newPassword) {
    await this.newPermanentPasswordInput.waitFor({ state: 'visible' });
    await this.newPermanentPasswordInput.fill(newPassword);
    await this.confirmPermanentPasswordInput.fill(confirmPassword);
    await this.savePermanentPasswordBtn.click();
  }

  async loginAgent({ email, password }) {
    await this.tabLogin.click();
    if (email !== undefined) await this.loginEmailInput.fill(email);
    if (password !== undefined) await this.loginPasswordInput.fill(password);
    await this.loginSubmitBtn.click();
  }

  async quickDemoLogin() {
    await this.tabLogin.click();
    await this.quickDemoLoginBtn.click();
    await this.tabActiveDeliveries.waitFor({ state: 'visible' });
  }

  async acceptOrder(orderNumber) {
    const acceptBtn = this.portalModal.getByTestId(`btn-accept-${orderNumber}`);
    await acceptBtn.click();
  }

  async rejectOrder(orderNumber) {
    const rejectBtn = this.portalModal.getByTestId(`btn-reject-${orderNumber}`);
    await rejectBtn.click();
  }

  async enterAndVerifyOtp(orderNumber, otp) {
    const otpInput = this.portalModal.getByTestId(`input-agent-otp-${orderNumber}`);
    const verifyOtpBtn = this.portalModal.getByTestId(`btn-verify-otp-${orderNumber}`);
    await otpInput.fill(otp);
    await verifyOtpBtn.click();
  }

  async completePrepaidDelivery(orderNumber) {
    const completeBtn = this.portalModal.getByTestId(`btn-complete-prepaid-${orderNumber}`);
    await completeBtn.click();
  }

  async collectCodQrPayment(orderNumber) {
    const qrBtn = this.portalModal.getByTestId(`btn-qr-paid-${orderNumber}`);
    await qrBtn.click();
  }

  async collectCodCash(orderNumber) {
    const cashBtn = this.portalModal.getByTestId(`btn-cash-collected-${orderNumber}`);
    await cashBtn.click();
  }

  async switchToStoreDepositTab() {
    await this.tabStoreDeposit.click();
  }

  async submitStoreDeposit() {
    await this.switchToStoreDepositTab();
    await this.submitStoreDepositBtn.waitFor({ state: 'visible' });
    await this.submitStoreDepositBtn.click();
  }

  async toggleNotifications() {
    await this.notificationBellBtn.click();
  }

  async markAllNotificationsRead() {
    await this.toggleNotifications();
    if (await this.markAllNotificationsReadBtn.isVisible()) {
      await this.markAllNotificationsReadBtn.click();
    }
  }

  async logout() {
    await this.logoutBtn.click();
    await this.tabLogin.waitFor({ state: 'visible' });
  }

  async openAgentForgotPassword() {
    await this.tabLogin.click();
    await this.forgotPasswordLink.click();
    await this.forgotEmailInput.waitFor({ state: 'visible' });
  }

  async requestAgentPasswordReset(email) {
    await this.openAgentForgotPassword();
    if (email !== undefined) {
      await this.forgotEmailInput.fill(email);
    }
    await this.forgotSubmitBtn.click();
  }

  async resetAgentPassword({ email, otp, newPassword, confirmPassword = newPassword }) {
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
