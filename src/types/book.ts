export interface Book {
  id: string;
  title: string;
  author: string;
  review: string;
  genre: string;
  url: string;
  openLibraryWorkId?: string;
}

export type SortField = 'title' | 'author' | 'genre';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  search: string;
  titles: string[];
  authors: string[];
  genres: string[];
}
