const puppeteer = require('puppeteer');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const isMatch = require('date-fns/isMatch');
const { necessaryDay } = require('./helpers/necessaryDay.js');

const DATE_MASK = 'dd/MM/yyyy';

const getPreparedDate = date => {
    const currentMask = isMatch(date, 'd MMMM yyyy', { locale: locale.ru }) ? 'd MMMM yyyy' : 'd MMMM';
    const parsedDate = parse(date, currentMask, new Date(), { locale: locale.ru });
    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromDelo() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://delo.ru/news`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.articles-block-item';
    await page.waitForSelector(selectorName);

    const listOfNewsRaw = await page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.articles-block-item-text-title').textContent;
            const href = element.href;
            const date = element.querySelector('.articles-block-item-text-line-date').textContent;
            // const dateRaw = element.querySelector('.news-preview__title').textContent;
            // const date = dateRaw.split('.').join('/');

           return {

                href,
                name,
                date,
           };
        });
    }, { selectorName });

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Дело', listOfNews.length);
    // console.log(listOfNews);

    return {
        siteName: "Дело банк",
        siteHref: "https://delo.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

// getParsedDataFromDelo();

module.exports = { getParsedDataFromDelo };