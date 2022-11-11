const MSB_KEY_WORDS = [
    ['малый бизнес', 'малого бизнеса', 'малому бизнесу', 'малом бизнесе'],
    ['средний бизнес', 'среднего бизнеса', 'среднему бизнесу', 'среднем бизнесе'],
    ['малый и средний бизнес', 'малого и среднего бизнеса', 'малому и среднему бизнесу', 'малом и среднем бизнесе', 'малым и средним'],
    ['мсб'],
    ['рко'],
    ['мсп'],
    ['мсб'],
    ['расчетно-кас', 'расчётно-кас'],
    ['пассив'],
    ['кредитован', 'кредит'],
    ['мал','средн','бизн', 'конвейе'],
    ['продукт мсб','продукта мсб','продуктом мсб','продукты мсб','продуктов мсб','продуктами мсб']
  ];
  
const TEST_KEY_WORDS = ['ес', 'nft', 'baza', 'заморож', 'design', 'nyt', 'магатэ',
 'инновац', 'вэд', 'Танкерный', 'дефолт', 'Сбер', 'esg', 'зелено', 'флагшт'];

 const MARINA_KEY_WORDS = [
    ['комплаенс'],
    ['колл-центр', 'колл'],
    ['чат-бот'],
    ['ДБО'],
    ['клиентский опыт', 'клиентского опыта', 'клиентскому опыту', 'клиентским опытом', 'клиентском опыте'],
    ['канал обслуж','канала обслуж','каналу обслуж','каналом обслуж','канале обслуж','каналом обслуж',],
    ['каналы обслуж','каналов обслуж','каналам обслуж','каналами обслуж','каналах обслуж'],
 ];
  
const KEY_WORDS_FLAT = MARINA_KEY_WORDS.reduce((acc, item) => {
    if (Array.isArray(item)) {
        return [...acc, ...item];
    }
    return [...acc, item];
},[])

function getFilteredResult (sourceArray) {
    const preparedKeyWords = KEY_WORDS_FLAT.map(word => word.toLowerCase());
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

module.exports = { getFilteredResult };




