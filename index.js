const AsyncStreamEmitter = require('async-stream-emitter');

function createStreamEmit(originalEmitMethod) {
  return function streamEmit(eventName, ...args) {
    originalEmitMethod.apply(this, arguments);
    AsyncStreamEmitter.prototype.emit.call(this, eventName, args);
  }
}

function createStreamRemoveListener(originalRemoveListenerMethod) {
  return function streamRemoveListener(eventName, listener) {
    if (listener) {
      originalRemoveListenerMethod.apply(this, arguments);
    } else {
      AsyncStreamEmitter.prototype.removeListener.call(this, eventName);
    }
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
  let originalRemoveListenerMethod = object.removeListener;
  Object.assign(object, AsyncStreamEmitter.prototype);
  AsyncStreamEmitter.call(object);
  object.emit = createStreamEmit(originalEmitMethod);
  object.listenerCount = createStreamListenerCount(originalListenerCountMethod);
  object.removeListener = createStreamRemoveListener(originalRemoveListenerMethod);
  return object;
}

module.exports = eetase;
