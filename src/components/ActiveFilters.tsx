import { X } from 'lucide-react';
import { FilterState } from '@/types/book';

type FilterType = 'authors' | 'statuses' | 'tags';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (type: FilterType, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters: { type: FilterType; value: string; label: string }[] = [];

  filters.authors.forEach((value) => activeFilters.push({ type: 'authors', value, label: `Author: ${value}` }));
  filters.statuses.forEach((value) => activeFilters.push({ type: 'statuses', value, label: `Status: ${value.replace(/_/g, ' ')}` }));
  filters.tags.forEach((value) => activeFilters.push({ type: 'tags', value, label: `Tag: ${value}` }));

  if (activeFilters.length === 0 && !filters.search && filters.isFiction === null) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" role="region" aria-label="Active filters">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.search && (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          Search: "{filters.search}"
        </span>
      )}
      {filters.isFiction !== null && (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {filters.isFiction ? 'Fiction' : 'Nonfiction'}
        </span>
      )}
      {activeFilters.map(({ type, value, label }) => (
        <button
          key={`${type}-${value}`}
          onClick={() => onRemoveFilter(type, value)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors focus-ring"
          aria-label={`Remove filter: ${label}`}
        >
          <span className="max-w-[150px] truncate">{label}</span>
          <X className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        </button>
      ))}
      <button onClick={onClearAll} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded px-2 py-1">
        Clear all
      </button>
    </div>
  );
}
