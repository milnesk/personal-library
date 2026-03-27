
-- Tighten RLS policies on books table
DROP POLICY IF EXISTS "Authenticated users can insert books" ON public.books;
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update books" ON public.books;
CREATE POLICY "Authenticated users can update books" ON public.books FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete books" ON public.books;
CREATE POLICY "Authenticated users can delete books" ON public.books FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Tighten RLS policies on tags table
DROP POLICY IF EXISTS "Authenticated users can insert tags" ON public.tags;
CREATE POLICY "Authenticated users can insert tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update tags" ON public.tags;
CREATE POLICY "Authenticated users can update tags" ON public.tags FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete tags" ON public.tags;
CREATE POLICY "Authenticated users can delete tags" ON public.tags FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Tighten RLS policies on book_tags table
DROP POLICY IF EXISTS "Authenticated users can insert book_tags" ON public.book_tags;
CREATE POLICY "Authenticated users can insert book_tags" ON public.book_tags FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete book_tags" ON public.book_tags;
CREATE POLICY "Authenticated users can delete book_tags" ON public.book_tags FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
