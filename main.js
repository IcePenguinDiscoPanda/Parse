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
const { getParsedDataFromSMPbank }  = require('./getParsedDataFromSMPbank.js');
const { getParsedDataFromMetallInvest }  = require('./getParsedDataFromMetallInvest.js');
const { getParsedDataFromUralSib }  = require('./getParsedDataFromUralSib.js');
const { getParsedDataFromAsiaPacific }  = require('./getParsedDataFromAsiaPacific.js');
// const { getParsedDataFromAkbars }  = require('./getParsedDataFromAkbars.js');


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
    const parseResultSMPbank = await getParsedDataFromSMPbank();
    const parseResultMetallInvest = await getParsedDataFromMetallInvest();
    const parseResultUralSib = await getParsedDataFromUralSib();
    const parseResultAsiaPacific = await getParsedDataFromAsiaPacific();
    // const parseResultAkbars = await getParsedDataFromAkbars();

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
        parseResultGazProm,
        parseResultSMPbank,
        parseResultMetallInvest,
        parseResultUralSib,
        parseResultAsiaPacific
        // parseResultAkbars
    ];
    
    const filteredArrayOfResults = getFilteredResult(arrayOfResults);

    const flatNewsArray = filteredArrayOfResults.reduce((acc, site) => ([...acc, ...site.listOfNews]), []);
    convertAndSaveResult(flatNewsArray);
})();
