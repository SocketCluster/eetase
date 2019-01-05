# eetase
EventEmitter to AsyncStreamEmitter converter.

Allows an `EventEmitter` (https://nodejs.org/api/events.html#events_class_eventemitter) to be used as an `AsyncStreamEmitter` (https://github.com/SocketCluster/async-stream-emitter).
Keeps original `EventEmitter` functionality.

## Installation

```bash
npm install eetase
```

## Usage example

```js
const eetase = require('eetase');
const http = require('http');

// The Node.js HTTP server is an EventEmitter.
// Normally works using server.on('request', handler);
let server = http.createServer();

// Mutates the server instance but doesn't touch
// the instance's prototype.
eetase(server);

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
