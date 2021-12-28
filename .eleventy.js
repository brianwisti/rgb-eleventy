module.exports = function (config) {
  // Bring in the Hugo sections as 11ty collections.
  config.addCollection(
    "notes",
    require("./src/_11ty/collections/notes.js")
  );

  config.addCollection(
    "posts",
    require("./src/_11ty/collections/posts.js")
  );

  config.addCollection(
    "featuredPosts",
    require("./src/_11ty/collections/featuredPosts.js")
  );

  config.addCollection(
    "latestNotes",
    require("./src/_11ty/collections/latestNotes.js")
  );

  // Add filters for the things Nunjucks won't do by itself.
  config.addFilter(
    "byYear",
    require("./src/_11ty/filters/byYear.js")
  );

  config.addFilter(
    "dateFormat",
    require("./src/_11ty/filters/dateFormat.js")
  );

  config.setDataDeepMerge(true);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "md",
    passthroughFileCopy: true,
  };
};
