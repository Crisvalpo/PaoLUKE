'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/lib/types';
import ProductCard from '@/components/tienda/ProductCard';

export default function BuscarPage() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const searchTerm = query.replace('#', '');
      
      const { data } = await supabase
        .from('productos')
        .select('*')
        .eq('estado', 'disponible')
        .or(`nombre.ilike.%${searchTerm}%,id.eq.${parseInt(searchTerm) || 0}`);

      setResultados(data || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <div className="sticky top-14 bg-white z-30 shadow-sm px-4 py-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Buscar producto o SKU..."
          className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none"
          autoFocus
        />
      </div>

      <div className="p-4">
        {query.length > 1 ? (
          loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : resultados.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {resultados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">😕</span>
              <p className="text-gray-500">No encontramos "{query}"</p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-500">Busca por nombre o SKU</p>
            <p className="text-sm text-gray-400 mt-1">Ej: "Frozen" o "#00047"</p>
          </div>
        )}
      </div>
    </div>
  );
}