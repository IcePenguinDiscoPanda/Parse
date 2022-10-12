const puppeteer = require("puppeteer");
const subDays = require('date-fns/subDays');
const format = require('date-fns/format');
const fs = require("fs");
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

async function getParsedData()  {

    const previousDay = subDays(new Date(), 1);
    const formattedPreviousDay = format(previousDay, "dd/MM/yyyy");
    const year = format(previousDay, "yyyy");
    const month = format(previousDay, "M");
    const day = format(previousDay, "d");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const siteHref = `https://www.banki.ru/news/lenta/?filterType=all&d=${day}&m=${month}&y=${year}`;
  
    await page.goto(siteHref);//, {waitUntil: 'load', timeout: 0}
   
    const selectorName = '.NewsItemstyled__StyledItemTitle-sc-jjc7yr-7';
    await page.waitForSelector(selectorName);

    const elements = await page.$$(selectorName);

    const listOfNews = [];

    elements.forEach( async element => {
        const href = await page.evaluate(el => el.href, element);
        const name = await page.evaluate(el => el.textContent, element);
        listOfNews.push({
            href,
            name,
            date: formattedPreviousDay,
        })
    });

    

    await browser.close();

    return {
        siteName: "Банки.ру",
        siteHref: "https://www.banki.ru/",
        listOfNews,
    };
}

function getFilteredResult (sourceArray) {
    const KEY_WORDS = ["малый средний бизнес", "мсб", "кредитование юрлиц", "рко", "расчетно-кассовое обслуживание", "пассивы",
     "мсп", "кредитование мсп", "новые продукты мсб мсп", "ПСБ"];
    const preparedKeyWords = KEY_WORDS.map(word => word.toLowerCase());
    return sourceArray.map(site => {
        const filteredListOfNews = site.listOfNews.filter(news => {
            return preparedKeyWords.reduce((acc, keyWord) => {
                if (news.name.toLowerCase().indexOf(keyWord) === -1) {
                    return acc;
                }
                return true;
            }, false);
        })
        return {
            ...site,
            listOfNews: filteredListOfNews,
        }
    })
}

function convertAndSaveResult (newsArray = []) {
    const doc = new Document({
        sections: newsArray.map(news => ({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: news.name,
                            color: "000000",
                            size: 26,
                        }),
                    ],
                }),
                new Paragraph({
                    text: news.href,
                }),
                new Paragraph({
                    text: news.date,
                })
            ],
        })),
    });

    const date = format(new Date(), "dd-MM-yyyy");
    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(`Отчет за ${date}.docx`, buffer);
        console.log("done");
    });
}

(async () => {
    const parseResultBankiRu = await getParsedData();
    const arrayOfResults = [parseResultBankiRu]
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);
    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), [])
    convertAndSaveResult(flatNewsArray);
})();
