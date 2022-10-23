const parsedDataHelperLenta = require('./getParsedDataFromLenta.js');
const parsedDataHelperBanki = require('./getParsedDataFromBanki.js');
const parsedDataHelperPSB = require('./getParsedDataFromPSB.js');
const parsedDataHelperRatings = require('./getParsedDataFromRatings.js');

const filteredResultHelper = require('./getFilteredResult.js');
const convertAndSaveResultHelper = require('./convertAndSaveResult.js');

const { getParsedDataFromLenta } = parsedDataHelperLenta;
const { getParsedDataFromBanki } = parsedDataHelperBanki;
const { getParsedDataFromPSB } = parsedDataHelperPSB;
const { getParsedDataFromRatings } = parsedDataHelperRatings;

const { getFilteredResult } = filteredResultHelper;
const { convertAndSaveResult } = convertAndSaveResultHelper;

(async () => {

    const parseResultLentaRu = await getParsedDataFromLenta();
    const parseResultBankiRu = await getParsedDataFromBanki();
    const parseResultPSB = await getParsedDataFromPSB();
    const parseResultRatings = await getParsedDataFromRatings();
    const arrayOfResults = [parseResultLentaRu, parseResultBankiRu, parseResultPSB, parseResultRatings];
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);

    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), []);
    convertAndSaveResult(flatNewsArray);
})();
