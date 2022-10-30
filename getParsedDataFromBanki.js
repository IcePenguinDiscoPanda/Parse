const puppeteer = require("puppeteer");
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
const { delay } = require('./helpers/delay.js');

async function getParsedDataFromBanki()  {
    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, "dd/MM/yyyy");
    const year = format(previousDay, "yyyy");
    const month = format(previousDay, "M");
    const day = format(previousDay, "d");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768});

    const siteHref = `https://www.banki.ru/news/lenta/main/?filterType=all&d=${day}&m=${month}&y=${year}`; 

    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.NewsItemstyled__StyledItemTitle-sc-jjc7yr-7';
    await page.waitForSelector(selectorName);

    await page.screenshot({path: 'example3.png', fullPage: true});

    // await delay(10000);
    
    await page.screenshot({path: 'example4.png', fullPage: true});

    const listOfNews = await page.evaluate(({ selectorName, formattedPreviousDay }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => ({
            href: element.href,
            name: element.textContent,
            date: formattedPreviousDay,
        }));
    }, { selectorName, formattedPreviousDay });

    // console.log(listOfNews);

    await browser.close();

    console.log('Банки.ру', listOfNews.length);

    return {
        siteName: "Банки.ру",
        siteHref: "https://www.banki.ru/",
        listOfNews,
    };
}

module.exports = { getParsedDataFromBanki };