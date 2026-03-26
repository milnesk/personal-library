import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortConfig, SortField } from '@/types/book';

interface SortControlsProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
}

const sortOptions: { field: SortField; label: string }[] = [
  { field: 'title', label: 'Title' },
  { field: 'author', label: 'Author' },
  { field: 'genre', label: 'Genre' },
  { field: 'status', label: 'Status' },
];

export function SortControls({ sortConfig, onSortChange }: SortControlsProps) {
  const handleSort = (field: SortField) => {
    if (sortConfig.field === field) {
      onSortChange({
        field,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  return (
    <div 
      className="flex items-center gap-2 flex-wrap" 
      role="toolbar"
      aria-label="Sort options"
    >
      <span id="sort-label" className="text-sm text-muted-foreground font-medium mr-1">Sort by:</span>
      <div role="group" aria-labelledby="sort-label" className="flex items-center gap-2 flex-wrap">
        {sortOptions.map(({ field, label }) => {
          const isActive = sortConfig.field === field;
          const Icon = isActive 
            ? sortConfig.direction === 'asc' ? ArrowUp : ArrowDown 
            : ArrowUpDown;
          
          return (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`sort-button focus-ring ${
                isActive ? 'sort-button-active' : 'sort-button-inactive'
              }`}
              aria-pressed={isActive}
              aria-label={`Sort by ${label}${isActive ? `, currently ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}` : ''}`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
