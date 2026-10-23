# Cobertura de testing V2 — HuertoHogar React
**DSY1104 · Evaluación Parcial 2 · Anexo 1 · 21-10-2026**

## 1. Alcance
El anexo recomienda verificar **renderizado normal y condicional, props, state y eventos**. La rúbrica solicita demostrar al menos **10 pruebas unitarias correctas**. Esta versión define **28 casos Jasmine/Karma**, integrando mocks y consultas del DOM de React Testing Library.

## 2. Herramientas y ejecución
Frontend: React 18 + Vite + Bootstrap. Pruebas: Jasmine 5 + Karma 6 + Webpack/Babel, ChromeHeadless, React Testing Library. Cobertura: plugin Istanbul + karma-coverage (resumen HTML y LCOV).

```bash
npm install
npm test
npm run test:coverage
# Abrir coverage/html/index.html
```

Prueba adicional de backend (Node integrado, sin dependencias): `npm run test:server`.

## 3. Matriz de 28 casos diseñados
| Caso | Prueba/archivo | Comprobación | Tipo |
|---|---|---|---|
| 01 | ProductCard | Nombre, precio y enlace de detalle | Props/DOM |
| 02 | ProductCard | Llama callback de agregar | Evento/mock |
| 03 | Catalog | Renderiza seis productos | Renderizado |
| 04 | Catalog | Cambio de categoría modifica lista | State/evento |
| 05 | Catalog | Búsqueda sin resultados muestra aviso | DOM/condicional |
| 06 | Cart | Carrito vacío | Condicional |
| 07 | Cart | Totales y subtotales | Lógica |
| 08 | Cart | Aumentar invoca callback correcto | Evento/mock |
| 09 | Cart | Eliminar invoca callback correcto | Evento/mock |
| 10 | Contact | Formulario inválido muestra errores | Validación/DOM |
| 11 | Contact | Formulario correcto ejecuta mock | Eventos/props |
| 12 | Storage | Recupera carrito original | Persistencia |
| 13 | Storage | Agregar no muta entrada | Función pura |
| 14 | Storage | Cantidades y total | Función pura |
| 15 | Database | Crear registro | CRUD/función pura |
| 16 | Database | Actualizar registro | CRUD/función pura |
| 17 | Database | Eliminar registro | CRUD/función pura |
| 18 | Database | Generar slug de categoría | Función pura |
| 19 | Database | Calcular precio con descuento | Oferta/carrito |
| 20 | Database | Crear pedido rechazado | Checkout/lógica |
| 21 | NewViews | Categorías y sus enlaces | Props/DOM |
| 22 | NewViews | Ofertas filtradas | Condicional |
| 23 | NewViews | Checkout inválido muestra errores | State/validación |
| 24 | NewViews | Datos precargados y pedido aprobado | Props/evento/mock |
| 25 | NewViews | Pedido rechazado desde selector | State/evento/mock |
| 26 | NewViews | Resultado y resumen de pedido | Renderizado |
| 27 | Admin | Crear producto desde formulario | Evento/mock/CRUD |
| 28 | Admin | Métricas en dashboard | Props/DOM |

Además se incluye **una prueba de integración HTTP independiente** de Jasmine/Karma (`server/server.test.js`) que revisa la respuesta `/api/data` del backend. No forma parte de las 28 pruebas de frontend.

## 4. Mocks y DOM
Ejemplos: `jasmine.createSpy('onAdd')`, `createSpy('onComplete')`, `createSpy('onSaveProducts')` para simular funciones de estado/persistencia superiores sin realizar compras reales. `render` monta componentes, `fireEvent.click` y `fireEvent.change` simulan eventos, `screen.getByRole` y `getByLabelText` buscan elementos reales del DOM. `afterEach(cleanup)` aísla pruebas.

## 5. Trazabilidad
| Requisitos ERS | Casos |
|---|---|
| RF01–RF03 (catálogo/detalle) | 01–05, 21–22 |
| RF04 (carrito) | 02, 06–09, 12–14, 19 |
| RF05–RF06 (categorías y ofertas) | 04, 18, 19, 21, 22 |
| RF07–RF09 (checkout y resultado) | 20, 23–26 |
| RF12 (contacto) | 10–11 |
| RF14–RF16 (administración, CRUD) | 15–17, 27–28 |
| RF20 (persistencia JS) | 12–20 |
| RF21 (servidor opcional) | prueba HTTP separada |

**Sin cobertura directa (demostrar manualmente):** autenticación de demo, historial del perfil, edición de categorías, eliminación condicional de categorías, pantalla de rechazo completa, actualización de estado de pedidos, reportes, artículos del blog, responsive y persistencia después de recarga. Los 28 tests **no cubren automáticamente todas las líneas ni todos los flujos de integración**.

## 6. Resultados comprobados frente a pendientes
- **Comprobado en preparación:** análisis sintáctico de archivos JS/JSX con parser TypeScript; **prueba HTTP de backend 1/1 PASSED** usando Node `--test`.
- **Pendiente en equipo con dependencias:** `npm install` y ejecución Karma/Chrome de las 28 pruebas de frontend. No hay porcentaje de cobertura medido, porque la instalación npm agotó el tiempo de espera del entorno de preparación.

| Indicador | Resultado actual |
|---|---|
| Casos Jasmine/Karma redactados | 28 |
| Casos Karma ejecutados | Pendiente |
| Casos Karma aprobados/fallidos | Pendiente |
| Cobertura Statements | Pendiente |
| Cobertura Branches | Pendiente |
| Cobertura Functions | Pendiente |
| Cobertura Lines | Pendiente |
| Prueba HTTP Node | 1/1 aprobada |

## 7. Proceso de testeo y análisis posterior
1. `npm install` y `npm test` en equipo con Chrome/Chromium instalado.
2. Si Karma no encuentra Chrome en Windows, tener Google Chrome instalado; en Linux definir `CHROME_BIN`.
3. Capturar consola con cantidad de tests y casos fallidos.
4. Abrir `coverage/html/index.html`, copiar cuatro porcentajes a la tabla de resultados.
5. Revisar archivos/ramas no cubiertos y agregar casos relevantes, priorizando checkout y órdenes.
6. Si una prueba falla, anotar fallo, corrección y segunda ejecución; no afirmar éxito sin evidencia.
7. Registrar fecha, navegador y versión Node del equipo usado.

## 8. Evidencia exigida para defensa
Mostrar: filtros en React; datos y props de `ProductCard`; estado del checkout; mocks de Jasmine; prueba de evento botón; resultados reales de Karma; pantallas de compra exitosa y rechazada; CRUD; reporte de cobertura; vista móvil/escritorio; ejemplo de comunicación frontend/backend mediante `/api/data`.
