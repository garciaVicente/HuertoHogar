# Guion de defensa (15 min + 5 min preguntas) — HuertoHogar, Evaluación 2

**Min 0–2: Contexto y migración.** HuertoHogar era HTML/CSS/JS con seis productos y carrito. Migramos las vistas a React con Vite, estados `useState`, props y React Router. Bootstrap permite una misma interfaz en móvil, tablet y escritorio.

**Min 2–5: Flujo cliente.** Inicio → categorías → catálogo con búsqueda → detalle → agregar carrito → ajustar cantidad → checkout. Completar cliente y dirección; ejecutar una compra aprobada y otra rechazada. Explicar que son pagos simulados y no se cobran tarjetas. Mostrar ofertas.

**Min 5–8: Administración.** Dashboard; CRUD de productos (crear, leer, editar, eliminar); CRUD de categorías; órdenes, detalle y boleta simulada; usuarios locales (alta/edición/baja); productos críticos; reportes y perfil. Explicar que no es seguro para producción porque no hay permisos reales.

**Min 8–10: Datos y backend.** `src/data/database.js` implementa la fuente JS CRUD; `localStorage` conserva cambios. Abrir `http://localhost:3001/api/data` con `npm run server` y `npm run dev` simultáneos; React consulta backend de demostración y guarda productos, categorías y órdenes en archivo JSON.

**Min 10–13: Jasmine/Karma.** Mostrar 28 pruebas propuestas, incluidas pruebas con props, state, renderizado condicional, eventos DOM, spies/mocks y validación. Ejecutar `npm test` delante del docente. Mostrar resultados reales y HTML de cobertura, sin inventar cifras.

**Min 13–15: Cierre.** Mostrar Bootstrap en dos tamaños, arquitectura por carpetas y documento ERS V2. Explicar límites de la demo y relación con anexo.

## Preguntas técnicas frecuentes
**¿Qué son las props?** Información o funciones que un padre envía a un componente (`ProductCard` recibe producto y `onAdd`).

**¿Qué es state?** Datos internos que React observa para redibujar una interfaz (`query`, `category`, `cart`, `form`).

**¿Qué es CRUD?** Crear, leer, actualizar y eliminar; `createRecord`, `loadCollection`, `updateRecord`, `deleteRecord`.

**¿Para qué sirve un mock?** Sustituye una dependencia con un spy; comprueba que la interacción pidió la operación correcta sin ejecutar efectos reales.

**¿Por qué Jasmine y Karma?** Jasmine define pruebas y expectativas; Karma las ejecuta en un navegador y reporta resultados.

**¿Cómo se mide cobertura?** Babel/Istanbul instrumenta el código, Karma Coverage genera porcentajes y HTML. Cobertura alta no garantiza que todos los casos de negocio estén correctos.

**¿Qué es la persistencia actual?** Por defecto, datos en `localStorage` del navegador. Para demostrar integración frontend/backend, un servidor Node opcional persiste categorías, productos y pedidos en JSON.

**¿Qué faltaría para producción?** Login/roles en servidor, base de datos, gestión de stock y transacciones, pasarela real, seguridad, cumplimiento de privacidad y auditoría.
