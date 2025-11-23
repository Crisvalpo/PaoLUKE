'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, Search, MessageCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/categorias', label: 'Categorías', icon: Grid3X3 },
  { href: '/buscar', label: 'Buscar', icon: Search },
  { href: '/contacto', label: 'Contacto', icon: MessageCircle, isWA: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          if (item.isWA) {
            return (
              <a
                key={item.href}
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center py-1 px-2"
              >
                <Icon 
                  size={24} 
                  className="text-gray-400"
                />
                <span className="text-xs mt-0.5 text-gray-400">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-1 px-2"
            >
              <Icon 
                size={24} 
                style={{ color: isActive ? '#E91E8C' : '#9CA3AF' }}
              />
              <span 
                className="text-xs mt-0.5"
                style={{ color: isActive ? '#E91E8C' : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}