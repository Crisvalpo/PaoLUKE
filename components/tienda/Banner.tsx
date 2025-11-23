interface Props {
  titulo: string;
  subtitulo: string;
  emoji?: string;
}

export default function Banner({ titulo, subtitulo, emoji = '🎄' }: Props) {
  return (
    <div 
      className="rounded-2xl p-5 mb-5 text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E91E8C, #00BCD4)' }}
    >
      <p className="text-sm opacity-90 mb-1">✨ Temporada</p>
      <h2 className="text-2xl font-bold mb-1">{titulo}</h2>
      <p className="text-sm opacity-90">{subtitulo}</p>
      <div className="absolute -right-4 -bottom-4 text-7xl opacity-20">
        {emoji}
      </div>
    </div>
  );
}
