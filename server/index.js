// Backend de demostración sin dependencias externas. Guarda productos, categorías y pedidos.
import http from 'node:http';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initialProducts } from '../src/data/products.js';
import { initialCategories } from '../src/data/database.js';

const dbFile = join(dirname(fileURLToPath(import.meta.url)), 'db.json');
function readDatabase() {
  if (!existsSync(dbFile)) return { products: initialProducts, categories: initialCategories, orders: [] };
  try { return JSON.parse(readFileSync(dbFile, 'utf8')); }
  catch { return { products: initialProducts, categories: initialCategories, orders: [] }; }
}
function respond(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': 'http://localhost:5173' });
  res.end(JSON.stringify(data));
}
async function handle(req, res) {
  const url = req.url.split('?')[0];
  if (req.method === 'GET' && url === '/api/data') return respond(res, 200, readDatabase());
  const collection = { '/api/products': 'products', '/api/categories': 'categories', '/api/orders': 'orders' }[url];
  if (req.method !== 'PUT' || !collection) return respond(res, 404, { error: 'Ruta no encontrada' });
  try {
    let body = '';
    for await (const chunk of req) {
      body += chunk.toString();
      if (body.length > 1_000_000) return respond(res, 413, { error: 'Datos demasiado grandes' });
    }
    const rows = JSON.parse(body);
    if (!Array.isArray(rows) || rows.length > 1000) return respond(res, 400, { error: 'Se esperaba una lista' });
    const database = readDatabase();
    database[collection] = rows;
    writeFileSync(dbFile, JSON.stringify(database, null, 2));
    return respond(res, 200, { ok: true, count: rows.length });
  } catch { return respond(res, 400, { error: 'JSON inválido' }); }
}
const server = http.createServer(handle);
const port = Number(process.env.PORT) || 3001;
if (process.argv[1] === fileURLToPath(import.meta.url)) server.listen(port, () => console.log(`Backend HuertoHogar: http://localhost:${port}/api/data`));
export { server, handle };
