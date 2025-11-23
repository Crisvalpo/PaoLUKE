'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCategorias } from '@/lib/hooks';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, X } from 'lucide-react';

interface Subcategoria {
  id: number;
  nombre: string;
  categoria_id: number;
  tallas_default: string[];
}

export default function CategoriasPage() {
  const { categorias } = useCategorias();
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Subcategoria | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState<number>(0);

  const [formSub, setFormSub] = useState({
    nombre: '',
    categoria_id: 0,
    tallas_default: [] as string[],
  });
  const [tallaInput, setTallaInput] = useState('');

  useEffect(() => {
    loadSubcategorias();
  }, []);

  useEffect(() => {
    if (categorias.length > 0 && categoriaActiva === 0) {
      setCategoriaActiva(categorias[0].id);
    }
  }, [categorias]);

  const loadSubcategorias = async () => {
    const { data } = await supabase
      .from('subcategorias')
      .select('*')
      .order('nombre');
    setSubcategorias(data || []);
    setLoading(false);
  };

  const subsCategoria = subcategorias.filter(s => s.categoria_id === categoriaActiva);

  const abrirModal = (sub?: Subcategoria) => {
    if (sub) {
      setEditando(sub);
      setFormSub({
        nombre: sub.nombre,
        categoria_id: sub.categoria_id,
        tallas_default: sub.tallas_default || [],
      });
    } else {
      setEditando(null);
      setFormSub({
        nombre: '',
        categoria_id: categoriaActiva,
        tallas_default: [],
      });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setFormSub({ nombre: '', categoria_id: 0, tallas_default: [] });
    setTallaInput('');
  };

  const agregarTalla = () => {
    if (tallaInput && !formSub.tallas_default.includes(tallaInput)) {
      setFormSub({
        ...formSub,
        tallas_default: [...formSub.tallas_default, tallaInput],
      });
      setTallaInput('');
    }
  };

  const eliminarTalla = (talla: string) => {
    setFormSub({
      ...formSub,
      tallas_default: formSub.tallas_default.filter(t => t !== talla),
    });
  };

  const guardarSubcategoria = async () => {
    if (!formSub.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      if (editando) {
        await supabase
          .from('subcategorias')
          .update(formSub)
          .eq('id', editando.id);
      } else {
        await supabase.from('subcategorias').insert([formSub]);
      }
      
      await loadSubcategorias();
      cerrarModal();
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar');
    }
  };

  const eliminarSubcategoria = async (id: number) => {
    if (!confirm('¿Eliminar esta subcategoría? Los productos que la usen quedarán sin subcategoría.')) {
      return;
    }

    try {
      await supabase.from('subcategorias').delete().eq('id', id);
      await loadSubcategorias();
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar');
    }
  };

  const tallasComunes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única', '2 años', '4 años', '6 años', '8 años', '10 años', '12 años'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-30 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 -ml-2 text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-bold text-lg text-gray-800">Categorías</h1>
        </div>
      </div>

      {/* Tabs de categorías */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto px-4 scrollbar-hide">
          {categorias.filter(c => c.activa).map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                categoriaActiva === cat.id
                  ? 'border-pink-500 text-pink-500'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {cat.emoji} {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Botón agregar */}
        <button
          onClick={() => abrirModal()}
          className="w-full py-3 rounded-xl text-white font-bold mb-4 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
        >
          <Plus size={20} />
          Nueva Subcategoría
        </button>

        {/* Lista de subcategorías */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : subsCategoria.length > 0 ? (
          <div className="space-y-3">
            {subsCategoria.map(sub => (
              <div key={sub.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{sub.nombre}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModal(sub)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => eliminarSubcategoria(sub.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sub.tallas_default.map(t => (
                    <span key={t} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay subcategorías</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {editando ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
              </h2>
              <button onClick={cerrarModal} className="p-2 text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formSub.nombre}
                  onChange={(e) => setFormSub({ ...formSub, nombre: e.target.value })}
                  placeholder="Ej: Poleras, Accesorios"
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Categoría *
                </label>
                <select
                  value={formSub.categoria_id}
                  onChange={(e) => setFormSub({ ...formSub, categoria_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none"
                >
                  {categorias.filter(c => c.activa).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tallas por defecto */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tallas por defecto
                </label>
                
                {/* Tallas comunes */}
                <div className="flex gap-2 flex-wrap mb-3">
                  {tallasComunes.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        if (formSub.tallas_default.includes(t)) {
                          eliminarTalla(t);
                        } else {
                          setFormSub({
                            ...formSub,
                            tallas_default: [...formSub.tallas_default, t],
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        formSub.tallas_default.includes(t)
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Tallas seleccionadas */}
                {formSub.tallas_default.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {formSub.tallas_default.map(t => (
                      <span
                        key={t}
                        className="px-3 py-1.5 bg-pink-50 text-pink-600 text-sm rounded-lg flex items-center gap-2"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => eliminarTalla(t)}
                          className="hover:text-pink-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Talla personalizada */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tallaInput}
                    onChange={(e) => setTallaInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && agregarTalla()}
                    placeholder="Talla personalizada"
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={agregarTalla}
                    className="px-4 py-2 bg-gray-200 rounded-xl text-sm font-medium"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={cerrarModal}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarSubcategoria}
                  className="flex-1 py-3 rounded-xl text-white font-medium"
                  style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}