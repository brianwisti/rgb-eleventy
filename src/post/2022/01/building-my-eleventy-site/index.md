---
date: 2022-01-03 22:30:00-08:00
title: Building my Eleventy site
description: something something "right tool for the right job"
cover: /assets/img/post/2022/01/building-my-eleventy-site/cover.jpg
caption: sometimes the tools break
draft: false
tags:
- Eleventy
- Node.js
- site
---

[Eleventy]: https://11ty.dev
[Node.js]: https://nodejs.org

Not a huge post. I'm using this [Eleventy][] incarnation of the site as a way
to learn a few [Node.js][] topics, and many of those concepts are still sinking
in.

## So how am I building this thing?

We know it's Eleventy. But what did I find to get a decent web nerd workflow?

Let's go down the list. You may know better choices. I won't complain if you
share them nicely.

You may *not* know better choices. If you come wandering in from some search
engine, *this page is not expert opinion.* It's just what I was able to find
that could glue everything together long enough to publish a site.

So let's go down the list.

### `yarn` to run everything

[Yarn]: https://yarnpkg.com
[npm]: https://docs.npmjs.com/cli/v8

I opted to drive this with [Yarn][]. For my beginner brain it looks equivalent
to [npm][] but I find Yarn's usage and invocation more pleasant.

### `package.json` to tell Yarn what I want it to do

[`scripts`]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#scripts
[`package.json`]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json

Everybody seems to treat the [`scripts`][] block of a [`package.json`][] pretty
much the same as the targets of a `Makefile` so I embraced that.

Here are my core scripts / tasks:

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel serve watch:style",
    "build:dev": "npm-run-all --serial site:img site:style site:content",
    "build:prod": "npm-run-all --serial site:img site:style site:content:prod",
    "clean": "rimraf dist",
    "push": "rsync -av dist/ vps:randomgeekery.org",
    "serve": "eleventy --serve --quiet",
    "site:img": "ts-node build_tasks/process_images.ts",
    "site:content": "eleventy --quiet",
    "site:content:prod": "INCLUDE_ANALYTICS=1 eleventy --quiet",
    "site:style": "sass ./src/assets/scss/main.scss ./dist/assets/css/main.css",
    "watch:style": "sass --watch ./src/assets/scss/main.scss ./dist/assets/css/main.css"
  }
}
```

Build, develop, clean, upload. All the basics are there. I don't think
`package.json` *really* has namespaces, but I use `:` to pretend.

[eleventy-img]: https://www.11ty.dev/docs/plugins/image/

:::note

I have a few more entries but until I smooth them out a bit they'll just add
noise. I left them out for now.

`site:img` is part of that noise to be honest, but it's mentioned prominently
in other entries. Basically I preprocess my images with [eleventy-img][]. We'll
talk more about that another day maybe.

:::

### `ts-node` to execute TypeScript code

[TypeScript]: https://www.typescriptlang.org
[ts-node]: https://typestrong.org/ts-node/

In the process of learning [TypeScript][], and I'm very much a "learn by doing"
sort of person. "Doing" here means "typing the code and making it run." I'll
learn the compilation framework of `tsc` soon enough, but [ts-node][] lets me
execute my TypeScript code immediately.

I like that.

### `sass` to make things pretty — eventually

[Tailwind]: https://tailwindcss.com
[Windi]: https://windicss.org
[Sass]: https://sass-lang.com

I'm sure I'll get deeper into [Tailwind][] or [Windi][] eventually, but for now
it's still easier to write my styles in [Sass][].

And yes I know my styles are rough right now. Decided if I let myself linger
and wait for the perfect layout I'd never push the update. But I'll get to it.

### `npm-run-all` so I can do *two* things with *one* command

[`npm-run-all`]: https://github.com/mysticatea/npm-run-all

The only thing I couldn't figure out how to do with `package.json` was run two
tasks with a single command. That's apparently because it doesn't do that on
its own. `package.json` is not a `Makefile`.

Have no fear. [`npm-run-all`][] is here. It's a CLI application focused on
letting you run multiple `package.json` script commands, sequentially or in
parallel.

### `rsync` to share it when I'm ready

[rsync]: https://rsync.samba.org
[Apache]: https://httpd.apache.org

This is a static site served by [Apache][]. It doesn't need some continuous
integration / deployment pipeline. I have files. [rsync][] uploads them with a
quickness.

`rsync` has been part of my toolkit for years. I'll replace it when I don't
need it anymore.

### `rimraf` to clean up after myself

[`rimraf`]: https://github.com/isaacs/rimraf

Everyone else is using [`rimraf`][] to clean build and intermediate files. I
don't know enough to choose any different.

## That's all the important stuff anyways

I wanted to go over everything, but there's just too much. A lot of the ideas
are still cooking. Expect more on every blogger's favorite topic: "how I built
my blog."

I'm having fun though!
