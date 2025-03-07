const sass = require('sass');
const fs = require('fs-extra');
const path = require('path');
const hljs = require('highlight.js'); // https://highlightjs.org/
// const eleventyToc = require('./eleventy-toc.js');
const pluginTOC = require('eleventy-plugin-toc');

function buildSass(srcDir, destDir) {
  fs.mkdir(destDir, { recursive: true });

  // Compile all the .scss files in ./src/_sass
  fs.readdir(srcDir, (_err, files) => {
    files.forEach((file) => {
      if (path.extname(file) == '.scss') {
        const p = path.parse(path.join(destDir, file));
        p.base = undefined;
        p.ext = '.css';
        // console.log('Compiling "' + srcDir + file + '" to "' + path.format(p));

        // Encapsulate rendered css from scssPath into result variable
        const result = sass.compile(path.join(srcDir, file));
        // Create cssPath directory recursively
        // Then write result css string to cssPath file
        fs.writeFile(path.format(p), result.css.toString()).catch((error) =>
          console.error(error)
        );
      }
    });
  });
}

module.exports = function (eleventyConfig) {
  // add as a valid template language to process, e.g. this adds to --formats
  // eleventyConfig.addTemplateFormats('scss');

  // eleventyConfig.addExtension('scss', {
  //   outputFileExtension: 'css', // optional, default: "html"

  //   // can be an async function
  //   compile: function (inputContent, inputPath) {
  //     let parsed = path.parse(inputPath);
  //     if (parsed.base.startsWith('_')) {
  //       return (data) => {
  //         return '';
  //       };
  //     }
  //     // let result = sass.compileString(inputContent, {
  //     //   loadPaths: [parsed.dir ?? '.', this.config.dir.includes],
  //     // });
  //     const result = sass.renderSync({
  //       file: inputPath,
  //       includePaths: ['./src/_sass/imports'],
  //     });

  //     return (data) => {
  //       return result.css.toString();
  //     };
  //   },
  // });

  buildSass('./src/_sass/', './src/build/css');

  // Use a custom hljs JavaScript grammar that fixes the parsing of
  // "evaluate" (have submitted a PR)
  hljs.unregisterLanguage('js');
  hljs.registerLanguage('js', require('./hljs-javascript.js'));

  const markdownIt = require('markdown-it');
  // const markdownItAttrs = require('markdown-it-attrs');
  // let markdownItEmoji = require('markdown-it-emoji');
  let options = {
    // See https://markdown-it.github.io/markdown-it/
    html: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (err) {
          console.log(err);
        }
      }

      return ''; // use external default escaping
    },
  };

  const md = markdownIt(options).use(require('markdown-it-deflist'));

  md.use(require('markdown-it-attrs'), {
    // optional, these are default options
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: [], // empty array = all attributes are allowed
  });

  // See https://github.com/valeriangalliat/markdown-it-anchor
  md.use(require('markdown-it-anchor'));

  md.use(require('markdown-it-multimd-table'), {
    multiline: true,
    rowspan: true,
    headerless: true,
  });

  eleventyConfig.addPlugin(pluginTOC, {
    wrapper: 'div',
    wrapperClass: 'toc__menu',
  });

  eleventyConfig.setLibrary('md', md);

  eleventyConfig.setTemplateFormats(['json', 'html', 'md']);

  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.setQuietMode(true);

  // {{ variable | jsonify }}
  eleventyConfig.addFilter('jsonify', (variable) => JSON.stringify(variable));

  eleventyConfig.addShortcode('icon', function (name, colorName) {
    let color = '';
    if (colorName) {
      if (colorName.startsWith('#')) color = ` style="color:${colorName})"`;
      else color = ` style="color:var(--${colorName})"`;
    }
    return `<svg class="icon1em"${color}><use xlink:href="/assets/icons.svg#${name}"></use></svg>`;
  });

  eleventyConfig.addShortcode('tags', function (...names) {
    const cls = {
      numeric: 'numeric',
      constructor: 'constructor',
      logical: 'predicate',
      predicate: 'predicate',
      inert: 'inert',
    };
    let wrapClass = 'tags';
    if (names.includes('float-right')) wrapClass += ' float-right';
    return `<span class='${wrapClass}'>${names
      .filter((x) => x !== 'float-right')
      .map((x) => `<span class='tag ${cls[x] ?? ''}'>${x}</span>`)
      .join('')}</span>`;
  });

  eleventyConfig.addPairedLiquidShortcode('defs', (content, col1, col2) => {
    return `${content}`;
  });

  eleventyConfig.addPairedLiquidShortcode('def', (content, name) => {
    return `<h3 class="visually-hidden" id="${name}" tabindex="-1">${name}</h3><div class="defs"><div class="def">${md.render(
      content
    )}</div></div>`;
  });

  eleventyConfig.addShortcode('latex', (content) => {
    return `<div class='latex'><div class="source">${content}</div><div class="display">\\[ ${content} \\]</div></div>`;
  });

  // eleventyConfig.addShortcode('latex-col', (content) => {
  //   return `<div class='latex column'><div class="source">${content}</div><div class="display">\\[ ${content} \\]</div></div>`;
  // });

  eleventyConfig.addPairedLiquidShortcode('latex-col', (content) => {
    return `<div class='latex column'><div class="source">${content.trim()}</div><div class="display">\\[ ${content} \\]</div></div>`;
  });

  eleventyConfig.addPairedLiquidShortcode('readmore', (content, url) => {
    return `<div class='read-more'><a href="${url}">${md.renderInline(
      content
    )}<svg class="svg-chevron"><use xlink:href="#svg-chevron"></use></svg></a></div>`;
  });

  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
    root: ['./src/_includes', './src'],
  });

  // Copy the `assets` directory to the compiled site folder
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy({ 'src/build/assets': 'assets' });

  // // Copy the `src/build` directory to the compiled site folder
  eleventyConfig.addPassthroughCopy({ 'src/build/css': 'assets/css' });

  eleventyConfig.addPassthroughCopy({ 'src/build/js': 'js' });

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addWatchTarget('./src/build/css/**/*.css');

  // eleventyConfig.addWatchTarget(
  //   './submodules/compute-engine/src/docs/**/*.{css,md,html}'
  // );
  // eleventyConfig.addWatchTarget('./src/_sass/**/*.{js,scss}');

  return {
    passtroughFileCopy: true,
    dir: {
      input: './src',
      output: './submodules/cortex-js.github.io',
      includes: '_includes/',
      layouts: '_layouts', // dir.input + '/_includes' by default
    },
  };
};
