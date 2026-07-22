'use strict';

const http = require('http');

// Request router for the demo app.
//
// The `/health` route is intentionally ABSENT — adding it is the demo feature (003-health):
// `/forge:implement` drives tdd-engineer to write a RED test, then impl-engineer to make it GREEN.
function handler(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('btg-forge demo app');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

const server = http.createServer(handler);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`listening on ${port}`));
}

module.exports = { handler, server };
