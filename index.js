/*!
 * deep-extend-stream | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/deep-extend-stream
*/
'use strict';

const {inspect} = require('util');

const deepExtend = require('deep-extend');
const {Transform} = require('stream');

module.exports = function deepExtendStream(target, cb) {
  if (typeof target === 'function') {
    cb = target;
    target = {};
  } else {
    if (cb && typeof cb !== 'function') {
      throw new TypeError(`${
        inspect(cb)
      } is not a function. The second argument to deep-extend-stream must be a function.`);
    }
    target = target || {};
  }

  const stream = new Transform({
    objectMode: true,
    transform(data, enc, done) {
      deepExtend(target, data);
      done();
    },
    flush(done) {
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
