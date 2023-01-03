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
            const name = element.querySelector('.news-title span').textContent;
            const href = element.querySelector('.news-title').href;
            const date = element.querySelector('.news-date').textContent;
            // const dateRaw = element.querySelector('.news-preview__title').textContent;
            // const date = dateRaw.split('.').join('/');

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

async function getParsedDataFromKubanKredit() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://kk.bank/o-banke/press-service/novosti-banka/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    await delay(3000);

    // await page.screenshot({path: 'exampleKK1.png', fullPage: true});

    const selectorName = '.news-preview-list-item';
    await page.waitForSelector(selectorName);

    await delay(3000);

    // await page.screenshot({path: 'exampleKK2.png', fullPage: true});

    const listOfNewsRawFirstPage = await getPageData(page, selectorName);

    await page.click('.uk-pagination li:nth-child(2)');

    await delay(3000);

    const listOfNewsRawSecondPage = await getPageData(page, selectorName);

    const listOfNewsRaw = [...listOfNewsRawFirstPage, ...listOfNewsRawSecondPage];

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Кубань кредит', listOfNews.length);
    // console.log(listOfNews); 

    return {
        siteName: "КубаньКредит",
        siteHref: "https://kk.bank/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

// getParsedDataFromKubanKredit();

module.exports = { getParsedDataFromKubanKredit };