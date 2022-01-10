---
title: Processing Sass in Eleventy
description: "Specifically, building `main.scss` when `_base.scss` changes"
cover: /assets/img/post/2022/01/processing-sass-in-eleventy/cover.jpg
caption: relevant pictures are overrated; this dog and cat are cute together
date: 2022-01-09 17:00:00-08:00
tags:
- Eleventy
- SCSS
- CSS
- site
---

[Eleventy][]’s 1.0 release includes the ability to add your own custom processing
based on file extension. Unsurprisingly, I love this feature.

Lots of big ideas, but let’s start small with the officially documented process
for processing Sass.

[Eleventy]: https://www.11ty.dev/

First things first, let's update `devDependencies` in my `package.json`:

```json
{
  "devDependencies": {
    "@11ty/eleventy": "^1.0.0"
  }
}
```

I keep my Sass files under `src/assets/style`:

```
$ tree src/assets/style/
src/assets/style/
├── _base.scss
├── _layout.scss
├── main.scss
└── modules
    └── _shiki.scss

1 directory, 4 files
```

[Structuring Eleventy Projects]: https://www.webstoemp.com/blog/eleventy-projects-structure/

:::note

Generally, I have been following the site organization guidelines described in
[Structuring Eleventy Projects][]. If I have some non-content file I need
transformed — Sass, images, whatever — I put it under `src/assets`.

:::

[custom templates]: https://www.11ty.dev/docs/languages/custom/
[skipping a template]: https://www.11ty.dev/docs/languages/custom/#skipping-a-template-from-inside-of-the-compile-function.

Eleventy provides instructions on how to set up [custom templates][] for dealing with Sass,
and even [skipping a template][] so it doesn't build `_base.scss` and so on.

And that's great. It works. `src/assets/style/main.scss` becomes
`dist/assets/style/main.css`. Course, it's not quite perfect.
I still need `main.css` rebuild if I write to `_base.scss`.

But I also don't want it randomly rebuilding the stylesheet 20 times because it
found 20 support files.

I need to think my way through this one.

## Add a SassHandler

Keeping with Jérôme Coupé's structural suggestions, I keep my more complex
JavaScript logic under `src/_11ty/`.

```
$ tree src/_11ty/
src/_11ty/
├── collections
├── filters
├── handlers
│   ├── MarkdownHandler.js
│   └── SassHandler.js
└── shortcodes
```

`handlers` is my own variation — that's where I put code for particular file
and content types.

So what needs to go into `SassHandler.js`? Let's see.

- ensure only `main.scss` gets handed off to Sass
- ensure the main stylesheet is rebuilt when any of the imports change
- avoid unnecessary recompilation — without getting too clever

Time to open up the old text editor.

```javascript
//- file:src/_11ty/handlers/SassHandler.js
// Handler for my Sass stylesheets

// ==> Import libraries.
// ==> Define input and output paths for sass.
// ==> Set build time guard variables.

module.exports = {
  outputFileExtension: "css",
  compileOptions: {
    permalink: false,
  },
  compile: async function(inputContent, inputPath) {
    // ==> Ensure we need to build the CSS.
    // ==> Remember and log this build.

    return async (data) => {
      // ==> Compile the Sass and write the CSS.
    };
  },
};
```

With what I've figured out so far, even though Eleventy can watch and act on
the files for me, keeping the paths under tight control will be my job. A
change in `_base.scss` means a change in `main.scss` which means a write to
`main.css`. I have not yet learned how to do that in any Eleventy-specific way.
So I'll disable the `permalink` compile option and handle it myself with the
appropriate libraries.

```javascript
//- Import libraries
const fs = require("fs-plus");
const path = require("path");
const sass = require("sass");
```

[`fs-plus`]: http://atom.github.io/fs-plus/
[`path`]: https://nodejs.org/dist/latest-v16.x/docs/api/path.html
[`sass`]: https://sass-lang.com
[`pathlib`]: https://docs.python.org/3/library/pathlib.html
[`os.path`]: https://docs.python.org/3/library/os.path.html

- [`fs-plus`][] is a little easier to work with than Node's standard `fs` library for file handling
- [`path`][] is no [`pathlib`][] — heck it's barely even [`os.path`][] — but it's better than trusting my own string-splitting and reassembly
- [`sass`][] of course; these *are* Sass files

I know exactly which files I want to read and write. Let's define those as constant.

```javascript
//- Define input and output paths for sass
const curDir = process.cwd();
const sassInputPath = path.join(cirDir, "src/assets/style/main.scss");
const cssOutputPath = path.join(curDir, "dist/assets/style/main.css");
```

Yes this does look a lot like what Eleventy would do on its own. Since I turned
off permalinks for `scss` files, I need to be careful. I start this with being
extremely specific and figuring out what I can relax later — assuming I decide
that relaxing is what I want to do.

:::note

Common sense sugests these should be defined in a config file somewhere. I'm
still getting the hang of Eleventy, though. Common sense won't be an option for
some time.

:::

I figure the easiest way to avoid extra recompilation is by watching the clock.
If it hasn't been long enough since the last build, skip it. Five seconds is a
completely arbitrary value for "long enough" but it seems to be working.

```javascript
//- Set build time guard variables
let lastSassBuild = 0;     // valueOf last sass build
const minimumWait = 5_000; // wait this many milliseconds before rebuilding
```

[`Date.valueOf`]: https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/date/valueof

And what does a build time check look like? We use [`Date.valueOf`][] to get
the number of milliseconds since 1970-01-01, which is a handy numeric value for
simple comparison. If the difference between that and `lastSassBuild` is less
than `minimumWait` milliseconds, we don't need to build.

```javascript
//- Ensure we need to build the CSS
const now = new Date().valueOf();

if (now - lastSassBuild <= minimumWait) {
  return;
}
```

What if we *do* need to build? Update `lastSassBuild` and log what's going on,
since I enjoy a little feedback.

```javascript
//- Remember and log this build
lastSassBuild = now;
const parsed = path.parse(inputPath);
console.log(`[${now}] SassHandler: ${inputPath} changed`);
console.log(`Building ${sassFilePath}`);
```

I still haven't learned enough JavaScript to know why, but when I use
`sass.compile` instead of the supposedly deprecated `renderSync` I get an
exception. Eventually I'll be forced to revisit that, but today is not that
day.

```javascript
//- Compile the Sass and write the CSS
let result = sass.renderSync({
  file: sassFilePath,
});

const cssText = result.css.toString("utf8");
fs.makeTreeSync(path.dirname(cssOutputPath));
fs.writeFileSync(cssOutputPath, cssText);
```

Again, I've disabled `permalink` so it's on me to ensure the output directory
exists and to write the generated CSS.

So there it is! Probably not optimal but hey we're all learning something every
day.

## Load that SassHandler

Then the relevant bits of my `.eleventy.js`:

```javascript
const SassHandler = require("./src/_11ty/handlers/SassHandler.js");

module.exports = function (eleventyConfig) {
  // ...
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", SassHandler);
};
```

This site still builds and the styles update as expected, so: yay!

## What's next?

[Asciidoctor]: https://asciidoctor.org

I dunno. Knowing me? Probably [Asciidoctor][].
