'use strict';

var assert = require('assert');
var browserify = require('browserify');
var markedify = require('../index');
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
});
