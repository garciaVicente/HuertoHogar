# ERS V2 — HuertoHogar (React + Anexo 1)
**Asignatura:** DSY1104 Desarrollo Fullstack II  
**Evaluación:** Parcial 2 (30%)  
**Versión:** 2.1 · 21-10-2026  
**Proyecto base:** https://github.com/uretam/huertohogar-frontend

## 1. Propósito
Continuar la tienda de productos naturales HuertoHogar originalmente implementada en HTML, CSS y JavaScript, migrando sus vistas a componentes React reutilizables, manteniendo el catálogo y carrito, y agregando los flujos propuestos en **Anexo 1: Instrucciones Evaluación 2**.

## 2. Alcance y usuarios
- **Visitante:** navega, busca, consulta categorías, ofertas y artículos, agrega productos y simula una compra.
- **Cliente:** puede registrar una cuenta de demostración, iniciar sesión, consultar pedidos simulados y editar su nombre.
- **Administrador de demostración:** accede a un panel con dashboard, productos, categorías, pedidos, usuarios, productos críticos, reportes y perfil. El panel no posee autenticación/autorización real.

## 3. Requisitos funcionales y rutas
| ID | Requisito | Ruta o código | Prioridad |
|---|---|---|---|
| RF01 | Inicio y destacados originales | `/` | Alta |
| RF02 | Catálogo, búsqueda y filtros | `/productos` | Alta |
| RF03 | Detalle de producto | `/productos/:id` | Alta |
| RF04 | Carrito: agregar, aumentar, reducir, quitar y limpiar | `/carrito` | Alta |
| RF05 | Vista de categorías y productos por categoría | `/categorias`, `/categorias/:category` | Alta |
| RF06 | Productos en oferta con precio rebajado | `/ofertas` | Alta |
| RF07 | Checkout: nombre, apellido, correo, dirección, región, comuna, entrega | `/checkout` | Alta |
| RF08 | Confirmación con pedido, total y datos de cliente | `/compra/exito/:id` | Alta |
| RF09 | Mensaje de rechazo con reintento y pedido | `/compra/error/:id` | Alta |
| RF10 | Inicio de sesión, registro y cierre de sesión de demostración | `/login`, `/registro` | Media |
| RF11 | Consulta y edición básica de perfil e historial | `/perfil` | Media |
| RF12 | Contacto con validaciones | `/contacto` | Media |
| RF13 | Nosotros, blog y dos artículos | `/nosotros`, `/blogs`, `/blogs/:id` | Media |
| RF14 | Dashboard y consulta de pedidos | `/admin`, pestañas Dashboard/Órdenes | Alta |
| RF15 | Productos: crear, consultar, actualizar, eliminar, descuento | `/admin`, pestaña Productos | Alta |
| RF16 | Categorías: crear, consultar, actualizar nombre, eliminar si no tiene productos | `/admin`, pestaña Categorías | Alta |
| RF17 | Usuarios: crear, consultar, editar nombre y eliminar cuentas locales de demo | `/admin`, pestaña Usuarios | Media |
| RF18 | Reporte de ventas/estado y unidades vendidas | `/admin`, pestaña Reportes | Media |
| RF19 | Perfil administrativo demostrativo | `/admin`, pestaña Perfil | Baja |
| RF20 | Persistencia de datos mediante fuente JS con CRUD | `src/data/database.js`, `localStorage` | Alta |
| RF21 | Sincronización opcional con backend Node local para productos, categorías y pedidos | `server/index.js`, `/api/data` | Media |

## 4. Requisitos no funcionales
| ID | Requisito | Evidencia |
|---|---|---|
| RNF01 | SPA desarrollada con React | `src/App.jsx`, componentes con props y hooks |
| RNF02 | Responsiva con Bootstrap | `container`, `row`, `col-sm-*`, `col-lg-*`, `table-responsive` |
| RNF03 | Navegación sin recargas completas | React Router |
| RNF04 | Archivos separados por responsabilidad | `src/components`, `src/pages`, `src/data`, `src/utils` |
| RNF05 | Formularios validados con mensajes visibles | `src/utils/validation.js` |
| RNF06 | Pruebas de render, props, state, eventos y mocks | Jasmine + Karma y React Testing Library |
| RNF07 | Informe de cobertura medible | Istanbul y `karma-coverage`, salida `coverage/html` |
| RNF08 | Accesibilidad mínima | Etiquetas, `aria-label`, mensaje de estado, imagen con alt |
| RNF09 | Backend mínimo para demostración integrada | Node `http` y `server/db.json`; no depende de librerías |

## 5. Reglas del negocio
1. Precios en CLP. Descuento porcentual permitido entre 0 % y 90 %; `salePrice` redondea al peso.
2. El precio rebajado se incorpora a la línea del carrito cuando se agrega el producto.
3. Cantidad cero elimina el ítem. Un pedido captura una copia de los productos y precios al confirmar.
4. El checkout requiere nombre, apellido, correo válido, calle, región y comuna; departamento e indicaciones son opcionales. Si hay sesión local, precarga nombre y correo, y recuerda los datos de entrega desde el último checkout de ese navegador.
5. El pago es **simulado**. El usuario elige resultado aprobado o rechazado. Aprobado limpia el carrito; rechazado mantiene el carrito para reintentar.
6. Categorías con productos asociados no se pueden eliminar desde la interfaz.
7. El administrador puede visualizar productos críticos (stock menor o igual a cinco).
8. La edición de una categoría modifica su nombre visible, no su ID, para conservar relaciones.
9. Un pedido registra fecha, número HH-…, estado, cliente, líneas y total; no genera boletas legales.

## 6. Flujos principales
**CU01 — Compra aprobada:** inicio → catálogo/categoría/oferta → detalle → carrito → checkout → datos válidos → simular aprobación → guardar pedido pagado → limpiar carrito → resumen de compra.

**CU02 — Compra rechazada:** carrito → checkout → datos válidos → simular rechazo → guardar pedido rechazado → mostrar error y detalle → reintentar con carrito preservado.

**CU03 — CRUD de producto:** panel administrativo → productos → crear producto → listar → editar precio, descripción y descuento → eliminar producto.

**CU04 — Administración:** panel → ver dashboard → consultar y actualizar estado de pedidos → administrar categorías → consultar usuarios → reportes agregados → perfil.

**CU05 — Contacto:** ingresar datos → validar → mostrar errores o confirmación local.

## 7. Arquitectura y modelo de datos
**Frontend:** navegador → Vite/React Router → páginas y componentes → `database.js` (CRUD de arreglos) → `localStorage`.  
**Backend opcional para exposición:** React → `apiRequest` → proxy Vite `/api` → Node HTTP puerto 3001 → `server/db.json`. El backend intercambia JSON de `products`, `categories` y `orders`; si no se ejecuta, se sigue usando `localStorage`.

**Producto:** `{id,name,category,price,discount,stock,image,description}`.  
**Categoría:** `{id,name}`.  
**Pedido:** `{id,number,createdAt,status,customer,items,total}`.  
**Cliente:** `{name,lastName,email,street,apartment,region,city,indications,delivery}`.  
**Usuario local:** `{id,name,email,salt,passwordHash}`.

**Claves de almacenamiento:** `huerto_cart` (compatibilidad original), `huerto_products_v2`, `huerto_categories_v2`, `huerto_orders_v2`, `huerto_users`, `huerto_session`, `huerto_delivery_<id>` (última dirección del cliente en ese navegador).

## 8. Limitaciones y decisiones
- La consigna solicita *fuente de datos simulada en JavaScript* y también habla de presentación *frontend/backend*: se implementan ambas opciones; el servidor Node es **opcional** y no necesita base de datos real.
- El flujo de autenticación y cuentas continúa siendo **solo académico**: la cuenta se guarda localmente y el panel no tiene roles protegidos; no ingresar datos reales.
- Las cuentas, carrito y preferencias de dirección se guardan en el navegador; el backend guarda copias de pedidos que incluyen datos de entrega. Se recomienda usar solo datos ficticios. El stock crítico es informativo; la demo no descuenta inventario automáticamente. No hay pago real, correo de confirmación ni comprobante fiscal.
- Las imágenes externas requieren Internet. Los contenidos del sitio se han simplificado respecto del HTML original.
- No se incluyen plantillas HTML adicionales, pues el PDF solo ofrece capturas y flujo orientativo y no se ha adjuntado el template completo mencionado.

## 9. Criterios de aceptación y evidencias
Demostrar: navegación responsiva; 6 productos originales; dos ofertas de ejemplo; categorías; búsqueda; detalle; carrito; checkout con ambas ramas; pedidos en administración; operaciones CRUD; reportes; y ejecución de **28 pruebas propuestas** con Jasmine/Karma y capturas de cobertura real. Mostrar el flujo React ↔ Node mediante `npm run server`, `npm run dev` y `http://localhost:3001/api/data`.

El estado real PASS/FAIL de Jasmine y los porcentajes de cobertura solo deben registrarse después de ejecutar `npm test` en un equipo con Node, npm y Chrome/Chromium. La publicación del código actualizado en GitHub corresponde al estudiante.
