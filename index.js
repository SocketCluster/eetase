const EventEmitter = require('events').EventEmitter;
const AsyncStreamEmitter = require('async-stream-emitter');

function emtase(object) {
  Object.keys(EventEmitter.prototype).forEach((methodName) => {
    let value = object[methodName];
    if (typeof value === 'function') {
      object[methodName] = function () {
        throw new Error('Cannot invoke an EventEmitter method on an object which was converted to an AsyncStreamEmitter via emtase');
      };
    } else {
      delete object[methodName];
    }
  });
  Object.assign(object, AsyncStreamEmitter.prototype);
  AsyncStreamEmitter.call(object);
}

module.exports = emtase;
