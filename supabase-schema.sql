-- Cole tudo isto no SQL Editor do Supabase e clique em Run. Pode rodar de novo sem problema.
create table if not exists public.panel (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.panel enable row level security;
drop policy if exists "ler o proprio painel" on public.panel;
drop policy if exists "criar o proprio painel" on public.panel;
drop policy if exists "alterar o proprio painel" on public.panel;
drop policy if exists "apagar o proprio painel" on public.panel;
create policy "ler o proprio painel" on public.panel for select using (auth.uid() = user_id);
create policy "criar o proprio painel" on public.panel for insert with check (auth.uid() = user_id);
create policy "alterar o proprio painel" on public.panel for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "apagar o proprio painel" on public.panel for delete using (auth.uid() = user_id);

-- Fotos enviadas pelo painel (pasta pública para leitura; só você envia na sua pasta)
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true) on conflict (id) do nothing;
drop policy if exists "enviar fotos na propria pasta" on storage.objects;
drop policy if exists "apagar fotos da propria pasta" on storage.objects;
create policy "enviar fotos na propria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "apagar fotos da propria pasta" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);
