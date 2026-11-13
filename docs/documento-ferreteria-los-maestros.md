# Ferretería Los Maestros — Frontend

## Documento de funcionalidades y apoyo para la defensa técnica (EP3)

Este documento explica cómo está construido el frontend y dónde está cada parte en el código, organizado según los indicadores de la defensa técnica. Complementa a:

- el [manual de usuario](manual-usuario.md): cómo se usa la tienda, paso a paso y con capturas;
- el [documento de integración](https://github.com/andresjp23/ferreteria-los-maestros-backend/blob/main/docs/documento-integracion.md): arquitectura completa, endpoints y pruebas de integración P01–P23;
- el [documento de defensa del backend](https://github.com/andresjp23/ferreteria-los-maestros-backend/blob/main/docs/documento-defensa-backend.md): entidades, servicios, Swagger y JWT del lado del servidor.

Las referencias `archivo:línea` apuntan a `src/` y sirven para abrir el código durante la defensa.

## Índice

1. [Propósito y alcance](#1-propósito-y-alcance)
2. [Stack y ejecución](#2-stack-y-ejecución)
3. [Estructura de la aplicación](#3-estructura-de-la-aplicación)
4. [Rutas y permisos](#4-rutas-y-permisos)
5. [Funcionalidades por módulo](#5-funcionalidades-por-módulo)
6. [Formularios y validaciones](#6-formularios-y-validaciones)
7. [Responsive](#7-responsive)
8. [Testing](#8-testing)
9. [Guía para la defensa por indicador](#9-guía-para-la-defensa-por-indicador)
10. [Recorrido sugerido para la demostración](#10-recorrido-sugerido-para-la-demostración)
11. [Decisiones, limitaciones y mejoras](#11-decisiones-limitaciones-y-mejoras)

---

## 1. Propósito y alcance

Ferretería Los Maestros es un negocio familiar de La Serena que gestionaba el stock y los pedidos de forma manual. La tienda online permite consultar el catálogo con stock real, comprar y, para el personal, gestionar productos, usuarios y pedidos.

**Qué cambió de la EP2 a la EP3:**

| EP2 | EP3 |
| --- | --- |
| Productos, usuarios y pedidos simulados en `src/mocks/` | Todo viene de la API REST del backend Spring Boot + MySQL |
| Login comparado contra una lista en el navegador | Login contra `POST /api/auth/login`, que devuelve un **JWT** |
| El rol se guardaba en `localStorage` y se podía editar | Solo se guarda el token. El rol se pide al servidor con `GET /api/auth/me` |
| "Continuar con la compra" volvía al catálogo | Checkout real: `POST /api/pedidos` crea el pedido y descuenta stock |
| Altas, ediciones y estados solo en memoria | CRUD de productos y usuarios y cambio de estado de pedidos persistidos en la BD |
| Protección de rutas solo visual | Las rutas se protegen en React **y** el backend valida token y rol en cada petición |

---

## 2. Stack y ejecución

- **React 19** para vistas y componentes, con **Context API** para sesión, catálogo y carrito.
- **React Router** para la navegación y la protección de rutas por rol.
- **Vite 8** como servidor de desarrollo y herramienta de build.
- **Tailwind CSS 4** para estilos y breakpoints.
- **Vitest + React Testing Library + JSDOM** para los tests.
- **`fetch`** nativo para hablar con la API (sin Axios), centralizado en `services/api.js`.

Requiere Node.js `^20.19.0` o `>=22.12.0` y el backend corriendo en `http://localhost:8080` (ver su README). Luego:

```bash
npm install
npm run dev        # http://localhost:5173
```

La URL de la API está en `.env.development`: `VITE_API_URL=http://localhost:8080/api`.

Otros comandos: `npm run build`, `npm run lint`, `npm test`, `npm run test:coverage`.

---

## 3. Estructura de la aplicación

| Ubicación | Responsabilidad |
| --- | --- |
| `src/main.jsx` | Monta la app dentro de `BrowserRouter` → `AuthProvider` → `CatalogProvider` → `CartProvider` |
| `src/App.jsx` | Declara las rutas públicas, las rutas protegidas de admin y vendedor, y la página 404 |
| `src/services/api.js` | **Cliente HTTP único**: arma la URL, agrega el token, convierte los errores del backend en `ApiError` y avisa cuando llega un 401 |
| `src/services/*Service.js` | Una función por endpoint: `authService`, `catalogService`, `orderService`, `adminService`, `userService` |
| `src/context/AuthProvider.jsx` | Sesión: login, logout, restauración al recargar y cierre automático cuando vence el token |
| `src/context/CatalogProvider.jsx` | Productos y categorías del backend, compartidos por todas las vistas |
| `src/context/CartProvider.jsx` | Carrito guardado en `localStorage` como `{ id, cantidad }`; precio y stock se leen del catálogo |
| `src/components/auth/ProtectedRoute.jsx` | Deja pasar, manda al login o devuelve a su panel según la sesión y el rol |
| `src/pages/` | Una vista por ruta. `admin/` y `seller/` se cargan bajo demanda (`lazy`) |
| `src/components/` | Componentes agrupados por sección (`admin`, `auth`, `cart`, `layout`, `products`, `seller`…) y reutilizables en `ui/` |
| `src/utils/` | Validaciones de formularios, formato de precios y fechas, roles, estados y lectura del `exp` del JWT |
| `src/test/` | Configuración de Vitest y `mockApi.js`, que simula el backend reemplazando `fetch` |
| `public/products/` | Imágenes WebP de los productos; el backend guarda solo su ruta |

---

## 4. Rutas y permisos

| Ruta | Contenido | Acceso |
| --- | --- | --- |
| `/` | Inicio | Público; página de inicio del cliente después del login |
| `/productos` | Catálogo con búsqueda, filtros y orden | Público |
| `/productos/:id` | Detalle de producto | Público; si no existe muestra "producto no encontrado" |
| `/carrito` | Carrito y checkout | Público; **confirmar la compra exige sesión de cliente** |
| `/nosotros`, `/contacto` | Información del negocio | Público |
| `/login` | Inicio de sesión | Público; con sesión activa redirige a la página de su rol |
| `/admin`, `/admin/productos`, `/admin/usuarios` | Dashboard y CRUD de productos y usuarios | Rol `admin` |
| `/vendedor` | Gestión de pedidos | Rol `vendedor` |
| Cualquier otra | Página 404 | Público |

`ProtectedRoute` (`components/auth/ProtectedRoute.jsx:10`) tiene tres salidas:

1. Mientras se valida el token guardado, muestra un loader (`:15`), para no mandar al login antes de tiempo.
2. Sin sesión, redirige a `/login` y guarda la ruta que se quería abrir (`:19`). Después del login, `pages/Login.jsx:21` vuelve a esa ruta.
3. Con sesión pero con otro rol, lo manda a la página de inicio de **su** rol (`:24`), definida en `utils/roles.js`.

---

## 5. Funcionalidades por módulo

### 5.1 Sitio público y catálogo

- **Datos:** `CatalogProvider` pide productos y categorías al montar la app (`GET /productos`, `GET /categorias`) y los comparte con todas las vistas. Si el backend no responde, muestra un error con botón "Reintentar".
- **Búsqueda:** filtra mientras se escribe y guarda el texto en la URL (`?q=`).
- **Filtros:** categoría, marca, disponibilidad y precio mínimo/máximo. Viven en la URL (`/productos?categoria=herramientas&orden=precio-asc`), así que se pueden compartir con un link.
- **Orden y resultados:** por nombre o precio. "Mostrar más" agrega bloques de 16 productos.
- **Detalle:** datos, disponibilidad, selector de cantidad limitado por el stock y productos relacionados. "Agregar al carrito" y "Comprar ahora" agregan el producto; el segundo lleva directo al carrito.

### 5.2 Carrito y checkout

- Se agregan productos y se acumulan las cantidades repetidas, sin pasar del stock.
- Se puede aumentar o disminuir la cantidad, eliminar productos y vaciar el carrito con confirmación.
- `localStorage` guarda solo `{ id, cantidad }` (`context/CartProvider.jsx:41`). El precio y el stock se leen siempre del catálogo actual, así un precio viejo guardado en el navegador nunca llega al total.
- **Checkout** (`components/cart/CartSummary.jsx:37`):
  - sin sesión → al login, y después vuelve al carrito;
  - con sesión de cliente → `POST /pedidos` con `[{ id, cantidad }]`. El backend valida y descuenta el stock y calcula el total;
  - con sesión de admin o vendedor → el botón aparece deshabilitado con "Las compras se hacen con una cuenta de cliente" (`:27`).
- Al crear el pedido: muestra "¡Pedido #N creado!", vacía el carrito y recarga el catálogo para ver el stock nuevo. Con un 409 (sin stock) muestra el mensaje del backend y también recarga el catálogo.

### 5.3 Login y sesión

- El login llama a `POST /auth/login`. Si es correcto, guarda el token y el usuario (`context/AuthProvider.jsx:89`) y redirige según el rol: admin a `/admin`, vendedor a `/vendedor` y cliente a `/`.
- Con error muestra el mensaje del backend ("Correo o contraseña incorrectos" o "Tu cuenta está inactiva…").
- La sesión se conserva al recargar y se cierra sola al vencer el token (ver [9.3](#93-ie335--gestión-y-persistencia-de-sesión)).
- El cliente cierra sesión desde la barra superior; admin y vendedor, desde el menú lateral de su panel.

### 5.4 Panel de administración

- **Dashboard:** indicadores calculados por el backend (`GET /admin/resumen`): productos y cuántos tienen stock bajo, pedidos y ventas del mes con su variación, usuarios registrados y pedidos recientes.
- **Productos:** tabla con búsqueda, filtros por categoría y estado de stock, y paginación de 8. Agregar (`POST`), editar (`PUT`) y eliminar (`DELETE`, que en el backend es una desactivación). Después de cada operación muestra un aviso y vuelve a pedir la lista (`pages/admin/Products.jsx:65`).
- **Usuarios:** tabla con búsqueda, filtros por rol y estado, y paginación. Agregar, editar (la contraseña es opcional al editar) y eliminar. La fila de la propia cuenta tiene "Eliminar" deshabilitado, y un usuario con pedidos no se puede eliminar (el backend responde 409 y el mensaje sugiere desactivarlo).

### 5.5 Panel de vendedor

- Lista de todos los pedidos (`GET /pedidos`) con búsqueda por número, cliente o producto, filtros por estado y fecha, y paginación.
- **Ver:** detalle del pedido. **Editar estado:** muestra solo el siguiente estado permitido (En preparación → Enviado → Entregado). **Enviar:** atajo para marcar como Enviado.
- El cambio se guarda con `PATCH /pedidos/{id}/estado` (`pages/seller/Orders.jsx:99`) y persiste en la BD.
- Dashboard, Productos, Clientes, Reportes y Configuración aparecen deshabilitados en el menú: no forman parte de esta versión.

### 5.6 Nosotros y contacto

Páginas informativas. El formulario de contacto es de demostración: muestra un aviso, pero no envía ni guarda nada.

---

## 6. Formularios y validaciones

La validación ocurre **dos veces**:

1. **En el navegador** (`utils/productValidation.js`, `utils/userValidations.js`), para dar respuesta inmediata: el campo se revisa al salir de él y otra vez al enviar, y el foco salta al primer campo con error.
2. **En el backend**, que es la validación que manda. Si responde 400 o 409 con `campos`, cada mensaje se muestra debajo de su input, porque los nombres coinciden (`codigo`, `precioVenta`, `email`…). Así se detecta, por ejemplo, un código o correo repetido, cosa que el navegador no puede saber.

| Formulario | Reglas principales |
| --- | --- |
| Producto | Código de 2 letras y 3 números; nombre, categoría, subcategoría, marca y unidad obligatorios; precios y stock enteros; precio de venta ≥ precio de compra; descripción con máximo; imagen como ruta `/…` o URL `https://…` |
| Usuario | Nombre y apellido; correo válido y único; rol y estado permitidos; contraseña de 8–64 caracteres con mayúscula, minúscula y número, sin espacios, y confirmación igual (opcional al editar) |
| Login | Correo y contraseña obligatorios |

---

## 7. Responsive

- La navegación pública se colapsa en un menú en móvil.
- En el catálogo, los filtros se despliegan con un botón en móvil y tablet, y quedan como barra lateral en escritorio.
- Los paneles de admin y vendedor usan un menú lateral deslizable bajo `xl` y fijo en escritorio.
- Las tablas de productos, usuarios y pedidos se muestran como tarjetas bajo `xl`.

---

## 8. Testing

```bash
npm test
```

**40 tests** con Vitest y React Testing Library. `src/test/mockApi.js` reemplaza `fetch` con respuestas como las del backend real, así cada test recorre el flujo de la pantalla (escribir, hacer clic, ver el resultado) sin levantar el servidor.

| Archivo | Qué prueba |
| --- | --- |
| `services/api.test.js` | Envío del token, conversión de errores en `ApiError`, aviso de 401 |
| `components/auth/CustomerSession.test.jsx` | Login correcto e incorrecto, restauración y cierre de sesión |
| `components/auth/ProtectedRoute.test.jsx` | Redirecciones sin sesión y con el rol equivocado |
| `components/cart/Checkout.test.jsx` | Checkout con y sin sesión, pedido creado y error de stock |
| `context/CartProvider.test.jsx` | Reglas de cantidades y persistencia del carrito |
| `pages/catalog-search.test.jsx` | Búsqueda y filtros del catálogo |
| `pages/admin/admin-panel.test.jsx`, `components/admin/forms.test.jsx` | CRUD y formularios del panel admin |
| `pages/seller/seller-orders.test.jsx`, `components/seller/OrdersTable.test.jsx` | Pedidos y cambio de estado del vendedor |
| `utils/*Validation*.test.js` | Reglas de validación de productos y usuarios |

En cada push a `main`, GitHub Actions corre formato, lint, tests y build (`.github/workflows/frontend.yml`). Las pruebas contra el backend real están documentadas en el documento de integración (P01–P23).

---

## 9. Guía para la defensa por indicador

Los indicadores de backend (IE3.1.2 e IE3.2.3) están en el [documento de defensa del backend](https://github.com/andresjp23/ferreteria-los-maestros-backend/blob/main/docs/documento-defensa-backend.md). Aquí están los que involucran al frontend.

### 9.1 IE3.2.4 · Flujo de integración frontend/backend

**Qué piden:** recorrer una operación iniciada en React hasta la API REST y mostrar dónde se actualiza el estado.

**Ejemplo recomendado, el checkout:**

| Paso | Dónde |
| --- | --- |
| 1. El cliente pulsa "Continuar con la compra" | `components/cart/CartSummary.jsx:37` (`handleCheckout`) |
| 2. Se llama al servicio con `[{ id, cantidad }]` | `services/orderService.js:5` (`createOrder`) |
| 3. `api.js` agrega `Authorization: Bearer <token>` y hace el `fetch` | `services/api.js:39` y `:43` |
| 4. El backend valida el token y el rol, descuenta stock y responde 201 | `PedidoController` → `PedidoService.crear` (backend) |
| 5. Si la respuesta no es OK, `api.js` lanza `ApiError { status, mensaje, campos }` | `services/api.js:56` |
| 6. **Se actualiza el estado:** `setOrder(created)`, `clearCart()` y `reloadCatalog()` | `CartSummary.jsx:49-53` |

**Cómo explicarlo:** el componente no conoce URLs ni headers. Llama a una función del *service*, y `api.js` concentra todo lo HTTP. Por eso, si cambia la URL del backend, se cambia solo `VITE_API_URL`. El navegador envía solo `id` y `cantidad`: el precio y el total los calcula el servidor, para que nadie pueda pagar menos editando el JavaScript.

**Otro ejemplo, el CRUD de productos:** `pages/admin/Products.jsx:65` (`handleSave`) llama a `createProduct` o `updateProduct` (`services/adminService.js:5-6`). Si el backend responde 400 o 409, devuelve `{ mensaje, campos }` al formulario, que pinta cada error en su input. Si responde bien, cierra el modal, muestra el aviso y vuelve a pedir la lista (`refresh`).

**Preguntas probables:**
- *¿Por qué un solo `api.js`?* Para no repetir el token, la URL base y el manejo de errores en cada pantalla.
- *¿Qué pasa si el backend está apagado?* `fetch` lanza un error y `api.js` lo convierte en "No se pudo conectar con el servidor…" (`services/api.js:50`).
- *¿Cómo se entera el catálogo de que bajó el stock?* `CartSummary` llama a `reloadCatalog()` del `CatalogProvider`, que vuelve a pedir `GET /productos`.

### 9.2 IE3.3.4 · JWT, roles y autorización (lado del frontend)

**Qué piden:** dónde se crea, valida y usa el JWT, y cómo se verifica el rol en el backend. La creación y la validación están en el backend (ver su documento). En el frontend:

| Qué | Dónde |
| --- | --- |
| Se recibe el token en el login y se guarda en `localStorage` (`auth_token`) | `context/AuthProvider.jsx:89-95`, `services/api.js:8-13` |
| Se **usa** en cada petición como `Authorization: Bearer <token>` | `services/api.js:39` |
| Se lee la fecha de vencimiento (`exp`) del token, solo para saber cuándo cerrar la sesión | `utils/jwt.js:4` |
| El rol que usa la interfaz viene de `GET /auth/me`, no del token ni de `localStorage` | `context/AuthProvider.jsx:53-65` |

**Cómo explicarlo:** el frontend **no valida** el token: no tiene la clave secreta y no debe tenerla. Solo lo guarda, lo envía y lee su vencimiento. El rol que decide qué ve el usuario lo entrega el servidor, así editar `localStorage` no sirve para "volverse admin". Y aunque alguien lo lograra en la interfaz, el backend respondería 403 a cada petición.

### 9.3 IE3.3.5 · Gestión y persistencia de sesión

**Qué piden:** mostrar qué ocurre al recargar con sesión activa y cómo se maneja una sesión vencida.

| Situación | Qué pasa | Dónde |
| --- | --- | --- |
| Login | Guarda el token en `localStorage` y el usuario en el estado de React | `AuthProvider.jsx:89` |
| Recarga (F5) | Lee el token; si no venció, pide `GET /auth/me` y restaura el usuario. Mientras tanto, `ProtectedRoute` muestra un loader | `AuthProvider.jsx:10` y `:53`, `ProtectedRoute.jsx:15` |
| Token ya vencido al abrir la app | Lo descarta y el login muestra "Tu sesión expiró. Inicia sesión nuevamente" | `AuthProvider.jsx:14-17` |
| El token vence con la app abierta | Un `setTimeout` programado para la hora de vencimiento cierra la sesión | `AuthProvider.jsx:78-85` |
| El backend responde 401 a una petición con token | `api.js` avisa al `AuthProvider`, que cierra la sesión con el mensaje | `api.js:64`, `AuthProvider.jsx:47-50` |
| Logout | Borra el token y el usuario | `AuthProvider.jsx:40` |

**Demostración:**
1. Iniciar sesión como admin, ir a `/admin` y recargar con F5: sigue en el panel. En DevTools → Network se ve la llamada a `/auth/me` (prueba P23).
2. Expiración: levantar el backend con `JWT_EXPIRATION_MINUTES=1`, iniciar sesión y esperar un minuto: la app vuelve al login con "Tu sesión expiró".

**Preguntas probables:**
- *¿Por qué `localStorage` y no `sessionStorage`?* Para que la sesión sobreviva al cerrar la pestaña. El riesgo (XSS) está en la sección 11.
- *¿Por qué pedir `/auth/me` si el token ya trae el rol?* Porque el servidor tiene la verdad: si el admin desactivó la cuenta o le cambió el rol, `/auth/me` lo refleja.
- *¿Por qué el loader?* Sin él, en el primer instante `user` es `null` y `ProtectedRoute` mandaría al login aunque la sesión sea válida.

### 9.4 IE3.3.6 · Control de acceso a interfaces y acciones

**Qué piden:** mostrar rutas o acciones restringidas y explicar por qué el backend debe validar además del frontend.

| Restricción | Dónde |
| --- | --- |
| `/admin/*` solo para `admin`; `/vendedor` solo para `vendedor` | `App.jsx:37-50` con `ProtectedRoute allowedRoles={[…]}` |
| Sin sesión → login; con otro rol → su propio panel | `ProtectedRoute.jsx:19` y `:24` |
| Confirmar la compra solo como cliente | `CartSummary.jsx:27` (`isStaff`) y `:41` |
| Botones de editar y eliminar solo dentro de los paneles | `pages/admin/*`, `pages/seller/Orders.jsx` |
| Un admin no puede eliminar su propia cuenta | `components/admin/users/UsersTable.jsx:50` |
| "Enviar" solo si el pedido está En preparación; "Estado" deshabilitado si está Entregado | `components/seller/OrdersTable.jsx:90` y `:100` |

**Demostración:** con sesión de cliente, escribir `/admin` en la barra de direcciones: vuelve al inicio. Luego, en Swagger, llamar a `GET /api/usuarios` con el token del cliente: **403** (prueba P09).

**Por qué el backend también valida:** el frontend corre en el navegador del usuario, que puede modificarlo, saltarse una pantalla o llamar a la API directamente con Swagger, Postman o curl. Ocultar un botón mejora la experiencia, pero no protege nada. La seguridad real es que cada endpoint revisa el token y el rol en el servidor (`SecurityConfig` en el backend).

---

## 10. Recorrido sugerido para la demostración

Con MySQL, el backend y el frontend levantados (ver el [manual](manual-usuario.md#2-instalación-y-arranque)):

1. **Visitante:** catálogo, filtro por categoría (se ve en la URL), detalle y agregar al carrito.
2. **Checkout sin sesión:** "Continuar con la compra" lleva al login y, después de entrar como cliente, vuelve al carrito.
3. **Cliente:** confirmar la compra → "¡Pedido #N creado!" y el stock baja en el catálogo. Abrir DevTools → Network y mostrar el `POST /pedidos` con el header `Authorization`.
4. **Recarga:** F5 con la sesión iniciada y mostrar `GET /auth/me`.
5. **Vendedor:** buscar el pedido recién creado, ver el detalle y pasarlo a "Enviado".
6. **Admin:** dashboard, agregar un producto con un código repetido (error en el campo, que viene del backend), agregarlo bien, editarlo y eliminarlo.
7. **Control de acceso:** como cliente, abrir `/admin` → redirige. En Swagger, la misma acción con su token → 403.
8. **Código:** abrir `api.js`, `AuthProvider.jsx` y `ProtectedRoute.jsx` y explicar el recorrido de la sección 9.

---

## 11. Decisiones, limitaciones y mejoras

| Tema | Decisión o limitación | Mejora posible |
| --- | --- | --- |
| Token en `localStorage` | Simple y conserva la sesión al recargar, pero un script inyectado (XSS) podría leerlo | Cookie `HttpOnly` + `SameSite`, o token corto con *refresh token* |
| Sin *refresh token* | Al vencer (60 min) hay que volver a iniciar sesión | Endpoint `/auth/refresh` |
| Carrito en el navegador | No se comparte entre dispositivos, pero solo guarda `id` y `cantidad` | Carrito guardado en el backend por cliente |
| Sin vista "Mis pedidos" para el cliente | El backend ya expone `GET /pedidos/mios`, pero la pantalla no se construyó | Página `/mis-pedidos` que consuma ese endpoint |
| Filtros del catálogo en el navegador | Con 76 productos es instantáneo, pero no escalaría a miles | Búsqueda y paginación en el backend (`?q=&page=`) |
| Imagen del producto como ruta | No se suben archivos | Subida *multipart* al backend |
| Cuentas de prueba visibles en el login | Facilitan la evaluación | Quitar el recuadro en producción |
| Contacto | El formulario no envía nada | Endpoint de contacto en el backend |
