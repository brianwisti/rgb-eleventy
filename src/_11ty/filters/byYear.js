module.exports = function (collection) {
    let byYear = new Map();

    collection.forEach((article) => {
        const articleYear = new Date(article.data.date).getFullYear();

        if (byYear.get(articleYear) === undefined) {
            byYear.set(articleYear, new Array());
        }

        byYear.get(articleYear).push(article);
    });

    console.table(byYear);
    return byYear;
};