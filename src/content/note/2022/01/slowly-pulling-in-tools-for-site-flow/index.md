---
title: Slowly pulling in tools for site flow
date: 2022-01-16 12:30:00-08:00
tags:
  - Node.js
  - IndieWeb
  - POSSE
  - site
---

Made a [toot][] with [Masto][]. Kinda need that for content syndication.

![Here's my toot](/assets/img/note/2022/01/slowly-pulling-in-tools-for-site-flow/toot.png "Here's my toot")

[toot]: https://hackers.town/@randomgeek/107630284879354154
[masto]: https://www.npmjs.com/package/masto
[mastodon twitter crossposter]: https://crossposter.masto.donte.com.br/

The [Mastodon Twitter Crossposter][] works great, but waiting for the
announcement toot to show up as a tweet was a tedious manual step that I hope to
discard. So I figured out how to make a tweet with [twitter-api-v2][].

[POSSE]: https://indieweb.org/POSSE
[Eleventy]: https://11ty.dev

Those are the pieces I need to get [POSSE][] syndication working in this
[Eleventy][] iteration of the site.

[twitter-api-v2]: https://www.npmjs.com/package/twitter-api-v2

Now I just need to staple those pieces together, grab a sharpie, and label it
"workflow."
