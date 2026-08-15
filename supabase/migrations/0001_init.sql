-- Dashboard de gestión de órdenes: schema inicial (MVP, un solo usuario)

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

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table pagos (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  monto numeric(12,2) not null check (monto > 0),
  metodo_pago metodo_pago_enum not null,
  fecha_pago date not null default current_date,
  nota text,
  created_at timestamptz not null default now()
);

create index pagos_order_id_idx on pagos(order_id);

-- Vista con monto pagado y restante por orden.
-- security_invoker: la vista respeta las políticas RLS del usuario que consulta,
-- en vez de correr con los permisos de quien la creó.
create view orders_resumen with (security_invoker = true) as
select
  o.*,
  coalesce(p.monto_pagado, 0) as monto_pagado,
  o.precio_venta - coalesce(p.monto_pagado, 0) as monto_restante
from orders o
left join (
  select order_id, sum(monto) as monto_pagado
  from pagos
  group by order_id
) p on p.order_id = o.id;

alter table orders enable row level security;
alter table pagos enable row level security;

create policy "authenticated full access" on orders
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "authenticated full access" on pagos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
