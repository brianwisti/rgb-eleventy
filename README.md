# rgb-eleventy

Just the latest attempt at building my site with Eleventy.

## What I'm using and why

A reminder for when I'm staring at `package.json` in the middle of the night.

`@11ty/eleventy`
: the SSG itself

`luxon`
: for tighter control of date formatting in my `<time />` elements

`sass`
: CSS style management

`onchange`
: so I don't have to rebuild styles myself

`npm-run-all`
: so can build styles and site pages at the same time

`browser-sync`
: so I don't need to manually refresh the browser during dev

`markdown-it-container`
: for the many notes, warnings, and asides I sprinkle through my articles

`eleventy-plugin-shiki-twoslash`
: because I poke at all sorts of languages Prism has never heard of

`xregexp`
: because I like regular expressions and I like them fancy

## Resources

Sites and posts that I'm leaning on heavily while I assemble this thing.

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Structuring Eleventy
  Projects](https://www.webstoemp.com/blog/eleventy-projects-structure/)
- [Nunjucks Templating
  Docs](https://mozilla.github.io/nunjucks/templating.html)
- [Consistent, Fluidly Scaling Type and Spacing](https://css-tricks.com/consistent-fluidly-scaling-type-and-spacing/)
- [Newspaper terms
  PDF](https://nieonline.com/coloradonie/downloads/journalism/GlossaryOfNewspaperTerms.pdf)
  for when I'm running blank on CSS class names
