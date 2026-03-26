import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Book, Tag } from '@/types/book';
import { useTags, useAddTag } from '@/hooks/useTags';
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
  const addTag = useAddTag();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [status, setStatus] = useState<'read' | 'to_be_read'>('to_be_read');
  const [owned, setOwned] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre);
      setPublishYear(book.publish_year?.toString() || '');
      setIsbn(book.isbn);
      setStatus(book.status);
      setOwned(book.owned);
      setNotes(book.notes);
      setSelectedTagIds(book.tags?.map((t) => t.id) || []);
    } else {
      setTitle(''); setAuthor(''); setGenre(''); setPublishYear('');
      setIsbn(''); setStatus('to_be_read'); setOwned(false); setNotes('');
      setSelectedTagIds([]);
    }
  }, [book, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }

    onSave({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      publish_year: publishYear ? parseInt(publishYear) : null,
      isbn: isbn.trim(),
      status,
      owned,
      notes: notes.trim(),
      cover_url: book?.cover_url || '',
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
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Fiction; Mystery" />
            </div>
            <div>
              <Label htmlFor="publishYear">Publish Year</Label>
              <Input id="publishYear" type="number" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} placeholder="2024" />
            </div>
          </div>
          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'read' | 'to_be_read')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="to_be_read">To Be Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Checkbox id="owned" checked={owned} onCheckedChange={(c) => setOwned(c === true)} />
                <Label htmlFor="owned" className="cursor-pointer">I own this book</Label>
              </div>
            </div>
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
