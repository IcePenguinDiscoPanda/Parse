const puppeteer = require('puppeteer');
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const { delay } = require('./helpers/delay.js');

const DATE_MASK = 'dd/MM/yyyy';

const getVtbPageData = async (page, selectorName) => {
    return page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.card-newsstyles__Title-news__sc-q05ogs-4').textContent;
            const href = element.href;
            const date = element.querySelector('.vGOOj').textContent;
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
    // const trimmedDate = _.trim(date).split(' ').join('').replace('\n', ' ');
    const parsedDate = parse(date, 'dd.MM.yyyy', new Date(), { locale: locale.ru });
    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromVtb() {
    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.vtb.ru/about/press/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.card-newsstyles__LinkWrap-news__sc-q05ogs-5';
    await page.waitForSelector(selectorName);

    const listOfNewsRawFirstPage = await getVtbPageData(page, selectorName);

    await page.click('.paginationstyles__Step-foundation-kit__sc-1e576hk-4.jvNIKG');

    // await page.waitForTimeout(5000)
     
    await delay(5000);

    const listOfNewsRawSecondPage = await getVtbPageData(page, selectorName);

    const listOfNewsRaw = _.uniqBy([...listOfNewsRawFirstPage, ...listOfNewsRawSecondPage], 'href');

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('ВТБ', listOfNews.length);

    return {
        siteName: "Втб.ру",
        siteHref: "https://www.vtb.ru",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromVtb };