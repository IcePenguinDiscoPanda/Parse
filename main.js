const parsedDataHelperLenta = require('./getParsedDataFromLenta.js');
const parsedDataHelperBanki = require('./getParsedDataFromBanki.js');
const parsedDataHelperPSB = require('./getParsedDataFromPSB.js');
const parsedDataHelperRankings = require('./getParsedDataFromRankings.js');
const parsedDataHelperAlfa = require('./getParsedDataFromAlfa.js');

const filteredResultHelper = require('./getFilteredResult.js');
const convertAndSaveResultHelper = require('./convertAndSaveResult.js');

const { getParsedDataFromLenta } = parsedDataHelperLenta;
const { getParsedDataFromBanki } = parsedDataHelperBanki;
const { getParsedDataFromPSB } = parsedDataHelperPSB;
const { getParsedDataFromRankings } = parsedDataHelperRankings;
const { getParsedDataFromAlfa } = parsedDataHelperAlfa;

const { getFilteredResult } = filteredResultHelper;
const { convertAndSaveResult } = convertAndSaveResultHelper;

(async () => {
    const parseResultLentaRu = await getParsedDataFromLenta();
    const parseResultBankiRu = await getParsedDataFromBanki();
    const parseResultPSB = await getParsedDataFromPSB();
    const parseResultRankings = await getParsedDataFromRankings();
    const parseResultAlfa = await getParsedDataFromAlfa();

    const arrayOfResults = [parseResultLentaRu, parseResultBankiRu, parseResultPSB, parseResultRankings, parseResultAlfa];
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);

    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), []);
    convertAndSaveResult(flatNewsArray);
})();
