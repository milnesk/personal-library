
-- Create status enum
CREATE TYPE public.book_status AS ENUM ('read', 'to_be_read');

-- Books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  publish_year INTEGER,
  isbn TEXT DEFAULT '',
  status book_status NOT NULL DEFAULT 'to_be_read',
  owned BOOLEAN NOT NULL DEFAULT false,
  cover_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Book-tags junction table
CREATE TABLE public.book_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (book_id, tag_id)
);

-- Enable RLS (permissive for now - no auth yet)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_tags ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (will be locked down when auth is added)
CREATE POLICY "Allow all access to books" ON public.books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to tags" ON public.tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to book_tags" ON public.book_tags FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
