# emtase
EventEmitter to AsyncStreamEmitter converter.

Converts an `EventEmitter` object into a `AsyncStreamEmitter` at runtime.

## Installation

```bash
npm install emtase
```

## Usage example

```
const emtase = require('emtase');
const http = require('http');

// The Node.js HTTP server is an EventEmitter.
// Normally works using server.on('request', handler);
let server = http.createServer();

// ...

emtase(server);

// ...

// The Node.js HTTP server now works as an
// AsyncStreamEmitter
(async () => {
  for await (let req of server.listener('request')) {
    // ...
  }
})();
```
