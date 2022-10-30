const { getParsedDataFromLenta } = require('./getParsedDataFromLenta.js');
const { getParsedDataFromBanki } = require('./getParsedDataFromBanki.js');
const { getParsedDataFromPSB } = require('./getParsedDataFromPSB.js');
const { getParsedDataFromRankings } = require('./getParsedDataFromRankings.js');
const { getParsedDataFromAlfa } = require('./getParsedDataFromAlfa.js');
const { getParsedDataFromVtb } = require('./getParsedDataFromVtb.js');
const { getParsedDataFromRia }  = require('./getParsedDataFromRia.js');
const { getParsedDataFromRBC }  = require('./getParsedDataFromRBC.js');

const { getFilteredResult } = require('./getFilteredResult.js');
const { convertAndSaveResult } = require('./convertAndSaveResult.js');

(async () => {
    const parseResultLentaRu = await getParsedDataFromLenta();
    const parseResultBankiRu = await getParsedDataFromBanki();
    const parseResultPSB = await getParsedDataFromPSB();
    const parseResultRankings = await getParsedDataFromRankings();
    const parseResultAlfa = await getParsedDataFromAlfa();
    const parseResultVtb = await getParsedDataFromVtb();
    const parseResultRia = await getParsedDataFromRia();
    const parseResultRBC = await getParsedDataFromRBC();

    const arrayOfResults = [parseResultLentaRu, parseResultBankiRu, parseResultPSB,
        parseResultRankings, parseResultAlfa, parseResultVtb, parseResultRia, parseResultRBC];
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);

    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), []);
    convertAndSaveResult(flatNewsArray);
})();

// https://www.rbc.ru/business/?utm_source=topline
// https://www.raexpert.ru/
// www.sberbank.ru не открывается без впн
// https://www.open.ru/ не открывается без впн
// https://sovcombank.ru/
// https://www.centrinvest.ru/about/press-releases
// https://kk.bank/o-banke/press-service/novosti-banka/