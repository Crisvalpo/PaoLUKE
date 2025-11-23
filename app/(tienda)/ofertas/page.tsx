import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/tienda/ProductCard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

async function getOfertas() {
  const { data } = await supabase
    .from('productos')
    .select('*')
    .not('precio_oferta', 'is', null)
    .neq('estado', 'vendido')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function OfertasPage() {
  const ofertas = await getOfertas();

  return (
    <div>
      <div className="sticky top-14 bg-white z-30 shadow-sm px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-gray-800">🛒 Ofertas</h1>
          <p className="text-xs text-gray-400">{ofertas.length} productos</p>
        </div>
      </div>

      <div className="p-4">
        {ofertas.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {ofertas.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🏷️</span>
            <p className="text-gray-500">No hay ofertas por ahora</p>
            <p className="text-sm text-gray-400 mt-1">¡Vuelve pronto!</p>
          </div>
        )}
      </div>
    </div>
  );
}