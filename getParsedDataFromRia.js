const puppeteer = require('puppeteer');
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const { delay } = require('./helpers/delay.js');
const isMatch = require('date-fns/isMatch');

const DATE_MASK = 'dd/MM/yyyy';

const getPageData = async (page, selectorName) => {
    return page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.list-item__title').textContent;
            const href = element.querySelector('.list-item__title').href;
            const date = element.querySelector('.list-item__date').textContent;
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
    // const parsedDate = parse(date, 'dd.MM.yyyy', new Date(), { locale: locale.ru });
    const localDateMask = 'd MMMM, HH:mm'
    let parsedDate = new Date();
    
    if (isMatch(date, localDateMask, { locale: locale.ru })) {
        parsedDate = parse(date, localDateMask, new Date(), { locale: locale.ru });
    } else if (date.toLowerCase().indexOf('вчера') !== -1) {
        parsedDate = subDays(new Date(), 1);
    }

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
    // 11:34
    // Вчера, 23:59
    // 28 октября, 19:33
};

async function getParsedDataFromRia() {
    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://ria.ru/economy/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.list-item';
    await page.waitForSelector(selectorName);

    await page.click('.list-more');

    // await page.waitForTimeout(5000)
     
    await delay(3000);

    await page.click('.list-more');

    await delay(3000);

    const listOfNewsRaw = await getPageData(page, selectorName);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('РИА', listOfNews.length);  

    return {
        siteName: "Риа.ру",
        siteHref: "https://ria.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromRia };