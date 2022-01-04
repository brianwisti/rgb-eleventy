const luxon = require('luxon');

module.exports = {
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink: data => {
      // TODO: gracefully turn data.page.date to a luxon DateTime so I can .toFormatString("yyyy/LL") it.
      const stem = data.page.date.toISOString().split("-").slice(0, 2).join("/");
      return `/post/${ stem }/${ data.page.fileSlug }/`;
    },
  },
};
