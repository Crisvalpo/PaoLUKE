'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
        >
          <span className="text-white text-lg">👗</span>
        </div>
        <span 
          className="font-bold text-xl"
          style={{
            background: 'linear-gradient(135deg, #E91E8C, #00BCD4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          PaoLUKE
        </span>
      </Link>
    </header>
  );
}