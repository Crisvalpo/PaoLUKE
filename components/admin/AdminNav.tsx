'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Grid3X3, Settings } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Inicio', icon: Home },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Grid3X3 },
  { href: '/admin/config', label: 'Config', icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

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