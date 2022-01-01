# rgb-eleventy

Just the latest attempt at building my site with Eleventy.

## What I'm using and why

A reminder for when I'm staring at `package.json` in the middle of the night.

`@11ty/eleventy`
: the SSG itself

`@11ty/eleventy-img`
: simplify a little magic cropping for cards

`@11ty/eleventy-plugin-rss`
: for folks like me who prefer to get site updates in a feed reader

`@types/node`
: because Typescript wants it

`browser-sync`
: so I don't need to manually refresh the browser during dev

`eleventy-plugin-shiki-twoslash`
: because I poke at all sorts of languages Prism has never heard of

`luxon`
: for tighter control of date formatting in my `<time />` elements

`markdown-it`
: already default in Eleventy, but explicitly adding it makes the markdown-it plugins happy

`markdown-it-attrs`
: for adding CSS classes and other attributes inside markdown

`markdown-it-container`
: for the many notes, warnings, and asides I sprinkle through my articles

`markdown-it-deflist`
: because I love definition lists

`npm-run-all`
: so can build styles and site pages at the same time

`onchange`
: so I don't have to rebuild styles myself

`sass`
: CSS style management

`ts-node`
: to let me use Typescript for my my utility code

`typescript`
: to simplify finding mistakes in the code I write

`xregexp`
: because I like regular expressions and I like them fancy

## Why'd I do that thing?

I use a separate step for resizing images because I'd rather have Nunjucks
macros than an `image` shortcode that resizes images, and Nunjucks async
support is a "maybe someday" thing.

## Annoyances

It seems to periodically forget `sharp` is installed or something, and I run
`yarn upgrade` every time I add a package, and sometimes when I didn't. I do
not consider this encouraging.

## Resources

Sites and posts that I'm leaning on heavily while I assemble this thing.

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Structuring Eleventy
  Projects](https://www.webstoemp.com/blog/eleventy-projects-structure/)
- [Nunjucks Templating
  Docs](https://mozilla.github.io/nunjucks/templating.html)
- [Consistent, Fluidly Scaling Type and Spacing](https://css-tricks.com/consistent-fluidly-scaling-type-and-spacing/)
- [Eleventy Image Lazy Loading](https://www.aleksandrhovhannisyan.com/blog/eleventy-image-lazy-loading/) 
- [Newspaper terms
  PDF](https://nieonline.com/coloradonie/downloads/journalism/GlossaryOfNewspaperTerms.pdf)
  for when I'm running blank on CSS class names
