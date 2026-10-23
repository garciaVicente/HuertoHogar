# 🌱 HuertoHogar React · Evaluación Parcial 2 (Anexo 1)

Continuación académica de [HuertoHogar original](https://github.com/uretam/huertohogar-frontend), anteriormente creado con HTML/CSS/JS. Migrado a **React + Vite + Bootstrap**, con **Jasmine + Karma**.

## Requisitos
Node.js 20 o 22, npm y Google Chrome (para Karma).

## Inicio más simple — solo frontend
```bash
npm install
npm run dev
```
Abre http://localhost:5173. Funciona **sin backend** con datos simulados en `src/data/database.js` y `localStorage`.

## Con frontend y backend (dos terminales)
Terminal 1:
```bash
npm run server
```
Terminal 2:
```bash
npm run dev
```
Abre http://localhost:5173. React consulta `/api/data` mediante proxy Vite hacia http://localhost:3001/api/data. El servidor guarda `products`, `categories` y `orders` en `server/db.json` (archivo generado; no subir a GitHub). Si el servidor está detenido, la tienda sigue usando almacenamiento local.

**No son pagos reales ni autenticación segura**: proyecto didáctico. Evita introducir información personal real.

## Pruebas y compilación
```bash
npm test               # 28 pruebas frontend Jasmine/Karma
npm run test:coverage  # cobertura HTML -> coverage/html/index.html
npm run test:server    # prueba HTTP nativa de Node
npm run build          # compilar para distribución
```
Las pruebas frontend requieren Chrome/Chromium; deben ejecutarse en el equipo del estudiante con las dependencias npm instaladas. `npm run test:server` no necesita dependencias externas.

## Vistas
- Tienda: inicio, productos, detalle, **categorías**, **ofertas**, blog, artículos, nosotros, contacto, registro, login y perfil.
- Compra: carrito, **checkout**, compra aprobada y pago rechazado con resumen del pedido (simulaciones).
- Administración: dashboard, órdenes/boletas simuladas, productos CRUD, categorías CRUD, usuarios locales (crear, editar y eliminar), productos críticos, reportes y perfil informativo.

## Estructura
```text
src/
  App.jsx                   # Rutas y estado principal
  components/               # Header y ProductCard (props)
  pages/                    # Tienda, checkout, formularios, administración y perfil
  data/products.js          # Seis productos originales y precios en pesos
  data/database.js          # Datos simulados + funciones CRUD
  utils/storage.js          # Carrito, descuentos y total
  utils/validation.js       # Reglas de formularios
  utils/api.js              # Comunicación opcional con backend
server/index.js             # API HTTP y persistencia JSON (demo)
tests/                      # 28 casos frontend Jasmine/Karma
karma.conf.cjs              # Configuración del runner y cobertura
docs/ERS.docx               # Especificación de requisitos V2
docs/COBERTURA_TESTING.docx # Matriz, métricas y evidencias
docs/GUION_DEFENSA.md       # Guion de exposición
```

## Verificación simple del anexo
| Requisito | Evidencia |
|---|---|
| Migración HTML → React | `src/pages`, `src/components`, `App.jsx` |
| Props/state | `ProductCard.jsx`, `ShopPages.jsx`, `CheckoutPages.jsx` |
| Archivo JS + CRUD | `data/database.js` y panel de administración (incluye stock) |
| Persistencia | `localStorage` y servidor Node opcional |
| Bootstrap | `main.jsx`, `container`, `row`, `table-responsive` |
| Categorías y ofertas | `/categorias`, `/ofertas` |
| Checkout y dos resultados | `/checkout`, `/compra/exito/:id`, `/compra/error/:id` |
| Administración | `/admin` con siete pestañas |
| Pruebas Jasmine/Karma | `tests/*.spec.jsx` (28 casos escritos) |
| Documentación | `docs/ERS.*`, `docs/COBERTURA_TESTING.*` |



