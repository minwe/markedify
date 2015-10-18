'use strict';

var assert = require('assert');
var browserify = require('browserify');
var markedify = require('../index');
var marked = require('marked');
var xtend = require('xtend');

/* global describe,it */
describe('markedify', function(){
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

  it('allows custom renderer', function() {
    var renderer = new marked.Renderer;
    var rendererHeading = renderer.heading;
    renderer.heading = function(text, level) {
      return 'ALLOWS_CUSTOM_RENDERER' + rendererHeading.apply(this, arguments);
    };

    browserify('./fixtures/main.js', {
      basedir: __dirname
    })
    .transform([ markedify, { marked: { renderer: renderer } } ])
    .bundle(function(err, result) {
      if (err) return done(err);
      assert(result.toString().
          indexOf('<h1 id=\\"title\\">title</h1>') > -1);
      assert(result.toString().indexOf('ALLOWS_CUSTOM_RENDERER') !== -1);
      done();
    });
  })
});
