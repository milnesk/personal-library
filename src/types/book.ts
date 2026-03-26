export interface Book {
  id: string;
  title: string;
  author: string;
  publish_year: number | null;
  isbn: string;
  status: 'read' | 'to_be_read' | 'currently_reading';
  owned: boolean;
  is_fiction: boolean | null;
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

export type SortField = 'title' | 'author' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  search: string;
  authors: string[];
  statuses: string[];
  tags: string[];
  owned: boolean | null;
  isFiction: boolean | null;
}
