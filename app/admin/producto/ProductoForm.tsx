'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCategorias } from '@/lib/hooks';
import ImageUploader from '@/components/admin/ImageUploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  precio_oferta?: number | null;
  fotos: string[];
  categoria_id: number;
  subcategoria_id: number;
  variantes: { t: string; s: number }[];
  ubicacion: string;
  destacado: boolean;
}

interface Props {
  producto?: Producto;
}

export default function ProductoForm({ producto }: Props) {
  const router = useRouter();
  const { categorias } = useCategorias();
  const [saving, setSaving] = useState(false);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);

  const [form, setForm] = useState<Producto>({
    nombre: producto?.nombre || '',
    precio: producto?.precio || 0,
    precio_oferta: producto?.precio_oferta || null,
    fotos: producto?.fotos || [],
    categoria_id: producto?.categoria_id || 0,
    subcategoria_id: producto?.subcategoria_id || 0,
    variantes: producto?.variantes || [],
    ubicacion: producto?.ubicacion || '',
    destacado: producto?.destacado || false,
  });

  const [tallaInput, setTallaInput] = useState('');

  // Cargar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (form.categoria_id) {
      supabase
        .from('subcategorias')
        .select('*')
        .eq('categoria_id', form.categoria_id)
        .then(({ data }) => {
          setSubcategorias(data || []);
          if (data && data.length > 0 && !producto) {
            setForm(f => ({ ...f, subcategoria_id: data[0].id }));
          }
        });
    }
  }, [form.categoria_id]);

  // Setear categoría inicial
  useEffect(() => {
    if (categorias.length > 0 && !form.categoria_id) {
      setForm(f => ({ ...f, categoria_id: categorias[0].id }));
    }
  }, [categorias]);

  const subcategoriaActual = subcategorias.find(s => s.id === form.subcategoria_id);

  const toggleTalla = (talla: string) => {
    const existe = form.variantes.find(v => v.t === talla);
    if (existe) {
      setForm({
        ...form,
        variantes: form.variantes.filter(v => v.t !== talla),
      });
    } else {
      setForm({
        ...form,
        variantes: [...form.variantes, { t: talla, s: 1 }],
      });
    }
  };

  const updateStock = (talla: string, delta: number) => {
    setForm({
      ...form,
      variantes: form.variantes.map(v =>
        v.t === talla ? { ...v, s: Math.max(0, v.s + delta) } : v
      ),
    });
  };

  const addTallaCustom = () => {
    if (tallaInput && !form.variantes.find(v => v.t === tallaInput)) {
      setForm({
        ...form,
        variantes: [...form.variantes, { t: tallaInput, s: 1 }],
      });
      setTallaInput('');
    }
  };

  const handleSave = async () => {
    if (!form.nombre || !form.precio) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    if (form.variantes.length === 0) {
      alert('Debes agregar al menos una talla');
      return;
    }

    setSaving(true);

    const data = {
      nombre: form.nombre,
      precio: form.precio,
      precio_oferta: form.precio_oferta || null,
      fotos: form.fotos,
      categoria_id: form.categoria_id,
      subcategoria_id: form.subcategoria_id,
      variantes: form.variantes,
      ubicacion: form.ubicacion.toUpperCase(),
      destacado: form.destacado,
    };

    try {
      if (producto?.id) {
        // Editar
        await supabase.from('productos').update(data).eq('id', producto.id);
      } else {
        // Crear
        const { data: newProduct, error } = await supabase
          .from('productos')
          .insert([{ ...data, estado: 'disponible' }])
          .select()
          .single();

        if (error) throw error;

        // Si hay fotos en temp/, moverlas a la carpeta del producto
        if (newProduct && form.fotos.some(f => f.startsWith('temp/'))) {
          const fotosActualizadas = await Promise.all(
            form.fotos.map(async (foto) => {
              if (foto.startsWith('temp/')) {
                const nombreArchivo = foto.split('/')[1];
                const nuevaRuta = `${newProduct.id}/${nombreArchivo}`;
                
                // Copiar archivo
                const { data: fileData } = await supabase.storage
                  .from('productos')
                  .download(foto);
                
                if (fileData) {
                  await supabase.storage
                    .from('productos')
                    .upload(nuevaRuta, fileData);
                  
                  // Eliminar archivo temporal
                  await supabase.storage.from('productos').remove([foto]);
                }
                
                return nuevaRuta;
              }
              return foto;
            })
          );

          // Actualizar producto con nuevas rutas
          await supabase
            .from('productos')
            .update({ fotos: fotosActualizadas })
            .eq('id', newProduct.id);
        }
      }

      router.push('/admin/productos');
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/productos" className="p-1 -ml-1 text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-bold text-lg text-gray-800">
            {producto ? 'Editar producto' : 'Nuevo producto'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl text-white font-medium text-sm disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div className="p-4 space-y-5 pb-8">
        {/* Fotos */}
        <ImageUploader
          fotos={form.fotos}
          productoId={producto?.id}
          onChange={(fotos) => setForm({ ...form, fotos })}
        />

        {/* Nombre */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Nombre del producto *
          </label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Disfraz Frozen Elsa"
            className="w-full px-4 py-3 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Precios */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Precio *
            </label>
            <input
              type="number"
              value={form.precio || ''}
              onChange={(e) => setForm({ ...form, precio: parseInt(e.target.value) || 0 })}
              placeholder="15000"
              className="w-full px-4 py-3 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Precio oferta
            </label>
            <input
              type="number"
              value={form.precio_oferta || ''}
              onChange={(e) => setForm({ ...form, precio_oferta: parseInt(e.target.value) || null })}
              placeholder="12000"
              className="w-full px-4 py-3 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Categoría y subcategoría */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Categoría *
            </label>
            <select
              value={form.categoria_id}
              onChange={(e) => setForm({ ...form, categoria_id: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none"
            >
              <option value={0}>Selecciona...</option>
              {categorias.filter(c => c.activa).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Subcategoría *
            </label>
            <select
              value={form.subcategoria_id}
              onChange={(e) => setForm({ ...form, subcategoria_id: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none"
              disabled={subcategorias.length === 0}
            >
              <option value={0}>Selecciona...</option>
              {subcategorias.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Ubicación en almacén
          </label>
          <input
            type="text"
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value.toUpperCase() })}
            placeholder="Ej: NAV-2-1, C1, PERCHA-3"
            className="w-full px-4 py-3 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Código para encontrar el producto fácilmente
          </p>
        </div>

        {/* Tallas */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Tallas disponibles *
          </label>

          {/* Tallas predefinidas */}
          {subcategoriaActual?.tallas_default && subcategoriaActual.tallas_default.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {subcategoriaActual.tallas_default.map((t: string) => {
                const sel = form.variantes.find((v) => v.t === t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTalla(t)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      sel ? 'text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                    style={
                      sel
                        ? { background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }
                        : {}
                    }
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}

          {/* Stock por talla */}
          {form.variantes.length > 0 && (
            <div className="space-y-2 mb-3">
              {form.variantes.map((v) => (
                <div
                  key={v.t}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200"
                >
                  <span className="text-sm font-medium">{v.t}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateStock(v.t, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 font-bold hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{v.s}</span>
                    <button
                      type="button"
                      onClick={() => updateStock(v.t, 1)}
                      className="w-8 h-8 rounded-full text-white font-bold hover:opacity-90 transition-opacity"
                      style={{ background: '#E91E8C' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agregar talla personalizada */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tallaInput}
              onChange={(e) => setTallaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTallaCustom()}
              placeholder="Talla personalizada (ej: 2XL)"
              className="flex-1 px-4 py-2 bg-white rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="button"
              onClick={addTallaCustom}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Destacado */}
        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            ⭐ Producto destacado
          </span>
          <button
            type="button"
            onClick={() => setForm({ ...form, destacado: !form.destacado })}
            className={`w-12 h-7 rounded-full transition-colors ${
              form.destacado ? '' : 'bg-gray-300'
            }`}
            style={
              form.destacado
                ? { background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }
                : {}
            }
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.destacado ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}