const AsyncStreamEmitter = require('async-stream-emitter');

function createStreamEmit(originalEmitMethod) {
  return function streamEmit(eventName, ...args) {
    originalEmitMethod.apply(this, arguments);
    AsyncStreamEmitter.prototype.emit.call(this, eventName, args);
  }
}

function eetase(object) {
  // Prevent EventEmitter from throwing on error.
  object.on('error', () => {});

  let originalEmitMethod = object.emit;
  Object.assign(object, AsyncStreamEmitter.prototype);
  AsyncStreamEmitter.call(object);
  object.emit = createStreamEmit(originalEmitMethod);
  return object;
}

module.exports = eetase;
