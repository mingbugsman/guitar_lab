-- "Có gì mới": when the learner last dismissed the update notice (synced across devices).
alter table public.profiles add column updates_seen_at timestamptz;
