import { supabase } from '@/lib/supabase';
import CategoryList from '@/components/tienda/CategoryList';

async function getCategorias() {
  const { data } = await supabase
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('orden');
  return data || [];
}

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Categorías</h2>
      <CategoryList categorias={categorias} />
    </div>
  );
}