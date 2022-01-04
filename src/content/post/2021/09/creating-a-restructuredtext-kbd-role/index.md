---
category: programming
date: 2021-09-23
description: But first a couple others as I figure this out
draft: false
format: rst
tags:
- rst
- python
title: Creating a reStructuredText kbd Role
---

[documentation]: https://docutils.sourceforge.io/docs/howto/rst-roles.html
[#rst]: /tags/rst

Today's the day I learn how to create custom roles in [#rst][]. There's
already [documentation][] on how to do this. I'm just applying it for my
specific case.

:::note Setup

Install some stuff if you want to play along.

```console
$ pip install -U docutils invoke
```

Some of the requirements are specific to my writing flow.

```console
$ pip install python-frontmatter
```

[Neovim rst plugin]: /post/2021/08/trying-a-thing-with-neovim/
[Invoke]: https://www.pyinvoke.org/

For experimentation, I copied the build code from my [Neovim rst plugin][] into
the site's [Invoke][] task file. Easier than updating remote plugins and
restarting the editor with every change.

```python
# tasks.py
"""Site generation tasks for randomgeekery.org"""

import locale

import frontmatter
import rich
from docutils.core import publish_parts
from invoke import task

locale.setlocale(locale.LC_ALL, "")

def convert_rst_file_for_hugo(source_filename: str) -> None:
    """Transform a single reStructuredText file so Hugo can handle it."""

    target_filename = determine_target(source_filename)
    post = frontmatter.load(source_filename)
    parts = publish_parts(source=post.content, writer_name="html")
    post.content = parts["body"]
    post.metadata["format"] = "rst"

    with open(target_filename, "w") as out:
        out.write(frontmatter.dumps(post))
        rich.print(f":crayon: {target_filename}")


def determine_target(source: str) -> str:
    """Return the filename that rst transformations should write to."""

    # Using an odd suffix so Hugo doesn't try to build the rst itself
    if not source.endswith(".rst.txt"):
        raise ValueError(f"Look at {source} more closely before transforming it.")

    return source.replace(".rst.txt", ".html")


@task
def rst(c, filename):
    """Transform a single reStructuredText file."""

    convert_rst_file_for_hugo(filename)
```

Then I use Invoke to do the transform:

```console
$ inv content/draft/creating-a-restructuredtext-kbd-role/index.rst.txt
🖍 content/draft/creating-a-restructuredtext-kbd-role/index.html
```

Some variation of this is bound to work for you.

:::

Let's get started!

## What even is a role?

First, we need the background. There's this thing called *interpreted
text*{.term}. It's a reserved bit of functionality for specially marked text.  Folks
coming to reStructuredText from Markdown mostly know it as the weird reason
they have to use double backticks for `code`.

```rst
`interpreted text`
```

[Docutils]: https://docutils.sourceforge.io/

Intepreted text has all sorts of fancy potential. I mainly know it for the fact
that rst links use it. Unless told otherwise, [Docutils][] treats interpreted text
as a citation.

```html
<cite>interpreted text</cite>
```

[cite]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite

It assumes any interpreted text is `:title-reference:` — that is, it
references the title of a book, movie, song, or other publication.  The [cite][]
element is a perfectly reasonable choice for that.

But what if you aren't specifically talking about a title? *Roles*{.term}
provide an explicit label for your interpreted text.

```rst
:term:`Roles`
```

What's a `:term:` in rst? Nothing. I made it up. Seems like a good role for
when I introduce a new name and I want it to stand out.

I need to define the role to use it. Otherwise?

![screenshot of docutils error message](/assets/img/post/2021/09/creating-a-restructuredtext-kbd-role/docutils-unknown-role.png "Docutils embeds an error message below the offending block"){width=976}

[role directive]: https://docutils.sourceforge.io/docs/ref/rst/directives.html#custom-interpreted-text-roles

So up at the top of my document use the [role directive][] to create `:term:`
and register it with the parser.

```rst
.. role:: term
```

Now that Docutils knows about the role, it can turn it into HTML.

```html
<span class="term">Roles</span>
```

It still doesn't have any inherent *meaning*, but I can put some style rules on
it so that anything I label with the `:term:` role shows up a little
differently.

## Inline roles in your document

If I want the term to stand out a little more, I can adjust my role definition.

```rst
.. role:: term(strong)
```

Now it inherits from the `:strong:` role, keeping the `"term"` CSS class.

```html
<strong class="term">Roles</strong>
```

You can inherit from any role. That makes it a nice way to create aliases
or slight variations to existing roles.

But I want to get fancy. Let's look at defining reStructuredText roles in
Python.

Defining roles in your code
===========================

Defining a role has two main steps. Okay, three. Because first we need to import
some libraries.

```python
from docutils import nodes
from docutils.parsers.rst import roles
```

*Now* we create a function that knows what to do when given
a role and some preprocessed parameters.

```python
def role_term(name, rawtext, text, lineno, inliner, options={}, content=[]):
    """Return text marked as domain terminology."""
    ...
```

That's quite a function signature to take in without context, so here's a
breakdown of what got sent when Docutils saw my first ``:term:Roles``:

| parameter | value                            | explanation
| --------- | -------------------------------- | ---
| `name`    | `term`                           | the role name
| `rawtext` | `` :term:`Roles` ``              | all text input including role and markup
| `text`    | `Roles`                          | the interpreted text content
| `lineno`  | `103`                            | the interpreted text starts on this line
| `inliner` | `<docutils…Inliner object at …>` | the object that called this function
| `options` | `{}`                             | a dictionary of customization options
| `content` | `[]`                             | a list of strings containing text content

I won't pretend I know how to use all these yet. That's okay. ``role_term``
only cares about three:

- `rawtext`
- `text`
- `options` — just in case

I chose to mirror the inline directive I made earlier, creating a `strong` node
with a class of `"term"`.

```python
term_node = nodes.strong(rawtext, text, **options)
term_node.set_class("term")
```

Anyone calling `role_term` expects a tuple with two node lists: one for
content, and another holding any error nodes I may need to create. In this case
the content list has my term node and the error list is empty.

```python
return [term_node], []
```

With our role implementation defined, we register it and the name associated
with it.

```python
def role_term(name, rawtext, text, lineno, inliner, options={}, content=[]):
    """Return text marked as domain terminology."""

    term_node = nodes.strong(rawtext, text, **options)
    term_node.set_class("term")

    return [term_node], []

roles.register_canonical_role('term', role_term)
```

I don't need my inline `role` directive anymore, so I remove it. Registering
`role_term` makes it available to every document processed by this particular
Python script.

Okay, now I basically know how to implement a reStructuredText role. Let's keep
going.

### `:tag:` references

I link to tags on this site frequently. Since I'm the main audience for this
site, it's mostly to give me a shortcut to related content. But hey it may help
*you* find related content to if you happen to click through.

Couple of problems with those tag links, though. First off, they look exactly
like every other link in my published HTML. It would be nice for them to stand
out a bit when I'm reading. Second, they look like every other link in my post
source. It would be nice for them to stand out a bit when I'm *writing*.

So let's make a `:tag:` reference role.

```python
def role_reference_tag(
    name, rawtext, text, lineno, inliner, options={}, content=[]
):
    """Return a reference to a site tag."""

    tag_ref = f"/tags/{text}"
    tag_node = nodes.reference(rawtext, text, refuri=tag_ref, **options)
    tag_node.set_class("p-category")

    return [tag_node], []

roles.register_canonical_role('tag', role_reference_tag)
```

:::note
I thought about putting the `#` in CSS, but not every `p-category` is a
tag. I can always change my mind later, maybe make a distinct `tag` CSS
class.
:::

[#microformats]: /tag/microformats
[#indieweb]: /tag/indieweb

It looks similar to `:term:`, except because I'm referencing something I use
a `reference` node and give it a link to that tag's page as `refuri`.  The
`p-category` class is a [#microformats][] thing for [#indieweb][]. I also
decided to prefix my tag text with the traditional octothorpe used to mark tags
out in the wild.

```rst
:tag:`microformats`
```

Oh yes that is *much* nicer to read than a standard reStructuredText link.

```html
<a class="p-category reference external" href="/tags/microformats">#microformats</a>
```

There's my `p-category` class, along with an unsurprising `reference` —
since it's a clear way to indicate the reference node I used — and a
slightly confusing `external` class. Pretty sure that means "external to the
document."

### A ``:kbd:`` role

Something I need rather often is a way to indicate keyboard input.
`Control c`, stuff like that.

```python
def role_kbd(name, rawtext, text, lineno, inliner, options={}, content=[]):
    """Return literal text marked as keyboard input."""

    kbd_node = nodes.literal(rawtext, text, **options)
    kbd_node.set_class("keyboard")

    return [kbd_node], []
```

```rst
:kbd:`Control c`
```

```html
<tt class="keyboard docutils literal">Control c</tt>
```

Well that was easy. A bit verbose, but okay. That's not the real problem
though.

### There's a perfectly good `<kbd>` element

[kbd]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

This blog is HTML, right? Can't I just use the [kbd][] element in my role?

Yes, but kind of no. It's considered poor form to put raw HTML in your output
nodes. Docutils writes all sorts of content, and a `<kbd>` would be pretty
ungainly sitting in a PDF. Ideally you'd take care of writing HTML in an HTML
Writer. Unfortunately, I have no idea how to work an HTML Writer yet.

But we *can* output raw HTML in a role implementation. It would be frowned on
slightly less if we flagged it as a raw role.

```python
import html

def role_raw_kbd(name, rawtext, text, lineno, inliner, options={}, content=[]):
    """Return literal text marked as keyboard input."""

    escaped_text = html.escape(text)
    kbd_html = f"<kbd>{escaped_text}</kbd>"
    options["format"] = "html"
    kbd_node = nodes.raw(rawtext, kbd_html, **options)

    return [kbd_node], []

roles.register_canonical_role('raw-kbd', role_raw_kbd)
```

[html]: https://docs.python.org/3/library/html.html
[#vim]: /tags/vim

Better pull in the [html][] standard library and escape that text. Otherwise I'd
feel awful silly when talking about indenting with `>>` in [#vim][] or
something and it breaks the whole page.

```rst
:raw-kbd:`>>`
```

Yeah, that works. It's not too bad to look at while writing.

```html
<kbd>&lt;&lt;</kbd>
```

And there we go. An honest to goodness `<kbd>` element. And `:raw-kbd:` will
be easier to search for if and when I get around to custom HTML Writers.

Figuring out a role for keyboard input was the reason I started writing this
post — though my favorite new role is `:tag:`. Anyways, I think this is a
good spot to stop writing and start editing.

## Wrap it up

…pardon me while I copy those role functions back into my Neovim plugin…

Well that was fun. I wanted a role for keyboard input, and I got it. Plus, my
tags are a little easier to find in the page. *And* I have a `:term:` role
for when I'm feeling pedagogical.

Cool.

[Docutils]: https://docutils.sourceforge.io/
[Sphinx]: https://www.sphinx-doc.org/en/master/

Roles are just a first step in customizing Docutils output. No idea when I'll
get to the rest. You can learn more for yourself with [Docutils][] and
heavily customized publishing environments like [Sphinx][].

[#hugo]: /tags/hugo
[Hugo B-side]: https://www.fisodd.com/code/b-side/

Me, I'm just having a grand time embedding this whole authoring flow in the
middle of my [#hugo][] site. May want to think about a new theme though if
I'm going to continue with Hugo. Perhaps borrow from Alexander Carlton's [Hugo
B-side][].