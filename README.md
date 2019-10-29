## Architecture

This project contains the source files for the `cortexjs.io` website.

The site is published using GitHub Pages. The main benefit of using GH Pages
is the workflow integration (pubshing to GH triggers an automatic update of the 
site being served)

The content of the sites are authored primarily as Markdown files, processed
with Jekyll to turn them into HTML/CSS. The main configuration is in the 
`_config.yml` file.

The output is in the `_site` directory. That directory is a Git **submodule** 
which is linked to the `cortex-js.github.io` repo. That repo is the one
published by GH Pages (for organization, only an entire repo can be published, 
for projects, the contents can be contained in a `/docs` directory).

Note: To initially create the submodule:
```bash
git submodule add -b master git@github.com:cortex-js/cortex-js.github.io.git _site
```

To get submodule (after doing a check-out, for example):
```bash
git submodule init
```

To manually update the submodule:
```bash
git submodule update --init
```

The `cortex-js.github.io` repo must also include two additional files:
- `.nojekyll` which indicates to GitHub that it should not process the content
of this repo with Jekyll (since this is already the output from Jekyll)
- `CNAME` with a content of `cortexjs.io`

Use the Settings tab in the `cortex-js.github.io` repo to indicate the use of
a custom domain.

In addition, the DNS entries for `cortexjs.io` must include the following:
- a CNAME record that points to `www.cortex-js.io` to `cortex-js.io` 
- Four A records that point to 
    - 185.199.108.153
    - 185.199.109.153
    - 185.199.110.153
    - 185.199.111.153


## Content

The `npm run build` command generates the documentation for the APIs 
from the TypeScript `.d.ts` files with .

The build process uses the `typedoc` tool to parse the API header files and 
output a `json` files in `_data/mathfield.json`.

The script then converts the `json` file into markdown in the `docs` folder,
which can then be processed by Jekyll with `script/cibuild` or `script/server`.

To output the appropriately formatted Markdown content, a custom theme for 
`typedoc` is used. This theme is defined in the `_typedoc_theme` directory.

The CSS styling information is defined in `_sass/typescript_doc.scss`.


The API documentation should follow the Google Documentation Style Guide
(https://developers.google.com/style/api-reference-comments)
 and https://developers.google.com/style
 
## Setup and scripts

Run 

```bash
script/bootstrap
```

On Windows (using PowerShell 7):
```
bash script/bootstrap
```

If getting network timeout errors:
```bash
gem install "jekyll" "minimal-mistakes-jekyll"  "jekyll-feed" "jekyll-include-cache"
bundle install
```

To do a local build:
```
script/server
```

To do a CI build
```
script/cibuild
```

### Test

The "testing" of the generated site consist of checking links, and that the 
generated HTML is valid, using the `html-proofer` gem. 

This require `libcurl`to be installed. On Windows, `curl` is installed by 
default, but not `libcurl`. See https://kwojcicki.github.io/blog/LIBCURL-JEKYLL.
Or use a Mac.


# ARCHIVES

See https://github.com/github/scripts-to-rule-them-all

## Setup
1. Install Ruby (https://www.ruby-lang.org/en/documentation/installation/#rubyinstaller)
2. Relaunch Terminal (to get the correct PATH variable)
2. Install Bundler
```bash
$ gem install bundler
$ gem install jekyll -v 3.8.5 # See https://pages.github.com/versions/ for correct version
$ gem update
```
If necessary, try:
```bash
$ gem install jekyll bundler
```

```bash
$ bundle install
$ bundle exec jekyll serve --incremental
```

## Updating
To stay up to date with GitHub:
```
$ bundle update github-pages
```
Also, check https://pages.github.com/versions for updated version of Jekyll, etc..

## Initial creation
Apparently a Gemfile is necessary for jekyll init to work. Try one with this
```
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
```


# TODO
- Add a CI/CD for the documentation. See https://jekyllrb.com/docs/continuous-integration/travis-ci/
- use htmlproofer gem link checking
```
#!/usr/bin/env bash
# halt script on error
set -e
# clean by deleting any existing output
rm -rf _site
# Build locally, then check links in built output
bundle exec jekyll build
# The url-ignore is optional depending on the links you have in the site
bundle exec htmlproofer ./_site --url-ignore "#"
```


- https://trianglify.io/p/w:1440!h:900!x:Blues!v:0.99!c:0.05!s:gluuoa
- https://trianglify.io/p/w:1440!h:900!x:random!v:0.99!c:0.06!s:gluuoa

## Splash Page Copy

Web Components for scientific exploration.

Math. Graphics. Programming.

A desktop environments tuned for iterative analysis, exploration.

Data visualization, modeling and simulation.

Computational intelligence.

Computational thinking.

Scientific Computing. Understand and solve complex problems.

Numerical analysis, modeling, 

Informatics & Data Science.