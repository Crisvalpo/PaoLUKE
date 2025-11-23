import Header from '@/components/tienda/Header';
import BottomNav from '@/components/tienda/BottomNav';

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}