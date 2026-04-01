import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Search, Loader2 } from 'lucide-react';
import { Book, Tag } from '@/types/book';
import { useTags, useAddTag } from '@/hooks/useTags';
import { useBooks } from '@/hooks/useBooks';
import { lookupISBN } from '@/lib/openLibrary';
import { toast } from 'sonner';

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSave: (data: any) => void;
  isSaving: boolean;
}

export function BookFormDialog({ open, onOpenChange, book, onSave, isSaving }: BookFormDialogProps) {
  const { data: allTags = [] } = useTags();
  const { data: allBooks = [] } = useBooks();
  const addTag = useAddTag();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [status, setStatus] = useState<'read' | 'to_be_read' | 'currently_reading'>('to_be_read');
  const [owned, setOwned] = useState(false);
  const [isFiction, setIsFiction] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLooking, setIsLooking] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setPublishYear(book.publish_year?.toString() || '');
      setIsbn(book.isbn);
      setStatus(book.status);
      setOwned(book.owned);
      setIsFiction(book.is_fiction);
      setNotes(book.notes);
      setCoverUrl(book.cover_url || '');
      setDescription(book.description || '');
      setSelectedTagIds(book.tags?.map((t) => t.id) || []);
    } else {
      setTitle(''); setAuthor(''); setPublishYear('');
      setIsbn(''); setStatus('to_be_read'); setOwned(false); setIsFiction(null);
      setNotes(''); setCoverUrl(''); setDescription(''); setSelectedTagIds([]);
    }
  }, [book, open]);

  const handleLookup = async () => {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    if (!cleanISBN) { toast.error('Enter an ISBN first'); return; }

    setIsLooking(true);
    try {
      const result = await lookupISBN(cleanISBN);
      setTitle(result.title || title);
      setAuthor(result.author || author);
      if (result.publish_year) setPublishYear(result.publish_year.toString());
      if (result.cover_url) setCoverUrl(result.cover_url);
      toast.success('Book details found!');
    } catch {
      toast.error('Could not find book. Check the ISBN and try again.');
    } finally {
      setIsLooking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }

    const cleanedIsbn = isbn.trim();
    if (cleanedIsbn) {
      const duplicate = allBooks.find(
        (b) => b.isbn?.replace(/[-\s]/g, '') === cleanedIsbn.replace(/[-\s]/g, '') && b.id !== book?.id
      );
      if (duplicate) {
        toast.error(`This ISBN is already in your library: "${duplicate.title}"`);
        return;
      }
    }
    onSave({
      title: title.trim(),
      author: author.trim(),
      publish_year: publishYear ? parseInt(publishYear) : null,
      isbn: isbn.trim(),
      status,
      owned,
      is_fiction: isFiction,
      notes: notes.trim(),
      cover_url: coverUrl,
      tagIds: selectedTagIds,
      ...(book ? { id: book.id } : {}),
    });
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await addTag.mutateAsync(newTagName.trim());
      setSelectedTagIds((prev) => [...prev, tag.id]);
      setNewTagName('');
    } catch {
      toast.error('Tag may already exist');
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{book ? 'Edit Book' : 'Add Book'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ISBN with Lookup */}
          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <div className="flex gap-2">
              <Input
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 978-0451524935"
                className="flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLookup(); } }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleLookup}
                disabled={isLooking || !isbn.trim()}
                className="gap-1.5 shrink-0"
              >
                {isLooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Lookup
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Enter ISBN and click Lookup to auto-fill details</p>
          </div>

          {/* Cover preview */}
          {coverUrl && (
            <div className="flex justify-center">
              <img src={coverUrl} alt="Book cover" className="h-32 rounded-md shadow-card object-contain" />
            </div>
          )}

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="publishYear">Publish Year</Label>
            <Input id="publishYear" type="number" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} placeholder="2024" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'read' | 'to_be_read' | 'currently_reading')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="currently_reading">Currently Reading</SelectItem>
                  <SelectItem value="to_be_read">To Be Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={isFiction === true ? 'fiction' : isFiction === false ? 'nonfiction' : 'unset'}
                onValueChange={(v) => setIsFiction(v === 'fiction' ? true : v === 'nonfiction' ? false : null)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unset">Not set</SelectItem>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="nonfiction">Nonfiction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="owned" checked={owned} onCheckedChange={(c) => setOwned(c === true)} />
            <Label htmlFor="owned" className="cursor-pointer">I own this book</Label>
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTagIds.includes(tag.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                  {selectedTagIds.includes(tag.id) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag..."
                className="flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag} disabled={addTag.isPending}>
                Add
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : book ? 'Update' : 'Add Book'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
