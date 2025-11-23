interface Props {
    valor: number;
    label: string;
    color: string;
  }
  
  export default function StatsCard({ valor, label, color }: Props) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-2xl font-bold" style={{ color }}>
          {valor}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    );
  }