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
            const name = element.querySelector('.card-full-news__title').textContent;
            const href = element.href;
            const date = element.querySelector('.card-full-news__info .card-full-news__date').textContent;

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

    const pureDate = date.slice(7);

    const parsedDate = parse(pureDate, localDateMask, new Date(), { locale: locale.ru });

    const formattedDate = format(parsedDate, DATE_MASK);
    return formattedDate;
};

async function getParsedDataFromLentaNew() {
    const previousDay = necessaryDay;
    const formattedPreviousDay = format(previousDay, "dd/MM/yyyy");
    const year = format(previousDay, "yyyy");
    const month = format(previousDay, "M");
    const day = format(previousDay, "dd");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://lenta.ru/rubrics/economics/${year}/${month}/${day}/`; 
    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.card-full-news';

    await page.waitForSelector(selectorName);

    await delay(3000);

    const listOfNewsRaw = []; 

    let hasMore = true;

    do {
        hasMore = await page.evaluate(() => {
            const el = document.querySelector(".loadmore._disabled");
            const elements = document.querySelectorAll(".loadmore._disabled");
            console.log(el);
            if ((el && el?.innerText && el?.innerText === 'Дальше') || elements.length > 1) {
                return false;
              }
              
              return true;
          });
        const listOfNewsRawPage = await getPageData(page, selectorName);
        listOfNewsRaw.push(...listOfNewsRawPage);
        // await page.click('.loadmore__button');
        let foo = await page.$$('.loadmore__button');
        // await page.click(foo[1]);
        await foo[1].click();
        await delay(3000);
    } while(hasMore);

    const listOfNews = listOfNewsRaw.map(news => ({
        ...news, 
        date: getPreparedDate(news.date),
    }));

    await browser.close();

    console.log('Лента', listOfNews.length); 

    return {
        siteName: "Лента",
        siteHref: "https://lenta.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
};

module.exports = { getParsedDataFromLentaNew };