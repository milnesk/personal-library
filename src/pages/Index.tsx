import { useState, useMemo } from 'react';
import { useBooks, getUniqueValues } from '@/hooks/useBooks';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterDropdown } from '@/components/FilterDropdown';
import { SortControls } from '@/components/SortControls';
import { BookList } from '@/components/BookList';
import { ResultsCount } from '@/components/ResultsCount';
import { ActiveFilters } from '@/components/ActiveFilters';
import { FilterState, SortConfig, Book } from '@/types/book';

export default function Index() {
  const { data: books = [], isLoading, error } = useBooks();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    titles: [],
    authors: [],
    genres: [],
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'title',
    direction: 'asc',
  });

  // Get unique values for filter dropdowns
  const uniqueTitles = useMemo(() => getUniqueValues(books, 'title'), [books]);
  const uniqueAuthors = useMemo(() => getUniqueValues(books, 'author'), [books]);
  const uniqueGenres = useMemo(() => getUniqueValues(books, 'genre'), [books]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Global search across all fields
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      result = result.filter((book) =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.review.toLowerCase().includes(searchLower) ||
        book.genre.toLowerCase().includes(searchLower)
      );
    }

    // Multi-select filters
    if (filters.titles.length > 0) {
      result = result.filter((book) => filters.titles.includes(book.title));
    }
    if (filters.authors.length > 0) {
      result = result.filter((book) => filters.authors.includes(book.author));
    }
    if (filters.genres.length > 0) {
      result = result.filter((book) => {
        // Split book's genre by semicolon and check if any match selected genres
        const bookGenres = book.genre.split(';').map((g) => g.trim());
        return filters.genres.some((selectedGenre) => bookGenres.includes(selectedGenre));
      });
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortConfig.field].toLowerCase();
      const bValue = b[sortConfig.field].toLowerCase();
      const comparison = aValue.localeCompare(bValue);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [books, filters, sortConfig]);

  const handleRemoveFilter = (type: 'titles' | 'authors' | 'genres', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      titles: [],
      authors: [],
      genres: [],
    });
  };

  const hasActiveFilters = filters.search || filters.titles.length > 0 || filters.authors.length > 0 || filters.genres.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="container max-w-4xl mx-auto px-4 pb-12">
        <Header />

        <main id="main-content">
          {/* Search Section */}
          <section aria-label="Search" className="mb-6">
            <SearchBar
              value={filters.search}
              onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
              placeholder="Search by title, author, genre, or review..."
            />
          </section>

          {/* Filters Section */}
          <section aria-label="Filters" className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <FilterDropdown
                label="Title"
                options={uniqueTitles}
                selectedValues={filters.titles}
                onChange={(values) => setFilters((prev) => ({ ...prev, titles: values }))}
                colorClass="bg-sage text-sage-foreground"
              />
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

          {/* Results Header */}
          <section 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border"
            aria-label="Results controls"
          >
            <ResultsCount count={filteredBooks.length} total={books.length} />
            <SortControls sortConfig={sortConfig} onSortChange={setSortConfig} />
          </section>

          {/* Book List */}
          <section aria-label="Book results">
            <BookList 
              books={filteredBooks} 
              isLoading={isLoading} 
              error={error as Error | null}
              hasFilters={!!hasActiveFilters}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
