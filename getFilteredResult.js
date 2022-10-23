const KEY_WORDS = [
    ['малый бизнес', 'малого бизнеса', 'малому бизнесу', 'малом бизнесе'],
    ['средний бизнес', 'среднего бизнеса', 'среднему бизнесу', 'среднем бизнесе'],
    ['малый и средний бизнес', 'малого и среднего бизнеса', 'малому и среднему бизнесу', 'малом и среднем бизнесе'],
    ['мсб'],
    ['рко'],
    ['мсп'],
    ['мсб'],
    ['расчетно-кассовое', 'расчетно-кассового', 'расчетно-кассовому', 'расчетно-кассовом'],
    ['пассивы', 'пассивов', 'пассивам', 'пассивами'],
    ['кредитование', 'кредитования', 'кредитованию', 'кредитованием','кредитовании']
  ];
  
const KEY_WORDS_FLAT = KEY_WORDS.reduce((acc, item) => {
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




