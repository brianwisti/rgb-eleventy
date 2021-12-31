const pluginRss = require("@11ty/eleventy-plugin-rss");
const shikiTwoslash = require("eleventy-plugin-shiki-twoslash");

const imageShortcode = require("./src/_11ty/shortcodes/imageShortcode.js");
const markdownHandler = require("./src/_11ty/handlers/markdownHandler.js");

module.exports = function (config) {

  config.setLibrary("md", markdownHandler());
  config.addPlugin(shikiTwoslash, { theme: "nord" });
  config.addPlugin(pluginRss);

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

  // Add filters for the things Nunjucks won't do by itself.
  config.addFilter(
    "byYear",
    require("./src/_11ty/filters/byYear.js")
  );

  config.addFilter(
    "dateFormat",
    require("./src/_11ty/filters/dateFormat.js")
  );

  config.addFilter(
    "forYear",
    require("./src/_11ty/filters/forYear.js")
  )

  config.addFilter(
    "newestEntries",
    require("./src/_11ty/filters/newestEntries.js")
  )

  config.setDataDeepMerge(true);
  config.addPassthroughCopy("src/assets/img");
  config.addPassthroughCopy("img");
  config.addNunjucksShortcode('image', imageShortcode);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false, // at least until I clean up template-ish markup
    passthroughFileCopy: true,
  };
};
