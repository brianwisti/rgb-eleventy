// plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");
const shikiTwoslash = require("eleventy-plugin-shiki-twoslash");

// my file / content handlers
const MarkdownHandler = require("./src/_11ty/handlers/MarkdownHandler.js");
const SassHandler = require("./src/_11ty/handlers/SassHandler.js");

// my shortcodes
const imageShortcode = require("./src/_11ty/shortcodes/imageShortcode.js");
const plausibleShortcode = require("./src/_11ty/shortcodes/plausibleShortcode.js");

module.exports = function (eleventyConfig) {

  eleventyConfig.setLibrary("md", MarkdownHandler());
  eleventyConfig.addPlugin(shikiTwoslash, { theme: "nord" });
  eleventyConfig.addPlugin(pluginRss);

  // Bring in the Hugo sections as 11ty collections.
  eleventyConfig.addCollection(
    "notes",
    require("./src/_11ty/collections/notes.js")
  );

  eleventyConfig.addCollection(
    "posts",
    require("./src/_11ty/collections/posts.js")
  );

  eleventyConfig.addCollection(
    "articles",
    require("./src/_11ty/collections/articles.js")
  );

  eleventyConfig.addCollection(
    "featuredPosts",
    require("./src/_11ty/collections/featuredPosts.js")
  );

  // Let Eleventy handle SASS
  //  see https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", SassHandler);

  // Add filters for the things Nunjucks won't do by itself.
  eleventyConfig.addFilter(
    "byYear",
    require("./src/_11ty/filters/byYear.js")
  );

  eleventyConfig.addFilter(
    "dateFormat",
    require("./src/_11ty/filters/dateFormat.js")
  );

  eleventyConfig.addFilter(
    "forYear",
    require("./src/_11ty/filters/forYear.js")
  )

  eleventyConfig.addFilter(
    "newestEntries",
    require("./src/_11ty/filters/newestEntries.js")
  )

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy({ "site_img": "img" });

  eleventyConfig.addNunjucksShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksShortcode("plausible", plausibleShortcode);

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
