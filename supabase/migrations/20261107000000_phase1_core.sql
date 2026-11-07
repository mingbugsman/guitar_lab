-- GUITAR LAB — Phase 0/1 core schema
-- Curriculum content (levels, lessons, chords) is versioned in the repo under src/content
-- and referenced here by stable slugs. The database only stores user-owned data.

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  experience text not null default 'complete_beginner'
    check (experience in ('complete_beginner', 'some_experience')),
  guitar_type text check (guitar_type in ('acoustic', 'electric', 'classical')),
  handedness text not null default 'right' check (handedness in ('right', 'left')),
  practice_goal_minutes smallint not null default 30
    check (practice_goal_minutes between 10 and 120),
  learning_target text not null default 'learn_from_zero',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth user; created by trigger on signup.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 60), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Lesson progress
--   completed_at       : learner finished the content + checklist (Completion)
--   self_rating        : learner's own assessment 1..5 (Self-assessment)
--   verified_at        : reserved for objective assessments; never written by clients
-- ---------------------------------------------------------------------------
create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null check (lesson_slug ~ '^[a-z0-9-]{1,80}$'),
  status text not null default 'learning'
    check (status in ('learning', 'practicing', 'mastered')),
  checklist text[] not null default '{}',
  self_rating smallint check (self_rating between 1 and 5),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  verified_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug),
  -- Mastered requires verified evidence.
  constraint mastered_requires_verification
    check (status <> 'mastered' or verified_at is not null)
);

create index lesson_progress_user_completed_idx
  on public.lesson_progress (user_id, completed_at desc);

create trigger lesson_progress_set_updated_at
  before update on public.lesson_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Practice sessions & activities
-- ---------------------------------------------------------------------------
create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_key text not null default 'daily-30',
  planned_minutes smallint not null check (planned_minutes between 1 and 240),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed')),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  notes text check (char_length(notes) <= 2000),
  focus_rating smallint check (focus_rating between 1 and 5),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create index practice_sessions_user_started_idx
  on public.practice_sessions (user_id, started_at desc);

create table public.practice_activities (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.practice_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  position smallint not null,
  kind text not null
    check (kind in ('recall', 'theory', 'technical', 'application', 'free_play', 'reflection')),
  title text not null,
  planned_seconds integer not null check (planned_seconds > 0),
  actual_seconds integer not null default 0 check (actual_seconds >= 0),
  completed_at timestamptz,
  unique (session_id, position)
);

create index practice_activities_session_idx on public.practice_activities (session_id);
create index practice_activities_user_idx on public.practice_activities (user_id);

-- ---------------------------------------------------------------------------
-- Milestones (awarded by server code from real data)
-- ---------------------------------------------------------------------------
create table public.user_milestones (
  user_id uuid not null references auth.users (id) on delete cascade,
  milestone_key text not null check (milestone_key ~ '^[a-z0-9-]{1,60}$'),
  achieved_at timestamptz not null default now(),
  primary key (user_id, milestone_key)
);

-- ---------------------------------------------------------------------------
-- Row Level Security: every row belongs to exactly one user.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.practice_activities enable row level security;
alter table public.user_milestones enable row level security;

create policy "profiles: read own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: update own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "lesson_progress: read own" on public.lesson_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "lesson_progress: insert own" on public.lesson_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "lesson_progress: update own" on public.lesson_progress
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "practice_sessions: read own" on public.practice_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "practice_sessions: insert own" on public.practice_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "practice_sessions: update own" on public.practice_sessions
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "practice_sessions: delete own" on public.practice_sessions
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "practice_activities: read own" on public.practice_activities
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "practice_activities: insert own" on public.practice_activities
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.practice_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );
create policy "practice_activities: update own" on public.practice_activities
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "user_milestones: read own" on public.user_milestones
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "user_milestones: insert own" on public.user_milestones
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- Clients may never set verified_at (only service-side assessment code may),
-- so table-level write grants are replaced by column-level grants.
revoke insert, update on public.lesson_progress from authenticated, anon;
grant insert (user_id, lesson_slug, status, checklist, self_rating, completed_at)
  on public.lesson_progress to authenticated;
grant update (user_id, lesson_slug, status, checklist, self_rating, completed_at)
  on public.lesson_progress to authenticated;
