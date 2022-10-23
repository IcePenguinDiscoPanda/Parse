const parsedDataHelperLenta = require('./getParsedDataFromLenta.js');
const parsedDataHelperBanki = require('./getParsedDataFromBanki.js');
const filteredResultHelper = require('./getFilteredResult.js');
const convertAndSaveResultHelper = require('./convertAndSaveResult.js');

const { getParsedDataFromLenta } = parsedDataHelperLenta;
const { getParsedDataFromBanki } = parsedDataHelperBanki;
const { getFilteredResult } = filteredResultHelper;
const { convertAndSaveResult } = convertAndSaveResultHelper;

(async () => {
    const parseResultLentaRu = await getParsedDataFromLenta();
    const parseResultBankiRu = await getParsedDataFromBanki();
    const arrayOfResults = [parseResultLentaRu, parseResultBankiRu];
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);

    // const filteredArrayOfResults = arrayOfResults;
    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), []);
    convertAndSaveResult(flatNewsArray);
})();
