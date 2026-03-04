create table if not exists launch_plans (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  url text not null,
  answers jsonb not null default '[]',
  plan jsonb,
  unlocked boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists launch_plans_session_id_idx on launch_plans(session_id);
