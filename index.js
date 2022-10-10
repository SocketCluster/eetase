const AsyncStreamEmitter = require('async-stream-emitter');

function createStreamEmit(originalEmitMethod) {
  return function streamEmit(eventName, ...args) {
    originalEmitMethod.apply(this, arguments);
    AsyncStreamEmitter.prototype.emit.call(this, eventName, args);
  }
}

function createStreamListenerCount(originalListenerCountMethod) {
  return function streamListenerCount(eventName) {
    let eventListenerCount = originalListenerCountMethod.apply(this, arguments);
    let streamConsumerCount = this.getListenerConsumerCount(eventName);
    return eventListenerCount + streamConsumerCount;
  }
}

function eetase(object) {
  // Prevent EventEmitter from throwing on error.
  object.on('error', () => {});

  let originalEmitMethod = object.emit;
  let originalListenerCountMethod = object.listenerCount;
  Object.assign(object, AsyncStreamEmitter.prototype);
  AsyncStreamEmitter.call(object);
  object.emit = createStreamEmit(originalEmitMethod);
  object.listenerCount = createStreamListenerCount(originalListenerCountMethod);
  return object;
}

module.exports = eetase;
