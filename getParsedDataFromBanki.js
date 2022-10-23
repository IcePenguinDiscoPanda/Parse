const puppeteer = require("puppeteer");
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');

async function getParsedDataFromBanki()  {

    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, "dd/MM/yyyy");
    const year = format(previousDay, "yyyy");
    const month = format(previousDay, "M");
    const day = format(previousDay, "d");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.banki.ru/news/lenta/main/?filterType=all&d=${day}&m=${month}&y=${year}`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.NewsItemstyled__StyledItemTitle-sc-jjc7yr-7';
    await page.waitForSelector(selectorName);

    // await page.screenshot({ path: "./screenshot.png", fullPage: true}) 

    const elements = await page.$$(selectorName);

    const listOfNews = [];

    elements.forEach( async element => {
        const href = await page.evaluate(el => el.href, element);
        const name = await page.evaluate(el => el.textContent, element);
        listOfNews.push({
            href,
            name,
            date: formattedPreviousDay,
        })
        // console.log(href, name);
    });

    // console.log(listOfNews);

    await browser.close();

    return {
        siteName: "Банки.ру",
        siteHref: "https://www.banki.ru/",
        listOfNews,
    };
}

module.exports = { getParsedDataFromBanki };