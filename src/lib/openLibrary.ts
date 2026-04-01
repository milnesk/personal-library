const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

export interface OpenLibraryResult {
  title: string;
  author: string;
  publish_year: number | null;
  cover_url: string;
  description: string;
}

export async function lookupISBN(isbn: string): Promise<OpenLibraryResult> {
  const cleanISBN = isbn.replace(/[-\s]/g, '');

  const editionRes = await fetch(`${OPEN_LIBRARY_BASE}/isbn/${cleanISBN}.json`, { redirect: 'follow' });
  if (!editionRes.ok) throw new Error('ISBN not found');
  const edition = await editionRes.json();

  const title = edition.title || '';
  const publishDate = edition.publish_date || '';
  const yearMatch = publishDate.match(/(\d{4})/);
  const publish_year = yearMatch ? parseInt(yearMatch[1]) : null;

  const coverId = edition.covers?.[0];
  const cover_url = coverId && coverId > 0
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : '';

  const workKey = edition.works?.[0]?.key;
  let authorKeys: string[] = [];

  if (workKey) {
    const workRes = await fetch(`${OPEN_LIBRARY_BASE}${workKey}.json`);
    if (workRes.ok) {
      const work = await workRes.json();
      authorKeys = (work.authors || []).map((a: any) => a.author?.key).filter(Boolean);
    }
  }

  if (authorKeys.length === 0 && edition.authors) {
    authorKeys = edition.authors.map((a: any) => a.key).filter(Boolean);
  }

  const authorNames: string[] = [];
  for (const key of authorKeys.slice(0, 3)) {
    try {
      const authorRes = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        if (authorData.name) authorNames.push(authorData.name);
      }
    } catch { /* skip */ }
  }

  return {
    title,
    author: authorNames.join(', '),
    publish_year,
    cover_url,
  };
}
