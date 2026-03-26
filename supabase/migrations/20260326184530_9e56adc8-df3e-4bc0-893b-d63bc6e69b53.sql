-- Step 1: Add is_fiction column
ALTER TABLE public.books ADD COLUMN is_fiction boolean DEFAULT NULL;

-- Step 2: Set is_fiction based on existing genre data
UPDATE public.books
SET is_fiction = true
WHERE lower(genre) LIKE '%fiction%' AND lower(genre) NOT LIKE '%nonfiction%' AND lower(genre) NOT LIKE '%non-fiction%';

UPDATE public.books
SET is_fiction = false
WHERE lower(genre) LIKE '%nonfiction%' OR lower(genre) LIKE '%non-fiction%';

-- Step 3: Insert unique genre values as tags (excluding fiction/nonfiction, trimmed)
INSERT INTO public.tags (name)
SELECT DISTINCT trim(g) 
FROM (
  SELECT unnest(string_to_array(genre, ';')) AS g FROM public.books WHERE genre != ''
) sub
WHERE trim(lower(g)) NOT IN ('fiction', 'nonfiction', 'non-fiction', '')
  AND trim(g) NOT IN (SELECT name FROM public.tags)
ON CONFLICT DO NOTHING;

-- Step 4: Link books to their genre-derived tags
INSERT INTO public.book_tags (book_id, tag_id)
SELECT b.id, t.id
FROM public.books b,
     unnest(string_to_array(b.genre, ';')) AS g
JOIN public.tags t ON t.name = trim(g)
WHERE trim(lower(g)) NOT IN ('fiction', 'nonfiction', 'non-fiction', '')
  AND b.genre != ''
  AND NOT EXISTS (
    SELECT 1 FROM public.book_tags bt WHERE bt.book_id = b.id AND bt.tag_id = t.id
  );

-- Step 5: Drop genre column
ALTER TABLE public.books DROP COLUMN genre;