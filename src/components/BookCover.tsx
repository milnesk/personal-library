import { useState } from 'react';

interface BookCoverProps {
  title: string;
  author: string;
  openLibraryWorkId?: string;
}

// Generate Open Library cover URL from Work ID
function getOpenLibraryCoverUrl(workId: string): string {
  return `https://covers.openlibrary.org/b/olid/${workId}-M.jpg`;
}

// Search Open Library API for cover as fallback
async function searchOpenLibraryCover(title: string, author: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}&limit=1&fields=cover_i`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const coverId = data.docs?.[0]?.cover_i;
    
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }
    return null;
  } catch {
    return null;
  }
}

export function BookCover({ title, author, openLibraryWorkId }: BookCoverProps) {
  // If we have a Work ID, use it directly
  const initialSrc = openLibraryWorkId ? getOpenLibraryCoverUrl(openLibraryWorkId) : null;
  
  const [imageSrc, setImageSrc] = useState<string | null>(initialSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!openLibraryWorkId);
  const [hasFetched, setHasFetched] = useState(!!openLibraryWorkId);

  // Fetch from Open Library search if no Work ID provided
  if (!hasFetched && !openLibraryWorkId) {
    setHasFetched(true);
    searchOpenLibraryCover(title, author).then((url) => {
      if (url) {
        setImageSrc(url);
      } else {
        setHasError(true);
      }
      setIsLoading(false);
    });
  }

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Show placeholder if loading, error, or no image
  if (hasError || (!imageSrc && !isLoading)) {
    return (
      <div 
        className="flex-shrink-0 w-14 h-20 rounded-lg bg-sage/50 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <svg 
          className="w-6 h-6 text-olive/60" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-muted">
      {isLoading && (
        <div className="w-full h-full bg-muted animate-pulse" />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`Cover of ${title}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
        />
      )}
    </div>
  );
}
