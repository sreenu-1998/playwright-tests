class utils {
    constructor(page) {
        this.page = page;
    }

    async navigateTo(url) {
        await this.page.goto(url);
        await this.page.waitForNavigation({ waitUntil: 'networkidle' });
    }


    async waitForElementandClick(selector) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.click(selector);
    }

    async clickAndWaitForNavigation(selector) {
        await this.page.click(selector);
        await this.page.waitForNavigation({ waitUntil: 'networkidle' });
    }

    async clickAndWaitForTimeout(selector, timeout) {
        await this.page.click(selector);
        await this.page.waitForTimeout(timeout);
    }


    async clearAndEnterText(selector, text) {
        await this.page.fill(selector, ''); // Clear the field first
        await this.page.fill(selector, text);
    }

    async clearAndEnterTextWithDelay(selector, text, delay) {
        await this.page.fill(selector, ''); // Clear the field first
        for (const char of text) {
            await this.page.type(selector, char);
            await this.page.waitForTimeout(delay); // Wait for the specified delay
        }
    }

    async clearAndEnterTextandPressEnter(selector, text) {
        await this.page.fill(selector, ''); // Clear the field first
        await this.page.fill(selector, text);
        await this.page.keyboard.press('Enter');
    }

    async getText(selector) {
        return await this.page.textContent(selector);
    }

    async waitForSelector(selector, timeout = 30000) {
        await this.page.waitForSelector(selector, { timeout });
    }

    async takeScreenshot(path) {
        await this.page.screenshot({ path });
    }
   
    async getElementCount(selector) {
        return await this.page.$$(selector).then(elements => elements.length);
    }
}

module.exports = utils;