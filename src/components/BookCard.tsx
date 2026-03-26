import { ExternalLink, Pencil, Trash2, BookOpen, BookMarked } from 'lucide-react';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: Book;
  index: number;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

function getGenreColor(genre: string): string {
  const g = genre.toLowerCase().trim();
  if (g.includes('fiction') || g.includes('novel')) return 'bg-sage text-sage-foreground';
  if (g.includes('mystery') || g.includes('thriller')) return 'bg-forest text-forest-foreground';
  if (g.includes('romance')) return 'bg-cream text-cream-foreground';
  if (g.includes('fantasy') || g.includes('sci-fi')) return 'bg-olive text-olive-foreground';
  if (g.includes('history') || g.includes('biography')) return 'bg-mustard text-mustard-foreground';
  const colors = ['bg-sage text-sage-foreground', 'bg-mustard text-mustard-foreground', 'bg-cream text-cream-foreground', 'bg-olive text-olive-foreground', 'bg-warm-brown text-warm-brown-foreground'];
  const hash = g.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function BookCard({ book, index, onEdit, onDelete }: BookCardProps) {
  const genres = book.genre ? book.genre.split(';').map((g) => g.trim()).filter(Boolean) : [];

  return (
    <article className="book-card animate-fade-in" style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-lg font-semibold text-foreground leading-tight truncate">
              {book.title}
            </h2>
            {book.status === 'read' ? (
              <BookOpen className="w-4 h-4 text-accent shrink-0" aria-label="Read" />
            ) : (
              <BookMarked className="w-4 h-4 text-muted-foreground shrink-0" aria-label="To be read" />
            )}
            {book.owned && (
              <Badge variant="outline" className="text-xs shrink-0">Owned</Badge>
            )}
          </div>
          {book.author && (
            <p className="text-sm text-muted-foreground">
              by <span className="font-medium text-foreground">{book.author}</span>
              {book.publish_year && <span className="ml-2">({book.publish_year})</span>}
            </p>
          )}
          {book.isbn && <p className="text-xs text-muted-foreground mt-0.5">ISBN: {book.isbn}</p>}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(book)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete(book.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {book.notes && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{book.notes}</p>}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {genres.map((g, i) => (
          <span key={i} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getGenreColor(g)}`}>
            {g}
          </span>
        ))}
        {book.tags?.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>
        ))}
      </div>
    </article>
  );
}
