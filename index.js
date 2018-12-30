const EventEmitter = require('events').EventEmitter;
const AsyncStreamEmitter = require('async-stream-emitter');

function createStreamEmit(originalEmitMethod) {
  return function streamEmit(eventName, ...args) {
    originalEmitMethod.apply(this, arguments);
    AsyncStreamEmitter.prototype.emit.call(this, eventName, args);
  }
}

function emtase(object) {
  let originalEmitMethod = object.emit;
  Object.assign(object, AsyncStreamEmitter.prototype);
  AsyncStreamEmitter.call(object);
  object.emit = createStreamEmit(originalEmitMethod);
}

module.exports = emtase;
