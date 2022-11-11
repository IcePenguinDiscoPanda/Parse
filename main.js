const { getParsedDataFromLenta } = require('./getParsedDataFromLenta.js');
const { getParsedDataFromBanki } = require('./getParsedDataFromBanki.js');
const { getParsedDataFromPSB } = require('./getParsedDataFromPSB.js');
const { getParsedDataFromRankings } = require('./getParsedDataFromRankings.js');
const { getParsedDataFromAlfa } = require('./getParsedDataFromAlfa.js');
const { getParsedDataFromVtb } = require('./getParsedDataFromVtb.js');
const { getParsedDataFromRia }  = require('./getParsedDataFromRia.js');
const { getParsedDataFromRBC }  = require('./getParsedDataFromRBC.js');
const { getParsedDataFromRaExpert }  = require('./getParsedDataFromRaExpert.js');
const { getParsedDataFromSber }  = require('./getParsedDataFromSber.js');
const { getParsedDataFromSovcom }  = require('./getParsedDataFromSovcom.js');
const { getParsedDataFromCenterInvest }  = require('./getParsedDataFromCenterInvest.js');
const { getParsedDataFromKubanKredit }  = require('./getParsedDataFromKubanKredit.js');
const { getParsedDataFromGazProm }  = require('./getParsedDataFromGazProm.js');

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
    const parseResultRaExpert = await getParsedDataFromRaExpert();
    const parseResultSber = await getParsedDataFromSber();
    const parseResultSovcom = await getParsedDataFromSovcom();
    const parseResultCenterInvest = await getParsedDataFromCenterInvest();
    const parseResultKubanKredit = await getParsedDataFromKubanKredit();
    const parseResultGazProm = await getParsedDataFromGazProm();

    const arrayOfResults = [
        parseResultLentaRu,
        parseResultBankiRu,
        parseResultPSB,
        parseResultRankings,
        parseResultAlfa, 
        parseResultVtb,
        parseResultRia,
        parseResultRBC,
        parseResultRaExpert,
        parseResultSber,
        parseResultSovcom,
        parseResultCenterInvest,
        parseResultKubanKredit,
        parseResultGazProm
    ];
    
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);

    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), []);
    convertAndSaveResult(flatNewsArray);
})();
