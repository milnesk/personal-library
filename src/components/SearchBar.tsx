import { Search, X } from 'lucide-react';
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search books...',
  id = 'book-search'
}: SearchBarProps) {
  return <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Search books
      </label>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" aria-hidden="true" />
      <input id={id} type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label="Search all book fields" className="w-full pl-10 pr-10 py-2 rounded-md bg-white/15 border border-white/30 text-white placeholder:text-white/60 text-sm font-body transition-all duration-200 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20" />
      {value && <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors focus-ring" aria-label="Clear search">
          <X className="w-3.5 h-3.5 text-white/70" />
        </button>}
    </div>;
}