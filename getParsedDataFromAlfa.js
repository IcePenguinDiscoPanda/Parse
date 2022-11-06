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

async function getParsedDataFromAlfa() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://news.alfabank.ru/releases/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.release';
    await page.waitForSelector(selectorName);

    const listOfNewsRaw = await page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.release__title').textContent;
            const href = element.href;
            const date = element.querySelector('.release__date').textContent;
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

    console.log('Альфа', listOfNews.length);

    return {
        siteName: "Альфабанк.ру",
        siteHref: "https://www.alfabank.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromAlfa };