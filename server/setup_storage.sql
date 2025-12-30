-- Create a storage bucket called 'images'
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Policy to allow anyone to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Policy to allow authenticated users (service role) to upload
-- Since we are uploading from backend with service role, this might not be strictly needed if RLS is disabled or service role bypasses,
-- but good to have if we ever go client-side.
create policy "Service Role Upload"
on storage.objects for insert
with check ( bucket_id = 'images' );

-- Allow delete
create policy "Service Role Delete"
on storage.objects for delete
using ( bucket_id = 'images' );
