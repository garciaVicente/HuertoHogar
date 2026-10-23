import test from 'node:test';
import assert from 'node:assert/strict';
import { server } from './index.js';

test('GET /api/data responde con catálogo, categorías y pedidos', async () => {
  await new Promise(resolve => server.listen(0, resolve));
  try {
    const port = server.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/api/data`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(Array.isArray(body.products), true);
    assert.equal(Array.isArray(body.categories), true);
    assert.equal(Array.isArray(body.orders), true);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
