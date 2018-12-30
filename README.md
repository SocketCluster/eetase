# emtase
EventEmitter to AsyncStreamEmitter converter.

Allows an `EventEmitter` to be used as an `AsyncStreamEmitter` at runtime.
Keeps original `EventEmitter` functionality.

## Installation

```bash
npm install emtase
```

## Usage example

```js
const emtase = require('emtase');
const http = require('http');

// The Node.js HTTP server is an EventEmitter.
// Normally works using server.on('request', handler);
let server = http.createServer();

// Mutates the server instance but doesn't touch
// the instance's prototype.
emtase(server);

// ...

// The Node.js HTTP server now works as an
// AsyncStreamEmitter
(async () => {
  // Use array destructuring to get the req object.
  // This is needed because emitter.emit(eventName, ...)
  // can have multiple arguments.
  for await (let [req] of server.listener('request')) {
    // ...
  }
})();
```
