import heroImage from '@/assets/grandma-books-header.png';
export function Header() {
  return <header style={{
    backgroundImage: `url(${heroImage})`
  }} className="relative py-16 sm:py-20 md:py-24 text-center bg-cover bg-center rounded-3xl">
      <div aria-hidden="true" className="absolute inset-0 bg-cream/70 border-4 px-0 border-double rounded-3xl" />
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl text-foreground mb-3 drop-shadow-sm font-serif font-semibold md:text-5xl">
          Grandma Joan's Book Reviews
        </h1>
        <p className="text-base sm:text-lg max-w-lg mx-auto px-4 text-secondary-foreground">
          Discover treasured reads from a lifetime of stories. Search, filter, and explore her curated collection.
        </p>
      </div>
    </header>;
}