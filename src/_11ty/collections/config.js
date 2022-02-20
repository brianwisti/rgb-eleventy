module.exports = (collection) => {
  return collection
      .getFilteredByGlob("./src/content/config/**/*.md")
      .sort((a, b) => a.weight - b.weight);
};
