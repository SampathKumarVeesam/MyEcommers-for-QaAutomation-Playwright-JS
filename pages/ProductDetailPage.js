// // export class ProductDetailPage {
// //   constructor(page) {
// //     this.page = page;

// //     // Search & Catalog triggers (Priority 2: getByPlaceholder, Priority 1: getByRole)
// //     this.searchInput = page.getByPlaceholder('Search dresses, smartphones, audio devices, perfumes...');
// //     this.cartButton = page.getByRole('button', { name: /cart/i });

// //     // Anchor PDP container via the unique share button inside the modal
// //     this.shareBtn = page.getByRole('button', { name: /share/i });
// //     this.pdpContainer = page.locator('div.fixed.inset-0').filter({ has: this.shareBtn });

// //     // Product Detail Modal Close Icon (w-5 h-5)
// //     this.closeBtn = this.pdpContainer.locator('button:has(svg.lucide-x.w-5.h-5)');

// //     // Social Share Popup & Close Icon (w-4 h-4)
// //     this.sharePopup = page
// //       .locator('div.fixed.inset-0, [role="dialog"], .z-50')
// //       .filter({ has: page.locator('button:has(svg.lucide-x.w-4.h-4)') })
// //       .last();
// //     this.closeSharePopupBtn = this.sharePopup.locator('button:has(svg.lucide-x.w-4.h-4)');

// //     // PDP Quantity Stepper (- 1 +) scoped inside PDP modal (Priority 1: getByRole)
// //     this.decreaseQtyBtn = this.pdpContainer.getByRole('button', { name: /decrease quantity/i });
// //     this.increaseQtyBtn = this.pdpContainer.getByRole('button', { name: /increase quantity/i });

// //     // PDP Action Buttons scoped inside PDP modal (Priority 1: getByRole)
// //     this.addToBasketBtn = this.pdpContainer.getByRole('button', { name: /add to basket/i });
// //     this.buyNowBtn = this.pdpContainer.getByRole('button', { name: /buy now/i });
// //   }

// //   async goto() {
// //     await this.page.goto('/');
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async searchAndOpenProduct(query, productId) {
// //     await this.searchInput.fill(query);
// //     await this.page.waitForTimeout(2000);

// //     // Priority 5: Chain product-card with product heading
// //     await this.page.getByTestId(`product-card-${productId}`).getByRole('heading', { level: 3 }).click();
// //     await this.shareBtn.waitFor({ state: 'visible' });
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async increaseQuantity(times = 1) {
// //     for (let i = 0; i < times; i++) {
// //       await this.increaseQtyBtn.click();
// //       await this.page.waitForTimeout(2000);
// //     }
// //   }

// //   async decreaseQuantity(times = 1) {
// //     for (let i = 0; i < times; i++) {
// //       await this.decreaseQtyBtn.click();
// //       await this.page.waitForTimeout(2000);
// //     }
// //   }

// //   async clickAddToBasket() {
// //     await this.addToBasketBtn.click();
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async clickBuyNow() {
// //     await this.buyNowBtn.click();
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async clickShare() {
// //     await this.shareBtn.click();
// //     await this.closeSharePopupBtn.waitFor({ state: 'visible' });
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async closeSharePopup() {
// //     await this.closeSharePopupBtn.click();
// //     await this.closeSharePopupBtn.waitFor({ state: 'hidden' });
// //     await this.page.waitForTimeout(2000);
// //   }

// //   async closeProductModal() {
// //     await this.closeBtn.click();
// //     await this.shareBtn.waitFor({ state: 'hidden' });
// //     await this.page.waitForTimeout(2000);
// //   }
// // }






// export class ProductDetailPage {
//   constructor(page) {
//     this.page = page;

//     // Search & Catalog triggers (Priority 2: getByPlaceholder, Priority 1: getByRole scoped to <header>)
//     this.searchInput = page.getByPlaceholder('Search dresses, smartphones, audio devices, perfumes...');
//     this.cartButton = page.locator('header').getByRole('button', { name: /cart/i });

//     // Anchor PDP container via the unique share button inside the modal
//     this.shareBtn = page.getByRole('button', { name: /share/i });
//     this.pdpContainer = page.locator('div.fixed.inset-0').filter({ has: this.shareBtn });

//     // Product Detail Modal Close Icon (w-5 h-5)
//     this.closeBtn = this.pdpContainer.locator('button:has(svg.lucide-x.w-5.h-5)');

//     // Social Share Popup & Close Icon (w-4 h-4)
//     this.sharePopup = page
//       .locator('div.fixed.inset-0, [role="dialog"], .z-50')
//       .filter({ has: page.locator('button:has(svg.lucide-x.w-4.h-4)') })
//       .last();
//     this.closeSharePopupBtn = this.sharePopup.locator('button:has(svg.lucide-x.w-4.h-4)');

//     // PDP Quantity Stepper (- 1 +) scoped inside PDP modal (Priority 1: getByRole)
//     this.decreaseQtyBtn = this.pdpContainer.getByRole('button', { name: /decrease quantity/i });
//     this.increaseQtyBtn = this.pdpContainer.getByRole('button', { name: /increase quantity/i });

//     // PDP Action Buttons scoped inside PDP modal (Priority 1: getByRole)
//     this.addToBasketBtn = this.pdpContainer.getByRole('button', { name: /add to basket/i });
//     this.buyNowBtn = this.pdpContainer.getByRole('button', { name: /buy now/i });
//   }

//   async goto() {
//     await this.page.goto('/');
//   }

//   async searchAndOpenProduct(query, productId) {
//     await this.searchInput.fill(query);

//     // Priority 5: Chain product-card with product heading
//     await this.page.getByTestId(`product-card-${productId}`).getByRole('heading', { level: 3 }).click();
//     await this.shareBtn.waitFor({ state: 'visible' });
//   }

//   async increaseQuantity(times = 1) {
//     for (let i = 0; i < times; i++) {
//       await this.increaseQtyBtn.click();
//     }
//   }

//   async decreaseQuantity(times = 1) {
//     for (let i = 0; i < times; i++) {
//       await this.decreaseQtyBtn.click();
//     }
//   }

//   async clickAddToBasket() {
//     await this.addToBasketBtn.click();
//   }

//   async clickBuyNow() {
//     await this.buyNowBtn.click();
//   }

//   async clickShare() {
//     await this.shareBtn.click();
//     await this.closeSharePopupBtn.waitFor({ state: 'visible' });
//   }

//   async closeSharePopup() {
//     await this.closeSharePopupBtn.click();
//     await this.closeSharePopupBtn.waitFor({ state: 'hidden' });
//   }

//   async closeProductModal() {
//     await this.closeBtn.click();
//     await this.shareBtn.waitFor({ state: 'hidden' });
//   }
// }







export class ProductDetailPage {
  constructor(page) {
    this.page = page;

    // Search, Quick Results Dropdown & Catalog triggers
    this.searchInput = page.getByPlaceholder('Search dresses, smartphones, audio devices, perfumes...');
    this.searchPreviewDropdown = page.getByTestId('search-preview-dropdown');
    this.cartButton = page.locator('header').getByRole('button', { name: /cart/i });

    // Anchor PDP container via the unique share button inside the modal
    this.shareBtn = page.getByRole('button', { name: /share/i });
    this.pdpContainer = page.locator('div.fixed.inset-0').filter({ has: this.shareBtn });

    // Product Detail Modal Close Icon (w-5 h-5)
    this.closeBtn = this.pdpContainer.locator('button:has(svg.lucide-x.w-5.h-5)');

    // Social Share Popup & Close Icon (w-4 h-4)
    this.sharePopup = page
      .locator('div.fixed.inset-0, [role="dialog"], .z-50')
      .filter({ has: page.locator('button:has(svg.lucide-x.w-4.h-4)') })
      .last();
    this.closeSharePopupBtn = this.sharePopup.locator('button:has(svg.lucide-x.w-4.h-4)');

    // PDP Quantity Stepper (- 1 +) scoped inside PDP modal
    this.decreaseQtyBtn = this.pdpContainer.getByRole('button', { name: /decrease quantity/i });
    this.increaseQtyBtn = this.pdpContainer.getByRole('button', { name: /increase quantity/i });

    // PDP Action Buttons scoped inside PDP modal
    this.addToBasketBtn = this.pdpContainer.getByRole('button', { name: /add to basket/i });
    this.buyNowBtn = this.pdpContainer.getByRole('button', { name: /buy now/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  // Flow A: Type full product name -> press Enter -> open filtered product card
  async searchAndOpenProduct(query, productId) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');

    await this.page.getByTestId(`product-card-${productId}`).getByRole('heading', { level: 3 }).click();
    await this.shareBtn.waitFor({ state: 'visible' });
  }

  // Flow B: Type partial query -> click matching item inside search-preview-dropdown
  async searchDropdownAndOpenProduct(partialQuery, productId) {
    await this.searchInput.fill(partialQuery);
    await this.searchPreviewDropdown.waitFor({ state: 'visible' });
    await this.searchPreviewDropdown.getByTestId(`search-preview-item-${productId}`).click();
    await this.shareBtn.waitFor({ state: 'visible' });
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.increaseQtyBtn.click();
    }
  }

  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.decreaseQtyBtn.click();
    }
  }

  async clickAddToBasket() {
    await this.addToBasketBtn.click();
  }

  async clickBuyNow() {
    await this.buyNowBtn.click();
  }

  async clickShare() {
    await this.shareBtn.click();
    await this.closeSharePopupBtn.waitFor({ state: 'visible' });
  }

  async closeSharePopup() {
    await this.closeSharePopupBtn.click();
    await this.closeSharePopupBtn.waitFor({ state: 'hidden' });
  }

  async closeProductModal() {
    await this.closeBtn.click();
    await this.shareBtn.waitFor({ state: 'hidden' });
  }
}