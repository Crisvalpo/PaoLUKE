'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Producto } from '@/lib/types';
import { formatPrice, formatSku, calcularStock, calcularDescuento } from '@/lib/utils';
import { getImageUrl } from '@/lib/supabase';

interface Props {
  producto: Producto;
}

export default function ProductCard({ producto }: Props) {
  const tieneOferta = producto.precio_oferta !== null;
  const stock = calcularStock(producto.variantes);
  const agotado = stock === 0;

  return (
    <Link 
      href={`/producto/${producto.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform block"
    >
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={getImageUrl(producto.fotos?.[0])}
          alt={producto.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        
        {tieneOferta && (
          <div 
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
          >
            {calcularDescuento(producto.precio, producto.precio_oferta!)}%
          </div>
        )}
        
        {stock <= 2 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 px-2 py-0.5 rounded-full text-xs font-bold text-white">
            ¡Últimos!
          </div>
        )}
        
        {agotado && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AGOTADO</span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <p className="text-xs text-gray-400">{formatSku(producto.id)}</p>
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 truncate">
          {producto.nombre}
        </h3>
        <div className="flex items-center gap-2">
          {tieneOferta ? (
            <>
              <span className="font-bold text-sm" style={{ color: '#E91E8C' }}>
                {formatPrice(producto.precio_oferta!)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(producto.precio)}
              </span>
            </>
          ) : (
            <span className="font-bold text-sm text-gray-800">
              {formatPrice(producto.precio)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}