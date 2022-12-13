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
            const name = element.querySelector('.news-main__title').textContent;
            const href = element.querySelector('.news-main__title').href;
            const date = element.querySelector('.news-main__date').textContent;

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

async function getParsedDataFromAsiaPacific() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.atb.su/news/?year=2022`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.news-main__item';
    await page.waitForSelector(selectorName);

    await delay(3000);

    const listOfNewsRaw = await getPageData(page, selectorName);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Азиатско-тихоокеанский банк', listOfNews.length);

    return {
        siteName: "Азиатско-тихоокеанский банк",
        siteHref: "https://www.atb.su/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromAsiaPacific };