# deep-extend-stream

[![NPM version](http://img.shields.io/npm/v/deep-extend-stream.svg)](https://www.npmjs.com/package/deep-extend-stream)
[![Build Status](http://img.shields.io/travis/shinnn/deep-extend-stream.svg)](https://travis-ci.org/shinnn/deep-extend-stream)
[![Build status](https://ci.appveyor.com/api/projects/status/1im5lixtp38ecg97?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/deep-extend-stream)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/deep-extend-stream.svg)](https://coveralls.io/r/shinnn/deep-extend-stream)
[![Dependency Status](https://img.shields.io/david/shinnn/deep-extend-stream.svg?label=deps)](https://david-dm.org/shinnn/deep-extend-stream)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/deep-extend-stream.svg?label=devDeps)](https://david-dm.org/shinnn/deep-extend-stream#info=devDependencies)

Recursively extend the object in a stream

```javascript
const deepExtend = require('deep-extend-stream');

const target = {foo: {bar: 123}};
const deepExtendStream = deepExtend(target);

deepExtendStream.write({foo: {baz: 'Hello'}});
deepExtendStream.write({qux: 'World'});

deepExtendStream.on('finish', () => {
  target; //=> {foo: {bar: 123, baz: 'Hello'}, qux: 'World'}
});

deepExtendStream.end();
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install deep-extend-stream
```

## API

```javascript
const deepExtend = require('deep-extend-stream');
```

### deepExtend([*target*,] [*callback*])

*target*: `Object` or `Array`  
*callback*: `Function`  
Return: `Object` ([stream.Transform](https://iojs.org/api/stream.html#stream_class_stream_transform_1))

It returns a transform stream that recursively extends the target object with passed objects (what is called "deep extend").

Target object is optional (`{}` by default).

```javascript
const deepExtend = require('deep-extend-stream');
const deepExtendStream = deepExtend();

deepExtendStream
.on('finish', function() {
  // this._target is an internal property to keep target object
  this._target;
  /*=> {
    '0': 'a',
    '1': {
      b: 'c',
      d: 'e'
    },
    '2': 'f'
  } */
})
.write(['a', {'b': 'c'}, 'f'])
.write({'1': {'d': 'e'}})
.end();
```

#### callback(target)

You can specify a function to be called on [`finish`](https://iojs.org/api/stream.html#stream_events_finish_and_end) event. It will be called with the target object as its first argument.

```javascript
const deepExtend = require('deep-extend-stream');

deepExtend(target => {
  target; //=> [0, 1, 2]
}).end([0, 1, 2]);

deepExtend([0, 1, 2], target => {
  target; //=> [0, 1, 2]
}).end();
```

## License

Copyright (c) 2014 - 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
