import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book, Tag } from '@/types/book';

async function fetchBooks(): Promise<Book[]> {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const { data: bookTags, error: tagsError } = await supabase
    .from('book_tags')
    .select('book_id, tag_id, tags(id, name, created_at)')
    .returns<Array<{ book_id: string; tag_id: string; tags: Tag }>>();

  if (tagsError) throw tagsError;

  const tagsByBookId = new Map<string, Tag[]>();
  for (const bt of bookTags || []) {
    if (!tagsByBookId.has(bt.book_id)) tagsByBookId.set(bt.book_id, []);
    if (bt.tags) tagsByBookId.get(bt.book_id)!.push(bt.tags);
  }

  return (books || []).map((book) => ({
    ...book,
    tags: tagsByBookId.get(book.id) || [],
  })) as Book[];
}

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (book: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'tags'> & { tagIds?: string[] }) => {
      const { tagIds, ...bookData } = book;
      const { data, error } = await supabase.from('books').insert(bookData).select().single();
      if (error) throw error;

      if (tagIds && tagIds.length > 0) {
        const { error: tagError } = await supabase.from('book_tags').insert(
          tagIds.map((tagId) => ({ book_id: data.id, tag_id: tagId }))
        );
        if (tagError) throw tagError;
      }
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, tagIds, ...bookData }: Partial<Book> & { id: string; tagIds?: string[] }) => {
      const { tags, ...dataToUpdate } = bookData as any;
      const { error } = await supabase.from('books').update(dataToUpdate).eq('id', id);
      if (error) throw error;

      if (tagIds !== undefined) {
        await supabase.from('book_tags').delete().eq('book_id', id);
        if (tagIds.length > 0) {
          const { error: tagError } = await supabase.from('book_tags').insert(
            tagIds.map((tagId) => ({ book_id: id, tag_id: tagId }))
          );
          if (tagError) throw tagError;
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function getUniqueValues(books: Book[], field: keyof Book): string[] {
  const values = books
    .map((book) => book[field])
    .filter((value): value is string => typeof value === 'string' && Boolean(value));
  return [...new Set(values.map((v) => v.trim()))].sort();
}

export function getUniqueTags(books: Book[]): string[] {
  const tags = books.flatMap((b) => b.tags?.map((t) => t.name) || []);
  return [...new Set(tags)].sort();
}
