-- Cole tudo isto no SQL Editor do Supabase e clique em Run.
create table if not exists public.panel (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.panel enable row level security;
create policy "ler o proprio painel" on public.panel for select using (auth.uid() = user_id);
create policy "criar o proprio painel" on public.panel for insert with check (auth.uid() = user_id);
create policy "alterar o proprio painel" on public.panel for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "apagar o proprio painel" on public.panel for delete using (auth.uid() = user_id);
