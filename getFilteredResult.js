const KEY_WORDS = [
    ['малый бизнес', 'малого бизнеса', 'малому бизнесу', 'малом бизнесе'],
    ['средний бизнес', 'среднего бизнеса', 'среднему бизнесу', 'среднем бизнесе'],
    ['малый и средний бизнес', 'малого и среднего бизнеса', 'малому и среднему бизнесу', 'малом и среднем бизнесе'],
    ['мсб'],
    ['рко'],
    ['мсп'],
    ['мсб'],
    ['расчетно-кас', 'расчётно-кас'],
    ['пассив'],
    ['кредитован', 'кредит'],
    ['мал','сред','бизн', 'конвейе'],
    ['продукт мсб','продукта мсб','продуктом мсб','продукты мсб','продуктов мсб','продуктами мсб']
  ];
  
const TEST_KEY_WORDS = ['ес', 'nft', 'baza', 'заморож', 'design', 'nyt', 'магатэ', 'инновац', 'вэд', 'Танкерный', 'дефолт', 'Сбер'];
  
const KEY_WORDS_FLAT = TEST_KEY_WORDS.reduce((acc, item) => {
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




