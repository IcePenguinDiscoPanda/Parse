const puppeteer = require('puppeteer');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const { delay } = require('./helpers/delay.js');
const isMatch = require('date-fns/isMatch');
const { necessaryDay } = require('./helpers/necessaryDay.js');

const DATE_MASK = 'dd/MM/yyyy';

const getPageData = async (page, selectorName) => {
    return page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        return elements.map(element => {
            const name = element.querySelector('.item__title').textContent;
            const href = element.querySelector('.item__link').href;
            const date = element.querySelector('.item__category').textContent;
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
    const localDateMask = 'd MMM, HH:mm'
    let parsedDate = new Date();
    
    if (isMatch(date, localDateMask, { locale: locale.ru })) {
        parsedDate = parse(date, localDateMask, new Date(), { locale: locale.ru });
    }

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromRbcPage(pageName) {
    const siteHref = `https://www.rbc.ru/${pageName}/?utm_source=topline`;
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0); 

    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    // await page.screenshot({path: 'exampleRBC.png'});

    const selectorName = '.js-category-item';
    await page.waitForSelector(selectorName);

    await delay(3000);

    // await page.screenshot({path: 'exampleRBC2.png'});

    const listOfNewsRaw = await getPageData(page, selectorName);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        name: _.trim(news.name).replace('\n', ' '),
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log(`РБК ${pageName}`, listOfNews.length);
    // console.log(listOfNews);

    return listOfNews.filter(news => news.date === formattedPreviousDay);
}


async function getParsedDataFromRBC() {
    const economics = await getParsedDataFromRbcPage('economics');
    const business = await getParsedDataFromRbcPage('business');
    const finances = await getParsedDataFromRbcPage('finances');

    return {
        siteName: "РБК.ру",
        siteHref: "https://www.rbc.ru/",
        listOfNews: [...economics, ...business, ...finances],
    };
};

// getParsedDataFromRBC();

module.exports = { getParsedDataFromRBC };