import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTags, useAddTag, useUpdateTag, useDeleteTag } from '@/hooks/useTags';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface TagManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagManager({ open, onOpenChange }: TagManagerProps) {
  const { data: tags = [] } = useTags();
  const addTag = useAddTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await addTag.mutateAsync(newName.trim());
      setNewName('');
      toast.success('Tag added');
    } catch {
      toast.error('Failed to add tag');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateTag.mutateAsync({ id, name: editName.trim() });
      setEditingId(null);
      toast.success('Tag updated');
    } catch {
      toast.error('Failed to update tag');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag.mutateAsync(id);
      toast.success('Tag deleted');
    } catch {
      toast.error('Failed to delete tag');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Manage Tags</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New tag name..."
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
          <Button onClick={handleAdd} disabled={addTag.isPending}>Add</Button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              {editingId === tag.id ? (
                <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 h-8"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(tag.id); }}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleUpdate(tag.id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{tag.name}</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingId(tag.id); setEditName(tag.name); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(tag.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          ))}
          {tags.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tags yet</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
