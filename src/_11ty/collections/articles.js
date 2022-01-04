// everything with a date
// mainly just used for the global feed

module.exports = (collection) => {
  return collection
    .getFilteredByGlob("./src/content/{note,post}/**/*.md")
    .sort((a, b) => b.date - a.date);
};
