// Handler for all the funky things I do with Markdown

const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItContainer = require("markdown-it-container");
const markdownItDeflist = require("markdown-it-deflist");
const XRegExp = require("xregexp");

const imageShortcode = require("../shortcodes/imageShortcode.js");

const knownAdmonitions = ["note", "admonition", "tip", "tldr", "warning"];
const skipNameIfUntitledFor = ["admonition"];

const buildContainerHandler = (container_name) => {
  const admonitionPattern = XRegExp(
    `
      ^
        (?<name> ${container_name})
        \s*?
        (?<title> .*?)
      $
    `, 'x'
  );

  return {
    validate: (params) => XRegExp.exec(params, admonitionPattern),

    render: (tokens, idx) => {
      const match = XRegExp.exec(tokens[idx].info.trim(), admonitionPattern);

      if (tokens[idx].nesting === 1) {
        const { title, name } = match.groups;
        const titleText = title
          ? title.trim()
          : skipNameIfUntitledFor.includes(name)
            ? ""
            : name;

        const opener = `<aside class="${name}">`;
        const admonitionHeader = titleText
          ? `<header>${titleText}</header>`
          : "";

        return opener + admonitionHeader;
      }
      else {
        return "</aside>\n";
      }
    },
  };
};


module.exports = function () {
  let markdownItOptions = {
    html: true,
    typographer: true,
    linkify: true,
  };
  let markdownLib = markdownIt(markdownItOptions)
    .use(markdownItAttrs)
    .use(markdownItDeflist);

  knownAdmonitions.forEach(
    (name) => {
      markdownLib.use(
        markdownItContainer,
        name,
        buildContainerHandler(name)
      )
    }
  );

  const defaultImageRender = markdownLib.renderer.rules.image;

  // replace markdown images with responsive images in figures
  markdownLib.renderer.rules.image = function (
    tokens, idx, options, env, self
  ) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex("src");
    const requestedUrl = token.attrs[srcIndex][1];
    const imageAlt = token["content"];
    const titleIndex = token.attrIndex("title");

    let caption = "";

    if (titleIndex >= 0) {
      const title = token.attrs[titleIndex][1];
      caption = `<figcaption>${title}</figcaption>`;
    }

    const imgMarkup = imageShortcode(requestedUrl, imageAlt);
    return `<figure>${imgMarkup}${caption}</figure>`;
  };

  return markdownLib;
};
