export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publish_year: number | null;
  isbn: string;
  status: 'read' | 'to_be_read';
  owned: boolean;
  cover_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface BookTag {
  id: string;
  book_id: string;
  tag_id: string;
}

export type SortField = 'title' | 'author' | 'genre' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  search: string;
  authors: string[];
  genres: string[];
  statuses: string[];
  tags: string[];
  owned: boolean | null;
}
