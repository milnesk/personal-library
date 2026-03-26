import { useQuery } from '@tanstack/react-query';
import { Book } from '@/types/book';

const SHEET_ID = '1FX5iPSf6cEcjpG7sbT65A9ct3X0nmen89HTCzNTOsYM';
// Use the CSV export which works for publicly shared sheets
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseCSV(text: string): Book[] {
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  const books: Book[] = [];
  
  // Skip header row, parse each data row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV properly handling quoted fields
    const values = parseCSVLine(line);
    
    const title = values[0]?.trim() || '';
    const author = values[1]?.trim() || '';
    const review = values[2]?.trim() || '';  // Column C
    const genre = values[3]?.trim() || '';   // Column D
    const url = values[4]?.trim() || '';     // Column E
    const openLibraryWorkId = values[5]?.trim() || ''; // Column F (Open Library Work ID)

    if (title) {
      books.push({
        id: `book-${i}`,
        title,
        author,
        review,
        genre,
        url,
        openLibraryWorkId: openLibraryWorkId || undefined,
      });
    }
  }

  return books;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current);

  return result;
}

async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(SHEET_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  const text = await response.text();
  return parseCSV(text);
}

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
}

export function getUniqueValues(books: Book[], field: keyof Book): string[] {
  const values = books
    .map((book) => book[field])
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => {
      // Split semicolon-separated values (for genre field)
      if (field === 'genre') {
        return value.split(';').map((v) => v.trim()).filter(Boolean);
      }
      return [value.trim()];
    });
  
  return [...new Set(values)].sort();
}
