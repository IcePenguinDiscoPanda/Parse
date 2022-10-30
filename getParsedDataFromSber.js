const puppeteer = require('puppeteer');
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const { delay } = require('./helpers/delay.js');

const DATE_MASK = 'dd/MM/yyyy';

const getPageData = async (page, selectorName) => {
    return page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.na-article__title').textContent;
            const href = element.href;
            const date = element.querySelector('.na-article__date').textContent;

           return {

                href,
                name,
                date,
           };
        });
    }, { selectorName });
}

const getPreparedDate = date => {
    // const parsedDate = parse(date, 'dd.MM.yyyy', new Date(), { locale: locale.ru });
    const localDateMask = 'd MMMM yyyy';

    const parsedDate = parse(date, localDateMask, new Date(), { locale: locale.ru });

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
    // 11:34
    // Вчера, 23:59
    // 28 октября, 19:33
};

async function getParsedDataFromSber() {
    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `http://www.sberbank.ru/ru/press_center/all`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.na-article';
    await page.waitForSelector(selectorName);
     
    await delay(3000);

    const listOfNewsRawFirstPage = await getPageData(page, selectorName);

    await page.click('.na-paging__page_number:nth-child(2)');

    await delay(3000);

    const listOfNewsRawSecondPage = await getPageData(page, selectorName);

    const listOfNewsRaw = [...listOfNewsRawFirstPage, ...listOfNewsRawSecondPage];

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Сбер', listOfNews.length);

    return {
        siteName: "Сбербанк.ру",
        siteHref: "http://www.sberbank.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromSber };