// Handler for all the funky things I do with Markdown

const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const XRegExp = require("xregexp");

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
        const title = match.groups.title.trim();
        const name = match.groups.name;
        
        if (title) {
          console.log(`name: ${name}; title: ${title}`);
        }

        const opener = `<aside class="${name}">`;
        const titleText = title
          ? title
          : skipNameIfUntitledFor.includes(name)
            ? ""
            : name;

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
    html: true
  };
  let markdownLib = markdownIt(markdownItOptions);

  knownAdmonitions.forEach(
    (name) => {
      markdownLib.use(
        markdownItContainer,
        name,
        buildContainerHandler(name)
      )
    }
  );

  return markdownLib;
};
