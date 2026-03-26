import { Pencil, Trash2, BookOpen, BookMarked } from 'lucide-react';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: Book;
  index: number;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const panelColors = [
  'bg-comic-blue',
  'bg-comic-red',
  'bg-comic-olive',
  'bg-comic-amber',
];

function getPanelColor(index: number): string {
  return panelColors[index % panelColors.length];
}

function getGenreColor(genre: string): string {
  const g = genre.toLowerCase().trim();
  if (g.includes('fiction')) return 'bg-comic-blue text-comic-blue-foreground';
  if (g.includes('mystery') || g.includes('thriller')) return 'bg-comic-red text-comic-red-foreground';
  if (g.includes('fantasy') || g.includes('sci-fi')) return 'bg-comic-olive text-comic-olive-foreground';
  if (g.includes('history') || g.includes('biography')) return 'bg-comic-amber text-comic-amber-foreground';
  const colors = [
    'bg-comic-blue text-comic-blue-foreground',
    'bg-comic-red text-comic-red-foreground',
    'bg-comic-olive text-comic-olive-foreground',
    'bg-comic-amber text-comic-amber-foreground',
  ];
  const hash = g.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function BookCard({ book, index, onEdit, onDelete }: BookCardProps) {
  const genres = book.genre ? book.genre.split(';').map((g) => g.trim()).filter(Boolean) : [];
  const colorAccent = getPanelColor(index);

  return (
    <article
      className="book-card animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className="flex">
        {/* Color accent strip */}
        <div className={`w-2 shrink-0 ${colorAccent}`} />

        {/* Cover image */}
        {book.cover_url && (
          <div className="w-20 sm:w-24 shrink-0 border-r-3 border-foreground overflow-hidden" style={{ borderRightWidth: '3px' }}>
            <img
              src={book.cover_url}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading text-xl font-bold text-foreground leading-tight uppercase tracking-wide">
                  {book.title}
                </h2>
                {book.status === 'read' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-comic-olive text-comic-olive-foreground border border-foreground">
                    <BookOpen className="w-3 h-3" /> Read
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-comic-amber text-comic-amber-foreground border border-foreground">
                    <BookMarked className="w-3 h-3" /> TBR
                  </span>
                )}
                {book.owned && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-comic-blue text-comic-blue-foreground border border-foreground">
                    Owned
                  </span>
                )}
              </div>
              {book.author && (
                <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                  by <span className="text-foreground font-semibold">{book.author}</span>
                  {book.publish_year && <span className="ml-1.5 text-muted-foreground">({book.publish_year})</span>}
                </p>
              )}
              {book.isbn && <p className="text-xs text-muted-foreground mt-0.5 font-mono">ISBN {book.isbn}</p>}
            </div>
            <div className="flex gap-0.5 shrink-0">
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-comic-blue/10" onClick={() => onEdit(book)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 text-destructive" onClick={() => onDelete(book.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {book.notes && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{book.notes}</p>
          )}

          {(genres.length > 0 || (book.tags && book.tags.length > 0)) && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {genres.map((g, i) => (
                <span key={i} className={`genre-tag ${getGenreColor(g)}`}>
                  {g}
                </span>
              ))}
              {book.tags?.map((tag) => (
                <span key={tag.id} className="genre-tag bg-muted text-muted-foreground">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
