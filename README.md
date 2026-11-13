# Ferretería Los Maestros

Frontend de la tienda online de Ferretería Los Maestros, negocio familiar de La Serena. Proyecto semestral de DSY1104 (EP3): SPA responsive en React que consume la API REST del backend Spring Boot.

> **EP3:** todos los datos vienen del backend: catálogo, checkout, sesión con JWT (se conserva al recargar y se cierra al vencer), CRUD de productos y usuarios, dashboard y gestión de pedidos del vendedor. Los permisos se validan en el backend; el frontend oculta o deshabilita lo que cada rol no puede hacer.

El backend (Spring Boot + MySQL + JWT) vive en su propio repositorio: [ferreteria-los-maestros-backend](https://github.com/andresjp23/ferreteria-los-maestros-backend). Debe estar corriendo en `http://localhost:8080` (la URL se cambia con `VITE_API_URL`, ver `.env.example`).

## Stack

- React 19 y React Router
- Vite 8
- Tailwind CSS 4
- Vitest + React Testing Library + JSDOM
- Lucide React para iconografía

## Requisitos

- Node.js `^20.19.0` o `>=22.12.0`
- npm 10 o compatible

## Instalación y desarrollo

1. **Levantar primero el backend** (MySQL en Docker + Spring Boot en el puerto 8080), siguiendo el [README del backend](https://github.com/andresjp23/ferreteria-los-maestros-backend#puesta-en-marcha).
2. Desde la raíz de este repositorio:

```bash
npm install
npm run dev
```

3. Abrir <http://localhost:5173>. Para detener el servidor, usa `Ctrl+C`.

La URL de la API viene en `.env.development` (`VITE_API_URL=http://localhost:8080/api`). Si el backend corre en otro puerto, copia `.env.example` a `.env.development.local` y ajústala. Si el backend no está corriendo, la tienda muestra el aviso "No se pudo conectar con el servidor".

## Comandos

| Comando                 | Descripción                                             |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Inicia el servidor de desarrollo.                       |
| `npm run build`         | Genera el build de producción en `dist/`.               |
| `npm run preview`       | Sirve localmente el último build.                       |
| `npm run lint`          | Ejecuta Oxlint.                                         |
| `npm run format`        | Formatea el código con Prettier.                        |
| `npm run format:check`  | Revisa el formato sin modificar archivos (lo usa CI).   |
| `npm run images`        | Convierte imágenes JPG/PNG nuevas a WebP optimizado.    |
| `npm test`              | Ejecuta Vitest una vez.                                 |
| `npm run test:watch`    | Ejecuta Vitest en modo watch.                           |
| `npm run test:coverage` | Ejecuta los tests y genera cobertura V8 en `coverage/`. |

## Estructura

```text
src/
├── components/   # Componentes por sección (admin, auth, cart, layout, products, seller...)
│   └── ui/       # Componentes reutilizables: SectionTitle, Modal, Notice, Pagination, StatusBadge...
├── context/      # Providers de sesión (AuthProvider), catálogo (CatalogProvider) y carrito (CartProvider)
├── hooks/        # useAuth, useCatalog, useCart, usePagination
├── services/     # Cliente HTTP (api.js) y llamadas a la API por recurso
├── test/         # Configuración de los tests, backend simulado (mockApi) y datos de prueba
├── pages/        # Una vista por ruta; admin/ y seller/ se cargan bajo demanda
└── utils/        # Formato, catálogo, roles, pedidos y validaciones
```

Los filtros del catálogo viven en la URL (`/productos?categoria=herramientas&marca=Makita&orden=precio-asc`), así que se pueden compartir con un link.

## Imágenes

Las imágenes se sirven en WebP y redimensionadas al tamaño en que se muestran. Para agregar una nueva, copia el JPG/PNG en su carpeta (`public/products`, `src/assets`, etc.) y ejecuta `npm run images`: el script la convierte y guarda el original en `originals/` (ignorada por git).

## Rutas principales

| Ruta                                            | Vista                                  | Acceso         |
| ----------------------------------------------- | -------------------------------------- | -------------- |
| `/`                                             | Inicio                                 | Público        |
| `/productos`                                    | Catálogo, búsqueda y filtros           | Público        |
| `/productos/:id`                                | Detalle de producto                    | Público        |
| `/carrito`                                      | Carrito                                | Público        |
| `/nosotros`                                     | Información del negocio                | Público        |
| `/contacto`                                     | Información y formulario de contacto   | Público        |
| `/login`                                        | Inicio de sesión (JWT)                 | Público        |
| `/admin`, `/admin/productos`, `/admin/usuarios` | Dashboard y CRUD de productos/usuarios | Rol `admin`    |
| `/vendedor`                                     | Gestión de pedidos                     | Rol `vendedor` |

Las rutas inexistentes muestran una página 404. El cliente usa el sitio público, compra desde el carrito y vuelve a `/` después de iniciar sesión. Si se intenta abrir una ruta protegida sin sesión, después del login se vuelve a esa ruta.

## Cuentas de demostración

| Rol           | Correo                    | Contraseña    |
| ------------- | ------------------------- | ------------- |
| Cliente       | `cliente@losmaestros.cl`  | `cliente123`  |
| Vendedor      | `vendedor@losmaestros.cl` | `vendedor123` |
| Administrador | `admin@losmaestros.cl`    | `admin123`    |

Las crea el backend al iniciar por primera vez (datos de demostración). No deben usarse como cuentas reales.

## Funcionalidades

- Catálogo con búsqueda en vivo, filtros por categoría, marca, disponibilidad y precio, orden y botón “Mostrar más”.
- Detalle de producto con stock, selector de cantidad y productos relacionados.
- Carrito con límites según stock, eliminación y vaciado. Se conserva en `localStorage` (solo id y cantidad; precio y stock se leen siempre del catálogo).
- Checkout para clientes: el backend valida el stock, lo descuenta y calcula el total.
- Inicio de sesión con JWT. El token se guarda en `localStorage`, la sesión se restaura al recargar con `GET /auth/me` y se cierra sola cuando el token vence (o si el backend responde 401).
- Panel admin: dashboard con indicadores reales y CRUD de productos y usuarios, con validaciones en el formulario y los errores del backend (400/409) en cada campo.
- Panel vendedor: pedidos del backend con filtros, detalle y avance de estado (En preparación → Enviado → Entregado).
- Diseño responsive: menú móvil, filtros plegables y tarjetas para tablas en pantallas menores a `xl`.

Los datos vienen de la API (`src/services/`). Las imágenes de los productos están en `public/products/` y el backend guarda su ruta.

## Tests

```bash
npm test
```

40 tests con Vitest y Testing Library. Simulan el backend reemplazando `fetch` (`src/test/mockApi.js`), así se prueba el flujo real de cada pantalla (login, catálogo, checkout, paneles de admin y vendedor) sin levantar el servidor. En cada push a `main`, GitHub Actions revisa formato, lint, tests y build (`.github/workflows/frontend.yml`).

## Documentación

- [Manual de usuario](docs/manual-usuario.md): instalación y uso paso a paso por rol (visitante, cliente, vendedor y administrador), con capturas.
- [Documento de integración frontend–backend](https://github.com/andresjp23/ferreteria-los-maestros-backend/blob/main/docs/documento-integracion.md) (en el repositorio del backend): arquitectura, flujo REST, endpoints, JWT, configuración y pruebas de integración.
- [Documento de la EP2](docs/documento-ferreteria-los-maestros.md): versión anterior, con datos simulados y sin backend. Se conserva como historial.
