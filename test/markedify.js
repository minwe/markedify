'use strict';

var assert = require('assert');
var browserify = require('browserify');
var marked = require('marked');
var markedify = require('../index');
var xtend = require('xtend');

/* global describe,it */
describe('markedify', function() {
  function bundle(entry, options, cb) {
    return browserify(xtend({
      entries: [entry],
      basedir: __dirname
    }, options || {}))
      .transform(markedify)
      .bundle(cb);
  };

  it('works for require *.md', function(done) {
    bundle('./fixtures/main.js', null, function(err, result) {
      assert(!err);
      assert(result);
      assert.equal(result.toString().
        indexOf('<h1 id=\\"title\\">title</h1>') > -1, true);
      done();
    });
  });

  it('works for custom extension *.mkd', function(done) {
    bundle('./fixtures/mkd.js', {extension: ['mkd']}, function(err, result) {
      assert(!err);
      assert(result);
      assert.equal(result.toString().
        indexOf('<h1 id=\\"title\\">title</h1>') > -1, true);
      done();
    });
  });

  it('works for custom renderer', function(done) {
    var renderer = new marked.Renderer;
    var rendererHeading = renderer.heading;

    renderer.heading = function(text, level) {
      return 'HEADING_CUSTOM_RENDERER' + rendererHeading.apply(this, arguments);
    };

    renderer.code = function(text, lang) {
      return '<pre class="code-highlight">' + text + '</pre>';
    };

    browserify({
      entries: ['./fixtures/main.js'],
      basedir: __dirname
    })
      .transform([markedify, {marked: {renderer: renderer}}])
      .bundle(function(err, result) {
        if (err) return done(err);
        assert(result.toString().
          indexOf('<h1 id=\\"title\\">title</h1>') > -1);
        assert(result.toString().indexOf('HEADING_CUSTOM_RENDERER') > -1);
        assert(result.toString().indexOf('code-highlight') > -1);
        done();
      });
  });
});
