export class AdminPage {
  constructor(page) {
    this.page = page;

    // 1. Header Trigger & Modal Container
    const header = page.locator('header');
    this.navAdminDashboardBtn = header.getByTestId('nav-admin-dashboard');
    this.adminModal = page.getByTestId('admin-modal');
    this.closeModalBtn = this.adminModal.getByTestId('admin-close-button');
    this.refreshAllBtn = this.adminModal.getByTestId('admin-refresh-all-button');

    // 2. Primary Tabs
    this.tabAnalytics = this.adminModal.getByTestId('admin-tab-analytics');
    this.tabInventory = this.adminModal.getByTestId('admin-tab-inventory');
    this.tabAddProduct = this.adminModal.getByTestId('admin-tab-add-product');
    this.tabOrders = this.adminModal.getByTestId('admin-tab-orders');
    this.tabAgents = this.adminModal.getByTestId('admin-tab-agents');
    this.tabAmountHandling = this.adminModal.getByTestId('admin-tab-amount-handling');

    // 3. Notification Bell & Dropdown
    this.notificationBellBtn = this.adminModal.getByTestId('admin-notifications-bell');
    this.notificationDropdown = this.adminModal.locator('.absolute.right-0.mt-2.w-80');
    this.markAllNotificationsReadBtn = this.notificationDropdown.getByRole('button', { name: /mark all read/i });

    // 4. Amount Handling Console Elements
    this.kpiUpiQrCard = this.adminModal.locator('.bg-indigo-50\\/70');
    this.kpiCashCard = this.adminModal.locator('.bg-amber-50\\/70');
    this.kpiTotalReconciledCard = this.adminModal.locator('.bg-emerald-50\\/70');

    // 5. Rejection Modal Dialog
    this.rejectionModal = page.locator('.fixed.inset-0.z-60');
    this.rejectionReasonInput = this.rejectionModal.getByTestId('input-deposit-rejection-reason');
    this.confirmRejectionBtn = this.rejectionModal.getByTestId('btn-confirm-deposit-rejection');
    this.cancelRejectionBtn = this.rejectionModal.getByTestId('btn-cancel-deposit-rejection');

    // 6. Agents List Tab Elements
    this.toggleAddAgentBtn = this.adminModal.getByTestId('btn-toggle-add-agent');
    this.newAgentNameInput = this.adminModal.getByPlaceholder('Agent Full Name');
    this.newAgentEmailInput = this.adminModal.getByPlaceholder('agent@example.com');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openViaHeader() {
    await this.navAdminDashboardBtn.click();
    await this.adminModal.waitFor({ state: 'visible' });
  }

  async closeAdminConsole() {
    if (await this.closeModalBtn.isVisible()) {
      await this.closeModalBtn.click();
      await this.adminModal.waitFor({ state: 'hidden' });
    }
  }

  async switchToTab(tabName) {
    const tabs = {
      analytics: this.tabAnalytics,
      inventory: this.tabInventory,
      'add-product': this.tabAddProduct,
      orders: this.tabOrders,
      agents: this.tabAgents,
      'amount-handling': this.tabAmountHandling,
    };
    const target = tabs[tabName];
    if (target) {
      await target.click();
    }
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

  async approveAgentCashDeposit(agentId) {
    await this.switchToTab('amount-handling');
    const approveBtn = this.adminModal.getByTestId(`btn-approve-deposit-${agentId}`);
    await approveBtn.waitFor({ state: 'visible' });
    await approveBtn.click();
  }

  async rejectAgentCashDeposit(agentId, reason = 'Cash shortage detected at store cashier') {
    await this.switchToTab('amount-handling');
    const rejectBtn = this.adminModal.getByTestId(`btn-reject-deposit-${agentId}`);
    await rejectBtn.waitFor({ state: 'visible' });
    await rejectBtn.click();

    await this.rejectionModal.waitFor({ state: 'visible' });
    await this.rejectionReasonInput.fill(reason);
    await this.confirmRejectionBtn.click();
    await this.rejectionModal.waitFor({ state: 'hidden' });
  }

  async confirmQrPayment(orderNumber) {
    await this.switchToTab('amount-handling');
    const confirmBtn = this.adminModal.getByTestId(`btn-confirm-qr-${orderNumber}`);
    await confirmBtn.waitFor({ state: 'visible' });
    await confirmBtn.click();
  }

  async toggleAgentActiveStatus(agentId) {
    await this.switchToTab('agents');
    const toggleBtn = this.adminModal.getByTestId(`btn-toggle-agent-status-${agentId}`);
    await toggleBtn.click();
  }

  async updateOrderStatus(orderNumber, newStatus) {
    await this.switchToTab('orders');
    const select = this.adminModal.getByTestId(`admin-order-status-select-${orderNumber}`);
    await select.selectOption(newStatus);
  }
}
