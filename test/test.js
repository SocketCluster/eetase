const assert = require('assert');
const emtase = require('../index');

const AsyncStreamEmitter = require('async-stream-emitter');
const EventEmitter = require('events').EventEmitter;

describe('emtase', () => {
  let emitter;

  beforeEach(async () => {
    emitter = new EventEmitter();
  });

  it('should convert an EventEmitter instance into an AsyncStreamEmitter', async () => {
    emtase(emitter);

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
});
