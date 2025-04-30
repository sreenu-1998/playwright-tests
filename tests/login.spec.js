const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page-objects/loginPage');
const { InventoryPage } = require('../page-objects/inventoryPage');
const Logger = require('../utils/logger');
const testData = require('../testData.json');


const loggerInstance = new Logger();

test.describe('Swag Labs Login Tests', () => {
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
            loggerInstance.error(testInfo.title, `❌ Test failed: ${testInfo.title}` );
            loggerInstance.error( testInfo.title, `Error: ${testInfo.error?.message}`);
        } else {
            loggerInstance.info(testInfo.title,'✅ Test passed successfully.' );
        }

        if (testInfo.error?.stack) {
            loggerInstance.error(testInfo.title, `Stack trace:\n${testInfo.error.stack}` );
        }


        loggerInstance.logTestEnd(testInfo.title);
    });

    test('Login with valid credentials @smoke', async () => {
        await loginPage.login(testData.credentials.username, testData.credentials.password);
        await loginPage.assertSuccessfulLogin();
    });

    test('Login with invalid credentials @smoke @negative', async () => {
        await loginPage.login(testData.credentials.invalid_username, testData.credentials.invalid_password);
        await loginPage.assertErrorMessageVisible();
        await loginPage.assertErrorMessage(testData.error_messages.invalid_credentials);
    });

    test('Logout from the application @smoke', async () => {
        await loginPage.login(testData.credentials.username, testData.credentials.password);
        await inventoryPage.logout();
        await loginPage.assertLoginButtonVisible();
    });
});
