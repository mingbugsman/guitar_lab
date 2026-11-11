-- One-minute chord changes: how many times the learner placed a chord (or switched between two)
-- in a timed run. Used to show progress per chord / chord pair over days.

create table public.chord_change_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- one chord ("em") or a pair sorted alphabetically ("am-em") so history groups regardless of order
  chords text not null check (chords ~ '^[a-z0-9]{1,8}(-[a-z0-9]{1,8})?$'),
  changes smallint not null check (changes between 0 and 400),
  seconds smallint not null default 60 check (seconds between 10 and 600),
  counted_by text not null check (counted_by in ('mic', 'manual')),
  created_at timestamptz not null default now()
);

create index chord_change_runs_user_chords_idx
  on public.chord_change_runs (user_id, chords, created_at desc);

alter table public.chord_change_runs enable row level security;

create policy "chord_change_runs: read own" on public.chord_change_runs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "chord_change_runs: insert own" on public.chord_change_runs
  for insert to authenticated with check ((select auth.uid()) = user_id);

revoke all on public.chord_change_runs from anon;
