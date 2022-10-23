const parsedDataHelperLenta = require('./getParsedDataFromLenta.js');
const parsedDataHelperBanki = require('./getParsedDataFromBanki.js');
const parsedDataHelperPSB = require('./getParsedDataFromPSB.js');
const filteredResultHelper = require('./getFilteredResult.js');
const convertAndSaveResultHelper = require('./convertAndSaveResult.js');

const { getParsedDataFromLenta } = parsedDataHelperLenta;
const { getParsedDataFromBanki } = parsedDataHelperBanki;
const { getParsedDataFromPSB } = parsedDataHelperPSB;
const { getFilteredResult } = filteredResultHelper;
const { convertAndSaveResult } = convertAndSaveResultHelper;

(async () => {
    
    const parseResultLentaRu = await getParsedDataFromLenta();
    const parseResultBankiRu = await getParsedDataFromBanki();
    const parseResultPSB = await getParsedDataFromPSB();
    const arrayOfResults = [parseResultLentaRu, parseResultBankiRu, parseResultPSB];
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);

    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), []);
    convertAndSaveResult(flatNewsArray);
})();
