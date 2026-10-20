# Documento de Cobertura del Testing EP2

## 1. Identificación

| Campo | Información |
|---|---|
| Asignatura | DSY1104 - Desarrollo Fullstack II |
| Sección | Completar por el equipo |
| Grupo | Completar por el equipo |
| Integrantes | Completar por el equipo |
| Contexto / caso | Frontend de tienda online para Ferretería Los Maestros; catálogo, carrito, gestión simulada de usuarios/productos y pedidos por rol. |
| Repositorio configurado | https://github.com/andresjp23/proyecto-semestral-ferreteria-los-maestros |
| Versión evaluada | Working tree basada en `c1e5411`; incluye cambios locales de frontend y testing aún no committeados. |
| Fecha de ejecución | 20-10-2026 |

El proyecto usa datos mock y no consulta servicios externos. Los flujos que la evaluación define como simulados se prueban dentro de ese alcance; estas pruebas no implican persistencia de negocio en servidor.

## 2. Configuración del entorno de pruebas

| Herramienta | Versión declarada |
|---|---|
| Vitest | `^5.0.5` |
| React Testing Library | `^16.3.3` |
| `@testing-library/user-event` | `^14.6.8` |
| `@testing-library/jest-dom` | `^7.0.1` |
| JSDOM | `^30.1.3` |
| `@vitest/coverage-v8` | `^5.0.5` |

Vitest está integrado con la configuración existente de Vite en `vite.config.js`. Los tests se ejecutan en JSDOM y cargan `src/test/setup.js`, que habilita los matchers de jest-dom, limpia el DOM y `localStorage`, y restaura los temporizadores después de cada caso. La cobertura V8 produce reportes de texto, HTML y LCOV en `coverage/`, carpeta excluida de Git.

Scripts definidos en `package.json`:

| Comando | Propósito |
|---|---|
| `npm test` | Ejecutar toda la suite una vez. |
| `npm run test:watch` | Ejecutar Vitest en modo watch durante el desarrollo. |
| `npm run test:coverage` | Ejecutar la suite y generar métricas de cobertura. |

## 3. Registro de pruebas

Los 16 tests automatizados pasaron en la ejecución registrada.

| N.º | Archivo / componente | Comportamiento verificado | Tipo | Resultado |
|---:|---|---|---|---|
| 1 | `src/utils/productValidation.test.js` - `validateField` | Rechaza códigos mal formados o duplicados; verifica categoría válida y límites de stock, incluido stock cero. | Lógica / validación | OK |
| 2 | `src/utils/productValidation.test.js` - `validateField` | Impide precio de venta menor al costo y rechaza imágenes GIF o mayores a 2 MB. | Lógica / validación | OK |
| 3 | `src/utils/productValidation.test.js` - `validateProduct` | Un producto completo y válido no genera errores. | Lógica | OK |
| 4 | `src/utils/userValidations.test.js` - `validateField` | Rechaza correo inválido/duplicado y contraseñas que incumplen las reglas de seguridad. | Lógica / validación | OK |
| 5 | `src/utils/userValidations.test.js` - `validateUser` | Rechaza confirmación distinta y acepta los datos de usuario válidos. | Lógica / validación | OK |
| 6 | `src/components/admin/forms.test.jsx` - `AddProductForm` | El envío incompleto muestra error, enfoca el primer campo inválido y no llama el callback. | Componente / interacción | OK |
| 7 | `src/components/admin/forms.test.jsx` - `AddProductForm` | El envío válido llama `onSubmit` con los campos introducidos. | Componente / interacción | OK |
| 8 | `src/components/admin/forms.test.jsx` - `AddUserForm` | La contraseña distinta bloquea el envío; al corregirla se llama `onSubmit`. | Componente / interacción | OK |
| 9 | `src/context/CartContext.test.jsx` - `CartContext` | Combina productos repetidos, limita cantidades al stock y persiste el carrito en `localStorage`. | Estado / persistencia local | OK |
| 10 | `src/context/CartContext.test.jsx` - `CartContext` | Respeta los límites al aumentar/disminuir, permite eliminar y vaciar el carrito. | Estado / lógica | OK |
| 11 | `src/components/auth/ProtectedRoute.test.jsx` - `ProtectedRoute` | Sin sesión redirige a login. | Rutas / roles | OK |
| 12 | `src/components/auth/ProtectedRoute.test.jsx` - `ProtectedRoute` | El rol no autorizado vuelve a su página de inicio. | Rutas / roles | OK |
| 13 | `src/components/auth/ProtectedRoute.test.jsx` - `ProtectedRoute` | El rol permitido accede a la ruta protegida. | Rutas / roles | OK |
| 14 | `src/components/auth/CustomerSession.test.jsx` - login, navbar y contexto | El cliente inicia sesión, llega al inicio, ve “Cerrar sesión” y al salir se elimina `auth_user` y vuelve “Iniciar Sesión”. | Integración / interacción | OK |
| 15 | `src/pages/catalog-search.test.jsx` - catálogo y `NavSearchBar` | Escribir filtra resultados, actualiza `q` con navegación `REPLACE` y conserva la categoría; limpiar elimina `q`. | Integración / navegación | OK |
| 16 | `src/components/seller/OrdersTable.test.jsx` - tarjetas de pedidos | Selección general e individual y acciones ver/editar/enviar; enviar está deshabilitado para pedidos ya enviados. | Componente / interacción / regla de estado | OK |

## 4. Mocks y spies utilizados

- `vi.fn()` simula y verifica los callbacks `onSubmit`, selección y acciones de pedidos; no se invoca ningún backend real.
- `userEvent` escribe y envía formularios como lo haría una persona, incluyendo selección de opciones, corrección de contraseñas y escritura progresiva en el buscador.
- `MemoryRouter` proporciona rutas controladas para probar redirecciones por rol y la actualización de la URL durante la búsqueda.
- `localStorage` real de JSDOM se limpia después de cada test. Se comprueba el guardado del carrito y de la sesión de cliente.
- Los validadores usan los mocks locales del catálogo/usuarios. Los tests que necesitan aislamiento pasan fixtures explícitos de productos y pedidos.

No se mockean las funciones del componente bajo prueba. Los mocks se limitan a sus dependencias externas o callbacks que deben observarse.

## 5. Resultado de cobertura

Comando ejecutado: `npm run test:coverage`.

| Métrica | Resultado | Interpretación |
|---|---:|---|
| Statements | 45,72% (396/866) | Cobertura parcial del frontend completo. |
| Branches | 51,89% (247/476) | Se ejercitan ramas de validación, sesión, stock, búsqueda y estados de pedidos; faltan ramas de muchas vistas. |
| Functions | 31,44% (100/318) | La mayoría de funciones de páginas y componentes aún no tiene pruebas. |
| Lines | 46,20% (359/777) | Menos de la mitad del código fuente total quedó ejecutado por la suite actual. |

El reporte HTML detallado se genera en `coverage/index.html`; LCOV queda en `coverage/lcov.info`. La carpeta de artefactos no se versiona.

## 6. Análisis

**Mejor cubiertos**

- `src/utils/productValidation.js`: 96,55% de líneas.
- `src/utils/userValidations.js`: 97,56% de líneas.
- `src/context/CartContext.jsx`: 96,77% de líneas y 100% de funciones.
- `src/context/AuthContext.jsx`: 91,66% de líneas y 100% de funciones.
- `src/components/admin/users/AddUserForm.jsx`: 94,87% de líneas.
- `src/components/ui/NavSearchBar.jsx`: 95% de líneas.
- `src/components/seller/OrdersTable.jsx`: 66,66% de líneas; las acciones de tarjetas se ejercitan, pero la tabla desktop no.

**Áreas con cobertura baja o inexistente**

- Las páginas de inicio, detalle de producto, carrito, contacto, panel admin y filtros de usuario/producto todavía no tienen pruebas de integración propias.
- Las tarjetas responsive de tablas admin (`UsersTable`, `ProductsTable`, `RecentOrders`) aún no tienen tests de renderizado; requieren además revisión visual en navegador porque JSDOM no calcula los breakpoints de Tailwind.
- El modal y filtros avanzados del vendedor, paginación y varios estados vacíos no se ejercitaron.
- La cobertura global baja se debe a que el reporte incluye todo `src/`, no solo los módulos seleccionados. No se configuró un umbral artificial; se reportan las métricas reales y las brechas pendientes.

**Errores encontrados por los tests**

No se detectó un defecto funcional de la aplicación. La primera ejecución reveló dos selectores de test demasiado amplios y una expectativa incorrecta al borrar `q`: la categoría activa se conserva, así que el producto sigue apareciendo. Se corrigieron los tests para reflejar ese comportamiento previsto.

**Pruebas recomendadas para una siguiente iteración**

- Renderizado y datos clave de las tarjetas admin en `UsersTable`, `ProductsTable` y `RecentOrders`.
- Flujo de agregar/quitar productos desde las tarjetas y controles del carrito.
- Filtros, orden, paginación y estado vacío del catálogo.
- Modal y actualización de estado en la página completa de pedidos del vendedor.
- Formulario de contacto y estados de validación.

## 7. Conclusiones

Se configuró un entorno repetible de Vitest + React Testing Library y se ejecutaron 16 pruebas efectivas en lógica, validación, formularios, estado global, autenticación, navegación y pedidos. Las reglas de validación y contextos principales tienen buena cobertura. La cifra global de 46,20% de líneas evidencia que la suite es un primer conjunto focalizado, no una cobertura exhaustiva de todas las vistas. Conviene priorizar las páginas y componentes con 0% en el reporte, además de completar la revisión visual responsive antes de entregar.

## 8. Verificación pendiente de entrega

- Completar sección, grupo e integrantes.
- Confirmar que el repositorio sea público y que el enlace pueda abrirse sin autenticación.
- Ejecutar la revisión manual responsive en 360 px, 768 px y 1280 px y registrar evidencia.
- Verificar los archivos finales desde un clon limpio y preparar el ZIP/video requeridos.
- La rúbrica original menciona Jasmine/Karma, pero la guía específica EP2 indica Vitest + React Testing Library como reemplazo; esa es la configuración y herramienta documentada aquí.
