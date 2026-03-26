import heroImage from '@/assets/hero-comic.jpg';
import { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="relative mb-8 mt-4 overflow-hidden rounded-xl" role="banner">
      <img
        src={heroImage}
        alt="Illustrated fantasy library with glowing portals nestled in ancient trees"
        className="w-full h-auto object-cover rounded-xl"
        width={1920}
        height={600}
      />
      {children && (
        <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-[hsl(160,20%,10%,0.75)] via-[hsl(160,20%,10%,0.3)] to-transparent">
          <div className="w-full px-4 sm:px-8 pb-5 sm:pb-7 pt-16">
            {children}
          </div>
        </div>
      )}
    </header>
  );
}
