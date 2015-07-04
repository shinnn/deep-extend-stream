/*!
 * deep-extend-stream | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/deep-extend-stream
*/
'use strict';

var deepExtend = require('deep-extend');
var Transform = require('readable-stream/transform');

module.exports = function deepExtendStream(target, cb) {
  if (typeof target === 'function') {
    cb = target;
    target = {};
  } else {
    if (cb && typeof cb !== 'function') {
      throw new TypeError(
        cb +
        ' is not a function. The second argument to deep-extend-stream must be a function.'
      );
    }
    target = target || {};
  }

  var stream = new Transform({
    objectMode: true,
    transform: function deepExtendTransform(data, enc, done) {
      deepExtend(target, data);
      done();
    },
    flush: function deepExtendFlush(done) {
      this.push(target);
      if (cb) {
        cb(target);
      }
      done();
    }
  });

  stream._target = target;

  return stream;
};
