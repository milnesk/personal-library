import { ExternalLink } from 'lucide-react';
import { Book } from '@/types/book';
import { BookCover } from './BookCover';
interface BookCardProps {
  book: Book;
  index: number;
}

// Wallpaper-inspired color palette for genre tags
function getGenreColor(genre: string): string {
  const normalizedGenre = genre.toLowerCase().trim();

  // Color assignment based on genre patterns using grandma's wallpaper colors
  if (normalizedGenre.includes('fiction') || normalizedGenre.includes('novel')) {
    return 'bg-sage text-sage-foreground';
  }
  if (normalizedGenre.includes('mystery') || normalizedGenre.includes('thriller')) {
    return 'bg-forest text-forest-foreground';
  }
  if (normalizedGenre.includes('romance') || normalizedGenre.includes('love')) {
    return 'bg-cream text-cream-foreground';
  }
  if (normalizedGenre.includes('fantasy') || normalizedGenre.includes('sci-fi') || normalizedGenre.includes('science')) {
    return 'bg-olive text-olive-foreground';
  }
  if (normalizedGenre.includes('history') || normalizedGenre.includes('biography')) {
    return 'bg-mustard text-mustard-foreground';
  }

  // Cycle through wallpaper colors for other genres
  const colors = ['bg-sage text-sage-foreground', 'bg-mustard text-mustard-foreground', 'bg-cream text-cream-foreground', 'bg-olive text-olive-foreground', 'bg-warm-brown text-warm-brown-foreground'];
  const hash = normalizedGenre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
export function BookCard({
  book,
  index
}: BookCardProps) {
  const hasReview = book.review && book.review.trim().length > 0;
  const hasGenre = book.genre && book.genre.trim().length > 0;
  return <article className="book-card animate-fade-in" style={{
    animationDelay: `${Math.min(index * 50, 500)}ms`
  }} aria-labelledby={`book-title-${book.id}`}>
      <div className="grid grid-cols-[10%_25%_1fr] gap-6 items-start">
        {/* Book Cover - Left Column */}
        <div className="flex-shrink-0">
          <BookCover title={book.title} author={book.author} openLibraryWorkId={book.openLibraryWorkId} />
        </div>

        {/* Title & Author - Middle Column */}
        <div className="min-w-0 pr-4">
          <h2 id={`book-title-${book.id}`} className="font-display text-lg font-semibold text-foreground leading-tight">
            {book.title}
          </h2>
          {book.author && <p className="text-sm text-muted-foreground mt-1">
              by <span className="font-medium text-foreground">{book.author}</span>
            </p>}
        </div>

        {/* Review, Genre & Link - Right Column */}
        <div className="min-w-0 space-y-3">
          {hasReview && <p className="text-sm text-muted-foreground leading-relaxed">
              {book.review}
            </p>}
          
          {hasGenre && (
            <ul className="flex flex-wrap gap-2 items-center list-none p-0 m-0" aria-label="Book genres">
              {book.genre.split(';').map((g, i) => {
                const trimmedGenre = g.trim();
                return (
                  <li key={i}>
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getGenreColor(trimmedGenre)}`}
                    >
                      {trimmedGenre}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          
          {book.url && <a href={book.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent hover:underline focus-ring rounded transition-colors" aria-label={`View ${book.title} on Goodreads (opens in new tab)`}>
              See more on Goodreads
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>}
        </div>
      </div>
    </article>;
}