const puppeteer = require('puppeteer');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const { delay } = require('./helpers/delay.js');
const { necessaryDay } = require('./helpers/necessaryDay.js');

const DATE_MASK = 'dd/MM/yyyy';

const getPageData = async (page, selectorName) => {
    return page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.fs-xl')?.textContent;
            const href = element.querySelector('.link-next_commonLinkNext__nmenK')?.href;
            const date = element.querySelector('.news-item_date__JXUFm')?.textContent;

           return {
                href,
                name,
                date,
           };
        });
    }, { selectorName });
}

const getPreparedDate = date => {
    const localDateMask = 'dd.MM.yyyy';

    const parsedDate = parse(date, localDateMask, new Date(), { locale: locale.ru });

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromTochka() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://tochka.com/news/`; 

    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    await delay(3000);

    const selectorName = '.news-item_container__D_Xbj';

    await page.waitForSelector(selectorName);

    await delay(3000);

    await page.screenshot({path: 'exampleTochka4.png'});

    const listOfNewsRaw = await getPageData(page, selectorName);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Точка', listOfNews.length);
    console.log(listOfNews);

    return {
        siteName: "Точка банк",
        siteHref: "https://tochka.com/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

getParsedDataFromTochka();

module.exports = { getParsedDataFromTochka };