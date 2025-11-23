import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TicketPage() {
  return (
    <div>
      <div className="sticky top-0 bg-white z-30 shadow-sm px-4 py-3 flex items-center gap-3">
        <Link href="/admin" className="p-2 -ml-2 text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-bold text-lg text-gray-800">Generar Ticket</h1>
      </div>
      <div className="p-4">
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">🖨️</span>
          <p className="text-gray-500">Generador de tickets</p>
          <p className="text-sm text-gray-400 mt-2">Próximamente...</p>
        </div>
      </div>
    </div>
  );
}