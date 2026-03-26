import { Book } from '@/types/book';
import { BookCard } from './BookCard';
import { BookX } from 'lucide-react';

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  error: Error | null;
  hasFilters?: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading books">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="book-card animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <BookX className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
        No books found
      </h2>
      <p className="text-muted-foreground max-w-md">
        {hasFilters 
          ? "Try adjusting your search or filters to find what you're looking for."
          : "No books are available at the moment. Please check back later."
        }
      </p>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-16 text-center"
      role="alert"
    >
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <BookX className="w-8 h-8 text-destructive" aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground max-w-md">
        {error.message || "Failed to load books. Please try again later."}
      </p>
    </div>
  );
}

export function BookList({ books, isLoading, error, hasFilters = false }: BookListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (books.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  return (
    <div 
      className="space-y-4"
      role="feed"
      aria-label={`Book list with ${books.length} results`}
      aria-busy={isLoading}
    >
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} index={index} />
      ))}
    </div>
  );
}
