const puppeteer = require("puppeteer");
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');

async function getParsedData()  {

    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, "dd/MM/yyyy");
    const year = format(previousDay, "yyyy");
    const month = format(previousDay, "M");
    const day = format(previousDay, "d");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://lenta.ru/rubrics/economics/${year}/${month}/${day}/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.card-full-news';
    await page.waitForSelector(selectorName);

    const elements = await page.$$(selectorName);

    const listOfNews = [];

    elements.forEach( async element => {
        const href = await page.evaluate(el => el.href, element);
        const name = await page.evaluate(el => el.firstChild.textContent, element);
        listOfNews.push({
            href,
            name,
            date: formattedPreviousDay,
        })
    });

    

    await browser.close();

    return {
        siteName: "Банки.ру",
        siteHref: "https://www.banki.ru/",
        listOfNews,
    };
}

module.exports = { getParsedData };