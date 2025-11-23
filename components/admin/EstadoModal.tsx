'use client';
import { Producto } from '@/lib/types';
import { estadoConfig } from '@/lib/utils';

interface Props {
  producto: Producto;
  onClose: () => void;
  onChange: (estado: 'disponible' | 'reservado' | 'vendido') => void;
}

export default function EstadoModal({ producto, onClose, onChange }: Props) {
  const estados: ('disponible' | 'reservado' | 'vendido')[] = [
    'disponible',
    'reservado',
    'vendido',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Cambiar estado</h3>
        <p className="text-sm text-gray-500 mb-4">{producto.nombre}</p>

        <div className="flex flex-col gap-2">
          {estados.map((e) => {
            const config = estadoConfig[e];
            const isActive = producto.estado === e;

            return (
              <button
                key={e}
                onClick={() => onChange(e)}
                className={`w-full py-3 rounded-xl font-medium text-left px-4 flex items-center gap-3 ${
                  isActive ? 'ring-2' : 'bg-gray-100'
                }`}
                style={
                  isActive
                    ? { background: config.color + '20', ringColor: config.color }
                    : {}
                }
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: config.color }}
                />
                {config.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 mt-4 text-gray-500 font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}