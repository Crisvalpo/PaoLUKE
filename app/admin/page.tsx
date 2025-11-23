'use client';
import { useProductos, useAuth } from '@/lib/hooks';
import Link from 'next/link';
import { Plus, Printer, LogOut } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import AdminProductCard from '@/components/admin/AdminProductCard';
import EstadoModal from '@/components/admin/EstadoModal';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/lib/types';

export default function AdminDashboard() {
  const { productos, setProductos } = useProductos();
  const { logout } = useAuth();
  const [modalEstado, setModalEstado] = useState<Producto | null>(null);

  const stats = {
    disponibles: productos.filter((p) => p.estado === 'disponible').length,
    reservados: productos.filter((p) => p.estado === 'reservado').length,
    vendidos: productos.filter((p) => p.estado === 'vendido').length,
    stockBajo: productos.filter(
      (p) =>
        p.variantes.reduce((a, v) => a + v.s, 0) <= 2 &&
        p.estado === 'disponible'
    ).length,
  };

  const cambiarEstado = async (estado: 'disponible' | 'reservado' | 'vendido') => {
    if (!modalEstado) return;

    const updates: any = { estado };
    if (estado === 'vendido') {
      updates.vendido_at = new Date().toISOString();
    } else {
      updates.vendido_at = null;
    }

    await supabase.from('productos').update(updates).eq('id', modalEstado.id);

    setProductos(
      productos.map((p) =>
        p.id === modalEstado.id ? { ...p, ...updates } : p
      )
    );
    setModalEstado(null);
  };

  const recientes = [...productos]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
            >
              <span className="text-white text-2xl">👗</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bienvenida</p>
              <h1 className="font-bold text-xl text-gray-800">PaoLUKE Admin</h1>
            </div>
          </div>
          <button onClick={logout} className="p-2 text-gray-400">
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard valor={stats.disponibles} label="Disponibles" color="#10B981" />
          <StatsCard valor={stats.reservados} label="Reservados" color="#F59E0B" />
          <StatsCard valor={stats.vendidos} label="Vendidos" color="#EF4444" />
          <StatsCard valor={stats.stockBajo} label="Stock bajo" color="#F97316" />
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/admin/producto/nuevo"
            className="bg-white rounded-xl p-4 shadow-sm text-left active:scale-95 transition-transform block"
          >
            <Plus size={32} className="text-pink-500 mb-2" />
            <p className="font-bold text-gray-800">Nuevo producto</p>
            <p className="text-sm text-gray-500">Agregar al catálogo</p>
          </Link>
          <Link
            href="/admin/ticket"
            className="bg-white rounded-xl p-4 shadow-sm text-left active:scale-95 transition-transform block"
          >
            <Printer size={32} className="text-cyan-500 mb-2" />
            <p className="font-bold text-gray-800">Generar ticket</p>
            <p className="text-sm text-gray-500">Para impresora</p>
          </Link>
        </div>

        {/* Productos recientes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">Últimos productos</h2>
            <Link href="/admin/productos" className="text-sm font-medium" style={{ color: '#E91E8C' }}>
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recientes.map((p) => (
              <AdminProductCard
                key={p.id}
                producto={p}
                onEdit={() => window.location.href = `/admin/producto/${p.id}`}
                onEstado={() => setModalEstado(p)}
              />
            ))}
          </div>
        </div>
      </div>

      {modalEstado && (
        <EstadoModal
          producto={modalEstado}
          onClose={() => setModalEstado(null)}
          onChange={cambiarEstado}
        />
      )}
    </div>
  );
}