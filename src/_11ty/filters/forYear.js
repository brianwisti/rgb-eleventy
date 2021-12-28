// assumes it's being called right after a byYear() filter.
// when I'm more awake I should do the byYear part right here instead.

module.exports = function (collection, year) {
    return collection.get(year)
};