// components/ProximosTopicos.jsx
export default function ProximosTopicos({ topicos }) {
  if (!topicos || topicos.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⏩</span>
        <div>
          <h3 className="font-display font-bold text-lg">Próximos Tópicos</h3>
          <p className="text-gray-400 text-xs">Continue sua jornada</p>
        </div>
      </div>

      <div className="space-y-3">
        {topicos.map((topico, index) => (
          <div 
            key={topico.id}
            className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-accent/30 transition-all"
          >
            <span className="text-2xl">{topico.icone || '📘'}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{topico.titulo}</p>
              <p className="text-xs text-gray-500">{topico.modulo_nome}</p>
            </div>
            <span className="text-xs text-accent">
              {index === 0 ? '▶️ Próximo' : `#${index + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}