function getFilteredResult (sourceArray) {
    const KEY_WORDS = [ "Бали", "Softline", "США", "Кабмин", "NFT", "малый средний бизнес", "мсб", "кредитование юрлиц", "рко",
     "расчетно-кассовое обслуживание", "пассивы", "мсп", "кредитование мсп", "новые продукты мсб мсп", "ПСБ", "Сбер"];
    const preparedKeyWords = KEY_WORDS.map(word => word.toLowerCase());
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
