// components/NotificationToast.jsx
import { useEffect } from 'react';

export default function NotificationToast({ conquista, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 border border-accent/30 rounded-2xl p-4 shadow-2xl max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-3xl">
            {conquista.icone}
          </div>
          <div className="flex-1">
            <p className="text-accent text-xs font-mono mb-1">🏆 NOVA CONQUISTA!</p>
            <p className="font-bold text-white mb-1">{conquista.nome}</p>
            <p className="text-xs text-gray-400">{conquista.descricao}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                +{conquista.pontos} pontos
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Confetes animados (opcional) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}