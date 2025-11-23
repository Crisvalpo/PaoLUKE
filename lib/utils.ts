export const formatPrice = (price: number): string => {
    return '$' + price.toLocaleString('es-CL');
  };
  
  export const formatSku = (id: number): string => {
    return '#' + String(id).padStart(5, '0');
  };
  
  export const calcularDescuento = (precio: number, oferta: number): number => {
    return Math.round((1 - oferta / precio) * 100);
  };
  
  export const calcularStock = (variantes: { t: string; s: number }[]): number => {
    return variantes.reduce((acc, v) => acc + v.s, 0);
  };
  
  export const estadoConfig = {
    disponible: { color: '#10B981', label: 'Disponible', bg: 'bg-green-500' },
    reservado: { color: '#F59E0B', label: 'Reservado', bg: 'bg-yellow-500' },
    vendido: { color: '#EF4444', label: 'Vendido', bg: 'bg-red-500' },
  };