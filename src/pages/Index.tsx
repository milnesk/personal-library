import { useState, useMemo } from 'react';
import { useBooks, useAddBook, useUpdateBook, useDeleteBook, getUniqueValues, getUniqueTags } from '@/hooks/useBooks';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterDropdown } from '@/components/FilterDropdown';
import { SortControls } from '@/components/SortControls';
import { BookCard } from '@/components/BookCard';
import { ResultsCount } from '@/components/ResultsCount';
import { ActiveFilters } from '@/components/ActiveFilters';
import { BookFormDialog } from '@/components/BookFormDialog';
import { TagManager } from '@/components/TagManager';
import { Button } from '@/components/ui/button';
import { Plus, Tags } from 'lucide-react';
import { FilterState, SortConfig, Book } from '@/types/book';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  const { data: books = [], isLoading, error } = useBooks();
  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    authors: [],
    genres: [],
    statuses: [],
    tags: [],
    owned: null,
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'title', direction: 'asc' });
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);

  const uniqueAuthors = useMemo(() => getUniqueValues(books, 'author'), [books]);
  const uniqueGenres = useMemo(() => getUniqueValues(books, 'genre'), [books]);
  const uniqueTags = useMemo(() => getUniqueTags(books), [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (filters.search.trim()) {
      const s = filters.search.toLowerCase().trim();
      result = result.filter((b) =>
        b.title.toLowerCase().includes(s) ||
        b.author.toLowerCase().includes(s) ||
        b.genre.toLowerCase().includes(s) ||
        b.notes.toLowerCase().includes(s) ||
        b.isbn.toLowerCase().includes(s) ||
        b.tags?.some((t) => t.name.toLowerCase().includes(s))
      );
    }
    if (filters.authors.length > 0) result = result.filter((b) => filters.authors.includes(b.author));
    if (filters.genres.length > 0) {
      result = result.filter((b) => {
        const bg = b.genre.split(';').map((g) => g.trim());
        return filters.genres.some((g) => bg.includes(g));
      });
    }
    if (filters.statuses.length > 0) {
      result = result.filter((b) => filters.statuses.includes(b.status));
    }
    if (filters.tags.length > 0) {
      result = result.filter((b) => b.tags?.some((t) => filters.tags.includes(t.name)));
    }
    if (filters.owned !== null) {
      result = result.filter((b) => b.owned === filters.owned);
    }

    result.sort((a, b) => {
      const aVal = String(a[sortConfig.field] || '').toLowerCase();
      const bVal = String(b[sortConfig.field] || '').toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [books, filters, sortConfig]);

  const handleSave = async (data: any) => {
    try {
      if (data.id) {
        await updateBook.mutateAsync(data);
        toast.success('Book updated');
      } else {
        await addBook.mutateAsync(data);
        toast.success('Book added');
      }
      setBookDialogOpen(false);
      setEditingBook(null);
    } catch {
      toast.error('Failed to save book');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook.mutateAsync(id);
      toast.success('Book deleted');
    } catch {
      toast.error('Failed to delete book');
    }
  };

  const handleRemoveFilter = (type: 'authors' | 'genres' | 'statuses' | 'tags', value: string) => {
    setFilters((prev) => ({ ...prev, [type]: (prev[type] as string[]).filter((v) => v !== value) }));
  };

  const handleClearAllFilters = () => {
    setFilters({ search: '', authors: [], genres: [], statuses: [], tags: [], owned: null });
  };

  const hasActiveFilters = filters.search || filters.authors.length > 0 || filters.genres.length > 0 || filters.statuses.length > 0 || filters.tags.length > 0 || filters.owned !== null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 pb-12">
        <Header />
        <main id="main-content">
          {/* Actions bar */}
          <section className="flex items-center gap-3 mb-6">
            <Button onClick={() => { setEditingBook(null); setBookDialogOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" /> Add Book
            </Button>
            <Button variant="outline" onClick={() => setTagManagerOpen(true)} className="gap-2">
              <Tags className="w-4 h-4" /> Manage Tags
            </Button>
          </section>

          {/* Search */}
          <section aria-label="Search" className="mb-6">
            <SearchBar
              value={filters.search}
              onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
              placeholder="Search by title, author, genre, ISBN, tag, or notes..."
            />
          </section>

          {/* Filters */}
          <section aria-label="Filters" className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <FilterDropdown
                label="Author"
                options={uniqueAuthors}
                selectedValues={filters.authors}
                onChange={(values) => setFilters((prev) => ({ ...prev, authors: values }))}
                colorClass="bg-mustard text-mustard-foreground"
              />
              <FilterDropdown
                label="Genre"
                options={uniqueGenres}
                selectedValues={filters.genres}
                onChange={(values) => setFilters((prev) => ({ ...prev, genres: values }))}
                colorClass="bg-olive text-olive-foreground"
              />
              <FilterDropdown
                label="Status"
                options={['read', 'to_be_read']}
                selectedValues={filters.statuses}
                onChange={(values) => setFilters((prev) => ({ ...prev, statuses: values }))}
                colorClass="bg-sage text-sage-foreground"
              />
              {uniqueTags.length > 0 && (
                <FilterDropdown
                  label="Tags"
                  options={uniqueTags}
                  selectedValues={filters.tags}
                  onChange={(values) => setFilters((prev) => ({ ...prev, tags: values }))}
                  colorClass="bg-cream text-cream-foreground"
                />
              )}
            </div>
          </section>

          {/* Active Filters */}
          {hasActiveFilters && (
            <section aria-label="Active filters" className="mb-6">
              <ActiveFilters
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </section>
          )}

          {/* Results */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border">
            <ResultsCount count={filteredBooks.length} total={books.length} />
            <SortControls sortConfig={sortConfig} onSortChange={setSortConfig} />
          </section>

          {/* Book List */}
          <section aria-label="Book results" className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
            ) : error ? (
              <p className="text-center text-destructive py-8">Failed to load books. Please try again.</p>
            ) : filteredBooks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {books.length === 0 ? 'No books yet. Click "Add Book" to get started!' : 'No books match your filters.'}
              </p>
            ) : (
              filteredBooks.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={i}
                  onEdit={(b) => { setEditingBook(b); setBookDialogOpen(true); }}
                  onDelete={handleDelete}
                />
              ))
            )}
          </section>
        </main>
      </div>

      <BookFormDialog
        open={bookDialogOpen}
        onOpenChange={(open) => { setBookDialogOpen(open); if (!open) setEditingBook(null); }}
        book={editingBook}
        onSave={handleSave}
        isSaving={addBook.isPending || updateBook.isPending}
      />
      <TagManager open={tagManagerOpen} onOpenChange={setTagManagerOpen} />
    </div>
  );
}
