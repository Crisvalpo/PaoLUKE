import { Carrot, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-pink-600">
      <Loader2 className="w-8 h-8 animate-spin mb-3" />
      <p className="text-sm font-medium">Cargando productos...</p>
      <Carrot className="w-4 h-4 mt-2 text-orange-400" />
    </div>
  );
}