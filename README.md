# markedify

[![NPM version](https://img.shields.io/npm/v/markedify.svg?style=flat-square)](https://www.npmjs.com/package/markedify)
[![Build Status](https://img.shields.io/travis/minwe/markedify.svg?style=flat-square)](https://travis-ci.org/minwe/markedify)

[Browserify](https://github.com/substack/node-browserify) transform for markdown, uses [marked][] as parser and [highlight.js](https://github.com/isagalaev/highlight.js) for code highlighting.

```js
var mdContent = require('path/to/filename.md');

// mdContent is parsed to HTML and stringify, you can use it in your js now.
```

## Installation

```
npm install --save-dev markedfiy
```

## Usage

### CLI

```
browserify main.js -t markedify --outfile bundle.js
```

### Node

```js
var browserify = require('browserify');
var markedify = require('markedify');
var fs = require('fs');

browserify('./main.js', {debug: true})
  .transform(markedify)
  .bundle()
  .on('error', function (err) {console.log('Error: ' + err.message); })
  .pipe(fs.createWriteStream('bundle.js'));
```

### Custom Markdown Renderer

Read [marked docs][marked] for more details.

```js
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');
var markedify = require('markedify');
var marked = require('marked');
var highlight = require('highlight.js')

marked.setOptions({
  highlight: function(code, lang) {
    return highlight.highlight(lang, code).value;
  }
});

var renderer = new marked.Renderer();
var markedOptions = {
  renderer: renderer,
};

browserify(path.join(__dirname, 'file.js'))
.transform(markedify, {marked: markedOptions})
.bundle()
.on('error', function(err) { console.log('ERROR: ' + err); })
.pipe(fs.createWriteStream(path.join(__dirname, 'docs-compiled.js')));
```

[marked]:https://github.com/chjj/marked
