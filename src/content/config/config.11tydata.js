module.exports = {
  layout: "layouts/article.njk",
  eleventyComputed: {
        permalink: data => `/${ data.page.filePathStem.replace('content', '') }/`,
  },
};
