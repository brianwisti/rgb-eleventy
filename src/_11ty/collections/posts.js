// short form content
module.exports = (collection) => {
    return collection
        .getFilteredByGlob("./src/post/**/*.md")
        .sort((a, b) => b.date - a.date);
};
