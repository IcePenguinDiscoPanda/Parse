const subDays = require('date-fns/subDays');

const necessaryDay = subDays(new Date(), 1);

module.exports = { necessaryDay };