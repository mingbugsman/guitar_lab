-- Results of practice-engine drills (finger drills now; chord challenge and fingerpicking later).
-- The learner rates each run; "fastest clean tempo" = max(bpm_reached) where rating = 'clean'.

create table public.drill_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  drill_id text not null check (drill_id ~ '^[a-z0-9:-]{1,80}$'),
  kind text not null check (kind in ('finger', 'chord-challenge', 'picking')),
  bpm_reached smallint not null check (bpm_reached between 20 and 300),
  rating text not null check (rating in ('clean', 'some-buzz', 'lost')),
  seconds smallint not null check (seconds between 5 and 1800),
  created_at timestamptz not null default now()
);

create index drill_results_user_drill_idx on public.drill_results (user_id, drill_id, created_at desc);

alter table public.drill_results enable row level security;

create policy "drill_results: read own" on public.drill_results
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "drill_results: insert own" on public.drill_results
  for insert to authenticated with check ((select auth.uid()) = user_id);

revoke all on public.drill_results from anon;
