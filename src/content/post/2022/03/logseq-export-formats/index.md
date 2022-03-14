---
date: 2022-03-13
description: Getting my second brain ready for post-processing
draft: false
tags:
  - logseq
title: Logseq's Export Formats
cover: /assets/img/Screenshot_from_2022-03-13_14-28-42_1647206944123_0.png
caption: Not the biggest graph but still cumbersome to export one by one
---

:::note

Trying an experiment where I write a post about [Logseq][logseq] _in_ Logseq. Not a big
deal on its own, but it should make publishing the post more interesting.

Won't make myself go into Document Mode for this one, though. Keep the outline nodes handy so I can have my tangents and side thoughts, then munge it into a readable post.

[logseq]: https://logseq.com

:::

The Logseq knowledge management tool has been getting a lot of my attention lately. Not for the first time, but I have been more ambitious this time around. So I was thinking yesterday about parsing Logseq's Markdown pages. And while that's certainly in the realm of possibility, it's not strictly necessary.

See, my short term goal is publishing some of my [pkm][pkm] _graph_ — what Logseq calls the combined pages, blocks, and metadata — to Random Geekery. Not all of it, because there's work and personal stuff mixed in there with the broad notes. But that's not the important bit. The important bit is Logseq directly supports exporting its graph.

[pkm]: https://en.wikipedia.org/wiki/Personal_knowledge_management

## What we're working with

Logseq can store pages in Markdown or [org][org] format. I have been using the Markdown format for this graph.

[org]: https://orgmode.org/

![the raw Logseq Markdown for this page](/assets/img/Screenshot_from_2022-03-13_07-06-34_1647180542104_0.png "the raw Logseq Markdown for this page")

As the screenshot shows, it's not quite the Markdown we're used to.

- The outline structure translates to an unordered list, which can be deeply nested for large pages.

- There's no frontmatter, YAML or otherwise. Instead, pages and individual nodes (list items) get properties assigned with a `property:: value` syntax. Properties can describe tags, heading status, or any arbitrary thing you care to track.
- It uses an org-inspired `#+BEGIN` / `#+END` syntax for admonitions.
- Tags can be assigned to a node as properties or as I've done here with the conventional hashtag approach. Probably worth noticing that tags can be nested!
- Images are stored with the vault in the `assets/` folder. Need to keep that in mind when shifting all the way over to my site sources.

:::note

Logseq understands ATX `# HEADER` syntax, but I've found the heading property is a little more flexible when rearranging nodes, increasing or decreasing size appropriate to its new context.

:::

So that's what a Logseq page looks like. We _could_ tweak a Markdown processor to handle
each little variation, but it might be easier by working with an exported copy of the
graph in some more widely consistent format.

## Exports available

So what are our options?

### Export public pages

Exports all of your public pages to HTML, with a styled, interactive interface for viewing them. Only problem with that is — well— I don't have any public pages.

![fancy HTML page listing with no pages](/assets/img/image_1647178655890_0.png)

I have 594 pages in this graph. I wouldn't be surprised if I had over 600 by the end of the end of the day. — _note: 610 by 3pm, when I'm getting ready to publish_ — I'm not going to go through each of those, split private from public content, and then mark which of those 600 pages are public. That's a kind of tediousness I don't enjoy.

### Export as standard Markdown (no block properties)

Takes a bit, but eventually drops a zip file containing mostly mundane Markdown.

![plain exported markdown for this page](/assets/img/Screenshot_from_2022-03-13_07-03-45_1647180250247_0.png)

Course, there's still a fair chunk for me to parse.

- tags
- those double bracket `[[links]]`
- plus I lose all my properties. Headings are just list items, and images have no caption. So yeah, "standard Markdown" is not an option for me.

### Export as OPML

[OPML] sounds like a pretty good fit for exporting from an outliner. It is an _Outline Processor Markup Language_ after all.

[opml]: https://indieweb.org/OPML

![Screenshot from 2022-03-13 07-57-59.png](/assets/img/Screenshot_from_2022-03-13_07-57-59_1647183496460_0.png "OPML export for this page")

Is it my imagination, or is there _less_ useful information here than in the standard Markdown export?

Moving on.

### Export as EDN

Logseq queries make heavy use of [EDN][edn]. Maybe someday I'll learn it.

[edn]: https://github.com/edn-format/edn

![EDN view of the graph focusing on highlights of this page](/assets/img/Screenshot_from_2022-03-13_08-15-24_1647184542358_0.png)

Wow. No zip file here. Nearly 34,000 lines of unfamiliar but _very_ structured text. Every node has a UUID, which could simplify organizing them when importing to my site, or processing them with another tool like [sqlite-utils][sqlite-utils].

[sqlite-utils]: https://sqlite-utils.datasette.io/en/stable/

I'm a little disappointed that the note syntax doesn't automatically transform to some kind of property, and that inline markdown is still left for me to parse. Oh well. I suppose it was a bit much to expect _another_ lightweight text formatting language hidden behind the Markdown and org options.

There's even [edn_format](https://github.com/swaroopch/edn_format), a Python library to load EDN objects into data structures much like with YAML, TOML, and JSON. Good to know!

### Export as JSON

This has pretty much the same structure as the EDN export, with the same benefits and limitations I saw with that. OTOH you don't need to install an extra library to parse it, so there's that.

![JSON view of the graph focusing on highlights of this page](/assets/img/Screenshot_from_2022-03-13_08-47-22_1647186468168_0.png)

### Export as Roam JSON

Well of course [Roam][roam] has its own JSON format.

[roam]: https://roamresearch.com/

![Roam JSON view of the graph focusing on this page](/assets/img/Screenshot_from_2022-03-13_08-47-22_1647186731737_0.png)

Too bad it holds so much less useful information than Logseq's main JSON export.

## Which export do I like

All things considered, the regular JSON export is probably my best bet. It and EDN both contain the most information about any given block. JSON has the advantage of being widely supported by libraries and CLI tools.

## What next?

The very next step was turning the page I wrote into the post you're reading. I may eventually turn my notes for that experience into its own post. Other than that, I'll probably take a look at the structure of my Logseq graph to see what bits I might want to make public and how.

Or I might just make this export knowledge part of the toolkit in my entropy-fighting battle with myself, bouncing between tools and PKMs like a ferret on a ping pong table.
