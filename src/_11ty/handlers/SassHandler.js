// Handler for my Sass stylesheets

const fs = require("fs-plus");
const path = require("path");
const sass = require("sass");

let lastSassBuild = 0;     // valueOf last sass build
const minimumWait = 5_000; // wait this many seconds before rebuilding

// We only build the main sass file
// - a lot of this could probably go in a config somewhere
const curDir = process.cwd();
const sassInputPath = path.join(curDir, "src/assets/style/main.scss");
const cssOutputPath = path.join(curDir, "dist/assets/style/main.css");

module.exports = {
  compileOptions: {
    permalink: false,
  },
  compile: async function(inputContent, inputPath) {
    const now = new Date().valueOf();

    if (now - lastSassBuild <= minimumWait) {
      return;
    }

    lastSassBuild = now;
    const parsed = path.parse(inputPath);
    console.log(`[${now}] SassHandler: ${inputPath} changed`);
    console.log(`Building ${sassInputPath}`);

    return async (data) => {
      let result = sass.renderSync({
        file: sassInputPath,
      });

      const cssText = result.css.toString("utf8");
      fs.makeTreeSync(path.dirname(cssOutputPath));
      fs.writeFileSync(cssOutputPath, cssText);
    };
  },
};
