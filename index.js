const AsyncStreamEmitter = require('async-stream-emitter');

function emtase(object) {
  Object.assign(object, AsyncStreamEmitter.prototype);
  AsyncStreamEmitter.call(object);
}

module.exports = emtase;
