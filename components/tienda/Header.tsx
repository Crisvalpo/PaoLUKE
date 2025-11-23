'use client';
import Link from 'next/link';
import { useConfig } from '@/lib/useConfig';

export default function Header() {
  const { config, loading } = useConfig();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2">
        {/* Logo */}
        {loading ? (
          // Skeleton mientras carga
          <div className="w-20 h-10 rounded-xl bg-gray-200 animate-pulse" />
        ) : config?.logo_svg ? (
          // Logo SVG desde la base de datos con fondo suave
          <div 
            className="w-20 h-10 rounded-xl flex items-center justify-center p-1 bg-gray-50"
            dangerouslySetInnerHTML={{ __html: config.logo_svg }}
          />
        ) : (
          // Logo por defecto si no hay SVG en la BD
          <div 
            className="w-20 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
          >
            <span className="text-white text-lg">👗</span>
          </div>
        )}

        {/* Nombre de la tienda */}
        {loading ? (
          // Skeleton mientras carga
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <span 
            className="font-bold text-xl"
            style={{
              background: 'linear-gradient(135deg, #E91E8C, #00BCD4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {config?.nombre_tienda || 'PaoLUKE'}
          </span>
        )}
      </Link>
    </header>
  );
}