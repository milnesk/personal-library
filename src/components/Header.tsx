import heroImage from '@/assets/hero-comic.jpg';

export function Header() {
  return (
    <header className="relative mb-8 mt-4 overflow-hidden border-3 border-foreground" style={{ borderWidth: '3px' }}>
      {/* Comic panel grid hero */}
      <div className="relative">
        <img
          src={heroImage}
          alt=""
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
          width={1920}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-wider drop-shadow-lg leading-none">
              MY LIBRARY
            </h1>
            <p className="font-heading text-lg sm:text-xl text-white/90 mt-2 font-semibold uppercase tracking-wide">
              Personal Book Collection Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
