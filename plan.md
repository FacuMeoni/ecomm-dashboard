# Plan: Dashboard de gestión de órdenes (tienda de ropa)

## Contexto

La tienda necesita reemplazar el registro manual de pedidos por un dashboard web/PWA donde el dueño/a pueda anotar cada orden: comprador, producto, costo, precio de venta, ganancia, pagos (seña/cuotas) y saldo restante. Como compran mercadería a proveedores de China, también necesitan trackear el estado del pedido desde "hay que encargarlo" hasta "entregado".

Es un proyecto desde cero (carpeta vacía, sin git). Es un MVP para un solo usuario (el dueño/a), sin necesidad de roles ni multiusuario.

**Decisiones ya acordadas con el usuario:**
- Stack: **Next.js (App Router) + TailwindCSS + shadcn/ui**
- Backend/DB: **Supabase** (Postgres + Auth)
- Usuarios: uno solo (login simple, sin roles)
- Métodos de pago: Efectivo y Transferencia (fácil de ampliar después)
- Estados de la orden (flujo manual, no automático): **Por encargar → Encargado → Pendiente → Entregado**, más **Cancelado** como estado terminal alcanzable en cualquier momento
- PWA: instalable (ícono, "agregar a inicio"), **sin** soporte offline — necesita conexión para leer/guardar datos
- Cada seña/cuota puede tener su propio método de pago (no uno solo por orden)

---

## 1. Modelo de datos (Supabase / Postgres)

**Ganancia (`total_ganancia`)**: se calcula sola como `precio_venta - costo` usando una **columna generada** de Postgres. Así nunca se puede desincronizar ni requiere lógica extra en el código.

**Saldo restante (`monto_restante`)**: no puede ser columna generada porque depende de sumar otra tabla (los pagos). Se resuelve con una **vista SQL** (`orders_resumen`) que suma los pagos de cada orden y calcula el restante al leer. Simple, siempre correcto, sin riesgo de que quede desactualizado.

**Método de pago**: va en la tabla de pagos (no en la orden), porque cada seña/cuota puede pagarse distinto. Se modela como un `enum` de Postgres (efectivo, transferencia) — agregar un método nuevo en el futuro es una sola línea de SQL.

**Estado**: campo manual en la orden (no calculado), con los 5 valores acordados. No se van a forzar transiciones válidas en la base de datos (ej. no bloquear pasar de "Pendiente" a "Por encargar") — es un MVP de un solo usuario, y forzar eso agrega complejidad sin beneficio real por ahora.

```sql
create type metodo_pago_enum as enum ('efectivo', 'transferencia');
create type order_estado_enum as enum (
  'por_encargar', 'encargado', 'pendiente', 'entregado', 'cancelado'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  nombre_comprador text not null,
  nombre_producto text not null,
  costo numeric(12,2) not null check (costo >= 0),
  precio_venta numeric(12,2) not null check (precio_venta >= 0),
  total_ganancia numeric(12,2) generated always as (precio_venta - costo) stored,
  estado order_estado_enum not null default 'por_encargar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pagos (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  monto numeric(12,2) not null check (monto > 0),
  metodo_pago metodo_pago_enum not null,
  fecha_pago date not null default current_date,
  nota text,
  created_at timestamptz not null default now()
);

-- Vista con monto pagado y restante por orden
create view orders_resumen with (security_invoker = true) as
select
  o.*,
  coalesce(p.monto_pagado, 0) as monto_pagado,
  o.precio_venta - coalesce(p.monto_pagado, 0) as monto_restante
from orders o
left join (
  select order_id, sum(monto) as monto_pagado
  from pagos group by order_id
) p on p.order_id = o.id;
```

`security_invoker = true` es importante: sin eso, la vista ignora las reglas de seguridad (RLS) y corre con permisos del dueño de la vista en vez del usuario que consulta.

**Seguridad (RLS)**: se activa Row Level Security en `orders` y `pagos`. Como hay un solo usuario, la regla es simplemente "tiene que estar logueado":

```sql
alter table orders enable row level security;
alter table pagos enable row level security;
create policy "authenticated full access" on orders
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "authenticated full access" on pagos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
```

Después de crear el schema: generar los tipos de TypeScript con `supabase gen types typescript --project-id <ref> > lib/types/database.types.ts`.

---

## 2. Autenticación

No hay registro público. El usuario dueño/a se crea una sola vez a mano desde Supabase Studio (Authentication → Users). El login es simple: email + contraseña (`supabase.auth.signInWithPassword`), sin redes sociales ni "magic link", que no aportan nada acá.

- Paquete: **`@supabase/ssr`** (el correcto para Next.js App Router hoy en día).
- `middleware.ts` en la raíz: en cada request, refresca la sesión y redirige — sin login va a `/login`; logueado que entra a `/login` va al dashboard.
- La capa del dashboard también revisa la sesión del lado del servidor como refuerzo.
- Botón de logout que cierra sesión y redirige a `/login`.

---

## 3. Estructura del proyecto (Next.js App Router)

```
app/
  login/page.tsx                -- formulario de login
  (dashboard)/
    layout.tsx                   -- chequeo de sesión + header + logout
    orders/
      page.tsx                     -- listado + resumen de totales
      new/page.tsx                  -- crear orden
      [id]/page.tsx                  -- detalle: datos + historial de pagos + estado
      [id]/edit/page.tsx              -- editar orden
  manifest.ts                    -- manifest de la PWA

lib/
  supabase/{client,server,middleware}.ts   -- clientes de Supabase (servidor y navegador)
  types/database.types.ts                    -- tipos generados desde Supabase
  actions/{orders,pagos}.ts                   -- Server Actions (crear/editar/borrar orden, agregar/borrar pago, cambiar estado)
  validations/{order,pago}.ts                  -- validación de formularios (zod)

components/
  ui/                            -- componentes shadcn/ui
  orders/orders-table.tsx, order-status-badge.tsx, order-form.tsx,
          status-select.tsx, payment-list.tsx, payment-form-dialog.tsx
  dashboard/totals-summary.tsx, nav-header.tsx

middleware.ts
public/icons/, sw.js
```

Regla simple: **toda escritura pasa por Server Actions** (crear orden, agregar pago, cambiar estado, borrar). Las lecturas (listado, detalle, totales) se hacen directo en Server Components contra la vista `orders_resumen`. Esto evita tener lógica de Supabase duplicada en el navegador y mantiene todo más fácil de debuggear.

---

## 4. Componentes principales (shadcn/ui)

- **`orders-table.tsx`**: tabla con comprador, producto, precio, badge de estado, badge de saldo restante (rojo si falta pagar, verde si está saldado), con filtro rápido por estado.
- **`order-status-badge.tsx`** / **`status-select.tsx`**: muestran y permiten cambiar el estado (los 5 valores, sin restricciones de flujo).
- **`order-form.tsx`**: comprador, producto, costo, precio de venta, estado inicial. La ganancia se muestra como vista previa en vivo mientras se escribe, pero el valor real siempre viene calculado de la base de datos.
- **`payment-list.tsx`** + **`payment-form-dialog.tsx`**: historial de señas/cuotas por orden (fecha, monto, método, nota) con opción de borrar un pago cargado por error, y un diálogo para cargar uno nuevo.
- **`totals-summary.tsx`**: tarjetas con "Ganancia acumulada" y "Total pendiente de cobro" en el listado.

---

## 5. PWA (instalable, sin offline)

- `app/manifest.ts` (API nativa de Next.js): nombre, ícono, `display: "standalone"`.
- Íconos placeholder (192px, 512px) que se pueden reemplazar por el logo real después sin tocar código.
- Un `sw.js` mínimo (solo para cumplir el requisito de instalabilidad, sin caché offline) registrado una vez en el layout raíz.
- Se verifica con Chrome DevTools → Application → Manifest, y probando "Agregar a pantalla de inicio" desde el celular.

---

## 6. Orden de construcción (para poder mostrar avances de a poco)

1. **Scaffold**: crear proyecto Next.js + Tailwind + shadcn, primer commit.
2. **Supabase**: crear proyecto, aplicar el schema (enums, tablas, vista, RLS), generar tipos, crear el usuario dueño/a.
3. **Login**: conexión con Supabase Auth, middleware de protección, logout.
4. **CRUD de órdenes**: crear, listar, ver detalle, editar (sin pagos todavía).
5. **Pagos y saldo restante**: cargar/borrar señas y cuotas, verificar que el saldo se actualiza bien.
6. **Estados**: selector de estado funcionando en el detalle y reflejado en el listado.
7. **Totales**: tarjetas de resumen en el listado.
8. **PWA**: manifest, íconos, service worker mínimo.
9. **Deploy**: subir a GitHub, desplegar en Vercel, configurar variables de entorno.

Queda fuera del MVP (a futuro si hace falta): búsqueda por comprador, exportar a CSV, modo offline real, multi-moneda, alertas de pedidos estancados.

---

## 7. Cómo verificar que funciona

1. Entrar a `/orders` sin sesión → debe redirigir a `/login`.
2. Loguearse → debe entrar al listado (vacío al principio).
3. Crear una orden → aparece en la tabla; chequear que `total_ganancia` sea correcto (comparar contra Supabase Studio directamente).
4. Cargar una seña parcial → el saldo restante baja en el detalle y en el listado. Cargar una cuota más → sigue bajando hasta llegar a 0 cuando está saldado.
5. Cambiar el estado a lo largo de todo el flujo (Por encargar → Encargado → Pendiente → Entregado) y probar Cancelado desde el medio del flujo.
6. Chequear a mano que los totales de "ganancia acumulada" y "pendiente de cobro" coincidan con 2-3 órdenes de prueba.
7. Cerrar sesión → `/orders` vuelve a bloquearse.
8. Confirmar en Supabase que sin sesión no se puede leer `orders`/`pagos` directamente (RLS funcionando).
9. Verificar instalabilidad de la PWA en Chrome DevTools y desde el celular.
