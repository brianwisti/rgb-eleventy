// short form content
module.exports = (collection) => {
  return collection
      .getFilteredByGlob("./src/content/note/**/*.md")
      .sort((a, b) => b.date - a.date);
};
