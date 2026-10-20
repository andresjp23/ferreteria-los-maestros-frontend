# Ferretería Los Maestros
## Documento de funcionalidades y apoyo para la defensa técnica

## 1. Propósito y alcance

Este frontend corresponde al caso de la Ferretería Los Maestros, negocio familiar ubicado en La Serena. El problema de negocio es la dificultad para consultar stock actualizado, gestionar pedidos y mantener información de compras usando procesos manuales.

La aplicación implementa una demostración frontend para la EP2 de DSY1104. Usa productos, usuarios y pedidos simulados. No hay backend, llamadas HTTP, base de datos ni persistencia de las altas/cambios comerciales. Las credenciales y roles se validan únicamente en el cliente, por lo que esta solución no debe presentarse como segura para producción.

## 2. Stack y ejecución

- React 19 para vistas y componentes.
- React Router para navegación y protección de rutas por rol.
- Vite 8 como servidor de desarrollo y herramienta de build.
- Tailwind CSS 4 para estilos y breakpoints responsive.
- Vitest, React Testing Library, user-event y JSDOM para pruebas.
- Context API para sesión y carrito.

Requiere Node.js `^20.19.0` o `>=22.12.0` y npm compatible. Desde la raíz del repositorio:

```bash
cd frontend/ferreteria-los-maestros
npm install
npm run dev
```

Comandos adicionales:

```bash
npm run build
npm run preview
npm run lint
npm test
npm run test:watch
npm run test:coverage
```

## 3. Estructura de la aplicación

| Ubicación | Responsabilidad |
|---|---|
| `src/main.jsx` | Monta React, BrowserRouter, AuthProvider y CartProvider. |
| `src/App.jsx` | Declara rutas públicas, rutas admin/vendedor protegidas y fallback 404. |
| `src/pages/` | Vistas completas del catálogo, sitio público, administración y vendedor. |
| `src/components/` | Componentes reutilizables agrupados por dominio y layout. |
| `src/context/AuthContext.jsx` | Login/logout mock y estado global de sesión. |
| `src/context/CartContext.jsx` | Estado global, reglas de cantidad y persistencia local del carrito. |
| `src/mocks/` | Datos locales de productos, categorías, marcas, usuarios y pedidos. |
| `src/utils/` | Validaciones, formato, roles y reglas de stock. |
| `src/assets/` | Imágenes importadas por componentes y procesadas por Vite. |
| `public/products/` | Imágenes WebP servidas por URL desde los mocks. |
| `public/login/` | Imagen de la vista de login. |
| `COBERTURA_TESTING_EP2.md` | Registro de tests y métricas de cobertura ejecutadas. |

## 4. Rutas y permisos

| Ruta | Contenido | Acceso |
|---|---|---|
| `/` | Inicio | Pública; también es la página de inicio del cliente. |
| `/productos` | Catálogo | Público; consulta y filtros se reflejan en parámetros URL. |
| `/productos/:id` | Detalle | Público; un producto inexistente muestra el estado correspondiente. |
| `/carrito` | Carrito | Público. |
| `/nosotros` | Historia e información del negocio | Pública. |
| `/contacto` | Datos y formulario de contacto | Pública. |
| `/login` | Formulario de acceso | Público; con sesión activa redirige según rol. |
| `/admin` | Dashboard de administración | Requiere rol `admin`. |
| `/admin/productos` | Catálogo dentro del panel admin | Requiere rol `admin`. |
| `/admin/usuarios` | Usuarios dentro del panel admin | Requiere rol `admin`. |
| `/vendedor` | Gestión de pedidos | Requiere rol `vendedor`. |
| Cualquier otra ruta | 404 | Página no encontrada con accesos al inicio y catálogo. |

`ProtectedRoute` manda a login a quien no tiene sesión. Si hay sesión con un rol no permitido, redirige a la página inicial de ese rol, definida en `src/utils/roles.js`.

## 5. Funcionalidades por módulo

### 5.1 Sitio público y catálogo

- **Inicio:** presenta el negocio, categorías destacadas y beneficios. Las tarjetas de categoría navegan al catálogo con la categoría correspondiente.
- **Búsqueda:** filtra mientras se escribe y actualiza `q` en la URL. La navegación reemplaza el historial por letra; al buscar dentro del catálogo conserva otros parámetros existentes.
- **Filtros:** categoría, marca, disponibilidad en stock y precio mínimo/máximo. Los grupos de filtros empiezan cerrados. En móvil/tablet el panel se despliega; en escritorio queda disponible como sidebar.
- **Orden y resultados:** permite ordenar por nombre y precio. “Mostrar más” amplía los resultados en bloques de 16.
- **Detalle:** presenta datos, disponibilidad, selector de cantidad y productos relacionados. Las acciones agregan al carrito o llevan al carrito; no crean un pedido.

Implementación principal: `src/pages/Products.jsx`, `src/pages/ProductDetail.jsx`, `src/components/ui/NavSearchBar.jsx` y `src/components/products/FiltersSidebar.jsx`.

### 5.2 Carrito

- Agrega productos y acumula artículos repetidos.
- Permite aumentar/disminuir cantidades dentro de los límites de stock, eliminar productos y vaciar el carrito con confirmación.
- El estado se guarda en `localStorage` bajo la clave `cart`.
- El resumen calcula subtotal y total; el envío todavía no se calcula.
- “Continuar con la compra” devuelve a `/productos`. No existe checkout, confirmación ni creación de pedido.

La lógica global está en `src/context/CartContext.jsx`; la interfaz está en `src/pages/Cart.jsx` y `src/components/cart/`.

### 5.3 Login y roles

- El login compara correo y contraseña contra `src/mocks/users.js`.
- Admin se dirige a `/admin`; vendedor a `/vendedor`; cliente a `/`.
- La sesión resumida se guarda en `localStorage` bajo `auth_user`; el cliente puede cerrar sesión desde la navbar.
- La protección es solo de interfaz: un rol guardado en localStorage puede manipularse. No hay JWT ni autorización de servidor.

Credenciales mock:

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | `cliente@losmaestros.cl` | `cliente123` |
| Vendedor | `vendedor@losmaestros.cl` | `vendedor123` |
| Administrador | `admin@losmaestros.cl` | `admin123` |

Son datos de demostración visibles en el frontend y no deben usarse fuera de esta evaluación.

### 5.4 Panel de administración

- **Dashboard:** muestra la cantidad real de productos del mock. Métricas de pedidos, ventas y tendencias son de ejemplo; pedidos recientes usan `src/mocks/orders.js`.
- **Productos:** búsqueda por texto, filtro por categoría/stock, paginación y formulario de alta validado. Al enviar, arma el producto, registra el objeto en consola y muestra un aviso; no lo agrega al catálogo.
- **Usuarios:** búsqueda, filtro de rol/estado, paginación y formulario con validación de nombre, correo, rol y contraseña. El alta muestra un aviso, pero no persiste ni añade el usuario a las credenciales de login.
- **Editar/eliminar:** los botones de las tablas son visuales y aún no ejecutan operaciones.
- **Responsive:** productos y usuarios se presentan como tarjetas bajo `xl` y como tablas en pantallas amplias.

Vistas: `src/pages/admin/Dashboard.jsx`, `src/pages/admin/Products.jsx` y `src/pages/admin/Users.jsx`. Validadores: `src/utils/productValidation.js` y `src/utils/userValidations.js`.

### 5.5 Panel de vendedor

- La vista `/vendedor` permite buscar pedidos por número, cliente o producto; filtrar por estado/fecha y paginar.
- Incluye selección individual y de la página, detalle, cambio de estado y acción para marcar como enviado.
- Los cambios de estado se conservan solo en el estado React de esa sesión; no modifican `src/mocks/orders.js` ni sobreviven a una recarga.
- Bajo `xl` se muestran tarjetas con las mismas acciones; en escritorio se usa la tabla.
- Dashboard, Productos, Clientes, Reportes y Configuración aparecen como secciones pendientes/deshabilitadas en el menú.

La vista está en `src/pages/seller/Orders.jsx` y `src/components/seller/`; los datos iniciales están en `src/mocks/orders.js`.

### 5.6 Nosotros y contacto

- “Nosotros” presenta información e historia de la ferretería.
- “Contacto” presenta datos estáticos. El formulario es de demostración y muestra un aviso: no envía correo ni guarda información.

## 6. Formularios y validaciones

- **Producto:** código de dos letras y tres números, unicidad respecto al catálogo mock, nombre/categoría/subcategoría/marca/unidad requeridos, campos numéricos enteros, stock permitido en cero, venta no menor al costo, descripción con máximo y archivo JPG/PNG/WEBP de hasta 2 MB.
- **Usuario:** nombre y apellido, correo válido y único respecto a `adminUsers`, rol/estado permitidos, contraseña de 8–64 caracteres con mayúscula, minúscula y número, sin espacios, y confirmación coincidente.
- Los formularios presentan errores por campo, enlazan mensajes con controles y enfocan el primer campo inválido al enviar.
- La validación comprueba datos mock, no una base de datos ni usuarios/productos recién creados.

## 7. Responsive

- La navegación pública se colapsa en móvil.
- El catálogo muestra un buscador móvil sobre el panel de filtros; estos se despliegan en móvil/tablet.
- Admin y vendedor usan sidebar deslizable bajo `xl` y lateral fijo en escritorio.
- Tablas admin y pedidos del vendedor usan tarjetas bajo `xl` y tablas en escritorio.
- Las clases implementan breakpoints; la comprobación visual final debe hacerse en navegador a 360, 768 y 1280 px. Vitest/JSDOM no certifica el layout visual real.

## 8. Testing

Vitest está configurado en `vite.config.js` con JSDOM y setup en `src/test/setup.js`. La suite incluye 16 tests para validaciones, formularios, carrito, rutas/roles, sesión, búsqueda y pedidos.

```bash
npm test
npm run test:coverage
```

El último informe registrado está en `COBERTURA_TESTING_EP2.md`: 16 tests aprobados y cobertura global de 46,20% de líneas. Las páginas y componentes que aparecen como brechas en ese informe requieren más pruebas.

## 9. Recorrido sugerido para la demostración

1. Desde Inicio, abrir una categoría y mostrar el catálogo.
2. Escribir `taladro` en el buscador y enseñar el filtrado y el parámetro `q` en la URL.
3. Abrir filtros, combinar búsqueda/categoría o disponibilidad y limpiar los filtros.
4. Entrar al detalle, agregar un producto y ajustar la cantidad en el carrito.
5. Iniciar sesión como cliente, confirmar la redirección al inicio y cerrar sesión desde la navbar.
6. Iniciar sesión como admin y mostrar filtros y validaciones del formulario. Aclarar que el alta es simulada y no persiste.
7. Iniciar sesión como vendedor, filtrar un pedido, ver su detalle y cambiar el estado. Aclarar que el cambio vive solo en estado local.
8. Mostrar la configuración de Vitest, un test representativo y la salida de `npm test`/`npm run test:coverage`.

## 10. Puntos clave para la defensa

- **Props y estado:** formularios reciben callbacks por props; páginas y contextos mantienen estado de filtros, formularios, carrito y pedidos.
- **Router y layouts:** rutas públicas comparten Layout; admin/vendedor tienen layouts propios y sus rutas están protegidas por rol.
- **Mocks:** sustituyen la API pendiente y permiten demostrar recorridos sin backend. Los spies (`vi.fn`) verifican callbacks en tests.
- **Pruebas:** React Testing Library comprueba resultados observables e interacciones; Vitest ejecuta y mide cobertura.
- **Seguridad:** el control de rol solo simula RBAC en el frontend; un sistema real debe autenticar en backend, usar tokens seguros y autorizar cada API.
- **Persistencia:** solo sesión y carrito se guardan localmente; las altas y estados administrativos no son persistentes.

## 11. Fuera del alcance de esta versión

Backend Spring Boot, microservicios, API REST, MySQL, JWT, seguridad real, registro de cliente, inventario persistente, checkout, pagos, entrega/despacho, mapa de cobertura, historial del cliente, cuenta corriente, reportes reales y persistencia de altas/cambios.
