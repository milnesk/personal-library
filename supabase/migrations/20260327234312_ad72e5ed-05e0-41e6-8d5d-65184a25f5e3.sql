
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all access to books" ON public.books;
DROP POLICY IF EXISTS "Allow all access to tags" ON public.tags;
DROP POLICY IF EXISTS "Allow all access to book_tags" ON public.book_tags;

-- Books: public read, authenticated write
CREATE POLICY "Anyone can read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update books" ON public.books FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete books" ON public.books FOR DELETE TO authenticated USING (true);

-- Tags: public read, authenticated write
CREATE POLICY "Anyone can read tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update tags" ON public.tags FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete tags" ON public.tags FOR DELETE TO authenticated USING (true);

-- Book_tags: public read, authenticated write
CREATE POLICY "Anyone can read book_tags" ON public.book_tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert book_tags" ON public.book_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete book_tags" ON public.book_tags FOR DELETE TO authenticated USING (true);
