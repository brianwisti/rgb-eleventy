---
title: "My NANO-based Emacs config"
author: ["Random Geek"]
description: "Not quite bespoke"
updated: 2022-02-19T23:25:14-08:00
tags: ["org-config", "emacs"]
draft: false
weight: 5
---

This is more or less my vanilla-ish Emacs playground. I start from [nano-emacs](https://github.com/rougier/nano-emacs).
It's pretty and pretty useful.  But expect it to veer pretty far from that
base over time.


## Foundations {#foundations}


### Give Emacs some breathing room {#give-emacs-some-breathing-room}

`max-specpdl-size` sets the upper limit for how many variable bindings and `unwind-protect` Emacs allows.
`max-lisp-eval-depth` says how deep we can get into a recursive function call.

I got the RAM so let's go past the respective defaults of 1600 and 800.

```elisp
(setq max-specpdl-size 3200)
(setq max-lisp-eval-depth 3200)
```

And of course I'm sure to screw something up so let's make sure the debugger is enabled for when I do.

```elisp
(setq debug-on-error t)
```


### Use straight.el to install packages {#use-straight-dot-el-to-install-packages}

[`straight.el`](https://github.com/raxod502/straight.el) is my new friend.


#### `early-init.el` {#early-init-dot-el}

But if I'm using `straight.el` I better disable `package.el` during the _early init_
stage.

```elisp
(setq package-enable-at-startup nil)
```


#### Bootstrap `straight.el` {#bootstrap-straight-dot-el}

Boilerplate from the `straight.el` documentation.

```elisp
(defvar bootstrap-version)
(let ((bootstrap-file
       (expand-file-name "straight/repos/straight.el/bootstrap.el" user-emacs-directory))
      (bootstrap-version 5))
  (unless (file-exists-p bootstrap-file)
    (with-current-buffer
        (url-retrieve-synchronously
         "https://raw.githubusercontent.com/raxod502/straight.el/develop/install.el"
         'silent 'inhibit-cookies)
      (goto-char (point-max))
      (eval-print-last-sexp)))
  (load bootstrap-file nil 'nomessage))
```


#### Integrate with `use-package` {#integrate-with-use-package}

I tried to avoid [use-package](https://jwiegley.github.io/use-package/) here for a more "minimal" setup. That did not work.
Since `straight.el` plays nice with `use-package`, let's let it do that.

```elisp
(straight-use-package 'use-package)

(use-package straight
  :custom
  (straight-use-package-by-default t))
```


## General Usability {#general-usability}


### invoke `M-x` without `Alt` {#invoke-m-x-without-alt}

I read Steve Yegge's [effective-emacs](https://sites.google.com/site/steveyegge2/effective-emacs) a _long_ time ago — back when it was an
internal Amazon blog. Applied his suggestion to invoke `X-m` with `C-x C-m`
and that's been part of my Emacs muscle memory ever since.

<a id="code-snippet--use C-x C-m for M-x"></a>
```elisp
(global-set-key (kbd "C-x C-m") 'execute-extended-command)
```


## Aesthetics {#aesthetics}


### Fonts {#fonts}

The _Roboto Mono_ font that NANO wants is **not** part of any `*roboto*` package I
found in Pop! OS repositories.  Ended up going to [Font Library](https://fontlibrary.org/en/font/roboto-mono) for a direct
download.

With that note out of the way - I still lean towards [Fantasque Sans Mono](https://github.com/belluzj/fantasque-sans).

```elisp
(set-face-attribute 'default t
                    :background "#000000"
                    :foreground "#ffffff"
                    :family "FantasqueSansMono Nerd Font"
                    :height 140)

(setq nano-font-family-monospaced "FantasqueSansMono Nerd Font")
```


### Configure `nano` {#configure-nano}


#### Install `nano` and its dependencies {#install-nano-and-its-dependencies}

Installing via `straight.el`.

<a id="code-snippet--install nano"></a>
```elisp
(straight-use-package
 '(nano-emacs :type git :host github :repo "rougier/nano-emacs"))
```


#### Load the Nano layout {#load-the-nano-layout}

```elisp
(require 'nano-layout)
```


#### Define my colors {#define-my-colors}

Because I'm the kind of person I am: setting the nano theme colors to match my
own tacky tastes. Maybe not _tacky_ but certainly not as refined as the author of
nano.

This particular set of colors comes from the [Spaceduck](https://pineapplegiant.github.io/spaceduck/) theme.

```elisp
(defun nano-theme-set-spaceduck ()
  (setq frame-background-mode 'dark)
  (setq nano-color-foreground "#ecf0c1")
  (setq nano-color-background "#0f111b")
  (setq nano-color-highlight  "#1b1c36")
  (setq nano-color-critical   "#e33400")
  (setq nano-color-salient    "#00a4cc")
  (setq nano-color-strong     "#e39400")
  (setq nano-color-popout     "#f2ce00")
  (setq nano-color-subtle     "#7a5ccc")
  (setq nano-color-faded      "#30365f"))

(nano-theme-set-spaceduck)
```


#### Set up font faces {#set-up-font-faces}

I feel comfortable loading `nano-faces` for font rules now that I've defined my colors.
Will need to fuss a bit more in a second though.

```elisp

(require 'nano-faces)
(nano-faces)
```


#### Let nano theme everything {#let-nano-theme-everything}

`nano-theme` maps those custom faces to pretty much everything everywhere.
Pretty nice.

```elisp
(require 'nano-theme)
(nano-theme)
```

_Except_ for this little thing where it disables bold for graphical displays? I
think?  I'm still learning how all this works.

I know **I** like bold, though. _And_ italics, now that you mention it.

```elisp
(set-face-attribute 'bold nil :weight 'bold)
```

Once I have my base established, I should be able to load the nano theme.


#### Load nano defaults {#load-nano-defaults}

```elisp
(require 'nano-defaults)
```


#### Enable nano session handling {#enable-nano-session-handling}

```elisp
(require 'nano-session)
```


#### Enable the nano modeline {#enable-the-nano-modeline}

One of my favorite bits really.

```elisp
(require 'nano-modeline)
```


#### Enable nano key bindings {#enable-nano-key-bindings}

`C-x k`
: kill current buffer without asking

`M-n`
: open a new frame

`` M-` ``
: switch to other frame

`C-x C-c`
: delete the current frame; exit if no frames remain

`C-c r`
: interactive select from recent files

`<M-return>`
: toggle maximization of current frame
    -   not sure if I like this one; it confuses org muscle memory, and if I want
        "maximized" I usually toggle tiling in the window manager

<!--listend-->

```elisp
(require 'nano-bindings)
```


#### nano Counsel integration {#nano-counsel-integration}

`nano-counsel.el` is small. I'll just map its logic directly to some
`use-package` magic.

```elisp
(use-package counsel
  :bind
  (("M-x" . 'counsel-recentf)
   ("C-x b" . 'counsel-bookmark)
   ("C-c r" . 'counsel-recentf)
   ("C-x C-b" . 'counsel-switch-buffer)
   ("C-c c" . 'counsel-org-capture)))

(use-package smex)
(use-package ivy
  :custom
  (ivy-height 4)
  (ivy-count-format "")
  (ivy-initial-inputs-alist: '((counsel-minor . "^+")
                               (counsel-package . "^+")
                               (counsel-org-capture . "^")
                               (counsel-M-x . "^")
                               (counsel-refile . "")
                               (org-agenda-refile . "")
                               (org-capture-refile . "")
                               (Man-completion-table . "^")
                               (woman . "^")))
  (ivy-use-virtual-buffers t)

  :init
  (setq enable-recursive-minibuffers t)

  :config
  (ivy-mode 1))
```

I need to give myself a little context here.


##### Ivy, Counsel, and Swiper {#ivy-counsel-and-swiper}

> flexible, simple tools for minibuffer completion in Emacs

These are technically separate packages developed together in the [swiper](https://github.com/abo-abo/swiper) repo.

Ivy
: an alternative completion framework for Emacs

Counsel
: Ivy-enhanced alternatives to common Emacs commands

Swiper
: Ivy-enhanced alternative to Isearch

Loading `nano-counsel` failed with complaints about missing `smex`.
[Smex](https://github.com/nonsequitur/smex/) provides enhancements to `M-x` behavior, such as an interface to recent and commonly used commands.
Since I want my foundation to be a clean Nano experience, I install smex as well.


#### nano splash {#nano-splash}

```elisp
(let ((inhibit-message t))
  (message "Welcome to GNU Emacs / N Λ N O edition")
  (message (format "Initialization time: %s" (emacs-init-time))))

(require 'nano-splash)

(require 'nano-help)
```


## Applications {#applications}


### Org Mode {#org-mode}

Okay here we go. Building up my `org-roam` experience while keeping Deft handy
for the longer, more intentional notes.


#### File locations {#file-locations}

```elisp
(setq bmw/local-root
      (if (string-equal system-type "windows-nt")
          "C:/Users/brian"
        "~/"))

(setq bmw/sync-dir (expand-file-name "Dropbox" bmw/local-root))

(setq bmw/org-dir (expand-file-name "org" bmw/sync-dir))

(setq
 bmw/current-journal (expand-file-name "journal.org" bmw/org-dir)
 bmw/org-id-locations-file (expand-file-name
                            ".org-id-locations" bmw/org-dir))
```


#### Custom keywords {#custom-keywords}

A process vagiuely similar to [GTD](https://gettingthingsdone.com/) but my brain insists on its own task
classifications.

LATER
: I need to do it, but it can wait (or it's waiting on something)

NOW
: I got everything I need to do this

MAYBE
: An idea, suggestion, or action that I may or may not want to to

PROJECT
: A multi-part task with notable dependencies

DONE
: I did it!

NOPE
: Never mind

<!--listend-->

<a id="code-snippet--define org keywords"></a>
```elisp
(setq bmw/todo-keywords
      `((sequence
         "LATER(l)" "NOW(n)" "MAYBE(m)" "PROJECT(p)"
         "|"
         "DONE(d)" "NOPE(-)")))
```


#### Putting it all together {#putting-it-all-together}

```elisp
(use-package org
  :ensure org-plus-contrib
  :custom
  (org-agenda-files (list bmw/org-dir))
  (org-log-into-drawer t)
  (org-startup-indented t)
  (org-todo-keywords bmw/todo-keywords)
  (org-id-track-globally t)
  (org-id-locations-file bmw/org-id-locations-file)

  :bind
  ("C-c a" . org-agenda)
  ("C-c c" . org-capture)
  ("C-c l" . org-store-link)

  :config
  (setq org-id-link-to-org-use-id t)
  (setq org-capture-templates
        '(("j" "Jot" entry
           (file+olp+datetree bmw/current-journal)
           "* %U %? \n%i\n %a")))
  (setq-local org-fontify-whole-heading-line t))
```


### Deft {#deft}

The perfect solution for knowledge management varies by context. But the core
thing really needed: someplace to drop my notes where I can find them when I
need them.

[Deft](https://jblevins.org/projects/deft/) provides exactly that. And since Org mode is the main reason I load Emacs,
my `~/org` folder is where Deft will look for notes.

I don't want `org-roam` notes obscuring the more persistent notes in my Org folder.
Better ignore them. Also the `org-brain` stuff until I have a good handle on that.

```elisp
(use-package deft
  :custom (deft-extensions '("org")) (deft-directory bmw/org-dir)
  (deft-recursive-ignore-dir-regexp "\\(?:\\.\\|\\.\\.\\|roam\\|brain\\)")
  (deft-ignore-file-regexp "\\(?:~\\|py\\)$")
  (deft-recursive t))
```

<div class="note">

Helpful hint when enabling `deft-recursive: =../` is one of the entries in your directory
listing, and Deft will do its darndest to follow it if you forget to include it in
`deft-recursive-ignore-dir-regexp` (set to `"\\(?:\\.\\|\\.\\.\\)"` by default).

This can lead to all sorts of recursive headaches, so don't forget!

</div>

Of course I'll end up tweaking it. But to get me started?

"Ask deft about my notes" is more than sufficient.


### org-roam {#org-roam}

Mostly copied from [OrgMode-ExoCortex](https://orgmode-exocortex.com/2021/06/22/upgrade-to-org-roam-v2-with-use-package-and-quelpa/).

```elisp
(use-package org-roam
  :after org

  :custom
  (org-roam-directory (expand-file-name "roam" bmw/org-dir))

  :bind
  ("C-c n l" . org-roam-buffer-toggle)
  ("C-c n f" . org-roam-node-find)
  (:map org-mode-map
        (("C-c n i" . org-roam-node-insert)
         ("C-M-i" . completion-at-point)))

  :config
  (setq org-roam-capture-templates '(("d" "default" plain "%?"
                                      :if-new (file+head "${slug}.org"
                                                         "#+TITLE: ${title}\n#+DATE: %T\n")
                                      :unnarrowed t)))
  ;; this sets up various file handling hooks so your DB remains up to date
  (org-roam-setup))
```


#### `org-roam-ui` {#org-roam-ui}

For the pretty.

```elisp
(use-package org-roam-ui
  :straight
    (:host github :repo "org-roam/org-roam-ui" :branch "main" :files ("*.el" "out"))
    :after org-roam
    :hook (after-init . org-roam-ui-mode)
    :config
    (setq org-roam-ui-sync-theme t
          org-roam-ui-follow t
          org-roam-ui-update-on-save t
          org-roam-ui-open-on-start t))
```


### ox-hugo {#ox-hugo}

Although [ox-hugo](https://ox-hugo.scripter.co) is aimed at Hugo, I'm trying it as part of an
experiment with some other tools.

Not worrying about capture templates yet.The main thing I care about is exporting config files
like this one.

```elisp
(use-package ox-hugo
  :after ox)
```