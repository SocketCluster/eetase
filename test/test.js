const assert = require('assert');
const emtase = require('../index');

const AsyncStreamEmitter = require('async-stream-emitter');
const EventEmitter = require('events').EventEmitter;

let pendingTimeoutSet = new Set();

function wait(duration) {
  return new Promise((resolve) => {
    let timeout = setTimeout(() => {
      pendingTimeoutSet.clear(timeout);
      resolve();
    }, duration);
    pendingTimeoutSet.add(timeout);
  });
}

function cancelAllPendingWaits() {
  for (let timeout of pendingTimeoutSet) {
    clearTimeout(timeout);
  }
}

describe('emtase', () => {
  let emitter;

  beforeEach(async () => {
    emitter = new EventEmitter();
    emtase(emitter);
  });

  afterEach(async () => {
    cancelAllPendingWaits();
  });

  it('should replace EventEmitter methods with AsyncStreamEmitter methods', async () => {
    assert.equal(!emitter._events, true);
    assert.equal(!emitter._eventsCount, true);
    assert.equal(!emitter._maxListeners, true);

    let error;
    try {
      emitter.getMaxListeners();
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.addListener('foo', () => {});
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.on('foo', () => {});
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.prependListener('foo', () => {});
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.once('foo', () => {});
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.prependOnceListener('foo', () => {});
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.removeListener('foo', () => {});
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.off('foo', () => {});
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.removeAllListeners('foo');
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.listeners('foo');
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.rawListeners('foo');
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.listenerCount('foo');
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    try {
      emitter.eventNames();
    } catch (err) {
      error = err;
    }
    assert.notEqual(error, null);

    assert.equal(!!emitter.emit, true);
    assert.equal(!!emitter.listener, true);
    assert.equal(!!emitter.closeListener, true);
    assert.equal(!!emitter.closeAllListeners, true);
  });

  it('should support AsyncStreamEmitter functionality', async () => {
    (async () => {
      for (let i = 0; i < 10; i++) {
        await wait(10);
        emitter.emit('foo', 'hello' + i);
      }
      emitter.closeListener('foo');
    })();

    let receivedData = [];
    for await (let data of emitter.listener('foo')) {
      receivedData.push(data);
    }
    assert.equal(receivedData.length, 10);
    assert.equal(receivedData[0], 'hello0');
    assert.equal(receivedData[9], 'hello9');

    (async () => {
      for (let i = 0; i < 20; i++) {
        await wait(10);
        emitter.emit('bar', 'hi' + i);
      }
      emitter.closeAllListeners();
    })();

    receivedData = [];
    for await (let data of emitter.listener('bar')) {
      receivedData.push(data);
    }
    assert.equal(receivedData.length, 20);
    assert.equal(receivedData[0], 'hi0');
    assert.equal(receivedData[19], 'hi19');

    (async () => {
      await wait(10);
      emitter.emit('test', 'abc');
    })();

    let data = await emitter.listener('test').once();
    assert.equal(data, 'abc');
  });
});
