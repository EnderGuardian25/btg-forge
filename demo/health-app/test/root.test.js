'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { handler } = require('../src/server');

// Minimal fake ServerResponse that captures status, headers, and body — lets us
// exercise the handler directly without binding a socket.
function fakeRes() {
  return {
    statusCode: null,
    headers: null,
    body: '',
    writeHead(code, headers) {
      this.statusCode = code;
      this.headers = headers;
    },
    end(chunk) {
      if (chunk) this.body += chunk;
    },
  };
}

test('GET / returns 200', () => {
  const res = fakeRes();
  handler({ method: 'GET', url: '/' }, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body, 'btg-forge demo app');
});

test('unknown route returns 404', () => {
  const res = fakeRes();
  handler({ method: 'GET', url: '/nope' }, res);
  assert.strictEqual(res.statusCode, 404);
});

// NOTE: the GET /health test is deliberately NOT here. The demo's `/forge:implement`
// step has tdd-engineer add it (RED), then impl-engineer makes it GREEN.
module.exports = { fakeRes };
