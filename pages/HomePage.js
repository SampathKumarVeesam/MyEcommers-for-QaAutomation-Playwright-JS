// export class HomePage {
//   constructor(page) {
//     this.page = page;

//     // Interactive header & navigation controls (Priority 1: getByRole)
//     this.logo = page.getByRole('button', { name: /shopsphere/i });
//     this.currencySelector = page.getByRole('combobox').filter({ has: page.locator('option[value="USD"]') });
//     this.cartButton = page.getByRole('button', { name: /cart/i });
//     this.wishlistButton = page.getByRole('button', { name: /view wishlist|wishlist/i });

//     // Search inputs (Priority 2: getByPlaceholder)
//     this.searchInput = page.getByPlaceholder('Search dresses, smartphones, audio devices, perfumes...');
//     this.mobileSearchInput = page.getByPlaceholder('Search products, phones, dresses...');

//     // Filters & Sorting (Priority 1: getByRole, Priority 3: getByText, Priority 4: locator)
//     this.priceSlider = page.getByRole('slider');
//     this.priceDisplay = page.locator('div:has(input[type="range"]) span.font-mono');
//     this.inStockCheckbox = page.getByRole('checkbox', { name: /in stock/i });
//     this.sortSelect = page.getByRole('combobox').filter({ has: page.locator('option[value="low-to-high"]') });
//     this.totalCount = page.getByText(/\d+ items/i);

//     // Pagination controls (Priority 1: getByRole, Priority 3: getByText)
//     this.paginationPrev = page.getByRole('button', { name: 'Previous' });
//     this.paginationNext = page.getByRole('button', { name: 'Next' });
//     this.paginationIndicator = page.getByText(/page \d+ of \d+/i);
//   }

//   async goto() {
//     await this.page.goto('https://samecommers.netlify.app/');
//   }

//   async searchProduct(query) {
//     await this.searchInput.fill(query);
//   }

//   async selectCategory(category) {
//     // Priority 1: Map category keys to accessible button text
//     const categoryNames = {
//       all: 'All Products',
//       electronics: 'Smartphones & Tech',
//       fashion: 'Fashion & Dresses',
//       audio: 'Hi-Fi Audio',
//       beauty: 'Luxury Fragrance',
//     };
//     const categoryName = categoryNames[category] || category;
//     await this.page.getByRole('button', { name: categoryName }).click();
//   }

//   async addProductToCart(productId) {
//     // Priority 5: Chain repeating card testid with semantic button role
//     await this.page.getByTestId(`product-card-${productId}`).getByRole('button', { name: /add to cart/i }).click();
//   }

//   async toggleWishlist(productId) {
//     // Priority 5: Chain repeating card testid with semantic button role
//     await this.page.getByTestId(`product-card-${productId}`).getByRole('button', { name: /wishlist/i }).click();
//   }
// }






// export class HomePage {
//   constructor(page) {
//     this.page = page;

//     // Interactive header & navigation controls (Priority 1: getByRole scoped to <header>)
//     const header = page.locator('header');
//     this.logo = header.getByRole('button', { name: /shopsphere/i });
//     this.currencySelector = header.getByRole('combobox').filter({ has: page.locator('option[value="USD"]') });
//     this.cartButton = header.getByRole('button', { name: /cart/i });
//     this.wishlistButton = header.getByRole('button', { name: /view wishlist|wishlist/i });

//     // Search inputs (Priority 2: getByPlaceholder)
//     this.searchInput = page.getByPlaceholder('Search dresses, smartphones, audio devices, perfumes...');
//     this.mobileSearchInput = page.getByPlaceholder('Search products, phones, dresses...');

//     // Filters & Sorting (Priority 1: getByRole, Priority 3: getByText, Priority 4: locator, Priority 5: testid)
//     this.priceSlider = page.getByRole('slider');
//     this.priceDisplay = page.locator('span.font-extrabold.font-mono');
//     this.inStockCheckbox = page.getByRole('checkbox', { name: /in stock/i });
//     this.sortSelect = page.getByRole('combobox').filter({ has: page.locator('option[value="low-to-high"]') });
//     this.totalCount = page.getByText(/\d+ items/i);

//     // Pagination controls (Priority 1: getByRole with exact: true so they don't collide with hero carousel slides)
//     this.paginationPrev = page.getByRole('button', { name: 'Previous', exact: true });
//     this.paginationNext = page.getByRole('button', { name: 'Next', exact: true });
//     this.paginationIndicator = page.getByText(/page \d+ of \d+/i);
//   }

//   async goto() {
//     await this.page.goto('/');
//   }

//   async searchProduct(query) {
//     await this.searchInput.fill(query);
//   }

//   async selectCategory(category) {
//     // Priority 1: Map category keys to accessible button text
//     const categoryNames = {
//       all: 'All Products',
//       electronics: 'Smartphones & Tech',
//       fashion: 'Fashion & Dresses',
//       audio: 'Hi-Fi Audio',
//       beauty: 'Luxury Fragrance',
//     };
//     const categoryName = categoryNames[category] || category;
//     await this.page.getByRole('button', { name: categoryName }).click();
//   }

//   async addProductToCart(productId) {
//     // Priority 5: Chain repeating card testid with semantic button role
//     await this.page.getByTestId(`product-card-${productId}`).getByRole('button', { name: /add to cart/i }).click();
//   }

//   async toggleWishlist(productId) {
//     // Priority 5: Chain repeating card testid with semantic button role
//     await this.page.getByTestId(`product-card-${productId}`).getByRole('button', { name: /wishlist/i }).click();
//   }
// }









export class HomePage {
  constructor(page) {
    this.page = page;

    // Interactive header & navigation controls (Priority 1: getByRole scoped to <header>)
    const header = page.locator('header');
    this.logo = header.getByRole('button', { name: /shopsphere/i });
    this.currencySelector = header.getByRole('combobox').filter({ has: page.locator('option[value="USD"]') });
    this.cartButton = header.getByRole('button', { name: /cart/i });
    this.wishlistButton = header.getByRole('button', { name: /view wishlist|wishlist/i });

    // Search inputs & Quick Results preview dropdown (Priority 2: getByPlaceholder, Priority 5: testid)
    this.searchInput = page.getByPlaceholder('Search dresses, smartphones, audio devices, perfumes...');
    this.mobileSearchInput = page.getByPlaceholder('Search products, phones, dresses...');
    this.searchPreviewDropdown = page.getByTestId('search-preview-dropdown');
    this.searchPreviewHeader = this.searchPreviewDropdown.getByText('Quick Results');

    // Filters & Sorting
    this.priceSlider = page.getByRole('slider');
    this.priceDisplay = page.locator('span.font-extrabold.font-mono');
    this.inStockCheckbox = page.getByRole('checkbox', { name: /in stock/i });
    this.sortSelect = page.getByRole('combobox').filter({ has: page.locator('option[value="low-to-high"]') });
    this.totalCount = page.getByText(/\d+ items/i);

    // Pagination controls (exact: true so they don't collide with hero carousel slides)
    this.paginationPrev = page.getByRole('button', { name: 'Previous', exact: true });
    this.paginationNext = page.getByRole('button', { name: 'Next', exact: true });
    this.paginationIndicator = page.getByText(/page \d+ of \d+/i);
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchProduct(query, pressEnter = false) {
    await this.searchInput.fill(query);
    if (pressEnter) {
      await this.searchInput.press('Enter');
    }
  }

  getSearchPreviewItem(productId) {
    return this.searchPreviewDropdown.getByTestId(`search-preview-item-${productId}`);
  }

  async selectFromSearchDropdown(query, productId) {
    await this.searchInput.fill(query);
    await this.searchPreviewDropdown.waitFor({ state: 'visible' });
    await this.getSearchPreviewItem(productId).click();
  }

  async selectCategory(category) {
    const categoryNames = {
      all: 'All Products',
      electronics: 'Smartphones & Tech',
      fashion: 'Fashion & Dresses',
      audio: 'Hi-Fi Audio',
      beauty: 'Luxury Fragrance',
    };
    const categoryName = categoryNames[category] || category;
    await this.page.getByRole('button', { name: categoryName }).click();
  }

  async addProductToCart(productId) {
    await this.page.getByTestId(`product-card-${productId}`).getByRole('button', { name: /add to cart/i }).click();
  }

  async toggleWishlist(productId) {
    await this.page.getByTestId(`product-card-${productId}`).getByRole('button', { name: /wishlist/i }).click();
  }
}