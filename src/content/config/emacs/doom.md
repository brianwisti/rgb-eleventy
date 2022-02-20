---
title: "Emacs Doom config"
author: ["Random Geek"]
description: "Still trying"
updated: 2022-02-19T22:45:44-08:00
tags: ["org-config", "emacs"]
draft: false
weight: 10
---

This is the config of a mostly-[Vim](https://www.vim.org/) user who occasionally uses [Emacs](https://www.gnu.org/software/emacs/), and mostly for [Org Mode](https://orgmode.org).

When I do fire up Emacs, it tends to be [Doom Emacs](https://github.com/hlissner/doom-emacs) with its not-quite-Emacs-not-quite-Vim quirks.


## `init.el` {#init-dot-el}

The best use of `init.el` is just uncommenting entries from the extensive [Doom init file](https://github.com/hlissner/doom-emacs/blob/develop/init.example.el) for bundled packages you want enabled, and adding bundle options where relevant.

Again, grabbing a useful tip from the original

> Move your cursor over a module's name (or its flags) and press 'K' (or
> 'C-c c k' for non-vim users) to view its documentation. This works on
> flags as well (those symbols that start with a plus).
>
> Alternatively, press 'gd' (or 'C-c c d') on a module to browse its
> directory (for easy access to its source code).

For the moment here's the contents of my `init.el`. If you've wandered in from some search engine looking for setup hints, be aware that my package listing here may not be up to date with what you see in a brand new Doom config!

```elisp
(doom! :input
       ;;japanese
       ;;layout            ; auie,ctsrnm is the superior home row

       :completion
       (company            ; the ultimate code completion backend
        +childframe)       ; - show in child frame rather than tooltip
       ;;helm              ; the *other* search engine for love and life
       ;;ido               ; the other *other* search engine...
       ivy               ; a search engine for love and life

       :ui
       deft              ; notational velocity for Emacs
       doom              ; what makes DOOM look the way it does
       doom-dashboard    ; a nifty splash screen for Emacs
       doom-quit         ; DOOM quit-message prompts when you quit Emacs
       ;;(emoji +unicode)  ; 🙂
       ;;fill-column       ; a `fill-column' indicator
       hl-todo           ; highlight TODO/FIXME/NOTE/DEPRECATED/HACK/REVIEW
       ;;hydra
       ;;indent-guides     ; highlighted indent columns
       ;;ligatures         ; ligatures and symbols to make your code pretty again
       ;;minimap           ; show a map of the code on the side
       modeline          ; snazzy, Atom-inspired modeline, plus API
       ;;nav-flash         ; blink cursor line after big motions
       ;;neotree           ; a project drawer, like NERDTree for vim
       ophints           ; highlight the region an operation acts on
       (popup +defaults)   ; tame sudden yet inevitable temporary windows
       ;;tabs              ; a tab bar for Emacs
       treemacs          ; a project drawer, like neotree but cooler
       ;;unicode           ; extended unicode support for various languages
       vc-gutter         ; vcs diff in the fringe
       vi-tilde-fringe   ; fringe tildes to mark beyond EOB
       ;;window-select     ; visually switch windows
       workspaces        ; tab emulation, persistence & separate workspaces
       zen               ; distraction-free coding or writing

       :editor
       (evil +everywhere); come to the dark side, we have cookies
       file-templates    ; auto-snippets for empty files
       fold              ; (nigh) universal code folding
       (format +onsave)  ; automated prettiness
       ;;god               ; run Emacs commands without modifier keys
       ;;lispy             ; vim for lisp, for people who don't like vim
       ;;multiple-cursors  ; editing in many places at once
       ;;objed             ; text object editing for the innocent
       ;;parinfer          ; turn lisp into python, sort of
       ;;rotate-text       ; cycle region at point between text candidates
       snippets          ; my elves. They type so I don't have to
       word-wrap         ; soft wrapping with language-aware indent

       :emacs
       dired             ; making dired pretty [functional]
       electric          ; smarter, keyword-based electric-indent
       ;;ibuffer         ; interactive buffer management
       undo              ; persistent, smarter undo for your inevitable mistakes
       vc                ; version-control and Emacs, sitting in a tree

       :term
       ;;eshell            ; the elisp shell that works everywhere
       ;;shell             ; simple shell REPL for Emacs
       ;;term              ; basic terminal emulator for Emacs
       vterm             ; the best terminal emulation in Emacs

       :checkers
       ;;syntax              ; tasing you for every semicolon you forget
       ;;spell             ; tasing you for misspelling mispelling
       ;;grammar           ; tasing grammar mistake every you make

       :tools
       ;;ansible
       ;;debugger          ; FIXME stepping through code, to help you add bugs
       direnv
       ;;docker
       ;;editorconfig      ; let someone else argue about tabs vs spaces
       ;;ein               ; tame Jupyter notebooks with emacs
       (eval +overlay)     ; run code, run (also, repls)
       ;;gist              ; interacting with github gists
       lookup              ; navigate your code and its documentation
       lsp
       magit             ; a git porcelain for Emacs
       ;;make              ; run make tasks from Emacs
       ;;pass              ; password manager for nerds
       ;;pdf               ; pdf enhancements
       ;;prodigy           ; FIXME managing external services & code builders
       ;;rgb               ; creating color strings
       ;;taskrunner        ; taskrunner for all your projects
       terraform         ; infrastructure as code
       tmux              ; an API for interacting with tmux
       ;;upload            ; map local to remote projects via ssh/ftp

       :os
       (:if IS-MAC macos)  ; improve compatibility with macOS
       tty               ; improve the terminal Emacs experience

       :lang
       ;;agda              ; types of types of types of types...
       ;;cc                ; C/C++/Obj-C madness
       ;;clojure           ; java with a lisp
       ;;common-lisp       ; if you've seen one lisp, you've seen them all
       ;;coq               ; proofs-as-programs
       crystal           ; ruby at the speed of c
       ;;csharp            ; unity, .NET, and mono shenanigans
       data              ; config/data formats
       ;;(dart +flutter)   ; paint ui and not much else
       ;;elixir            ; erlang done right
       ;;elm               ; care for a cup of TEA?
       emacs-lisp        ; drown in parentheses
       ;;erlang            ; an elegant language for a more civilized age
       ;;ess               ; emacs speaks statistics
       ;;faust             ; dsp, but you get to keep your soul
       ;;fsharp            ; ML stands for Microsoft's Language
       ;;fstar             ; (dependent) types and (monadic) effects and Z3
       ;;gdscript          ; the language you waited for
       (go +lsp)         ; the hipster dialect
       ;;(haskell +dante)  ; a language that's lazier than I am
       ;;hy                ; readability of scheme w/ speed of python
       ;;idris             ; a language you can depend on
       json              ; At least it ain't XML
       ;;(java +meghanada) ; the poster child for carpal tunnel syndrome
       javascript        ; all(hope(abandon(ye(who(enter(here))))))
       julia             ; a better, faster MATLAB
       ;;kotlin            ; a better, slicker Java(Script)
       ;;latex             ; writing papers in Emacs has never been so fun
       ;;lean
       ;;factor
       ;;ledger            ; an accounting system in Emacs
       lua               ; one-based indices? one-based indices
       markdown          ; writing docs for people to ignore
       ;;nim               ; python + lisp at the speed of c
       ;;nix               ; I hereby declare "nix geht mehr!"
       ;;ocaml             ; an objective camel
       (org                ; organize your plain life in plain text
        +hugo             ; - export Org files to Hugo sections
        +org-plus-contrib
        +roam2)
       ;;php               ; perl's insecure younger brother
       ;;plantuml          ; diagrams for confusing people more
       ;;purescript        ; javascript, but functional
       (python    ; beautiful is better than ugly
        +lsp
        +pyenv)
       ;;qt                ; the 'cutest' gui framework ever
       ;;racket            ; a DSL for DSLs
       raku              ; the artist formerly known as perl6
       ;;rest              ; Emacs as a REST client
       rst               ; ReST in peace
       ruby     ; 1.step {|i| p "Ruby is #{i.even? ? 'love' : 'life'}"}
       rust              ; Fe2O3.unwrap().unwrap().unwrap().unwrap()
       ;;scala             ; java, but good
       ;;scheme            ; a fully conniving family of lisps
       sh                ; she sells {ba,z,fi}sh shells on the C xor
       ;;sml
       ;;solidity          ; do you need a blockchain? No.
       ;;swift             ; who asked for emoji variables?
       ;;terra             ; Earth and Moon in alignment for performance.
       (web +web-django-mode) ; the tubes
       yaml              ; JSON, but readable

       :email
       ;;(mu4e +gmail)
       ;;notmuch
       ;;(wanderlust +gmail)

       :app
       ;;calendar
       ;;irc               ; how neckbeards socialize
       ;;(rss +org)        ; emacs as an RSS reader
       ;;twitter           ; twitter client https://twitter.com/vnought

       :config
       ;;literate
       (default +bindings +smartparens))
;; =init.el=:1 ends here
```


## `config.el` {#config-dot-el}

See the [Doom config example](https://github.com/hlissner/doom-emacs/blob/develop/core/templates/config.example.el) for extremely helpful inline comments, which I have impatiently stripped from my own config.

However, I know I'll need this bit:

> Here are some additional functions/macros that could help you configure Doom:
>
> -   `load!` for loading external \*.el files relative to this one
> -   `use-package!` for configuring packages
> -   `after!` for running code after a package has loaded
> -   `add-load-path!` for adding directories to the `load-path`, relative to
>     this file. Emacs searches the `load-path` when you load packages with
>     `require` or `use-package`.
> -   `map!` for binding new keys
>
> To get information about any of these functions/macros, move the cursor over
> the highlighted symbol at press `K` (non-evil users must press `C-c c k`).
> This will open documentation for it, including demos of how they are used.
>
> You can also try `gd` (or `C-c c d`) to jump to their definition and see how
> they are implemented.

```elisp
<<config.el prelude>>

<<set personal variables>>
<<set sensitive variables>>

<<configure fonts>>
<<display line numbers>>

<<configure org mode>>
<<require backtrace in ox-hugo>>

<<configure company>>
<<configure projectile>>

<<configure pylsp>>
<<use python-black>>

<<configure doom dashboard>>
```

This preface seems relevant when you have `literate` enabled in Doom.

<a id="code-snippet--config.el prelude"></a>
```emacs-lisp
;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-
```


### Personal Variables {#personal-variables}

Some are preferences, some are handy ways to define my environment.

<a id="code-snippet--set personal variables"></a>
```elisp
(setq user-full-name "Brian Wisti"
      user-mail-address "brianwisti@pobox.com")
(setq bmw/local-root
      (if (string-equal system-type "windows-nt")
          "C:/Users/brian"
        "~/"))
(setq bmw/sync-dir (expand-file-name "Dropbox" bmw/local-root))
(setq bmw/org-dir (expand-file-name "org" bmw/sync-dir))
(setq
 bmw/org-brain-path (expand-file-name "brain" bmw/org-dir))
```

And some are for work projects that we don't need to be showing the public.


### Aesthetics {#aesthetics}

My personal favorite code font is FantasqueSansMono.

[emacs-doom-themes](https://github.com/hlissner/emacs-doom-themes) includes _many_ options, but I seem to have settled on Fairy Floss for my aesthetic.

<a id="code-snippet--configure fonts"></a>
```elisp
(setq bmw/font-mono
      (if (string-equal system-type "windows-nt")
    "FantasqueSansMono NF"
  "FantasqueSansMono Nerd Font"))

(setq doom-font (font-spec :family bmw/font-mono :size 18)
      doom-big-font (font-spec :family bmw/font-mono :size 24)
      doom-theme 'doom-fairy-floss)
```

<a id="code-snippet--display line numbers"></a>
```elisp
(setq display-line-numbers-type t)
```


### Org mode {#org-mode}

Honestly, [Org mode](https://orgmode.org) is mostly what I use Emacs for.

<div class="note">

[Logseq](https://logseq.com) does great as a sort of org-mode-light, and I highly recommend it if you want a less complex tool for managing notes and tasks. OTOH its org parser does not yet provide 100% of what I expect. I can't quite abandon org mode yet.

</div>


#### Configure Org Mode {#configure-org-mode}

Tasks could be in notes, journal, or the actual agenda folder.

Sometimes I want to enable mixed-pitch-mode for Org, and sometimes I don't. Eventually I'll use some clever approach to toggle, but for now I just include this bit when I want it.

<a id="code-snippet--mixed pitch org mode"></a>
```elisp
(add-hook! 'org-mode-hook #'mixed-pitch-mode)
(setq mixed-pitch-variable-pitch-cursor nil)
```

My `org-directory` is on a folder synchronized across multiple machines. Probably want to keep things like generated `org-id` values synchronized as well.

<a id="code-snippet--keep org files and data together"></a>
```elisp
(setq
 org-directory bmw/org-dir
 org-id-locations-file (expand-file-name ".orgids" bmw/org-dir)
 org-id-locations-file-relative t
 org-roam-directory (expand-file-name "roam" bmw/org-dir))
```

Make sure that tasks I think of on the spur of the moment in `org/roam/daily` get included in my Agenda views.

<a id="code-snippet--find agenda tasks recursively"></a>
```elisp
(setq
 org-agenda-files (directory-files-recursively bmw/org-dir "\\.org$" t))
```

My brain insists on a particular set of state keywords for my tasks.

<a id="code-snippet--set my custom org todo keywords"></a>
```elisp
(setq
 org-todo-keywords `((sequence
                      "LATER(l)" "NOW(n)" "MAYBE(m)" "PROJECT(p)"
                      "|"
                      "DONE(d)" "NOPE(-)")))
```

Throw all of it together, along with the things I don't feel like explaining right now:

<a id="code-snippet--configure org mode"></a>
```elisp

(after! org
  <<keep org files and data together>>
  <<find agenda tasks recursively>>
  <<set my custom org todo keywords>>

  (setq
   org-catch-invisible-edits 'smart ; try not to change things in hidden blocks
   org-log-done 'time
   org-log-into-drawer t
   org-log-redeadline 'time
   org-log-reschedule 'time
   org-refile-use-outline-path 'file
   org-use-property-inheritance t))
```


#### Fiddle with `ox-hugo` {#fiddle-with-ox-hugo}

Having trouble with `ox-hugo`. It fails telling me that there's no function for backtraces. Hopefully this fixes it!

<a id="code-snippet--require backtrace in ox-hugo"></a>
```elisp
(after! ox-hugo
  (require 'backtrace))
```

<div class="note">

It sort of fixes it. I get a backtrace, but I also get my content exported. I'll take it.

</div>


### Company {#company}

An autocompletion framework of some kind? I'd like to tone it down, but first I'll just figure out how to tune it. [tecosaur's notes](https://tecosaur.github.io/emacs-config/config.html#company) seems like a good place to start.

Also keeping [doom docs](https://docs.doomemacs.org/latest/modules/completion/company/) handy.

<a id="code-snippet--configure company"></a>
```elisp
(after! company
  (setq company-idle-delay 0.5
        company-minimum-prefix-length 3
        company-show-numbers t)
  (add-hook
   'evil-normal-state-entry-hook #'company-abort))
```


### Projectile {#projectile}

[Projectile](https://docs.projectile.mx/projectile/index.html) provides one approach to project management in Emacs.

<a id="code-snippet--configure projectile"></a>
```elisp
(after! projectile
  (dolist (project bmw/projects)
    (projectile-add-known-project project)))
```


### Doom Dashboard {#doom-dashboard}

<a id="code-snippet--configure doom dashboard"></a>
```elisp
(setq +doom-dashboard-menu-sections
  '(("Reload last session"
    :icon (all-the-icons-octicon "history" :face 'doom-dashboard-menu-title)
    :when (cond ((require 'persp-mode nil t)
                  (file-exists-p (expand-file-name persp-auto-save-fname persp-save-dir)))
                ((require 'desktop nil t)
                  (file-exists-p (desktop-full-file-name))))
    :face (:inherit (doom-dashboard-menu-title bold))
    :action doom/quickload-session)
    ("Open org-agenda"
    :icon (all-the-icons-octicon "calendar" :face 'doom-dashboard-menu-title)
    :when (fboundp 'org-agenda)
    :action org-agenda)
    ("Recently opened files"
    :icon (all-the-icons-octicon "file-text" :face 'doom-dashboard-menu-title)
    :action recentf-open-files)
    ("Open project"
    :icon (all-the-icons-octicon "briefcase" :face 'doom-dashboard-menu-title)
    :action projectile-switch-project)
    ("Jump to bookmark"
    :icon (all-the-icons-octicon "bookmark" :face 'doom-dashboard-menu-title)
    :action bookmark-jump)
    ("Open private configuration"
    :icon (all-the-icons-octicon "tools" :face 'doom-dashboard-menu-title)
    :when (file-directory-p doom-private-dir)
    :action doom/open-private-config)
    ("Open documentation"
    :icon (all-the-icons-octicon "book" :face 'doom-dashboard-menu-title)
    :action doom/help)))
```


### Perl {#perl}

Doom Emacs doesn't do much with Perl. So I can't just enable a handy `init.el` module. The handy module that _was_ available didn't actually do much, as it turns out.

For now let's just use [CPerl Mode](https://www.emacswiki.org/emacs/CPerlMode) with everything enabled and the [IndentingPerl](https://www.emacswiki.org/emacs/IndentingPerl). When all else fails, go to the Emacs Wiki.

\#+ name: configure perl settings

```elisp
(defalias 'perl-mode 'cperl-mode)
(setq
 cperl-hairy t
 cperl-indent-level 2
 cperl-close-paren-offset -2
 cperl-continued-statement-offset 2
 cperl-indent-parens-as-block t
 cperl-tab-always-indent t)
```


### Python {#python}

Having a language server is nice, but I can't just use the defaults.

For one thing, I prefer black's 88 character default line length to Flake's 79 character default.

<a id="code-snippet--configure pylsp"></a>
```elisp
(setq lsp-pylsp-plugins-flake8-max-line-length 88)
```

For some strange reason I'm not getting any formatting applied when I save an obviously long line of Python. So I'll borrow from a [gist](https://gist.github.com/jordangarrison/8720cf98126a1a64890b2f18c1bc69f5g) describing how someone set `python-black` up with Doom.

<a id="code-snippet--use python-black"></a>
```elisp
(use-package! python-black
  :demand t
  :after python
  :config
  (add-hook! 'python-mode-hook #'python-black-on-save-mode)
  (map! :leader :desc "Blacken Buffer" "m b b" #'python-black-buffer)
  (map! :leader :desc "Blacken Region" "m b r" #'python-black-region)
  (map! :leader :desc "Blacken Statement" "m b s" #'python-black-statement))
```


## `package.el` {#package-dot-el}

Just trying to get black formatting working with my Doom setup. `+black` seems to do nothing.

For general info about `packages.el`, I may want to look at the [Doom packages example](https://github.com/hlissner/doom-emacs/blob/develop/core/templates/packages.example.el).

```elisp
;; -*- no-byte-compile: t; -*-
(package! python-black)
```