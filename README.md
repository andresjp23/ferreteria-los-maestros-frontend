# Ferretería Los Maestros

Frontend de una tienda online para el caso académico de Ferretería Los Maestros, negocio familiar de La Serena. El proyecto corresponde a la Evaluación Parcial 2 de DSY1104 y se enfoca en construir una SPA responsive con catálogo, carrito y vistas de administración/ventas.

> **Alcance:** esta entrega funciona con datos mock y estado local del navegador. No incluye backend, API, base de datos ni persistencia de operaciones comerciales.

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

Desde la raíz del repositorio:

```bash
cd frontend/ferreteria-los-maestros
npm install
npm run dev
```

Vite mostrará la URL local en la terminal. Para detener el servidor, usa `Ctrl+C`.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera el build de producción en `dist/`. |
| `npm run preview` | Sirve localmente el último build. |
| `npm run lint` | Ejecuta Oxlint. |
| `npm test` | Ejecuta Vitest una vez. |
| `npm run test:watch` | Ejecuta Vitest en modo watch. |
| `npm run test:coverage` | Ejecuta los tests y genera cobertura V8 en `coverage/`. |

## Rutas principales

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | Inicio | Público |
| `/productos` | Catálogo, búsqueda y filtros | Público |
| `/productos/:id` | Detalle de producto | Público |
| `/carrito` | Carrito | Público |
| `/nosotros` | Información del negocio | Público |
| `/contacto` | Información y formulario de contacto | Público |
| `/login` | Inicio de sesión de demostración | Público |
| `/admin`, `/admin/productos`, `/admin/usuarios` | Panel y gestión mock | Rol `admin` |
| `/vendedor` | Gestión de pedidos mock | Rol `vendedor` |

Las rutas inexistentes muestran una página 404. El cliente usa el sitio público y vuelve a `/` después de iniciar sesión; no tiene un panel de cuenta propio en esta fase.

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | `cliente@losmaestros.cl` | `cliente123` |
| Vendedor | `vendedor@losmaestros.cl` | `vendedor123` |
| Administrador | `admin@losmaestros.cl` | `admin123` |

Son credenciales mock incluidas en el frontend, solo para demostración. No deben usarse como cuentas reales.

## Funcionalidades

- Catálogo con búsqueda en vivo, filtros por categoría, marca, disponibilidad y precio, orden y botón “Mostrar más”.
- Detalle de producto con stock, selector de cantidad y productos relacionados.
- Carrito con límites según stock, eliminación y vaciado. Se conserva en `localStorage`.
- Inicio de sesión simulado por rol. La sesión se conserva en `localStorage` y la navbar del cliente permite cerrar sesión.
- Panel admin con dashboard, filtros y paginación de productos/usuarios, y formularios con validaciones.
- Panel vendedor con filtros, selección, detalle y cambios locales de estado de pedidos.
- Diseño responsive: menú móvil, filtros plegables y tarjetas para tablas en pantallas menores a `xl`.

Los datos están en `src/mocks/`; las imágenes que los productos cargan por URL están en `public/products/`.

## Pruebas y documentación

- [Documento de funcionalidad y apoyo para la defensa técnica](docs/documento-ferreteria-los-maestros.md)

El documento de cobertura de testing se entrega por separado en AVA. Las operaciones de alta de productos/usuarios y los estados de pedidos no se guardan en un servidor.
