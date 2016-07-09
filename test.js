'use strong';

const arrayStream = require('stream-array');
const deepExtend = require('./');
const test = require('tape');

test('deepExtendStream()', t => {
  t.plan(9);

  t.equal(deepExtend.name, 'deepExtendStream', 'should have a function name.');

  const targetObject = {foo: [0, 0], bar: {a: [1]}, baz: ['3']};
  const stream = deepExtend(targetObject, obj => {
    t.deepEqual(
      obj,
      {foo: 0, bar: {a: [1], b: '2'}, baz: ['3']},
      'should extend the object.'
    );
    t.strictEqual(targetObject, obj, 'should directly pass the target object to the callback.');
  });

  stream.write({foo: 0});
  stream.end({bar: {b: '2'}});

  const targetArray = ['b'];
  const stream2 = arrayStream([{1: false}, {'1_': true}, ['a', 'b', 'c']])
  .on('end', () => {
    const expected = ['b', false];
    expected['1_'] = true;
    t.deepEqual(targetArray, expected, 'should regard the second argument as optional.');
  });
  stream2.pipe(deepExtend(targetArray));
  stream2.pipe(deepExtend({4: null}, obj => {
    t.deepEqual(obj, {
      1: false,
      '1_': true,
      4: null
    }, 'should work as a transform stream.');
  }));

  arrayStream([{a: true}, {a: undefined}, {a: undefined}]).pipe(deepExtend(obj => {
    t.deepEqual(
      obj,
      {a: undefined},
      'should use default value when the first argument is not a function.'
    );
  }));

  deepExtend(undefined).on('finish', function() {
    t.deepEqual(
      this._target,
      {},
      'should use default value when the first argument is false value.'
    );
  }).end();

  deepExtend().on('finish', function() {
    t.deepEqual(this._target, {}, 'should work even if it takes no arguments.');
  }).end();

  t.throws(
    () => deepExtend('string', ['not function']),
    /^TypeError.*\[ 'not function' \] is not a function\. .*must be a function\./,
    'should throw a type error when the second argument is not a function.'
  );
});
