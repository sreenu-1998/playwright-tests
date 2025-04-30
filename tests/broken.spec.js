const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page-objects/loginPage');
const { InventoryPage } = require('../page-objects/inventoryPage');
const { Broken } = require('.././page-objects/broken');
const Logger = require('../utils/logger');
const testData = require('../testData.json')

const loggerInstance = new Logger();

test.describe('Broken links', () => {
    let loginPage;
    let inventoryPage;
    let brokenPage;

    test.beforeEach("Before all", async ({ page }, testInfo) => {
        const testTitle = testInfo.title;
        loginPage = new LoginPage(page, loggerInstance, testTitle);
        inventoryPage = new InventoryPage(page, loggerInstance, testTitle);
        brokenPage = new Broken(page, loggerInstance, testTitle);
        loggerInstance.info(testTitle, '--- Test Started ---');
        await loginPage.navigateToLoginPage();
        await loginPage.login(testData.credentials.username, testData.credentials.password);
    });

    test.afterEach(async ({ }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            loggerInstance.error(testInfo.title, `❌ Test failed: ${testInfo.title}`);
            loggerInstance.error(testInfo.title, `Error: ${testInfo.error?.message}`);
        }else{
            loggerInstance.info(testInfo.title,'✅ Test passed successfully.' );
        }

        if (testInfo.error?.stack) {
            loggerInstance.error(testInfo.title, `Stack trace:\n${testInfo.error.stack}`);
        }


        loggerInstance.logTestEnd(testInfo.title);
    });

    test('print no of links in inventory page', async () =>{
        await brokenPage.printNumberOfLinks();
    });

    test('print no of Broken links in inventory page', async () =>{
        await brokenPage.printNoofBrokenLinks();
    });

    test('print all links', async () =>{
        await brokenPage.printAllLinks();
    });

    test('print all broken links', async () =>{
        await brokenPage.printAllBrokenLinks();
    });

})
