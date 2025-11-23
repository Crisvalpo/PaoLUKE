import { supabase } from '@/lib/supabase';
import CategoryList from '@/components/tienda/CategoryList';

export const revalidate = 60;

async function getData() {
  const [categoriasRes, productosRes] = await Promise.all([
    supabase
      .from('categorias')
      .select('*')
      .eq('activa', true)
      .order('orden'),
    supabase
      .from('productos')
      .select('id, categoria_id')
      .neq('estado', 'vendido'),
  ]);

  return {
    categorias: categoriasRes.data || [],
    productos: productosRes.data || [],
  };
}

export default async function CategoriasPage() {
  const { categorias, productos } = await getData();

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Categorías</h1>
      <CategoryList categorias={categorias} />
    </div>
  );
}