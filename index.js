'use strict';

var path = require('path');
var format = require('util').format;
var through = require('through2');
var marked = require('marked');
var hl = require('highlight.js');
var xtend = require('xtend');

var code = function(code, lang) {
  lang = lang === 'js' ? 'javascript' : lang;
  if (lang === 'html') {
    lang = 'xml';
  }

  return format('<div class="doc-highlight">' +
    '<pre><code class="%s">%s</code></pre></div>',
    lang || '',
    lang ? hl.highlight(lang, code).value :
      hl.highlightAuto(code).value);
};

var extensions = [
  '.md',
  '.mkd',
  '.markdown'
];

var stringify = function(contents) {
  return 'module.exports = ' + JSON.stringify(contents) + ';';
};

module.exports = function(file, options) {
  options = options || {};

  var isMarkdown = (function() {
    var ext = path.extname(file);

    return extensions.indexOf(ext) > -1 ||
      (options.extensions && options.extensions.indexOf(ext) > -1);
  })();

  if (!isMarkdown) {
    return through();
  }

  var chunks = [];
  var size = 0;
  var str = '';
  var write = function(chunk, encoding, callback) {
    chunks.push(chunk);
    size += chunk.length;
    str += chunk;

    callback();
  };

  var renderer = options.marked && options.marked.renderer;
  if (renderer) {
    renderer.code = code;
  } else {
    renderer = new marked.Renderer();
    renderer.code = code;
  }
  marked.setOptions(xtend({
    renderer: renderer,
    gfm: true,
    pedantic: true
  }, options.marked));

  var end = function(callback) {
    var data = Buffer.concat(chunks, size).toString();

    try {
      this.push(stringify(marked(data)));
    } catch (err) {
      this.emit('error', err);
    }

    callback();
  };

  return through(write, end);
};
