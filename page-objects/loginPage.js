const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page, logger, testTitle = '') {
    this.page = page;
    this.logger = logger;
    this.testTitle = testTitle;

    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
    this.errorMessage = '[data-test="error"]';
  }

  async navigateToLoginPage() {
    this.logger.info(this.testTitle, 'Navigating to login page...');
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    this.logger.info(this.testTitle, `Filling in username: "${username}"`);
    await this.page.fill(this.usernameInput, username);

    this.logger.info(this.testTitle, `Filling in password`);
    await this.page.fill(this.passwordInput, password);

    this.logger.info(this.testTitle, 'Clicking login button');
    await this.page.click(this.loginButton);
  }

  async assertErrorMessage(expectedMessage) {
    this.logger.info(this.testTitle, `Asserting error message text is: "${expectedMessage}"`);
    await expect(this.page.locator(this.errorMessage)).toHaveText(expectedMessage);
  }

  async assertErrorMessageVisible() {
    this.logger.info(this.testTitle, 'Checking if error message is visible');
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
  }

  async assertSuccessfulLogin() {
    this.logger.info(this.testTitle, 'Asserting login success — expecting inventory page URL');
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async assertLoginButtonVisible() {
    this.logger.info(this.testTitle, 'Asserting login button is visible on the page');
    await expect(this.page.locator(this.loginButton)).toBeVisible();
  }
}

module.exports = { LoginPage };
