module.exports = function (collection, lim) {
    return collection.sort((a, b) => b.date - a.date).slice(0, lim)
};