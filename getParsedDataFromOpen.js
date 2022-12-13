const puppeteer = require('puppeteer');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const isMatch = require('date-fns/isMatch');
const { necessaryDay } = require('./helpers/necessaryDay.js');

const DATE_MASK = 'dd/MM/yyyy';

const getPreparedDate = date => {
    const currentMask = isMatch(date, 'd MMMM yyyy', { locale: locale.ru }) ? 'dd.MM.yyyy' : 'dd.MM';
    const parsedDate = parse(date, currentMask, new Date(), { locale: locale.ru });
    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromOpen() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.open.ru/about/press`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.press-list__item';
    await page.waitForSelector(selectorName);


    await page.screenshot({path: 'exampleOpen.png'})

    const listOfNewsRaw = await page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.news-title__link').textContent;
            const href = element.querySelector('.news-title__link').href;
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

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Открытие', listOfNews.length);

    return {
        siteName: "Открытие",
        siteHref: "https://www.open.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromOpen };