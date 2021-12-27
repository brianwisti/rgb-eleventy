const { DateTime } = require("luxon");

module.exports = function (date, format, locale = "en") {
    const jsDate = new Date(date);

    return DateTime.fromJSDate(jsDate).setLocale(locale).toFormat(format);
};