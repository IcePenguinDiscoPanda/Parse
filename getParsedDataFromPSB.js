const puppeteer = require("puppeteer");
const format = require('date-fns/format');
const { necessaryDay } = require('./helpers/necessaryDay.js');

const DATE_MASK = 'dd/MM/yyyy';

async function getParsedDataFromPSB() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.psbank.ru/Bank/Press/News`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.news-inner-item';
    await page.waitForSelector(selectorName);

    const listOfNews = await page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const href = element.querySelector('.news-inner-item__link').href;
            const name = element.querySelector('.news-inner-item__title').textContent;
            const dateRaw = element.querySelector('.news-inner-item__date').textContent;
            const date = dateRaw.split('.').join('/');

           return {
                href,
                name,
                date,
           };
        });
    }, { selectorName });

    await browser.close();

    console.log('ПСБ', listOfNews.length);

    return {
        siteName: "Псбанк.ру",
        siteHref: "https://www.psbank.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromPSB };

