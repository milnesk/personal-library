import { useState } from 'react';
import { Pencil, Trash2, BookOpen, BookMarked, BookOpenCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface BookCardProps {
  book: Book;
  index: number;
  onEdit?: (book: Book) => void;
  onDelete?: (id: string) => void;
}

const MAX_VISIBLE_TAGS = 3;

const accentColors = [
  'hsl(155, 55%, 32%)',
  'hsl(320, 55%, 52%)',
  'hsl(260, 45%, 48%)',
  'hsl(38, 75%, 55%)',
];

export function BookCard({ book, index, onEdit, onDelete }: BookCardProps) {
  const accent = accentColors[index % accentColors.length];
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <article
      className="book-card animate-fade-in"
      style={{
        animationDelay: `${Math.min(index * 40, 400)}ms`,
        borderLeftColor: accent,
      }}
    >
      <div className="flex">
        {book.cover_url && (
          <div className="w-20 sm:w-24 shrink-0 overflow-hidden">
            <img
              src={book.cover_url}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-lg font-bold text-foreground leading-tight uppercase tracking-wide">
                {book.title}
              </h2>
              {book.is_fiction === true && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-comic-blue/15 text-comic-blue">
                  Fiction
                </span>
              )}
              {book.is_fiction === false && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-comic-olive/15 text-comic-olive">
                  Nonfiction
                </span>
              )}
              {book.status === 'read' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-comic-olive/15 text-comic-olive">
                  <BookOpen className="w-3 h-3" /> Read
                </span>
              )}
              {book.status === 'currently_reading' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-comic-blue/15 text-comic-blue">
                  <BookOpenCheck className="w-3 h-3" /> Reading
                </span>
              )}
              {book.status === 'to_be_read' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-comic-amber/15 text-comic-amber">
                  <BookMarked className="w-3 h-3" /> TBR
                </span>
              )}
              {book.owned && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-comic-blue/15 text-comic-blue">
                  Owned
                </span>
              )}
            </div>
            {book.author && (
              <p className="text-sm text-muted-foreground mt-1">
                by <span className="text-foreground font-semibold">{book.author}</span>
                {book.publish_year && <span className="ml-1.5">({book.publish_year})</span>}
              </p>
            )}
          </div>

          {book.description && (
            <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen} className="mt-2.5">
              <CollapsibleTrigger asChild>
                <button className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary hover:text-primary/80 transition-colors">
                  {summaryOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {summaryOpen ? 'Hide Summary' : 'Show Summary'}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <p className="text-sm text-muted-foreground leading-relaxed">{book.description}</p>
              </CollapsibleContent>
            </Collapsible>
          )}

          {book.notes && (
            <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">{book.notes}</p>
          )}

          {(book.tags?.length || book.description || book.notes) && (
            <hr className="border-border/50 mt-3" />
          )}

          <div className="flex items-end justify-between gap-2 mt-2.5">
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {book.tags?.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                <span key={tag.id} className="genre-tag bg-muted text-muted-foreground">{tag.name}</span>
              ))}
              {(book.tags?.length ?? 0) > MAX_VISIBLE_TAGS && (
                <span className="genre-tag bg-muted text-muted-foreground">
                  +{(book.tags?.length ?? 0) - MAX_VISIBLE_TAGS}
                </span>
              )}
            </div>
            {(onEdit || onDelete) && (
              <div className="flex gap-0.5 shrink-0">
                {onEdit && (
                  <Button size="icon" variant="ghost" className="h-7 w-7 rounded-md hover:bg-comic-blue/10" onClick={() => onEdit(book)} aria-label={`Edit ${book.title}`}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                )}
                {onDelete && (
                  <Button size="icon" variant="ghost" className="h-7 w-7 rounded-md hover:bg-destructive/10 text-destructive" onClick={() => onDelete(book.id)} aria-label={`Delete ${book.title}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
