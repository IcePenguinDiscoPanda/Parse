const puppeteer = require('puppeteer');
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
const _ = require('lodash');
const parse = require('date-fns/parse');
const locale = require('date-fns/locale');
const { delay } = require('./helpers/delay.js');

const DATE_MASK = 'dd/MM/yyyy';

const getPageData = async (page, selectorName) => {
    return page.evaluate(({ selectorName }) => {
        const elements = Array.from(document.querySelectorAll(selectorName));

        console.log(elements);

        return elements.map(element => {
            const name = element.querySelector('.b-articles-list-item__title a:last-child').textContent;
            const href = element.querySelector('.b-articles-list-item__title a:last-child').href;
            const date = element.querySelector('.b-articles-list-item__time').textContent;

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
    const localDateMask = 'dd.MM.yyyy'

    const trimmedDate = date.slice(-10);
    
    const parsedDate = parse(trimmedDate, localDateMask, new Date(), { locale: locale.ru });

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromRaExpertPage(pageName) {
    const siteHref = `https://www.raexpert.ru/${pageName}/`;
    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.b-articles-list-item__info:not(.index-macro-header)';

    await page.waitForSelector(selectorName);

    await page.evaluate(() => {
        document.querySelector('.b-footer').scrollIntoView();
     });

    await delay(3000);

    const listOfNewsRaw = await getPageData(page, selectorName);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        name: _.trim(news.name).replace('\n', ' '),
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log(`Раэксперт ${pageName}`, listOfNews.length);

    return listOfNews.filter(news => news.date === formattedPreviousDay);
}


async function getParsedDataFromRaExpert() {
    const researches = await getParsedDataFromRaExpertPage('researches');
    const press = await getParsedDataFromRaExpertPage('press');

    return {
        siteName: "Раэксперт.ру",
        siteHref: "https://www.raexpert.ru/",
        listOfNews: [...researches, ...press],
    };
};

module.exports = { getParsedDataFromRaExpert };