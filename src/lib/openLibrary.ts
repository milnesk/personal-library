const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

export interface OpenLibraryResult {
  title: string;
  author: string;
  genre: string;
  publish_year: number | null;
  cover_url: string;
}

export async function lookupISBN(isbn: string): Promise<OpenLibraryResult> {
  const cleanISBN = isbn.replace(/[-\s]/g, '');

  // Step 1: Get edition by ISBN
  const editionRes = await fetch(`${OPEN_LIBRARY_BASE}/isbn/${cleanISBN}.json`, { redirect: 'follow' });
  if (!editionRes.ok) throw new Error('ISBN not found');
  const edition = await editionRes.json();

  const title = edition.title || '';
  const publishDate = edition.publish_date || '';
  const yearMatch = publishDate.match(/(\d{4})/);
  const publish_year = yearMatch ? parseInt(yearMatch[1]) : null;

  // Cover URL from edition covers
  const coverId = edition.covers?.[0];
  const cover_url = coverId && coverId > 0
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : '';

  // Step 2: Get work for subjects and author keys
  const workKey = edition.works?.[0]?.key;
  let subjects: string[] = [];
  let authorKeys: string[] = [];

  if (workKey) {
    const workRes = await fetch(`${OPEN_LIBRARY_BASE}${workKey}.json`);
    if (workRes.ok) {
      const work = await workRes.json();
      subjects = (work.subjects || []).slice(0, 5);
      authorKeys = (work.authors || []).map((a: any) => a.author?.key).filter(Boolean);
    }
  }

  // Also check edition-level authors
  if (authorKeys.length === 0 && edition.authors) {
    authorKeys = edition.authors.map((a: any) => a.key).filter(Boolean);
  }

  // Step 3: Resolve author names
  const authorNames: string[] = [];
  for (const key of authorKeys.slice(0, 3)) {
    try {
      const authorRes = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        if (authorData.name) authorNames.push(authorData.name);
      }
    } catch { /* skip failed author lookups */ }
  }

  return {
    title,
    author: authorNames.join(', '),
    genre: subjects.join('; '),
    publish_year,
    cover_url,
  };
}
