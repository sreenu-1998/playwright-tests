const { expect } = require('@playwright/test')

class Broken {
    constructor(page, logger, testTitle = "") {
        this.page = page;
        this.logger = logger;
        this.testTitle = testTitle;
    }

    // async getAllLinks() {
    //     return await this.page.$$eval('a', links => links.map(link => link.href));
    // }

    async getAllLinks(){
        let links = await this.page.locator('a');
        let allLinks=[];
        for(let i=0; i<await links.count(); i++){
            allLinks.push(await links.nth(i).getAttribute('href'));
        }
        return allLinks
    }

    async checkBrokenLinks() {
        let links = await this.getAllLinks();
        const brokenLinks = [];
        for (const link of links) {
            try {
            const response = await this.page.goto(link);
            if (!response || response.status() >= 400) {
                brokenLinks.push(link);
            }
            } catch (error) {
            brokenLinks.push(link);
            }
        }
        return brokenLinks;
    }

    async printNoofBrokenLinks(){
        let bLinks = await this.checkBrokenLinks();
        console.log("Total number of Broken links in the page are " + bLinks.length);
        this.logger.info(this.testTitle, "Total number of links in the page are " + bLinks.length);
    }
    async printNumberOfLinks(){
        let links = await this.getAllLinks();
        console.log("Total number of links in the page are " + links.length);
        this.logger.info(this.testTitle, "Total number of links in the page are " + links.length);
    }

    async printAllLinks() {
        const links = await this.getAllLinks();
        console.log('All Links:', links);
        this.logger.info(this.testTitle, `All Links: ${links}`)
    }

    async printAllBrokenLinks(){
        const brokenLinks = await this.checkBrokenLinks();
        console.log('Broken Links:', brokenLinks);
        this.logger.info(this.testTitle, `All Broken Links: ${brokenLinks}`)
    }
}
module.exports = { Broken }