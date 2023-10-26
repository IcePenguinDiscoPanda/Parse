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
            const name = element.querySelector('a h2').textContent;
            const href = element.querySelector('a').href;
            const date = element.querySelector('.PostPreview___time__BDfvz').textContent;

           return {
                href,
                name,
                date,
           };
        });
    }, { selectorName });
}

const getPreparedDate = date => {
    const localDateMask = 'dd MMMM yyyy';

    const pureDate = date.slice(0, -3);
    const parsedDate = parse(pureDate, localDateMask, new Date(), { locale: locale.ru });

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromUralSib() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.uralsib.ru/blog`; 

    await page.setDefaultNavigationTimeout(0); 

    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.PostPreview___contentWrapper__jvBtK';
    await page.waitForSelector(selectorName);

    await delay(3000);

    const listOfNewsRaw = await getPageData(page, selectorName);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Уралсиб', listOfNews.length);
    // console.log(listOfNews);

    return {
        siteName: "Уралсиб",
        siteHref: "https://www.uralsib.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

// getParsedDataFromUralSib();

module.exports = { getParsedDataFromUralSib };