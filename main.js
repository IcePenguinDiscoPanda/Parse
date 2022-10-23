const parsedDataHelper = require('./getParsedDataFromLenta.js')
const filteredResultHelper = require('./getFilteredResult.js')
const convertAndSaveResultHelper = require('./convertAndSaveResult.js')

const { getParsedData } = parsedDataHelper;
const { getFilteredResult } = filteredResultHelper;
const { convertAndSaveResult } = convertAndSaveResultHelper;

(async () => {
    const parseResultBankiRu = await getParsedData();
    const arrayOfResults = [parseResultBankiRu]
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);
    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), [])
    convertAndSaveResult(flatNewsArray);
})();
