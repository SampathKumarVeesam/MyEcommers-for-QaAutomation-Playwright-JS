# 🛒 ShopSphere — Enterprise Playwright E2E Automation Framework

[![Playwright Tests](https://img.shields.io/badge/Playwright-v1.58.2-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![CI/CD](https://img.shields.io/badge/GitHub%20Actions-Passing%20(61%2F61)-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/SampathKumarVeesam/MyEcommers-for-QaAutomation-Playwright-JS/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An enterprise-grade End-to-End (E2E) Test Automation Framework architected with **Playwright**, modern **JavaScript (ES Modules)**, and the **Page Object Model (POM)** design pattern. Built for robust, scalable, and cross-platform verification of the [ShopSphere E-Commerce Platform](https://samecommers.netlify.app/).

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Application Under Test (AUT)](#-application-under-test-aut)
- [Framework Highlights & Engineering Practices](#-framework-highlights--engineering-practices)
- [Project Architecture](#-project-architecture)
- [Test Suites & Coverage Matrix (61 Tests)](#-test-suites--coverage-matrix-61-tests)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running Tests](#-running-tests)
- [HTML Reporting & Failure Artifacts](#-html-reporting--failure-artifacts)
- [CI/CD Pipeline (GitHub Actions)](#-cicd-pipeline-github-actions)
- [Contributing & Code Standards](#-contributing--code-standards)
- [License](#-license)

---

## 🌟 Overview

This test suite simulates real-world customer and administrator journeys through automated browser sessions. It provides automated test coverage spanning authentication, dynamic product catalogs, faceted filtering, interactive modal dialogues, live search dropdowns, shopping cart calculations, coupon processing, and complete multi-step checkout with OTP simulation and shipping destination validations.

---

## 🌐 Application Under Test (AUT)

- **Target App**: **ShopSphere** — Multi-Category E-Commerce & QA Testing Platform
- **Live URL**: [https://samecommers.netlify.app/](https://samecommers.netlify.app/)
- **Core Capabilities**:
  - Customer & Administrator Role Authentication
  - Real-time Product Search with Live Dropdown Previews
  - Dynamic Catalog Filtering (Category tabs, Price sliders, Stock filters, Sorting, Pagination)
  - Interactive Product Detail Modal (PDP) with Steppers, Pricing, and Social Sharing
  - Real-time Shopping Basket with dynamic totals and promotional discount codes (`SPHERE20`)
  - Multi-Step Checkout Flow (Country validation, Indian Shipping Address, 3 Delivery Tiers, 4 Payment Gateways, OTP Verification, Order Confirmation)
  - Cash on Delivery (COD) Payment Verification and Admin Approval workflows

---

## 🚀 Framework Highlights & Engineering Practices

- **Page Object Model (POM)**: Strict separation of page locators, actions, and assertions for clean maintainability.
- **Resilient, User-Centric Locators**: Prioritizes `page.getByRole()`, `page.getByTestId()`, and `page.getByPlaceholder()` over fragile CSS or XPath selectors.
- **API Network Interception**: Leverages `page.waitForResponse()` to validate HTTP 200/201 response payloads during registration and login workflows.
- **Positive & Negative Scenarios**: Validates edge cases including XSS script injections, invalid inputs, duplicate registrations, short passwords, and expired coupons.
- **Cross-Viewport & Responsive Testing**: Automated verification of mobile viewport transitions (`375x667`) and responsive navigation adaptations.
- **Headless & Headed Execution**: Seamless toggling between headless CI runs and full-screen headed debugging sessions (`--start-maximized`).
- **Rich Failure Artifacts**: Automatic capture of screenshots, videos, and network traces on test retries and failures.
- **GitHub Actions CI/CD**: Automated execution on every `push` and `pull_request` with automated 30-day artifact retention for test reports.

---

## 📁 Project Architecture

```plaintext
MyEcommers-for-QaAutomation-Playwright-JS/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI pipeline configuration
├── pages/                          # Page Object Model (POM) classes
│   ├── AdminPage.js               # Admin & Analytics console, Amount Handling & queues
│   ├── AuthPage.js                # Customer & Admin authentication actions & locators
│   ├── CartCheckoutPage.js        # Cart drawer, coupon handling, country & checkout
│   ├── DeliveryAgentPage.js       # Delivery Partner portal, OTP onboarding, dashboard & settlements
│   ├── HomePage.js                # Catalog, search, filters, hero slides & footer
│   └── ProductDetailPage.js       # PDP modal, steppers, pricing & social sharing
├── tests/                         # E2E Test Specifications (77+ Tests)
│   ├── admin-amount-handling.spec.js # Admin Amount Handling, Cash/QR queues & alerts (6 tests)
│   ├── agent-settlement-flow.spec.js # Full COD Settlement & Store Cash Deposit lifecycle (1 test)
│   ├── auth.spec.js               # Registration, Login, Logout & Admin auth suite (23 tests)
│   ├── cart-checkout.spec.js      # Cart management, coupon & multi-step checkout suite (12 tests)
│   ├── delivery-agent.spec.js     # Delivery Agent onboarding, OTP & store deposit suite (14 tests)
│   ├── forgot-password.spec.js    # Forgot & Reset Password suite with EP & BVA (14 tests)
│   ├── home.spec.js               # Catalog browsing, sliders, sorting & pagination (10 tests)
│   ├── product-details.spec.js    # PDP modal, dynamic pricing & basket interactions (7 tests)
│   └── search.spec.js             # Live search, dropdown previews, XSS & edge cases (11 tests)
├── .env.example                   # Template environment variables (safe placeholders)
├── .gitignore                     # Git ignore rules for reports, cache, and secrets
├── package.json                   # NPM dependencies, scripts, and metadata
├── playwright.config.js           # Playwright global runner configuration
└── README.md                      # Project documentation
```

---

## 🧪 Test Suites & Coverage Matrix (61 Tests)

### 1. Complete Authentication Suite (`tests/auth.spec.js` — 21 Tests)
| Test ID | Type | Description |
|---|---|---|
| `TC-REG-01` | Positive | Customer registration and database persistence verification |
| `TC-REG-02` | Negative | Rejects duplicate registration with already registered email |
| `TC-REG-03` | Negative | Prevents submission when required fields are empty |
| `TC-REG-04` | Negative | Enforces HTML5 and schema validation for invalid email formats |
| `TC-REG-05` | Negative | Rejects weak passwords with less than 6 characters |
| `TC-PWD-01` | Functional | Password visibility eye icon toggles masking without losing input |
| `TC-LOG-01` | Positive | Valid customer login with verified API response |
| `TC-LOG-02` | Session | Session persistence across page reloads and state clearing on sign-out |
| `TC-LOG-03` | Negative | Rejects unregistered email addresses with error banners |
| `TC-LOG-04` | Negative | Validates rejection on incorrect passwords |
| `TC-LOG-05` | Security | Enforces strict password case-sensitivity |
| `TC-LOG-06` | Negative | Form submission blocked when credentials are blank |
| `TC-ADM-01` | Positive | Administrator login via top header modal using username (`admin`) |
| `TC-ADM-02` | Positive | Administrator login via modal tab using email identifier |
| `TC-ADM-03` | Functional | Admin password masking toggle functionality |
| `TC-ADM-04` | Session | Admin session persistence on reload and proper sign-out |
| `TC-ADM-05` | Negative | Admin login failure on incorrect password |
| `TC-ADM-06` | Negative | Admin login failure on non-existent administrator account |
| `TC-ADM-07` | Security | Enforces administrator password case-sensitivity |
| `TC-ADM-08` | RBAC | Verifies standard customer credentials cannot access the Admin portal |
| `TC-ADM-09` | Negative | Admin login blocked on empty field submission |

### 2. Product Search & Live Results Suite (`tests/search.spec.js` — 11 Tests)
| Test ID | Type | Description |
|---|---|---|
| `TC-SRCH-01` | UI/UX | Verifies search input visibility, placeholder, and attributes |
| `TC-SRCH-02` | Positive | Partial query (`stu`) opens Quick Results dropdown, navigates directly to PDP |
| `TC-SRCH-03` | Positive | Full product name search with Enter key filters catalog card accurately |
| `TC-SRCH-04` | Search | Case-insensitive search verification (`UPPERCASE` vs `lowercase`) |
| `TC-SRCH-05` | Category | Product category keyword search (e.g., *Perfume*) |
| `TC-SRCH-06` | Reset | Clearing search query restores full catalog items |
| `TC-SRCH-07` | Input | Leading and trailing whitespace tolerance |
| `TC-SRCH-08` | Negative | Non-existent queries display 0 items gracefully without broken state |
| `TC-SRCH-09` | Security | XSS payload injection (`<script>alert("XSS")</script>`) is safely neutralized |
| `TC-SRCH-10` | Negative | Whitespace-only query handling |
| `TC-SRCH-11` | Responsive | Mobile viewport swaps desktop input for `mobile-search-input` |

### 3. Home Page & Catalog Browsing Suite (`tests/home.spec.js` — 10 Tests)
| Test ID | Description |
|---|---|
| `TC-01` | Verifies page title, branding logo, promo badge (`SPHERE20`), and header controls |
| `TC-03` | Verifies product catalog filtering on exact query search |
| `TC-04` | Category navigation tabs (Electronics, Hi-Fi Audio, All Products) |
| `TC-05` | Hero carousel next/previous slider navigation |
| `TC-06` | Price slider filtering ($200 max), In-Stock toggle, and sorting (Low to High) |
| `TC-07` | Product card attribute verification and Add-to-Cart quick action |
| `TC-08` | Pagination navigation between Page 1 and Page 2 |
| `TC-09` | FAQ accordion expansion and newsletter subscription |
| `TC-10` | Mobile viewport responsive layout verification |

### 4. Product Detail Modal & Cart Flow Suite (`tests/product-details.spec.js` — 7 Tests)
| Test ID | Description |
|---|---|
| `TC-PDP-01` | Opens PDP modal, verifies controls (Share, Add to Basket, Buy Now, Close) |
| `TC-PDP-02` | Quantity steppers (`+` and `-`) dynamically calculate total button price |
| `TC-PDP-03` | Quantity stepper prevents dropping below minimum order quantity (1) |
| `TC-PDP-04` | Add to Basket updates header cart badge count accurately |
| `TC-PDP-05` | Opens Social Share popup, closes it, and verifies PDP remains interactive |
| `TC-PDP-06` | Buy Now adds product and launches checkout drawer immediately |
| `TC-PDP-07` | Close icon (`X`) dismisses PDP modal back to catalog |
| `TC-PDP-08` | Full End-to-End flow: Search -> Open -> Increment Qty -> Share -> Add -> Close |

### 5. Cart, Coupon & Multi-Step Checkout Suite (`tests/cart-checkout.spec.js` — 12 Tests)
| Test ID | Description |
|---|---|
| `TC-CART-01` | Shopping Basket drawer opens; stepper counts and subtotal update in real-time |
| `TC-CART-02` | Valid coupon `SPHERE20` applies discount; successfully removed on request |
| `TC-CART-03` | Invalid coupon code displays error notice without altering order total |
| `TC-CHK-01` | Step 1: Secure Checkout accepts Country, City, State, and Postal Code |
| `TC-CHK-02` | Step 2: Delivery Method 1 — Standard Ground Shipping (FREE) & Back button verification |
| `TC-CHK-03` | Step 2: Delivery Method 2 — Express 2-Day Air ($14.99) |
| `TC-CHK-04` | Step 2: Delivery Method 3 — Next-Day Priority Courier ($24.99) |
| `TC-CHK-05` | Step 3: Payment gateways (UPI, Cards, Net Banking, COD) and Back navigation |
| `TC-CHK-06` | Complete End-to-End Checkout: Basket -> Qty -> `SPHERE20` -> Address -> Shipping -> Card -> OTP (`123456`) -> Order Confirmation |
| `TC-CHK-07` | OTP Gate rejects invalid/wrong OTP code with clear error notice |
| `TC-CHK-08` | Guest Checkout Auth Guard: Guest user is prompted to sign in and completes checkout |
| `TC-CHK-09` | PDP "Buy Now" direct jump into Secure Checkout flow |

### 6. Delivery Partner Portal & Onboarding Suite (`tests/delivery-agent.spec.js` — 9 Tests)
| Test ID | Type | Description |
|---|---|---|
| `TC-AGENT-01` | Navigation | Delivery Partner Portal opens via Header button and `#agent` URL hash |
| `TC-AGENT-02` | Positive | Agent self-registration dispatches 6-digit OTP to mailbox and leaves OTP input empty |
| `TC-AGENT-03` | Negative | Duplicate registration with already registered agent email is rejected |
| `TC-AGENT-04` | Negative | Email verification fails when OTP code is empty or invalid |
| `TC-AGENT-05` | Security | Verifying email sends temporary password to mailbox only (never exposed on UI) |
| `TC-AGENT-06` | Dashboard | Quick demo login as Alex Rivers displays assigned deliveries, earnings, and online FIFO presence |
| `TC-AGENT-07` | Settlement | Store Cash Deposit tab displays cash balance, lock status, and Hyderabad Store details |
| `TC-AGENT-08` | Alerts | In-App Notification Bell toggles real-time delivery agent alerts dropdown |
| `TC-AGENT-09` | Session | Delivery Agent can successfully log out and return to the login screen |
| `TC-AGENT-10` | Negative (EP) | Agent login rejected on incorrect password with security banner |
| `TC-AGENT-11` | Negative (EP) | Agent login rejected on non-existent delivery agent account |
| `TC-AGENT-12` | Positive (EP) | Agent registration with diverse vehicle types (Electric Van, Scooter) and Hyderabad zones |
| `TC-AGENT-13` | Positive (EP) | Gender selection dynamically presents corresponding avatar options |
| `TC-AGENT-14` | API/Presence | Live FIFO queue heartbeat maintaining online rotation presence |

### 7. Admin Amount Collection & Cash Handling Console Suite (`tests/admin-amount-handling.spec.js` — 6 Tests)
| Test ID | Type | Description |
|---|---|---|
| `TC-ADMIN-AMT-01` | Navigation | Admin can open Admin Console and navigate to the Amount Handling tab |
| `TC-ADMIN-AMT-02` | Financial | Amount Handling Console renders 3 KPI summary cards (UPI QR, Cash in Hand/Store, Reconciled COD) |
| `TC-ADMIN-AMT-03` | Verification | Store Cash Deposit Approvals queue displays locked agents and settlement queues |
| `TC-ADMIN-AMT-04` | Verification | UPI QR Payment Verification queue renders table headers or empty queue state |
| `TC-ADMIN-AMT-05` | Alerts | Admin In-App Notification Bell toggles real-time alert dropdown |
| `TC-ADMIN-AMT-06` | Directory | Delivery Agents tab displays agent list with online status and FIFO ranks |

### 8. Full COD Settlement & Store Cash Deposit Lifecycle Suite (`tests/agent-settlement-flow.spec.js` — 1 Test)
| Test ID | Type | Description |
|---|---|---|
| `TC-SETTLE-01` | End-to-End | Full lifecycle verification: Admin Amount Handling -> Agent Demo Login -> Store Cash Deposit -> In-App Notifications -> Agent Sign Out |

### 9. Forgot & Reset Password Security Suite (`tests/forgot-password.spec.js` — 14 Tests)
| Test ID | Method | Description |
|---|---|---|
| `TC-FP-EP-01` | Positive (EP) | Customer requests password reset OTP for registered account |
| `TC-FP-EP-02` | Positive (EP) | Delivery Agent requests recovery OTP via Agent Portal |
| `TC-FP-EP-03` | Security (EP) | Administrator self-service reset is strictly blocked with HTTP 403 Forbidden |
| `TC-FP-EP-04` | Negative (EP) | Unregistered email returns 404 account not found error |
| `TC-FP-EP-05` | Negative (EP) | Malformed email is rejected by client-side format validation |
| `TC-FP-BVA-01` | Negative (BVA) | Password reset rejects 5-character password (lower boundary $N-1$) |
| `TC-FP-BVA-02` | Positive (BVA) | Exactly 6-character password satisfies minimum boundary requirement ($N$) |
| `TC-FP-EP-06` | Negative (EP) | Password reset rejects non-matching passwords |
| `TC-FP-BVA-03` | Negative (BVA) | Empty OTP submission (0 chars) is blocked |
| `TC-FP-BVA-04` | Negative (BVA) | 5-digit OTP fails verification (boundary $N-1$) |
| `TC-FP-BVA-05` | Negative (BVA) | 6-digit incorrect OTP code is rejected |
| `TC-FP-AGENT-01` | Negative (EP) | Delivery Agent reset rejects invalid OTP via Portal modal |
| `TC-FP-AGENT-02` | Negative (EP) | Delivery Agent reset validates matching passwords |
| `TC-AUTH-FP-01` | Integration | Customer Sign In modal seamlessly links to Forgot Password recovery |

---

## 🛠️ Tech Stack

- **Testing Framework**: [Playwright Test](https://playwright.dev/)
- **Programming Language**: JavaScript (Node.js ES Modules)
- **Design Pattern**: Page Object Model (POM)
- **Assertion Engine**: Playwright Expect
- **Configuration & Secrets**: [dotenv](https://www.npmjs.com/package/dotenv)
- **CI/CD Integration**: GitHub Actions
- **Browsers Supported**: Chromium / Google Chrome

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (bundled with Node.js)
- **Git**: Installed and configured

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SampathKumarVeesam/MyEcommers-for-QaAutomation-Playwright-JS.git
   cd MyEcommers-for-QaAutomation-Playwright-JS
   ```

2. **Install NPM Dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright Browsers & OS Dependencies**:
   ```bash
   npx playwright install --with-deps chromium
   ```

### Environment Configuration

Create a `.env` file in the root directory by copying the provided `.env.example`:

```bash
cp .env.example .env
```

Configure your test parameters in `.env`:

```env
# Application Base URL
BASE_URL=https://samecommers.netlify.app/

# Customer Test Credentials
REAL_USER_NAME=Jane Customer
REAL_USER_EMAIL=customer@practicesoftwaretesting.com
REAL_USER_PASSWORD=User01

# Administrator Test Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@practicesoftwaretesting.com
ADMIN_PASSWORD=Sampath@123

# Verified Delivery Partner Test Credentials (Hyderabad Hub)
AGENT_NAME=Alex Rivers
AGENT_EMAIL=agent.alex@shopsphere.test
AGENT_PASSWORD=Agent@123
AGENT_PHONE=+91 98765 43210
AGENT_VEHICLE=Motorcycle
AGENT_ZONE=Hitech City, Hyderabad
```

> **Security Note**: Never commit actual passwords or credentials to version control. The `.env` file is excluded from git tracking via `.gitignore`.

---

## 🚦 Running Tests

The framework provides comprehensive npm scripts configured in `package.json`:

### Run Entire Test Suite (Headless)
```bash
npm test
```

### Run Entire Test Suite (Headed Mode)
```bash
npm run test:headed
```

### Run Tests with Playwright Interactive UI Mode
```bash
npm run test:ui
```

### Run Specific Test Suite
```bash
# Authentication Suite (23 tests)
npm run test:auth

# Forgot & Reset Password Security Suite (14 tests)
npm run test:forgot

# Cart & Multi-Step Checkout Suite (12 tests)
npm run test:cart

# Home Page & Catalog Browsing Suite (10 tests)
npm run test:home

# Product Detail Modal (PDP) Suite (7 tests)
npm run test:pdp

# Search & Quick Results Suite (11 tests)
npm run test:search

# Delivery Partner Portal & Onboarding Suite (14 tests)
npm run test:agent

# Admin Amount Collection & Cash Handling Console Suite (6 tests)
npm run test:admin-amount

# Full COD Settlement & Store Cash Deposit Flow (1 test)
npm run test:settlement
```

### Debugging with Playwright Inspector
```bash
npm run test:debug
```

---

## 📊 HTML Reporting & Failure Artifacts

After any test execution, launch the interactive Playwright HTML report:

```bash
npm run report
```

The report provides:
- Detailed step-by-step execution timeline with elapsed durations.
- Color-coded pass/fail/retry status indicators.
- Automatic screenshots captured at the point of failure.
- Full video recordings of failed test runs.
- Playwright Trace Viewer files (`trace.zip`) enabling time-travel DOM inspection, action logs, and network requests.

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

The repository includes a GitHub Actions workflow located in `.github/workflows/playwright.yml`:

- **Triggers**: Executed on every `push` and `pull_request` to `main` and `master` branches.
- **Environment**: Runs on `ubuntu-latest` with automated browser caching and Node.js setup.
- **Execution**: Runs with `--workers=1` to guarantee isolated, collision-free database transactions against the live target platform.
- **Artifacts**: Playwright HTML test reports and failure traces are automatically uploaded as workflow artifacts and retained for 30 days.

---

## 🤝 Contributing & Code Standards

1. Follow the **Page Object Model (POM)** pattern: all selectors belong in `pages/`, and tests in `tests/`.
2. Prioritize user-facing, accessible locators (`getByRole`, `getByTestId`, `getByPlaceholder`).
3. Ensure all tests run green locally before creating a pull request.
4. Keep commit messages clear and adhere to Conventional Commits (e.g., `feat:`, `fix:`, `test:`, `docs:`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
