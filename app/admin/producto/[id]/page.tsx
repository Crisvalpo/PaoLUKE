import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductoForm from '../ProductoForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProducto(id: number) {
  const { data } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const producto = await getProducto(parseInt(id));

  if (!producto) notFound();

  return <ProductoForm producto={producto} />;
}