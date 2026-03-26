import heroImage from '@/assets/hero-comic.jpg';

export function Header() {
  return (
    <header className="relative mb-8 mt-4 overflow-hidden rounded-xl">
      <div className="relative">
        <img
          src={heroImage}
          alt=""
          className="w-full h-64 sm:h-72 md:h-80 object-cover"
          width={1920}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,15%,20%)] via-[hsl(220,15%,20%,0.4)] to-transparent" />
        <div className="absolute inset-0 flex items-end px-6 sm:px-10 pb-6 sm:pb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-wider leading-none">
              MY LIBRARY
            </h1>
            <p className="font-heading text-base sm:text-lg text-white/80 mt-1.5 font-semibold uppercase tracking-wide">
              Personal Book Collection
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
