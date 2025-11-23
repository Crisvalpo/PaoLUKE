import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductoDetalle from './ProductoDetalle';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProducto(id: number) {
  const { data } = await supabase
    .from('productos')
    .select('*, categoria:categorias(*)')
    .eq('id', id)
    .single();
  return data;
}

async function getConfig() {
  const { data } = await supabase.from('config').select('*').single();
  return data;
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const productoId = parseInt(id);
  
  const [producto, config] = await Promise.all([
    getProducto(productoId),
    getConfig(),
  ]);

  if (!producto) notFound();

  return <ProductoDetalle producto={producto} config={config} />;
}