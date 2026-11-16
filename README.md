# 🛒 ShopSphere — Enterprise Playwright E2E Automation Framework

[![Playwright Tests](https://img.shields.io/badge/Playwright-v1.65.1-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![CI/CD](https://img.shields.io/badge/GitHub%20Actions-CI%20Enabled-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/SampathKumarVeesam/MyEcommers-for-QaAutomation-Playwright-JS/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An enterprise-grade End-to-End (E2E) Test Automation Framework architected with **Playwright**, modern **JavaScript (ES Modules)**, and the **Page Object Model (POM)** design pattern. Built for robust, scalable, and cross-platform verification of the [ShopSphere E-Commerce Platform](https://samecommers.netlify.app/).

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Application Under Test (AUT)](#-application-under-test-aut)
- [Framework Highlights & Engineering Practices](#-framework-highlights--engineering-practices)
- [Project Architecture](#-project-architecture)
- [Test Suites & Coverage Matrix](#-test-suites--coverage-matrix)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running Tests](#-running-tests)
- [HTML Reporting & Artifacts](#-html-reporting--artifacts)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Contributing & Code Standards](#-contributing--code-standards)
- [Author & Connect](#-author--connect)

---

## 🌟 Overview

This framework simulates real-world customer and administrator journeys through automated browser sessions. It provides automated test coverage spanning authentication, dynamic product catalogs, faceted filtering, interactive modal dialogues, live search dropdowns, shopping cart calculations, coupon processing, and complete multi-step checkout with OTP simulation.

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
  - Multi-Step Checkout Flow (Indian Shipping Address, 3 Delivery Tiers, 4 Payment Gateways, OTP Verification, Order Confirmation)

---

## 🚀 Framework Highlights & Engineering Practices

- **Page Object Model (POM)**: Complete separation of page locators, actions, and assertions for clean maintainability.
- **Resilient, User-Centric Locators**: Prioritizes `page.getByRole()`, `page.getByTestId()`, and `page.getByPlaceholder()` over fragile CSS/XPath selectors.
- **API Network Interception**: Leverages `page.waitForResponse()` to validate HTTP 200/201 response payloads during registration and login workflows.
- **Positive & Negative Scenarios**: Validates edge cases including XSS script injections, invalid inputs, duplicate registrations, short passwords, and expired coupons.
- **Cross-Viewport & Responsive Testing**: Automated verification of mobile viewport transitions (`375x667`) and responsive navigation adaptations.
- **Headless & Headed Execution**: Seamless toggling between headless CI runs and full-screen headed debugging sessions (`--start-maximized`).
- **Rich Failure Artifacts**: Automatic capture of screenshots, videos, and network traces on test retries and failures.
- **GitHub Actions CI/CD**: Automated execution on every `push` and `pull_request` with automated 30-day artifact retention for test reports.

---

## 📂 Project Architecture

```plaintext
MyEcommers-for-QaAutomation-Playwright-JS/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI pipeline configuration
├── pages/                          # Page Object Model (POM) classes
│   ├── AuthPage.js                # Customer & Admin authentication actions & locators
│   ├── CartCheckoutPage.js        # Cart drawer, coupon handling & 3-step checkout
│   ├── HomePage.js                # Catalog, search, filters, hero slides & footer
│   └── ProductDetailPage.js       # PDP modal, steppers, pricing & social sharing
├── tests/                         # E2E Test Specifications
│   ├── auth.spec.js               # Registration, Login, Logout & Admin auth suite
│   ├── cart-checkout.spec.js      # Cart management, coupon & multi-step checkout suite
│   ├── home.spec.js               # Catalog browsing, sliders, sorting & pagination
│   ├── product-details.spec.js    # PDP modal, dynamic pricing & basket interactions
│   └── search.spec.js             # Live search, dropdown previews, XSS & edge cases
├── .env.example                   # Template environment variables
├── .gitignore                     # Git ignore rules for reports, cache, and secrets
├── package.json                   # NPM dependencies, scripts, and metadata
├── playwright.config.js           # Playwright global runner configuration
└── README.md                      # Project documentation
```

---

## 🧪 Test Suites & Coverage Matrix

### 1. Complete Authentication Suite (`tests/auth.spec.js`)
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

### 2. Product Search & Live Results Suite (`tests/search.spec.js`)
| Test ID | Type | Description |
|---|---|---|
| `TC-SRCH-01` | UI/UX | Verifies search input visibility, placeholder, and attributes |
| `TC-SRCH-02` | Positive | Partial query (`stu`) opens Quick Results dropdown, navigates directly to PDP |
| `TC-SRCH-03` | Positive | Full product name search with Enter key filters catalog card accurately |
| `TC-SRCH-04` | Search | Case-insensitive search verification (`UPPERCASE` vs `lowercase`) |
| `TC-SRCH-05` | Category | Product category keyword search (e.g., *Perfume*) |
| `TC-SRCH-06` | Reset | Clearing search query restores full 16-item catalog |
| `TC-SRCH-07` | Input | Leading and trailing whitespace tolerance |
| `TC-SRCH-08` | Negative | Non-existent queries display 0 items gracefully without broken state |
| `TC-SRCH-09` | Security | XSS payload injection (`<script>alert("XSS")</script>`) is safely neutralized |
| `TC-SRCH-10` | Negative | Whitespace-only query handling |
| `TC-SRCH-11` | Responsive | Mobile viewport swaps desktop input for `mobile-search-input` |

### 3. Home Page & Catalog Browsing Suite (`tests/home.spec.js`)
| Test ID | Description |
|---|---|
| `TC-01` | Verifies page title, branding logo, promo badge (`SPHERE20`), and header controls |
| `TC-03` | Verifies product catalog filtering on exact query search |
| `TC-04` | Category navigation tabs (Electronics, Hi-Fi Audio, All Products) |
| `TC-05` | Hero carousel next/previous slider navigation |
| `TC-06` | Price slider filtering ($200 max), In-Stock toggle, and sorting (Low to High) |
| `TC-07` | Product card attribute verification and Add-to-Cart quick action |
| `TC-08` | Pagination navigation between Page 1 and Page 2 |
| `TC-09` | FAQ accordion accordion expansion and newsletter subscription |
| `TC-10` | Mobile viewport responsive layout verification |

### 4. Product Detail Modal & Cart Flow Suite (`tests/product-details.spec.js`)
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

### 5. Cart, Coupon & Multi-Step Checkout Suite (`tests/cart-checkout.spec.js`)
| Test ID | Description |
|---|---|
| `TC-CART-01` | Shopping Basket drawer opens; stepper counts and subtotal update in real-time |
| `TC-CART-02` | Valid coupon `SPHERE20` applies discount; successfully removed on request |
| `TC-CART-03` | Invalid coupon code displays error notice without altering order total |
| `TC-CHK-01` | Step 1: Secure Checkout accepts full Indian Shipping Address (Hyderabad, Telangana) |
| `TC-CHK-02` | Step 2: Delivery Method 1 — Standard Ground Shipping (FREE) & Back button verification |
| `TC-CHK-03` | Step 2: Delivery Method 2 — Express 2-Day Air ($14.99) |
| `TC-CHK-04` | Step 2: Delivery Method 3 — Next-Day Priority Courier ($24.99) |
| `TC-CHK-05` | Step 3: Payment gateways (UPI, Cards, Net Banking, COD) and Back navigation |
| `TC-CHK-06` | Complete End-to-End Checkout: Basket -> Qty -> `SPHERE20` -> Address -> Shipping -> Card -> OTP (`123456`) -> Order Confirmation |

---

## 🛠 Tech Stack

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
   npx playwright install --with-deps
   ```

### Environment Configuration

Create a `.env` file in the root directory by copying the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```env
# Application Base URL
BASE_URL=https://samecommers.netlify.app/

# Real Customer Test Credentials
REAL_USER_NAME=User
REAL_USER_EMAIL=user@mailto.plus
REAL_USER_PASSWORD=User@2$0$2$6

# Administrator Test Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@practicesoftwaretesting.com
ADMIN_PASSWORD=Sampath@123
```

> **Note**: `.env` is excluded from git tracking via `.gitignore` to prevent secret exposure.

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

### Run Tests in Debug Mode (Playwright Inspector)
```bash
npm run test:debug
```

### Run Specific Test Modules

| Module | Command (Headless) | Command (Headed) |
|---|---|---|
| **Authentication Suite** | `npm run test:auth` | `npm run test:auth:headed` |
| **Home & Catalog Suite** | `npm run test:home` | `npm run test:home:headed` |
| **Search & Dropdown Suite** | `npm run test:search` | `npm run test:search:headed` |
| **Product Detail (PDP) Suite** | `npm run test:pdp` | `npm run test:pdp:headed` |
| **Cart & Checkout Suite** | `npm run test:checkout` | `npm run test:checkout:headed` |

---

## 📊 HTML Reporting & Artifacts

Playwright generates an interactive HTML report containing step-by-step logs, execution times, video recordings, and screenshots.

To launch the latest test report locally:
```bash
npm run report
```

---

## ⚙️ CI/CD Pipeline

Continuous Integration is pre-configured using **GitHub Actions** (`.github/workflows/playwright.yml`).

### Workflow Triggers:
- Every `push` to `main` or `master`
- Every `pull_request` targeting `main` or `master`

### Pipeline Steps:
1. Check out repository code.
2. Set up Node.js LTS environment.
3. Cache and install clean dependencies via `npm ci`.
4. Install Playwright browser binaries with required system dependencies.
5. Execute full test suite in headless mode.
6. Publish HTML test report artifacts with 30-day retention.

---

## 🤝 Contributing & Code Standards

Contributions, bug reports, and suggestions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author & Connect

**Sampath Kumar Veesam**  
- **GitHub**: [@SampathKumarVeesam](https://github.com/SampathKumarVeesam)  
- **Email**: sampathkumarveesam@gmail.com  
- **Project Repository**: [MyEcommers-for-QaAutomation-Playwright-JS](https://github.com/SampathKumarVeesam/MyEcommers-for-QaAutomation-Playwright-JS)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
