const puppeteer = require("puppeteer");
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
// const parse = require('date-fns/parse');

const DATE_MASK = 'dd/MM/yyyy';

async function getParsedDataFromPSB() {
    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.psbank.ru/Bank/Press/News`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.news-area__item';
    await page.waitForSelector(selectorName);

    const listOfNews = await page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.news-area__title b').textContent;
            const dateRaw = element.querySelector('.news-area__date').textContent;
            const date = dateRaw.split('.').join('/');

           return {
                href: element.href,
                name,
                date,
           };
        });
    }, { selectorName });

    await browser.close();

    return {
        siteName: "Псбанк.ру",
        siteHref: "https://www.psbank.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromPSB };

