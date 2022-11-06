const puppeteer = require("puppeteer");
const format = require('date-fns/format');
const { necessaryDay } = require('./helpers/necessaryDay.js');

async function getParsedDataFromLenta() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, "dd/MM/yyyy");
    const year = format(previousDay, "yyyy");
    const month = format(previousDay, "M");
    const day = format(previousDay, "dd");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://lenta.ru/rubrics/economics/${year}/${month}/${day}/`; 

    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.card-full-news';
    await page.waitForSelector(selectorName);

    const listOfNews = await page.evaluate(({ selectorName, formattedPreviousDay }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => ({
            href: element.href,
            name: element.firstChild.textContent,
            date: formattedPreviousDay,
        }));
    }, { selectorName, formattedPreviousDay });

    await browser.close();

    console.log('Лента', listOfNews.length);

    return {
        siteName: "Лента.ру",
        siteHref: "https://www.lenta.ru/",
        listOfNews,
    };
}

module.exports = { getParsedDataFromLenta };