module.exports = (collection) => {
    return collection
        .getFilteredByGlob("./src/note/**/*.md")
        .sort((a, b) => b.date - a.date)
        .slice(0, 10)
};