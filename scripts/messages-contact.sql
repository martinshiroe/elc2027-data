-- Table des messages du formulaire de contact (page /contact).
--
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller → Run.
-- Seule la fonction serverless /api/contact y écrit, avec la clé service_role ;
-- la sécurité au niveau des lignes (RLS) ferme la table à tout autre accès.

create table if not exists public.messages_contact (
  id         bigint generated always as identity primary key,
  cree_le    timestamptz not null default now(),
  nom        text not null check (char_length(nom) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  message    text not null check (char_length(message) between 1 and 4000),
  traite     boolean not null default false
);

alter table public.messages_contact enable row level security;

create index if not exists messages_contact_cree_le_idx
  on public.messages_contact (cree_le desc);
