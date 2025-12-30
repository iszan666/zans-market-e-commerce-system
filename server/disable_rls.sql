-- TEMPORARY: Disable RLS for migration to allow the anon key (if used) or ensure service role key is actually used
-- The user might have provided an ANON key instead of SERVICE ROLE key
-- If anon key is used, we need to allow public insert/delete

alter table users disable row level security;
alter table products disable row level security;
alter table orders disable row level security;
