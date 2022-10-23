const puppeteer = require("puppeteer");
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
// const parse = require('date-fns/parse');

const DATE_MASK = 'dd/MM/yyyy';

async function getParsedDataFromRankings()  {

    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, DATE_MASK);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://ratings.ru/news/`; 

    
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}

    const selectorName = '.news-preview__item';
    await page.waitForSelector(selectorName);

    const elements = await page.$$(selectorName);

    const listOfNews = [];

    elements.forEach( async element => {
        const newsData = await page.evaluate(el => {
            const href = el.querySelector('.news-preview__title').href;
            const name = el.querySelector('.news-preview__title').textContent;
            const dateRaw = el.querySelector('.news-area__date').textContent;
            const date = dateRaw.split('.').join('/');
            // const dateObj = parse(dateRaw, 'dd.MM.yyyy', new Date());
            // const date = format(dateObj, DATE_MASK);
            return { href, name, date };
        }, element);

        listOfNews.push({
            ...newsData
        })
    });
    await browser.close();

    return {
        siteName: "Рейтингс.ру",
        siteHref: "https://www.ratings.ru/",
        listOfNews: listOfNews.filter(news => news.date === formattedPreviousDay),
    };
}

module.exports = { getParsedDataFromRatings };

