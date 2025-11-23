import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <span className="text-6xl mb-4">😕</span>
      <h1 className="text-xl font-bold text-gray-800 mb-2">
        Producto no encontrado
      </h1>
      <p className="text-gray-500 mb-6">
        El producto que buscas no existe o fue eliminado
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl text-white font-bold"
        style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}