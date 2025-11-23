'use client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Props {
  titulo: string;
  backUrl?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({ titulo, backUrl, action }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {backUrl && (
          <Link href={backUrl} className="p-1 -ml-1 text-gray-600">
            <ChevronLeft size={24} />
          </Link>
        )}
        <h1 className="font-bold text-lg text-gray-800">{titulo}</h1>
      </div>
      {action}
    </header>
  );
}