-- RLS Policies for Products Table

-- 1. Anyone can view products
CREATE POLICY "Allow public read access for products"
ON public.products
FOR SELECT
USING (true);

-- 2. Only admin users can insert products
CREATE POLICY "Allow admin insert access for products"
ON public.products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Only admin users can update products
CREATE POLICY "Allow admin update access for products"
ON public.products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Only admin users can delete products
CREATE POLICY "Allow admin delete access for products"
ON public.products
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
