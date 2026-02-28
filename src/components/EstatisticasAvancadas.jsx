// components/EstatisticasAvancadas.jsx
export default function EstatisticasAvancadas({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <span className="text-xs text-gray-500">Média diária</span>
        </div>
        <p className="text-2xl font-bold text-accent">{stats.mediaDiaria || 0}</p>
        <p className="text-xs text-gray-500">tópicos/dia</p>
      </div>

      <div className="bg-card border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⏱️</span>
          <span className="text-xs text-gray-500">Tempo médio</span>
        </div>
        <p className="text-2xl font-bold text-blue-400">{stats.tempoMedio || 0}</p>
        <p className="text-xs text-gray-500">dias/tópico</p>
      </div>

      <div className="bg-card border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📅</span>
          <span className="text-xs text-gray-500">Dias ativos</span>
        </div>
        <p className="text-2xl font-bold text-orange-400">{stats.diasAtivos || 0}</p>
        <p className="text-xs text-gray-500">total</p>
      </div>

      <div className="bg-card border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏆</span>
          <span className="text-xs text-gray-500">Ranking</span>
        </div>
        <p className="text-2xl font-bold text-yellow-400">#{stats.posicaoRanking || '-'}</p>
        <p className="text-xs text-gray-500">da turma</p>
      </div>
    </div>
  );
}