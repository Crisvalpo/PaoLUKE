// components/tienda/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-white border-t border-gray-100 mt-10 py-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} PaoLUKE.</p>
          <p className="mt-1">Contacto: {process.env.NEXT_PUBLIC_WHATSAPP}</p>
        </div>
      </footer>
    );
  }