// components/ConquistaBadge.jsx
import { useState } from 'react';

export default function ConquistaBadge({ conquista, isNova }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusStyle = () => {
    switch(conquista.status) {
      case 'conquistada':
        return 'bg-accent/20 border-accent/50 text-accent';
      case 'em_andamento':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default:
        return 'bg-gray-800/50 border-gray-700 text-gray-600';
    }
  };

  const getProgresso = () => {
    if (conquista.status === 'conquistada') return 100;
    if (conquista.status === 'em_andamento') {
      return (conquista.progresso_atual / conquista.progresso_total) * 100;
    }
    return 0;
  };

  return (
    <div className="relative">
      <div
        className={`
          relative w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl
          transition-all duration-300 cursor-pointer
          ${getStatusStyle()}
          ${isNova ? 'animate-pulse ring-2 ring-accent ring-offset-2 ring-offset-card' : ''}
          ${conquista.status !== 'bloqueada' ? 'hover:scale-110' : ''}
        `}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className={conquista.status === 'bloqueada' ? 'opacity-50' : ''}>
          {conquista.icone}
        </span>
        
        {/* Barra de progresso circular para conquistas em andamento */}
        {conquista.status === 'em_andamento' && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - getProgresso() / 100)}`}
              className="text-blue-400 opacity-50"
            />
          </svg>
        )}

        {/* Indicador de nova conquista */}
        {isNova && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 border border-gray-800 rounded-xl shadow-xl">
          <p className="font-bold text-sm mb-1">{conquista.nome}</p>
          <p className="text-xs text-gray-400 mb-2">{conquista.descricao}</p>
          <div className="flex justify-between items-center text-xs">
            <span className="text-accent">+{conquista.pontos} pts</span>
            {conquista.status === 'em_andamento' && (
              <span className="text-gray-500">
                {conquista.progresso_atual}/{conquista.progresso_total}
              </span>
            )}
          </div>
          {conquista.status === 'em_andamento' && (
            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400"
                style={{ width: `${getProgresso()}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}