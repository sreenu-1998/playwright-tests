const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page-objects/loginPage');
const { InventoryPage } = require('../page-objects/inventoryPage');
const Logger = require('../utils/logger'); // ✅ Fixed import
const testData = require('../testData.json');

// ✅ Single logger instance
const loggerInstance = new Logger();

test.describe('Swag Labs Add to Cart Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }, testInfo) => {
    const testTitle = testInfo.title;
    loginPage = new LoginPage(page, loggerInstance, testTitle);
    inventoryPage = new InventoryPage(page, loggerInstance, testTitle);
    loggerInstance.info(testTitle, '--- Test Started ---');
    await loginPage.navigateToLoginPage();
  });

  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      loggerInstance.error(testInfo.title, `❌ Test failed: ${testInfo.title}`);
      loggerInstance.error(testInfo.title, `Error: ${testInfo.error?.message}`);
    } else {
      loggerInstance.info(testInfo.title, '✅ Test passed successfully.');
    }

    if (testInfo.error?.stack) {
      loggerInstance.error(testInfo.title, `Stack trace:\n${testInfo.error.stack}`);
    }


    loggerInstance.logTestEnd(testInfo.title);
  });

  test('Add item to cart and verify @regression', async () => {
    await loginPage.login(testData.credentials.username, testData.credentials.password);
    await inventoryPage.addItemToCart(testData.products.bag_pack.name);
    await inventoryPage.assertItemInCart(testData.products.bag_pack.name);
    await inventoryPage.verifyNumberofItemsInCart(1);
  });

  test('Remove item from cart and verify @regression', async () => {
    await loginPage.login(testData.credentials.username, testData.credentials.password);
    await inventoryPage.addItemToCart(testData.products.bag_pack.name);
    await inventoryPage.goToCart();
    await inventoryPage.removeItemFromCart(testData.products.bag_pack.name);
    await inventoryPage.assertItemNotInCart(testData.products.bag_pack.name);
    await inventoryPage.verifyNumberofItemsInCart(0);
  });
});
