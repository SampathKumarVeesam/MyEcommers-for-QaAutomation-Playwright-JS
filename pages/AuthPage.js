// // export class AuthPage {
// //   constructor(page) {
// //     this.page = page;

// //     // Header triggers (Priority 1: getByRole)
// //     this.signInNavBtn = page.getByRole('button', { name: 'Sign In' });
// //     this.registerNavBtn = page.getByRole('button', { name: 'Register' });
// //     this.adminLoginNavBtn = page.getByRole('button', { name: /admin login|administrator login/i });
// //     this.demoAccountsBtn = page.getByRole('button', { name: /customer demos/i });

// //     // Logged-in User / Admin Profile Menu & Dropdown
// //     this.userMenuTrigger = page.locator('header .relative.shrink-0 button:has(svg.lucide-chevron-down)');
// //     this.userMenuDropdown = page.locator('div[data-testid="user-menu-dropdown"]');
// //     this.userProfileName = this.userMenuDropdown.locator('p').first();
// //     this.userProfileEmail = this.userMenuDropdown.locator('p').nth(1);
// //     this.signOutBtn = page.getByRole('button', { name: 'Sign Out' });

// //     // Modal container & tabs (Priority 1: getByRole scoped inside modal)
// //     this.modal = page.locator('div[data-testid="auth-modal"]');
// //     this.loginTab = this.modal.getByRole('button', { name: 'Sign In' });
// //     this.registerTab = this.modal.getByRole('button', { name: 'Register' });
// //     this.adminTab = this.modal.getByRole('button', { name: 'Admin' });
// //     this.closeModalBtn = this.modal.locator('button:has(svg.lucide-x)');

// //     // Register form fields & inline errors (Priority 1: role, 2: placeholder/label, 3: text)
// //     this.registerNameInput = this.modal.getByPlaceholder(/sarah connor/i);
// //     this.registerEmailInput = this.modal.getByPlaceholder('sarah@example.com');
// //     this.registerPasswordInput = this.modal.getByPlaceholder('Minimum 6 characters');
// //     this.registerPasswordToggle = this.modal.getByRole('button', { name: /show password|hide password/i }).first();
// //     this.registerPhoneInput = this.modal.getByPlaceholder('+1 (555) 000-0000');
// //     this.registerSubmitBtn = this.modal.getByRole('button', { name: 'Create Free Account' });
// //     this.registerEmailError = this.modal.getByText(/already in use|already registered |register-email-error/i);
// //     this.registerPasswordError = this.modal.getByText('Password must be at least 6 characters');

// //     // Customer Login form fields inside auth-modal (Priority 2: placeholder, 1: role)
// //     this.loginEmailInput = this.modal.getByPlaceholder('you@example.com');
// //     this.loginPasswordInput = this.modal.getByPlaceholder('••••••••');
// //     this.loginSubmitBtn = this.modal.getByRole('button', { name: /sign in with token|sign in to account/i });

// //     // Admin Login form fields inside auth-modal (Priority 2: placeholder, 1: role)
// //     this.adminIdentifierInput = this.modal.getByPlaceholder('admin or admin@example.com');
// //     this.adminPasswordInput = this.modal.getByPlaceholder('Enter administrator password');
// //     this.adminPasswordToggle = this.modal.getByRole('button', { name: /show password|hide password/i }).first();
// //     this.adminSubmitBtn = this.modal.getByRole('button', { name: 'Sign In to Admin Dashboard' });
// //   }

// //   async goto() {
// //     await this.page.goto('/');
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async openRegisterModal() {
// //     await this.registerNavBtn.click();
// //     await this.modal.waitFor({ state: 'visible' });
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async openSignInModal() {
// //     await this.signInNavBtn.click();
// //     await this.modal.waitFor({ state: 'visible' });
// //     await this.page.waitForTimeout(2000);
// //     await this.loginTab.click();
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async openAdminModal(viaTab = false) {
// //     if (viaTab) {
// //       await this.signInNavBtn.click();
// //       await this.modal.waitFor({ state: 'visible' });
// //       await this.page.waitForTimeout(2000);
// //       await this.adminTab.click();
// //     } else {
// //       await this.adminLoginNavBtn.click();
// //       await this.modal.waitFor({ state: 'visible' });
// //     }
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async register({ name, email, password, phone }) {
// //     await this.openRegisterModal();
// //     if (name !== undefined) {
// //       await this.registerNameInput.fill(name);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     if (email !== undefined) {
// //       await this.registerEmailInput.fill(email);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     if (password !== undefined) {
// //       await this.registerPasswordInput.fill(password);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     if (phone !== undefined) {
// //       await this.registerPhoneInput.fill(phone);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     await this.registerSubmitBtn.click();
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async login({ email, password }) {
// //     await this.openSignInModal();
// //     if (email !== undefined) {
// //       await this.loginEmailInput.fill(email);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     if (password !== undefined) {
// //       await this.loginPasswordInput.fill(password);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     await this.loginSubmitBtn.click();
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async loginAsAdmin({ identifier, password, viaTab = false }) {
// //     await this.openAdminModal(viaTab);
// //     if (identifier !== undefined) {
// //       await this.adminIdentifierInput.fill(identifier);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     if (password !== undefined) {
// //       await this.adminPasswordInput.fill(password);
// //       await this.page.waitForTimeout(2000);
// //     }
// //     await this.adminSubmitBtn.click();
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async logout() {
// //     // 1. Click the chevron-down trigger on the logged-in header profile button
// //     await this.userMenuTrigger.click();
// //     await this.userMenuDropdown.waitFor({ state: 'visible' });
// //     await this.page.waitForTimeout(2000);

// //     // 2. Click Sign Out
// //     await this.signOutBtn.click();
// //     await this.page.waitForTimeout(2000);
// //   }
// // }








// export class AuthPage {
//   constructor(page) {
//     this.page = page;

//     // 1. Header triggers (Priority 1: getByRole scoped to <header>)
//     const header = page.locator('header');
//     this.signInNavBtn = header.getByRole('button', { name: 'Sign In' });
//     this.registerNavBtn = header.getByRole('button', { name: 'Register' });
//     this.adminLoginNavBtn = header.getByRole('button', { name: /admin login|administrator login/i });
//     this.demoAccountsBtn = header.getByRole('button', { name: /customer demos/i });

//     // 2. Logged-in User / Admin Profile Menu & Dropdown
//     this.userMenuTrigger = header.locator('.relative.shrink-0 button:has(svg.lucide-chevron-down)');
//     this.userMenuDropdown = page.locator('div[data-testid="user-menu-dropdown"]');
//     this.userProfileName = this.userMenuDropdown.locator('p').first();
//     this.userProfileEmail = this.userMenuDropdown.locator('p').nth(1);
//     this.signOutBtn = this.userMenuDropdown.getByRole('button', { name: 'Sign Out' });

//     // 3. Modal container & tabs (Priority 1: getByRole scoped inside modal)
//     this.modal = page.locator('div[data-testid="auth-modal"]');
//     this.loginTab = this.modal.getByRole('button', { name: 'Sign In' });
//     this.registerTab = this.modal.getByRole('button', { name: 'Register' });
//     this.adminTab = this.modal.getByRole('button', { name: 'Admin' });
//     this.closeModalBtn = this.modal.locator('button:has(svg.lucide-x)');

//     // 4. Register form fields & inline errors
//     this.registerNameInput = this.modal.getByPlaceholder(/sarah connor/i);
//     this.registerEmailInput = this.modal.getByPlaceholder('sarah@example.com');
//     this.registerPasswordInput = this.modal.getByPlaceholder('Minimum 6 characters');
//     this.registerPasswordToggle = this.modal.getByRole('button', { name: /show password|hide password/i }).first();
//     this.registerPhoneInput = this.modal.getByPlaceholder('+1 (555) 000-0000');
//     this.registerSubmitBtn = this.modal.getByRole('button', { name: 'Create Free Account' });
//     this.registerEmailError = this.modal.getByText('Email address already in use');
//     this.registerPasswordError = this.modal.getByText('Password must be at least 6 characters');

//     // 5. Customer Login form fields inside auth-modal
//     this.loginEmailInput = this.modal.getByPlaceholder('you@example.com');
//     this.loginPasswordInput = this.modal.getByPlaceholder('••••••••');
//     this.loginSubmitBtn = this.modal.getByRole('button', { name: /sign in with token|sign in to account/i });

//     // 6. Admin Login form fields inside auth-modal
//     this.adminIdentifierInput = this.modal.getByPlaceholder('admin or admin@example.com');
//     this.adminPasswordInput = this.modal.getByPlaceholder('Enter administrator password');
//     this.adminPasswordToggle = this.modal.getByRole('button', { name: /show password|hide password/i }).first();
//     this.adminSubmitBtn = this.modal.getByRole('button', { name: 'Sign In to Admin Dashboard' });
//   }

//   async goto() {
//     await this.page.goto('/');
//   }

//   async openRegisterModal() {
//     await this.registerNavBtn.click();
//     await this.modal.waitFor({ state: 'visible' });
//   }

//   async openSignInModal() {
//     await this.signInNavBtn.click();
//     await this.modal.waitFor({ state: 'visible' });
//     await this.loginTab.click();
//   }

//   async openAdminModal(viaTab = false) {
//     if (viaTab) {
//       await this.signInNavBtn.click();
//       await this.modal.waitFor({ state: 'visible' });
//       await this.adminTab.click();
//     } else {
//       await this.adminLoginNavBtn.click();
//       await this.modal.waitFor({ state: 'visible' });
//     }
//   }

//   async register({ name, email, password, phone }) {
//     await this.openRegisterModal();
//     if (name !== undefined) {
//       await this.registerNameInput.fill(name);
//     }
//     if (email !== undefined) {
//       await this.registerEmailInput.fill(email);
//     }
//     if (password !== undefined) {
//       await this.registerPasswordInput.fill(password);
//     }
//     if (phone !== undefined) {
//       await this.registerPhoneInput.fill(phone);
//     }
//     await this.registerSubmitBtn.click();
//   }

//   async login({ email, password }) {
//     await this.openSignInModal();
//     if (email !== undefined) {
//       await this.loginEmailInput.fill(email);
//     }
//     if (password !== undefined) {
//       await this.loginPasswordInput.fill(password);
//     }
//     await this.loginSubmitBtn.click();
//   }

//   async loginAsAdmin({ identifier, password, viaTab = false }) {
//     await this.openAdminModal(viaTab);
//     if (identifier !== undefined) {
//       await this.adminIdentifierInput.fill(identifier);
//     }
//     if (password !== undefined) {
//       await this.adminPasswordInput.fill(password);
//     }
//     await this.adminSubmitBtn.click();
//   }

//   async logout() {
//     await this.userMenuTrigger.click();
//     await this.userMenuDropdown.waitFor({ state: 'visible' });
//     await this.signOutBtn.click();
//   }
// }









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
    this.loginEmailInput = this.modal.getByPlaceholder('you@example.com');
    this.loginPasswordInput = this.modal.getByPlaceholder('••••••••');
    this.loginSubmitBtn = this.modal.locator('form button[type="submit"]');

    // 6. Admin Login form fields inside auth-modal
    this.adminIdentifierInput = this.modal.getByPlaceholder('admin or admin@example.com');
    this.adminPasswordInput = this.modal.getByPlaceholder('Enter administrator password');
    this.adminPasswordToggle = this.modal.getByRole('button', { name: /show password|hide password/i }).first();
    this.adminSubmitBtn = this.modal.getByRole('button', { name: 'Sign In to Admin Dashboard' });
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
    if (viaTab) {
      await this.signInNavBtn.click();
      await this.modal.waitFor({ state: 'visible' });
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
}