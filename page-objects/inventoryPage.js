const { expect } = require('@playwright/test');

class InventoryPage {
  constructor(page, logger, testTitle = '') {
    this.page = page;
    this.logger = logger;
    this.testTitle = testTitle;

    this.itemTitleSelector = '.inventory_item_name';
    this.addToCartButtonSelector = '.btn_inventory';
    this.cartBadgeSelector = '.shopping_cart_badge';
    this.cartLinkSelector = '.shopping_cart_link';
    this.burgerMenuButtonSelector = '.bm-burger-button button';
    this.logoutButtonSelector = '#logout_sidebar_link';
  }

  async navigateTo() {
    this.logger.info(this.testTitle, 'Navigating to inventory page...');
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  async getItemTitles() {
    this.logger.info(this.testTitle, 'Fetching list of item titles from inventory');
    return await this.page.$$eval(this.itemTitleSelector, items =>
      items.map(item => item.textContent.trim())
    );
  }

  async addItemToCart(itemName) {
    this.logger.info(this.testTitle, `Adding item to cart: "${itemName}"`);
    const itemSelector = `xpath=//div[text()='${itemName}']/ancestor::div[contains(@class, 'inventory_item')]//button[contains(@class, 'btn_inventory')]`;
    await this.page.click(itemSelector);
  }

  async getCartItemCount() {
    this.logger.info(this.testTitle, 'Getting cart item count');
    const badge = await this.page.$(this.cartBadgeSelector);
    return badge ? parseInt(await badge.textContent(), 10) : 0;
  }

  async goToCart() {
    this.logger.info(this.testTitle, 'Navigating to cart page');
    await this.page.click(this.cartLinkSelector);
  }

  async isItemInCart(itemName) {
    this.logger.info(this.testTitle, `Checking if "${itemName}" is in the cart`);
    await this.goToCart();
    const itemSelector = `xpath=//div[text()='${itemName}']`;
    return await this.page.$(itemSelector) !== null;
  }

  async removeItemFromCart(itemName) {
    this.logger.info(this.testTitle, `Removing item from cart: "${itemName}"`);
    const itemSelector = `xpath=//div[text()='${itemName}']/ancestor::div[contains(@class, 'cart_item')]//button[text()='Remove']`;
    await this.page.click(itemSelector);
  }

  async logout() {
    this.logger.info(this.testTitle, 'Logging out of the application');
    await this.page.click(this.burgerMenuButtonSelector);
    await this.page.click(this.logoutButtonSelector);
  }

  async assertItemInCart(itemName) {
    this.logger.info(this.testTitle, `Asserting "${itemName}" is in cart`);
    const isInCart = await this.isItemInCart(itemName);
    expect(isInCart).toBe(true);
  }

  async assertItemNotInCart(itemName) {
    this.logger.info(this.testTitle, `Asserting "${itemName}" is NOT in cart`);
    const isInCart = await this.isItemInCart(itemName);
    expect(isInCart).toBe(false);
  }

  async verifyNumberofItemsInCart(expectedCount) {
    this.logger.info(this.testTitle, `Verifying cart has ${expectedCount} item(s)`);
    const cartItemCount = await this.getCartItemCount();
    expect(cartItemCount).toBe(expectedCount);
  }
}

module.exports = { InventoryPage };
