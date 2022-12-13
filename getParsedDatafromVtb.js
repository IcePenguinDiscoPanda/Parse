const puppeteer = require('puppeteer');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const { delay } = require('./helpers/delay.js');
const { necessaryDay } = require('./helpers/necessaryDay.js');


const DATE_MASK = 'dd/MM/yyyy';

const getVtbPageData = async (page, selectorName) => {
    return page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.card-newsstyles__Title-news__sc-q05ogs-4').textContent;
            const href = element.href;
            const date = element.querySelector('.vGOOj').textContent;

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
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.vtb.ru/about/press/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.card-newsstyles__LinkWrap-news__sc-q05ogs-5';
    await page.waitForSelector(selectorName);

    await page.screenshot({path: 'exampleVtb.png'});

    const listOfNewsRawFirstPage = await getVtbPageData(page, selectorName);

    await page.click('.paginationstyles__Navigation-foundation-kit__sc-1e576hk-5');
     
    await delay(5000);

    const listOfNewsRawSecondPage = await getVtbPageData(page, selectorName);

    const listOfNewsRaw = _.uniqBy([...listOfNewsRawFirstPage, ...listOfNewsRawSecondPage], 'href');

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('ВТБ', listOfNews.length);
    // console.log(listOfNews);

    return {
        siteName: "Втб.ру",
        siteHref: "https://www.vtb.ru",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

// getParsedDataFromVtb();

module.exports = { getParsedDataFromVtb };