import heroImage from '@/assets/hero-comic.jpg';

export function Header() {
  return (
    <header className="relative mb-8 mt-4 overflow-hidden rounded-xl">
      <img
        src={heroImage}
        alt="Library hero"
        className="w-full h-auto object-cover rounded-xl"
        width={1920}
        height={600}
      />
    </header>
  );
}
