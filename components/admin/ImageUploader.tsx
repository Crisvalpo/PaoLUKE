'use client';
import { useState } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { supabase, getImageUrl } from '@/lib/supabase';
import { Camera, X } from 'lucide-react';

interface Props {
  fotos: string[];
  productoId?: number;
  onChange: (fotos: string[]) => void;
}

export default function ImageUploader({ fotos, productoId, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || fotos.length >= 4) return;

    setUploading(true);

    try {
      // Comprimir imagen
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      // Generar nombre único
      const folder = productoId || 'temp';
      const fileName = `${folder}/${Date.now()}.webp`;

      // Subir a Supabase
      const { error } = await supabase.storage
        .from('productos')
        .upload(fileName, compressed, {
          contentType: 'image/webp',
          upsert: false,
        });

      if (error) throw error;

      onChange([...fotos, fileName]);
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const foto = fotos[index];
    
    // Eliminar de storage si no es URL externa
    if (!foto.startsWith('http')) {
      try {
        await supabase.storage.from('productos').remove([foto]);
      } catch (error) {
        console.error('Error eliminando imagen:', error);
      }
    }

    onChange(fotos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Fotos del producto (máx. 4)
      </label>

      <div className="grid grid-cols-4 gap-2">
        {fotos.map((foto, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
          >
            <Image
              src={getImageUrl(foto)}
              alt=""
              fill
              className="object-cover"
            />
            <button
              onClick={() => handleRemove(i)}
              type="button"
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
            {i === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                Principal
              </div>
            )}
          </div>
        ))}

        {fotos.length < 4 && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-pink-400 hover:text-pink-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full" />
            ) : (
              <>
                <Camera size={24} />
                <span className="text-xs mt-1">
                  {fotos.length === 0 ? 'Agregar' : 'Otra'}
                </span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        📱 Toca para usar cámara o galería. La primera foto será la principal.
      </p>
    </div>
  );
}