import Link from 'next/link';
import { Categoria } from '@/lib/types';

interface Props {
  categorias: Categoria[];
  horizontal?: boolean;
}

export default function CategoryList({ categorias, horizontal = false }: Props) {
  if (horizontal) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {categorias.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.id}`}
            className="flex-shrink-0 bg-white rounded-2xl p-3 text-center shadow-sm active:scale-95 transition-transform min-w-[85px]"
          >
            <span className="text-2xl mb-1 block">{cat.emoji}</span>
            <span className="text-xs font-medium text-gray-700">{cat.nombre}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {categorias.map((cat) => (
        <Link
          key={cat.id}
          href={`/categoria/${cat.id}`}
          className="bg-white rounded-2xl p-5 text-left shadow-sm active:scale-95 transition-transform relative overflow-hidden"
        >
          <span className="text-4xl mb-2 block">{cat.emoji}</span>
          <h3 className="font-bold text-gray-800">{cat.nombre}</h3>
          <div 
            className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10"
            style={{ background: '#E91E8C' }}
          />
        </Link>
      ))}
    </div>
  );
}