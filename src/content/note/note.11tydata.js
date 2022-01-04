const luxon = require('luxon');

module.exports = {
  layout: "layouts/note.njk",
  eleventyComputed: {
    permalink: data => {
      const stem = data.page.date.toISOString().split("-").slice(0, 2).join("/");
      return `/note/${ stem }/${ data.page.fileSlug }/`;
    },
  },
};
