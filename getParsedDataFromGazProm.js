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
            const name = element.querySelector('.press_center_news_list_item_root__content_title--ac767').textContent;
            const href = element.href;
            const date = element.querySelector('.press_center_news_list_item_root__content_date--ac767').textContent;
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
    const localDateMask = 'dd MMMM, yyyy';

    const parsedDate = parse(date, localDateMask, new Date(), { locale: locale.ru });

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromGazProm() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.gazprombank.ru/press/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.press_center_news_list_item_listing--ac767';
    await page.waitForSelector(selectorName);

    await delay(3000);

    const listOfNewsRaw = await getPageData(page, selectorName);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        // name: _.trim(news.name).replace('\n', ' '),
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Газпром', listOfNews.length);  
    // console.log(listOfNews);

    return {
        siteName: "Газпром",
        siteHref: "https://www.gazprombank.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

// getParsedDataFromGazProm();

module.exports = { getParsedDataFromGazProm };