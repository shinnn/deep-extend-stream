/*!
 * deep-extend-stream | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/deep-extend-stream
*/
'use strict';

var deepExtend = require('deep-extend');
var through = require('through2');

module.exports = function deepExtendStream(target, cb) {
  if (typeof target === 'function') {
    cb = target;
    target = {};
  } else {
    if (cb && typeof cb !== 'function') {
      throw new TypeError('must be a function');
    }
    target = target || {};
  }

  function deepExtendTransform(data, enc, done) {
    deepExtend(target, data);
    done();
  }

  function deepExtendFlush(done) {
    this.push(target);
    if (cb) {
      cb(target);
    }
    done();
  }

  var stream = through.obj(deepExtendTransform, deepExtendFlush);
  stream._target = target;

  return stream;
};
