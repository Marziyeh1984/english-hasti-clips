-- Store the same lesson content used by the built-in LessonClip player.
-- Each video keeps ordered dialogue timestamps/translations and vocabulary.
alter table public.videos
  add column if not exists badge text not null default 'درس جدید',
  add column if not exists dialogues jsonb not null default '[]'::jsonb,
  add column if not exists vocab jsonb not null default '[]'::jsonb;

alter table public.videos
  drop constraint if exists videos_dialogues_is_array,
  drop constraint if exists videos_vocab_is_array,
  drop constraint if exists videos_dialogues_valid,
  drop constraint if exists videos_vocab_valid;

alter table public.videos
  add constraint videos_dialogues_is_array
    check (jsonb_typeof(dialogues) = 'array'),
  add constraint videos_vocab_is_array
    check (jsonb_typeof(vocab) = 'array');

-- Existing video RLS policies continue to protect these fields because they
-- are stored on the videos row itself. No separate public content table is needed.
