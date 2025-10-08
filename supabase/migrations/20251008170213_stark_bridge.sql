/*
  # Create chat tables for OpsCentral Assistant

  1. New Tables
    - `chat_threads`
      - `id` (text, primary key)
      - `userId` (text)
      - `title` (text, not null)
      - `createdAt` (timestamptz, default now())
      - `updatedAt` (timestamptz, default now())
    - `chat_messages`
      - `id` (text, primary key)
      - `threadId` (text, foreign key to chat_threads)
      - `userId` (text)
      - `role` (text, check constraint: user/assistant/system)
      - `content` (text, not null)
      - `createdAt` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add basic policies for read and insert (MVP - relax later)
*/

create table if not exists public.chat_threads (
  id text primary key,
  userId text,
  title text not null,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id text primary key,
  threadId text not null references public.chat_threads(id) on delete cascade,
  userId text,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  createdAt timestamptz not null default now()
);

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- Simple MVP policies (relax later)
do $$
begin
  if not exists (select 1 from pg_policies where tablename='chat_threads' and policyname='threads_read') then
    create policy threads_read on public.chat_threads for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='chat_threads' and policyname='threads_insert') then
    create policy threads_insert on public.chat_threads for insert with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename='chat_messages' and policyname='messages_read') then
    create policy messages_read on public.chat_messages for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='chat_messages' and policyname='messages_insert') then
    create policy messages_insert on public.chat_messages for insert with check (true);
  end if;
end $$;