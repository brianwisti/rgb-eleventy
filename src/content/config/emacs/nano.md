---
title: "My NANO-based Emacs config"
author: ["Random Geek"]
description: "Not quite bespoke"
updated: 2022-02-23T23:21:19-08:00
tags: ["org-config", "emacs"]
draft: false
weight: 5
---

This is more or less my vanilla-ish Emacs playground. I start from
[nano-emacs](https://github.com/rougier/nano-emacs).  It's pretty and pretty useful.  But expect it to veer
pretty far from that base over time.

<div class="note">

There's bound to be a lot of things that make you, the Emacs
veteran, wonder "why didn't he just do X?"  The likeliest options:

-   I didn't know X was an option
-   I saw X but wanted to wait until I understood it

That last is particularly likely. I keep getting reminded that
outsmarting yourself is a major hazard of Emacs configuration.

I'll add `org-pymacs-nodejs-todoist-roam-lsp-mode` later. Maybe. I
may not even need it.

</div>


## Foundations {#foundations}


### Give Emacs some breathing room {#give-emacs-some-breathing-room}

`max-specpdl-size` sets the upper limit for how many variable bindings
and `unwind-protect` Emacs allows.  `max-lisp-eval-depth` says how deep we
can get into a recursive function call.

I got the RAM so let's go past the respective defaults of 1600 and 800.

```elisp
(setq max-specpdl-size 3200)
(setq max-lisp-eval-depth 3200)
```

And of course I'm sure to screw something up so let's make sure the debugger is enabled for when I do.

```elisp
(setq debug-on-error t)
```


### Enable local lisp {#enable-local-lisp}

```elisp
(let ((default-directory  (expand-file-name "lisp" user-emacs-directory)))
  (setq load-path
        (append
         (let ((load-path  (copy-sequence load-path))) ;; Shadow
           (append
            (copy-sequence (normal-top-level-add-to-load-path '(".")))
            (normal-top-level-add-subdirs-to-load-path)))
         load-path)))
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


### Make a few adjustments for running on macOS {#make-a-few-adjustments-for-running-on-macos}

Make sure the macOS Emacs GUI app picks up environment variables.

```elisp
(use-package exec-path-from-shell
  :ensure
  :init (exec-path-from-shell-initialize))
```

macOS doesn't use GNU Coreutils and of course its `ls` isn't what
`dired` expects. Adjust for that.

```elisp
(if (string-equal system-type "darwin")
    (setq dired-use-ls-dired nil))
```


## Aesthetics {#aesthetics}


### Fonts {#fonts}

The _Roboto Mono_ font that NANO wants is **not** part of any `*roboto*` package I
found in Pop! OS repositories.  Ended up going to [Font Library](https://fontlibrary.org/en/font/roboto-mono) for a direct
download.

With that note out of the way - I still lean towards [Fantasque Sans Mono](https://github.com/belluzj/fantasque-sans).

```elisp
(setq bmw/face-height-default
      (if (eq system-type 'darwin)
          180
        140))

(set-face-attribute 'default t
                    :background "#000000"
                    :foreground "#ffffff"
                    :family "FantasqueSansMono Nerd Font"
                    :height bmw/face-height-default)

(setq nano-font-family-monospaced "FantasqueSansMono Nerd Font")
(setq nano-font-size (/ bmw/face-height-default 10))
```


## Configure `nano` {#configure-nano}


### Install `nano` and its dependencies {#install-nano-and-its-dependencies}

Installing via `straight.el`.

<a id="code-snippet--install nano"></a>
```elisp
(straight-use-package
 '(nano-emacs :type git :host github :repo "rougier/nano-emacs"))
```


### Load the Nano layout {#load-the-nano-layout}

```elisp
(require 'nano-layout)
```


### Define my colors {#define-my-colors}

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
  (setq nano-color-faded      "#b3a1e6"))

(nano-theme-set-spaceduck)
```


### Set up font faces {#set-up-font-faces}

I feel comfortable loading `nano-faces` for font rules now that I've defined my colors.
Will need to fuss a bit more in a second though.

```elisp

(require 'nano-faces)
(nano-faces)
```

Want to overload some of the defaults, though. nano-emacs does not
like to show bold text when using Fantasque Sans Mono.

```elisp
(set-face-attribute 'nano-face-strong nil
                    :foreground (face-foreground 'nano-face-default)
                    :weight 'bold)
```


### Let nano theme everything {#let-nano-theme-everything}

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


### Load nano defaults {#load-nano-defaults}

```elisp
(require 'nano-defaults)
```


### Enable nano session handling {#enable-nano-session-handling}

```elisp
(require 'nano-session)
```


### Enable the nano modeline {#enable-the-nano-modeline}

One of my favorite bits really.

```elisp
(require 'nano-modeline)
```


### Enable nano key bindings {#enable-nano-key-bindings}

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


### nano Counsel integration {#nano-counsel-integration}

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


#### Ivy, Counsel, and Swiper {#ivy-counsel-and-swiper}

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


### nano splash {#nano-splash}

```elisp
(let ((inhibit-message t))
  (message "Welcome to GNU Emacs / N Λ N O edition")
  (message (format "Initialization time: %s" (emacs-init-time))))

(require 'nano-splash)

(require 'nano-help)
```


## Knowledge management with Org {#knowledge-management-with-org}

Okay here we go. Building up my `org-roam` experience while keeping Deft handy
for the longer, more intentional notes.


### File locations {#file-locations}

I work this out piecemeal, as some of the files and folders build on
what's been defined before.

First: what's the top level of everything? That depends on whether I'm
in a UNIX-like system or playing with the native Windows version of
Emacs.

```elisp
(setq bmw/local-root
      (if (string-equal system-type "windows-nt")
          "C:/Users/brian"
        "~/"))
```

Trying an experiment where first we look for a local `~org/` folder and
use that if found, otherwise going with my actual default of
`~/Dropbox/org`. Trying to shift over to git-synchronized Org files
instead of Dropbox-synchronized, but that change will take a bit to
percolate through all my systems.

```elisp
(setq bmw/default-org-directory (expand-file-name "org" bmw/local-root))
(setq bmw/sync-org-directory (expand-file-name "Dropbox/org" bmw/local-root))

(setq bmw/org-dir
      (if (file-directory-p bmw/default-org-directory)
          bmw/default-org-directory
        bmw/sync-org-directory))
```

That's enough to define most of the files I need.

```elisp
(setq
 bmw/current-journal (expand-file-name "journal.org" bmw/org-dir)
 bmw/org-id-locations-file (expand-file-name
                            ".org-id-locations" bmw/org-dir)
 bmw/org-roam-directory (expand-file-name "roam" bmw/org-dir))
```

Oh, one more thing. I want to include `org-roam` files in my Org
agenda. I found [helpful instructions](https://d12frosted.io/posts/2021-01-16-task-management-with-roam-vol5.html), but I'm not adding that code to
my config until I understand it. Maybe if I follow the link to the
_beginning_ of the post series and start there.

What a novel idea.

But today? With my small collection of `org-roam` notes, I can get away
with directly including them in my agenda searches.

```elisp
(setq bmw/org-agenda-files (list bmw/org-dir
                                 bmw/org-roam-directory
                                 (expand-file-name
                                  "daily" bmw/org-roam-directory)))
```


### Custom keywords {#custom-keywords}

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
         "LATER(l!)" "NOW(n!)" "MAYBE(m!)" "PROJECT(p!)"
         "|"
         "DONE(d!)" "NOPE(-!)")))
```


### `CUSTOM_ID` generation via writequit {#custom-id-generation-via-writequit}

Grabbing directly from [this post](https://writequit.org/articles/emacs-org-mode-generate-ids.html).

More to keep my `org-roam-ui` graph in order than for publishing, but
hopefully it'll come in handy there too.

```elisp
(defun eos/org-custom-id-get (&optional pom create prefix)
  "Get the CUSTOM_ID property of the entry at point-or-marker POM.
     If POM is nil, refer to the entry at point. If the entry does
     not have an CUSTOM_ID, the function returns nil. However, when
     CREATE is non nil, create a CUSTOM_ID if none is present
     already. PREFIX will be passed through to `org-id-new'. In any
     case, the CUSTOM_ID of the entry is returned."
  (interactive)
  (org-with-point-at pom
    (let ((id (org-entry-get nil "CUSTOM_ID")))
      (cond
       ((and id (stringp id) (string-match "\\S-" id))
        id)
       (create
        (setq id (org-id-new (concat prefix "h")))
        (org-entry-put pom "CUSTOM_ID" id)
        (org-id-add-location id (buffer-file-name (buffer-base-buffer)))
        id)))))

(defun eos/org-add-ids-to-headlines-in-file ()
  "Add CUSTOM_ID properties to all headlines in the
     current file which do not already have one."
  (interactive)
  (org-map-entries (lambda () (eos/org-custom-id-get (point) 'create))))
```


### Putting it all together {#putting-it-all-together}

```elisp

(use-package org
  :ensure org-plus-contrib
  :custom
  (org-agenda-files bmw/org-agenda-files)
  (org-log-done 'time)
  (org-log-reschedule 'time)
  (org-log-into-drawer t)
  (org-startup-indented t)
  (org-todo-keywords bmw/todo-keywords)
  (org-id-track-globally t)
  (org-id-link-to-org-use-id 'create-if-interactive-and-no-custom-id)
  (org-id-locations-file bmw/org-id-locations-file)
  (org-id-locations-file-relative t)

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


### Additional Org tools {#additional-org-tools}


#### Deft {#deft}

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


#### org-roam {#org-roam}

Taking advantage of [`org-roam-dailies`](https://www.orgroam.com/manual.html#Org_002droam-Dailies) for journaling.  I started by
copying from [OrgMode-ExoCortex](https://orgmode-exocortex.com/2021/06/22/upgrade-to-org-roam-v2-with-use-package-and-quelpa/) and [System Crafters](https://systemcrafters.net/build-a-second-brain-in-emacs/keep-a-journal/).

```elisp
(use-package org-roam
  :after org
  :ensure t
  :demand t

  :custom
  (org-roam-directory bmw/org-roam-directory)
  (org-roam-completion-everywhere t)
  (org-roam-dailies-directory "daily")
  (org-roam-node-display-template
   (concat "${title:*} " (propertize "${tags:10}" 'face 'org-tag)))

  :bind
  ("C-c n l" . org-roam-buffer-toggle)
  ("C-c n f" . org-roam-node-find)
  ("C-c n i" . org-roam-node-insert)
  ("C-c n j" . org-roam-dailies-capture-today)
  ("C-c n t" . org-roam-tag-add)
  ([f8] . org-roam-dailies-goto-today)
  (:map org-mode-map
        ("C-M-i" . completion-at-point))

  :bind-keymap
  ("C-c n d" . org-roam-dailies-map)

  :config
  (require 'org-roam-dailies)
  (org-roam-db-autosync-mode)

  :hook
  (org-load . org-roam-mode)

  :commands
  (org-roam-buffer-toggle-display
   org-roam-find-file
   org-roam-insert
   org-roam-switch-to-buffer
   org-roam-dailies-date
   org-roam-dailies-today
   org-roam-dailies-tomorrow
   org-roam-dailies-yesterday)
  )
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


#### `ox-hugo` {#ox-hugo}

Although [ox-hugo](https://ox-hugo.scripter.co) is aimed at Hugo, I'm trying it as part of an
experiment with some other tools.

Not worrying about capture templates yet. The main thing I care about
is exporting config files like this one.

```elisp
(use-package ox-hugo
  :after ox)
```


## Project management with Projectile and friends {#project-management-with-projectile-and-friends}

[Projectile](https://projectile.mx/) plus a `.dir-locals.el` file seems like the right way to
handle development projects without bumping into everything else.

```elisp
(use-package projectile
  :ensure t

  :init
  (projectile-mode +1)

  :bind
  (:map projectile-mode-map
        ("s-p" . projectile-command-map)
        ("C-c p" . projectile-command-map)))
```


## `lsp-mode` {#lsp-mode}

[`lsp-mode`](https://emacs-lsp.github.io/lsp-mode/) adds support for Microsoft's [Language Server
Protocol](https://github.com/Microsoft/language-server-protocol/). Hypothetically that means easier setup of commonly desired
features like linting and autocompletion.

`nano-modeline` and `lsp-mode`'s breadcrumb trail wrestle with each other
for space on that top line. Maybe someday I can figure out how to
stack them. Until then, I like the modeline and its placement more
than I like the breadcrumb.

```elisp
(use-package lsp-mode
  :custom
  (lsp-headerline-breadcrumb-enable nil)

  :init
  (setq lsp-keymap-prefix "C-c C-l")

  :hook ((python-mode . lsp-deferred)
         (lsp-mode . lsp-enable-which-key-integration))

  :commands lsp)

(use-package lsp-ui :commands lsp-ui-mode)

(use-package lsp-ivy :commands lsp-ivy-workspace-symbol)

(use-package lsp-treemacs
  :after (lsp-mode treemacs)

  :config
  (lsp-treemacs-sync-mode 1)

  :commands lsp-treemacs-errors-list)
```


## Programming Languages {#programming-languages}


### Python {#python}

I manage my projects with [Poetry](https://python-poetry.org/). [poetry.el](https://github.com/galaunay/poetry.el) offers a nice Magit-like
interface to managing and maintaining Poetry projects.

In particular, it _might_ simplify venv handling when I get to linting
tools and language server providers.

```elisp
(use-package poetry
  :ensure t
  :config
  (poetry-tracking-mode))
```


## Which Key? {#which-key}

[`which-key`](https://github.com/justbur/emacs-which-key) adds a completion panel for commands. That helps me learn
the many Emacs key maps.

```elisp
(use-package which-key
  :defer 0
  :diminish which-key-mode
  :config
  (which-key-mode)
  (setq which-key-idle-delay 1))
```


## Treemacs {#treemacs}

[Treemacs](https://github.com/Alexander-Miller/treemacs) is a file explorer sidebar. That part is kind of "meh" for
me.  The outliner provided by [`lsp-treemacs`](https://github.com/emacs-lsp/lsp-treemacs) interests me much more.

<div class="note">

To get Treemacs and nano playing nice I had to comment out line 515 of
`nano-modeline.el` in my local copy of nano.

```elisp
;; (setq-default mode-line-format "")
```

Watching issue [#75](https://github.com/rougier/nano-emacs/issues/75) for updates on this problem.

</div>

```elisp
(use-package treemacs
  :ensure t

  :defer t

  :init
  (with-eval-after-load 'winum
    (define-key winum-keymap (kbd "M-0") #'treemacs-select-window))

  :config
  (progn
    (setq treemacs-collapse-dirs                   (if treemacs-python-executable 3 0)
          treemacs-deferred-git-apply-delay        0.5
          treemacs-directory-name-transformer      #'identity
          treemacs-display-in-side-window          t
          treemacs-eldoc-display                   'simple
          treemacs-file-event-delay                5000
          treemacs-file-extension-regex            treemacs-last-period-regex-value
          treemacs-file-follow-delay               0.2
          treemacs-file-name-transformer           #'identity
          treemacs-follow-after-init               t
          treemacs-expand-after-init               t
          treemacs-find-workspace-method           'find-for-file-or-pick-first
          treemacs-git-command-pipe                ""
          treemacs-goto-tag-strategy               'refetch-index
          treemacs-indentation                     2
          treemacs-indentation-string              " "
          treemacs-is-never-other-window           nil
          treemacs-max-git-entries                 5000
          treemacs-missing-project-action          'ask
          treemacs-move-forward-on-expand          nil
          treemacs-no-png-images                   nil
          treemacs-no-delete-other-windows         t
          treemacs-project-follow-cleanup          nil
          treemacs-persist-file                    (expand-file-name ".cache/treemacs-persist" user-emacs-directory)
          treemacs-position                        'left
          treemacs-read-string-input               'from-child-frame
          treemacs-recenter-distance               0.1
          treemacs-recenter-after-file-follow      nil
          treemacs-recenter-after-tag-follow       nil
          treemacs-recenter-after-project-jump     'always
          treemacs-recenter-after-project-expand   'on-distance
          treemacs-litter-directories              '("/node_modules" "/.venv" "/.cask")
          treemacs-show-cursor                     nil
          treemacs-show-hidden-files               t
          treemacs-silent-filewatch                nil
          treemacs-silent-refresh                  nil
          treemacs-sorting                         'alphabetic-asc
          treemacs-select-when-already-in-treemacs 'move-back
          treemacs-space-between-root-nodes        t
          treemacs-tag-follow-cleanup              t
          treemacs-tag-follow-delay                1.5
          treemacs-text-scale                      nil
          treemacs-user-mode-line-format           nil
          treemacs-user-header-line-format         nil
          treemacs-wide-toggle-width               70
          treemacs-width                           35
          treemacs-width-increment                 1
          treemacs-width-is-initially-locked       t
          treemacs-workspace-switch-cleanup        nil)

    ;; The default width and height of the icons is 22 pixels. If you are
    ;; using a Hi-DPI display, uncomment this to double the icon size.
    ;;(treemacs-resize-icons 44)

    (treemacs-follow-mode t)
    (treemacs-filewatch-mode t)
    (treemacs-fringe-indicator-mode 'always)

    (pcase (cons (not (null (executable-find "git")))
                 (not (null treemacs-python-executable)))
      (`(t . t)
       (treemacs-git-mode 'deferred))
      (`(t . _)
       (treemacs-git-mode 'simple)))

    (treemacs-hide-gitignored-files-mode nil))
  :bind
  (:map global-map
        ("M-0"       . treemacs-select-window)
        ("C-x t 1"   . treemacs-delete-other-windows)
        ("C-x t t"   . treemacs)
        ("C-x t d"   . treemacs-select-directory)
        ("C-x t B"   . treemacs-bookmark)
        ("C-x t C-t" . treemacs-find-file)
        ("C-x t M-t" . treemacs-find-tag)))

(use-package treemacs-projectile
  :after (treemacs projectile)
  :ensure t)
```

I want `dired` icons, and I want them consistent with my Spaceduck colors.

```elisp
(use-package treemacs-icons-dired
  :hook (dired-mode . treemacs-icons-dired-enable-once)
  :ensure t
  :custom
  (treemacs-no-png-images t))
```