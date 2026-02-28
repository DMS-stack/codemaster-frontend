// pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import ConquistasSection from '../components/ConquistasSection';
import NotificationToast from '../components/NotificationToast';
import EstatisticasAvancadas from '../components/EstatisticasAvancadas';
import ProximosTopicos from '../components/ProximosTopicos';

function ProgressBar({ pct, color = 'bg-accent', showLabel = false }) {
  return (
    <div className="relative">
      {showLabel && (
        <div className="absolute -top-6 right-0 text-xs font-mono text-accent">{pct}%</div>
      )}
      <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StreakCounter({ streak }) {
  if (!streak) return null;
  return (
    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-1.5">
      <span className="text-orange-400">🔥</span>
      <span className="font-mono text-sm text-orange-400">{streak} dias</span>
    </div>
  );
}

function PontuacaoCard({ pontos, nivel }) {
  pontos = pontos || 0;
  nivel  = nivel  || 1;
  const progressoNivel  = pontos % 100;
  const pontosRestantes = 100 - progressoNivel;
  return (
    <div className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-lg p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Nível {nivel}</span>
        <span className="text-xs text-accent font-mono">{pontos} pts</span>
      </div>
      <ProgressBar pct={progressoNivel} color="bg-accent" />
      <p className="text-[10px] text-gray-500 mt-1">{pontosRestantes} pts para o próximo nível</p>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData]                         = useState(null);
  const [stats, setStats]                       = useState(null);
  const [conquistasDados, setConquistasDados]   = useState(null);
  const [proximosTopicos, setProximosTopicos]   = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [refreshing, setRefreshing]             = useState(false);
  const [novaConquista, setNovaConquista]       = useState(null);
  const [showToast, setShowToast]               = useState(false);
  const [conquistasErro, setConquistasErro]     = useState(false);
  const [sidebarOpen, setSidebarOpen]           = useState(false);

  const carregarDashboardPrincipal = async () => {
    try {
      const response = await api.get('/alunos/dashboard', { timeout: 5000 });
      setData(response.data);
      return true;
    } catch (err) {
      console.error('Erro ao carregar dashboard principal:', err);
      return false;
    }
  };

  const carregarConquistas = async () => {
    try {
      const response = await api.get('/conquistas/minhas', { timeout: 3000 });
      setConquistasDados(response.data);
      setConquistasErro(false);
    } catch (err) {
      console.log('Sistema de conquistas não disponível ainda:', err.message);
      setConquistasErro(true);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await api.get('/alunos/estatisticas', { timeout: 3000 });
      setStats(response.data);
    } catch (err) {
      console.log('Estatísticas avançadas não disponíveis ainda');
      setStats({
        mediaDiaria: 0, tempoMedio: 0, diasAtivos: 0,
        posicaoRanking: '-', streakAtual: 0,
        fraseMotivacional: 'Continue assim! Cada dia é uma oportunidade de aprender mais.',
      });
    }
  };

  const carregarProximosTopicos = async () => {
    try {
      const response = await api.get('/alunos/proximos-topicos', { timeout: 3000 });
      setProximosTopicos(response.data);
    } catch (err) {
      setProximosTopicos([]);
    }
  };

  const carregarDashboard = useCallback(async () => {
    try {
      setRefreshing(true);
      const dashboardOk = await carregarDashboardPrincipal();
      if (dashboardOk) {
        await Promise.allSettled([
          carregarEstatisticas(),
          carregarProximosTopicos(),
          carregarConquistas(),
        ]);
      }
    } catch (err) {
      console.error('Erro geral ao carregar dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    carregarDashboard();
    const interval = setInterval(carregarDashboard, 300000);
    return () => clearInterval(interval);
  }, [carregarDashboard]);

  async function toggleTopico(topicoId, atual) {
    try {
      const response = await api.post('/alunos/progresso', { topicoId, concluido: !atual });

      if (response.data?.novasConquistas?.length > 0) {
        setNovaConquista(response.data.novasConquistas[0]);
        setShowToast(true);

        setConquistasDados(prev => {
          if (!prev) return prev;
          const novas = response.data.novasConquistas;
          const todasAntigas = prev.conquistas?.todas || [];
          const pontuacaoExtra = novas.reduce((s, c) => s + (c.pontos || 0), 0);
          return {
            ...prev,
            pontuacaoTotal: (prev.pontuacaoTotal || 0) + pontuacaoExtra,
            conquistas: {
              ...prev.conquistas,
              todas: [...todasAntigas, ...novas],
            },
          };
        });
      }

      await carregarDashboard();
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    }
  }

  const pontuacaoTotal = conquistasDados?.pontuacaoTotal ?? stats?.pontuacaoTotal ?? 0;
  const nivel          = conquistasDados?.nivel          ?? stats?.nivel          ?? 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-accent font-mono text-sm">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-white font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;900&family=DM+Sans:wght@400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .sidebar-transition { transition: transform 0.3s ease; }
      `}</style>

      {showToast && novaConquista && (
        <NotificationToast conquista={novaConquista} onClose={() => setShowToast(false)} />
      )}

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-surface border-b border-gray-800 flex items-center justify-between px-4 h-14">
        <span className="font-display font-black text-base">Code<span className="text-accent">Master</span></span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
          aria-label="Abrir menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`
          w-64 bg-surface border-r border-gray-800 flex flex-col fixed h-full z-50
          sidebar-transition
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:flex
        `}>
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <span className="font-display font-black text-lg">Code<span className="text-accent">Master</span></span>
              <p className="font-mono text-xs text-gray-500 mt-1">Dev Pro</p>
            </div>
            {/* Close button — mobile only */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
              aria-label="Fechar menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <a
              href="#dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-medium"
            >
              <span>📊</span> Dashboard
            </a>
            <a
              href="#modulos"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors"
            >
              <span>📚</span> Módulos
            </a>
            <a
              href="#conquistas"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors"
            >
              <span>🏆</span> Conquistas
            </a>
            <a
              href="#estatisticas"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors"
            >
              <span>📈</span> Estatísticas
            </a>
          </nav>

          {/* Perfil — canto inferior esquerdo */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg flex-shrink-0">
                {user?.nome?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.nome}</p>
                <p className="font-mono text-xs text-accent">Nível {nivel}</p>
              </div>
            </div>
            <div className="mb-3">
              <PontuacaoCard pontos={pontuacaoTotal} nivel={nivel} />
            </div>
            {/* Botões Home e Sair */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex-1 text-gray-400 hover:text-white text-xs transition-colors flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-gray-800"
              >
                <span>🏠</span> Home
              </button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex-1 text-gray-400 hover:text-white text-xs transition-colors flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-gray-800"
              >
                <span>🚪</span> Sair
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 pt-20 md:pt-6 md:p-8 min-w-0">
          {/* Header */}
          <div id="dashboard" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="min-w-0">
              <p className="font-mono text-xs text-accent uppercase tracking-widest mb-1">Bem-vindo(a) de volta</p>
              <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight truncate">
                {user?.nome?.split(' ')[0]}.
              </h1>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {stats?.fraseMotivacional || 'Consistência é mais importante que velocidade. Continue avançando.'}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {stats?.streakAtual > 0 && <StreakCounter streak={stats.streakAtual} />}
              <button
                onClick={carregarDashboard}
                disabled={refreshing}
                className="p-2 bg-card border border-gray-700 rounded-lg hover:border-accent transition-colors"
                title="Atualizar"
              >
                <span className={`text-gray-400 text-lg ${refreshing ? 'animate-spin inline-block' : ''}`}>⟳</span>
              </button>
            </div>
          </div>

          {stats && <EstatisticasAvancadas stats={stats} />}

          {/* Progresso Geral */}
          <div className="bg-card border border-gray-800 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="font-display font-bold text-lg">Progresso Geral</p>
                <p className="text-gray-400 text-xs">Acompanhe sua evolução no curso</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-mono text-accent text-2xl sm:text-3xl font-bold">{data?.progresso_geral ?? 0}%</span>
                  <p className="text-xs text-gray-500">concluído</p>
                </div>
                <div className="w-px h-10 bg-gray-700" />
                <div className="text-right">
                  <span className="font-mono text-blue-400 text-xl font-bold">
                    {data?.modulos?.flatMap(m => m.topicos).filter(t => t.concluido).length ?? 0}
                  </span>
                  <p className="text-xs text-gray-500">
                    de {data?.modulos?.flatMap(m => m.topicos).length ?? 0}
                  </p>
                </div>
              </div>
            </div>
            <ProgressBar pct={data?.progresso_geral ?? 0} showLabel={false} />
            <div className="flex justify-between mt-3 text-[10px] text-gray-600">
              <span>🌱 Iniciante</span>
              <span className="hidden xs:inline">📚 Aprendiz</span>
              <span>⚡ Interm.</span>
              <span>🏆 Mestre</span>
            </div>
          </div>

          {/* CONQUISTAS */}
          <div id="conquistas" className="mb-6 md:mb-8">
            <ConquistasSection
              conquistas={conquistasDados}
              erro={conquistasErro}
              onRetentar={carregarConquistas}
            />
          </div>

          {/* Próximos Tópicos */}
          {proximosTopicos.length > 0 && (
            <div className="mb-6 md:mb-8">
              <ProximosTopicos topicos={proximosTopicos} />
            </div>
          )}

          {/* Módulos */}
          <div id="modulos" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg md:text-xl">Módulos do Curso</h2>
              <p className="text-xs text-gray-500">
                {data?.modulos?.filter(m => m.pct === 100).length || 0} de {data?.modulos?.length || 0} concluídos
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {data?.modulos?.map((modulo, index) => (
                <div
                  key={modulo.id}
                  className="bg-card border border-gray-800 rounded-2xl p-4 md:p-6 hover:border-gray-700 transition-all group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl md:text-3xl flex-shrink-0">{modulo.icone}</span>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-sm md:text-base truncate">{modulo.nome}</h3>
                        <p className="text-xs text-gray-500">{modulo.concluidos}/{modulo.total} tópicos</p>
                      </div>
                    </div>
                    {modulo.pct === 100 ? (
                      <span className="bg-accent/20 text-accent text-xs font-mono px-2 py-1 rounded-full flex-shrink-0 ml-2">✓ Concluído</span>
                    ) : (
                      <span className="font-mono text-accent font-bold text-lg flex-shrink-0 ml-2">{modulo.pct}%</span>
                    )}
                  </div>

                  <ProgressBar pct={modulo.pct} />

                  <ul className="mt-4 space-y-1.5">
                    {modulo.topicos.map(t => (
                      <li
                        key={t.id}
                        className="flex items-center gap-3 cursor-pointer group/item p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                        onClick={() => toggleTopico(t.id, t.concluido)}
                      >
                        <div className={`
                          w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all
                          ${t.concluido ? 'bg-accent border-accent' : 'border-gray-600 group-hover/item:border-accent'}
                        `}>
                          {t.concluido && <span className="text-black text-xs font-bold">✓</span>}
                        </div>
                        <span className={`text-sm transition-colors flex-1 min-w-0 truncate ${t.concluido ? 'line-through text-gray-600' : 'text-gray-300 group-hover/item:text-white'}`}>
                          {t.titulo}
                        </span>
                        {t.temConquista && !t.concluido && (
                          <span className="text-xs text-yellow-500 flex-shrink-0" title="Conquista disponível">🏆</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {modulo.pct < 100 && modulo.pct > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span>💡</span>
                        Faltam {modulo.total - modulo.concluidos} tópicos para completar este módulo
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}