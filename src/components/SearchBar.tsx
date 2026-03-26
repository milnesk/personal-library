import { Search, X } from 'lucide-react';
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search books...'
}: SearchBarProps) {
  return <div className="relative w-full max-w-2xl mx-auto">
      <label htmlFor="book-search" className="sr-only">
        Search books
      </label>
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
      <input id="book-search" type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label="Search all book fields" className="search-input pl-14 pr-12 mx-[10px] my-[10px]" />
      {value && <button onClick={() => onChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted transition-colors focus-ring" aria-label="Clear search">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>}
    </div>;
}