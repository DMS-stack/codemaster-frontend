import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

// Componente de Barra de Progresso
function ProgressBar({ pct, color = 'bg-accent', size = 'sm' }) {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  return (
    <div className={`bg-gray-800 rounded-full ${heights[size]} overflow-hidden`}>
      <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// Componente de Card de Aluno com Progresso Detalhado
function AlunoCard({ aluno, onVerDetalhes, onToggleStatus }) {
  const [expandido, setExpandido] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'bg-accent/10 text-accent border-accent/20';
      case 'inativo': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pendente': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const getProgressoClasse = () => {
    if (aluno.progresso_percentual >= 75) return 'text-accent';
    if (aluno.progresso_percentual >= 50) return 'text-blue-400';
    if (aluno.progresso_percentual >= 25) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const ultimaAtividade = aluno.ultima_atividade
    ? new Date(aluno.ultima_atividade).toLocaleDateString('pt-AO')
    : 'Nunca';

  return (
    <div className="bg-card border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg flex-shrink-0">
              {aluno.nome?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-white truncate">{aluno.nome}</h3>
              <p className="text-xs text-gray-500 truncate">{aluno.email}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${getStatusColor(aluno.status)}`}>
            {aluno.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-gray-800/30 rounded-lg p-2">
            <p className="text-lg font-mono text-accent">{aluno.topicos_concluidos || 0}</p>
            <p className="text-[10px] text-gray-500">Tópicos</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-2">
            <p className="text-lg font-mono text-blue-400">{aluno.modulos_completos || 0}</p>
            <p className="text-[10px] text-gray-500">Módulos</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-2">
            <p className="text-lg font-mono text-yellow-400">{aluno.conquistas || 0}</p>
            <p className="text-[10px] text-gray-500">Conquistas</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Progresso Geral</span>
            <span className={`text-xs font-mono ${getProgressoClasse()}`}>
              {aluno.progresso_percentual || 0}%
            </span>
          </div>
          <ProgressBar pct={aluno.progresso_percentual || 0} size="md" />
        </div>

        <div className="flex justify-between items-center mt-3 text-[10px] text-gray-600 flex-wrap gap-1">
          <span>📅 {new Date(aluno.data_criacao).toLocaleDateString('pt-AO')}</span>
          <span>⏱️ {ultimaAtividade}</span>
        </div>
      </div>

      <div className="border-t border-gray-800 p-2 flex gap-2">
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex-1 text-xs py-2 px-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center justify-center gap-1"
        >
          <span>{expandido ? '▼' : '▶'}</span>
          <span className="hidden sm:inline">{expandido ? 'Ocultar' : 'Detalhes'}</span>
        </button>
        <button
          onClick={() => onToggleStatus(aluno.id, aluno.status)}
          className={`flex-1 text-xs py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
            aluno.status === 'ativo'
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
              : 'bg-accent/10 hover:bg-accent/20 text-accent'
          }`}
        >
          {aluno.status === 'ativo' ? '🔴 Desativar' : '🟢 Ativar'}
        </button>
        <button
          onClick={() => onVerDetalhes(aluno)}
          className="flex-1 text-xs py-2 px-2 rounded-lg bg-accent text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          📊 <span className="hidden sm:inline">Dashboard</span>
        </button>
      </div>

      {expandido && (
        <div className="border-t border-gray-800 p-4 bg-gray-900/30">
          <h4 className="text-xs font-mono text-gray-500 mb-3">📚 PROGRESSO POR MÓDULO</h4>
          <div className="space-y-3 mb-4">
            {aluno.modulos?.map(modulo => (
              <div key={modulo.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400 truncate mr-2">{modulo.nome}</span>
                  <span className="text-xs font-mono text-accent flex-shrink-0">{modulo.pct}%</span>
                </div>
                <ProgressBar pct={modulo.pct} size="sm" />
                <p className="text-[10px] text-gray-600 mt-1">{modulo.concluidos}/{modulo.total} tópicos</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/30 rounded-lg p-2">
              <p className="text-xs text-gray-400">Streak Atual</p>
              <p className="text-sm font-bold text-orange-400">{aluno.streak || 0} dias</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2">
              <p className="text-xs text-gray-400">Média Diária</p>
              <p className="text-sm font-bold text-blue-400">{aluno.media_diaria || 0} tópicos</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2">
              <p className="text-xs text-gray-400">Tempo Médio</p>
              <p className="text-sm font-bold text-yellow-400">{aluno.tempo_medio || 0} dias</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2">
              <p className="text-xs text-gray-400">Ranking</p>
              <p className="text-sm font-bold text-purple-400">#{aluno.ranking || '-'}</p>
            </div>
          </div>

          {aluno.ultimas_atividades?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-mono text-gray-500 mb-2">⏱️ ÚLTIMAS ATIVIDADES</h4>
              <div className="space-y-1">
                {aluno.ultimas_atividades.map((atv, idx) => (
                  <div key={idx} className="text-[10px] text-gray-500 flex justify-between gap-2">
                    <span className="truncate">{atv.titulo}</span>
                    <span className="flex-shrink-0">{new Date(atv.data).toLocaleDateString('pt-AO')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Modal de Dashboard do Aluno
function AlunoDashboardModal({ aluno, onClose }) {
  const [dadosAluno, setDadosAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDadosDetalhados();
  }, [aluno.id]);

  const carregarDadosDetalhados = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/alunos/${aluno.id}/detalhes`);
      setDadosAluno(response.data);
    } catch (err) {
      console.error('Erro ao carregar detalhes do aluno:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative bg-card border border-gray-800 rounded-3xl p-8 max-w-4xl w-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-accent">Carregando dashboard do aluno...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-gray-800 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-gray-800 p-4 sm:p-6 flex justify-between items-center">
          <div className="min-w-0">
            <h2 className="font-display font-bold text-xl sm:text-2xl truncate">{aluno.nome}</h2>
            <p className="text-gray-500 text-sm truncate">{aluno.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl ml-4 flex-shrink-0">✕</button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Stats Cards — 2 cols mobile, 4 desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 sm:p-4">
              <p className="text-xs text-gray-400">Progresso</p>
              <p className="text-xl sm:text-2xl font-bold text-accent">{dadosAluno?.progresso_geral || 0}%</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
              <p className="text-xs text-gray-400">Tópicos</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-400">{dadosAluno?.topicos_concluidos || 0}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 sm:p-4">
              <p className="text-xs text-gray-400">Streak</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-400">{dadosAluno?.streak || 0}d</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 sm:p-4">
              <p className="text-xs text-gray-400">Conquistas</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-400">{dadosAluno?.conquistas || 0}</p>
            </div>
          </div>

          {/* Gráfico de Atividade */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <h3 className="font-display font-bold mb-4">Atividade Recente</h3>
            <div className="flex gap-1 h-28 sm:h-32 items-end">
              {[45, 60, 25, 80, 55, 90, 70].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-accent/20 rounded-t" style={{ height: `${height}%` }}>
                    <div className="w-full bg-accent rounded-t transition-all" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-[8px] text-gray-600">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Módulos Detalhados */}
          <div>
            <h3 className="font-display font-bold mb-4">Progresso por Módulo</h3>
            <div className="space-y-4">
              {dadosAluno?.modulos?.map(modulo => (
                <div key={modulo.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{modulo.icone}</span>
                      <span className="font-medium truncate">{modulo.nome}</span>
                    </div>
                    <span className="font-mono text-accent flex-shrink-0">{modulo.pct}%</span>
                  </div>
                  <ProgressBar pct={modulo.pct} size="md" />
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modulo.topicos?.map(topico => (
                      <div key={topico.id} className="flex items-center gap-2 text-xs">
                        <span className={topico.concluido ? 'text-accent' : 'text-gray-600'}>
                          {topico.concluido ? '✅' : '⭕'}
                        </span>
                        <span className={`truncate ${topico.concluido ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                          {topico.titulo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conquistas do Aluno */}
          <div>
            <h3 className="font-display font-bold mb-4">Conquistas</h3>
            <div className="flex flex-wrap gap-3">
              {dadosAluno?.conquistas_lista?.map(conquista => (
                <div
                  key={conquista.id}
                  className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center"
                  title={conquista.descricao}
                >
                  <span className="text-2xl block mb-1">{conquista.icone}</span>
                  <p className="text-xs font-medium">{conquista.nome}</p>
                  <p className="text-[8px] text-gray-500">{new Date(conquista.data).toLocaleDateString('pt-AO')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Estatísticas Globais
function EstatisticasGlobais({ dados }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-xl p-3 sm:p-4">
        <p className="text-xs text-gray-400 mb-1">Média da Turma</p>
        <p className="text-xl sm:text-2xl font-bold text-accent">{dados?.mediaTurma || 0}%</p>
        <p className="text-xs text-gray-500 mt-1">progresso médio</p>
      </div>
      <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-3 sm:p-4">
        <p className="text-xs text-gray-400 mb-1">Total de Tópicos</p>
        <p className="text-xl sm:text-2xl font-bold text-blue-400">{dados?.totalTopicos || 0}</p>
        <p className="text-xs text-gray-500 mt-1">concluídos</p>
      </div>
      <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-3 sm:p-4">
        <p className="text-xs text-gray-400 mb-1">Alunos Ativos</p>
        <p className="text-xl sm:text-2xl font-bold text-orange-400">{dados?.alunosAtivos || 0}</p>
        <p className="text-xs text-gray-500 mt-1">de {dados?.totalAlunos || 0}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-3 sm:p-4">
        <p className="text-xs text-gray-400 mb-1">Engajamento</p>
        <p className="text-xl sm:text-2xl font-bold text-purple-400">{dados?.engajamento || 0}%</p>
        <p className="text-xs text-gray-500 mt-1">últimos 7 dias</p>
      </div>
    </div>
  );
}

// Componente de Filtros
function Filtros({ filtros, setFiltros }) {
  return (
    <div className="bg-card border border-gray-800 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Status:</span>
          <select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
            <option value="pendente">Pendentes</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Progresso:</span>
          <select
            value={filtros.progresso}
            onChange={(e) => setFiltros({ ...filtros, progresso: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="todos">Todos</option>
            <option value="iniciante">Iniciante (0-25%)</option>
            <option value="aprendiz">Aprendiz (25-50%)</option>
            <option value="intermediario">Intermediário (50-75%)</option>
            <option value="avancado">Avançado (75-100%)</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar aluno..."
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white w-full"
            />
            <span className="absolute right-3 top-2 text-gray-500">🔍</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [aba, setAba] = useState('alunos');
  const [metricas, setMetricas] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [estatisticasGlobais, setEstatisticasGlobais] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtros, setFiltros] = useState({ status: 'todos', progresso: 'todos', busca: '' });

  const [modalCredenciais, setModalCredenciais] = useState({
    aberto: false, dados: null, carregandoEmail: false, emailEnviado: false
  });
  const [copiado, setCopiado] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [metRes, aluRes, insRes, pagRes, statsRes] = await Promise.all([
          api.get('/admin/metricas'),
          api.get('/admin/alunos-completo'),
          api.get('/inscricoes'),
          api.get('/admin/pagamentos'),
          api.get('/admin/estatisticas-globais')
        ]);
        setMetricas(metRes.data);
        setAlunos(aluRes.data);
        setAlunosFiltrados(aluRes.data);
        setInscricoes(insRes.data);
        setPagamentos(pagRes.data || []);
        setEstatisticasGlobais(statsRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtrados = [...alunos];
    if (filtros.status !== 'todos') filtrados = filtrados.filter(a => a.status === filtros.status);
    if (filtros.progresso !== 'todos') {
      filtrados = filtrados.filter(a => {
        const pct = a.progresso_percentual || 0;
        switch (filtros.progresso) {
          case 'iniciante': return pct < 25;
          case 'aprendiz': return pct >= 25 && pct < 50;
          case 'intermediario': return pct >= 50 && pct < 75;
          case 'avancado': return pct >= 75;
          default: return true;
        }
      });
    }
    if (filtros.busca) {
      const buscaLower = filtros.busca.toLowerCase();
      filtrados = filtrados.filter(a =>
        a.nome.toLowerCase().includes(buscaLower) || a.email.toLowerCase().includes(buscaLower)
      );
    }
    setAlunosFiltrados(filtrados);
  }, [filtros, alunos]);

  const copiarTexto = async (texto, campo) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(campo);
      setTimeout(() => setCopiado(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const enviarEmailCredenciais = async () => {
    const { dados } = modalCredenciais;
    if (!dados) return;
    setModalCredenciais(prev => ({ ...prev, carregandoEmail: true }));
    try {
      await api.patch(`/admin/inscricoes/${dados.inscricaoId}/confirmar`, {
        observacao: 'Confirmado via painel admin',
        enviarEmail: true
      });
      setModalCredenciais(prev => ({ ...prev, emailEnviado: true }));
      setTimeout(() => setModalCredenciais(prev => ({ ...prev, emailEnviado: false })), 3000);
    } catch (err) {
      console.error('Erro ao enviar email:', err);
      alert('Não foi possível enviar o email. Tente copiar e enviar manualmente.');
    } finally {
      setModalCredenciais(prev => ({ ...prev, carregandoEmail: false }));
    }
  };

  const confirmarPagamento = async (id, enviarEmail = false) => {
    if (!window.confirm('Confirmar pagamento e activar aluno?')) return;
    try {
      const response = await api.patch(`/admin/inscricoes/${id}/confirmar`, {
        observacao: 'Confirmado via painel admin',
        enviarEmail
      });
      const { senhaTemp, user: novoUser, emailEnviado, whatsappMsg } = response.data;
      setModalCredenciais({
        aberto: true,
        dados: { senhaTemp, novoUser, whatsappMsg, inscricaoId: id },
        carregandoEmail: false,
        emailEnviado: emailEnviado || false
      });
      const [pagRes, aluRes, metRes, insRes] = await Promise.all([
        api.get('/admin/pagamentos'),
        api.get('/admin/alunos-completo'),
        api.get('/admin/metricas'),
        api.get('/inscricoes')
      ]);
      setPagamentos(pagRes.data || []);
      setAlunos(aluRes.data);
      setAlunosFiltrados(aluRes.data);
      setMetricas(metRes.data);
      setInscricoes(insRes.data);
    } catch (err) {
      console.error('Erro ao confirmar pagamento:', err);
      alert('Não foi possível confirmar o pagamento. Verifique o console.');
    }
  };

  const toggleStatusAluno = async (alunoId, statusAtual) => {
    const novoStatus = statusAtual === 'ativo' ? 'inativo' : 'ativo';
    if (!window.confirm(`Tem certeza que deseja ${novoStatus === 'ativo' ? 'ativar' : 'desativar'} este aluno?`)) return;
    try {
      await api.patch(`/admin/alunos/${alunoId}/status`, { status: novoStatus });
      setAlunos(prev => prev.map(a => a.id === alunoId ? { ...a, status: novoStatus } : a));
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      alert('Erro ao alterar status do aluno.');
    }
  };

  const abas = [
    { id: 'metricas', label: '📊 Métricas', count: metricas?.totalInscricoes },
    { id: 'alunos', label: '👥 Alunos', count: alunos.length },
    { id: 'inscricoes', label: '📝 Inscrições', count: inscricoes.length },
    { id: 'pagamentos', label: '💳 Pagamentos', count: pagamentos.filter(p => p.status === 'pendente').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-accent font-mono text-sm">A carregar painel admin...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;900&family=DM+Sans:wght@400;500&display=swap');
        .font-display{font-family:'Syne',sans-serif}
        .font-mono{font-family:'Space Mono',monospace}
        .font-body{font-family:'DM Sans',sans-serif}
        @keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .modal-animation{animation:modalIn 0.2s ease-out}
        .backdrop-animation{animation:fadeIn 0.2s ease-out}
        .sidebar-transition{transition:transform 0.3s ease}
        body { overflow-x: hidden; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Modal de Credenciais */}
      {modalCredenciais.aberto && modalCredenciais.dados && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setModalCredenciais({ aberto: false, dados: null })}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm backdrop-animation" />
          <div
            className="relative bg-card border border-gray-800 rounded-3xl p-6 max-w-md w-full modal-animation shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-1">
                {modalCredenciais.emailEnviado ? '✅ Email Enviado!' : 'Pagamento Confirmado!'}
              </h3>
              <p className="text-gray-400 text-sm">
                {modalCredenciais.emailEnviado
                  ? 'Credenciais enviadas para o email do aluno'
                  : 'Envie estas credenciais ao aluno'}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500 text-xs font-mono uppercase">Nome</span>
                  <button onClick={() => copiarTexto(modalCredenciais.dados.novoUser.nome, 'nome')}>
                    {copiado === 'nome' ? '✓' : '📋'}
                  </button>
                </div>
                <p className="text-white font-medium">{modalCredenciais.dados.novoUser.nome}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500 text-xs font-mono uppercase">Email</span>
                  <button onClick={() => copiarTexto(modalCredenciais.dados.novoUser.email, 'email')}>
                    {copiado === 'email' ? '✓' : '📋'}
                  </button>
                </div>
                <p className="text-accent font-mono text-sm">{modalCredenciais.dados.novoUser.email}</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-accent text-xs font-mono uppercase">🔑 Senha Temporária</span>
                  <button onClick={() => copiarTexto(modalCredenciais.dados.senhaTemp, 'senha')}>
                    {copiado === 'senha' ? '✓' : '📋'}
                  </button>
                </div>
                <p className="text-white font-mono text-lg font-bold">{modalCredenciais.dados.senhaTemp}</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-6">
              <p className="text-yellow-400 text-xs">⚠️ Recomende que ele altere a senha no primeiro login!</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => copiarTexto(modalCredenciais.dados.whatsappMsg, 'whatsapp')}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 text-green-400 font-medium py-3 px-4 rounded-xl"
              >
                {copiado === 'whatsapp' ? '✓ Mensagem copiada!' : '💬 Copiar mensagem WhatsApp'}
              </button>
              <button
                onClick={enviarEmailCredenciais}
                disabled={modalCredenciais.carregandoEmail || modalCredenciais.emailEnviado}
                className={`w-full py-3 px-4 rounded-xl ${
                  modalCredenciais.emailEnviado
                    ? 'bg-green-600/20 text-green-400'
                    : modalCredenciais.carregandoEmail
                    ? 'bg-gray-700 text-gray-400 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {modalCredenciais.emailEnviado ? '✓ Email enviado!' :
                  modalCredenciais.carregandoEmail ? '⏳ Enviando...' :
                  '📧 Enviar credenciais por email'}
              </button>
              <button
                onClick={() => setModalCredenciais({ aberto: false, dados: null })}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-4 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal do Dashboard do Aluno */}
      {alunoSelecionado && (
        <AlunoDashboardModal aluno={alunoSelecionado} onClose={() => setAlunoSelecionado(null)} />
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Layout Principal */}
      <div className="flex min-h-screen bg-bg text-white font-body overflow-x-hidden">

        {/* Sidebar */}
        <aside className={`
          w-64 bg-surface border-r border-gray-800 flex flex-col fixed h-full z-50
          sidebar-transition
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-accent">CodeMaster</h2>
              <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {abas.map(a => (
              <button
                key={a.id}
                onClick={() => { setAba(a.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm ${
                  aba === a.id
                    ? 'bg-accent text-black font-medium'
                    : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                <span>{a.label}</span>
                {a.count > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    aba === a.id ? 'bg-black/20 text-black' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {a.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold flex-shrink-0">
                {user?.nome?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.nome}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex-1 text-gray-400 hover:text-white text-xs py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
              >
                🏠 Home
              </button>
              <button
                onClick={logout}
                className="flex-1 text-gray-400 hover:text-white text-xs py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-w-0 w-full overflow-x-hidden">
          {/* Sticky wrapper: Header + Mobile Tabs together — avoids needing a calculated top offset */}
          <div className="sticky top-0 z-10 bg-surface">
          {/* Header */}
          <header className="border-b border-gray-800 px-4 sm:px-6 py-4 overflow-hidden">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {/* Hamburger — mobile only */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors flex-shrink-0"
                  aria-label="Abrir menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <h1 className="font-display font-bold text-xl sm:text-2xl truncate">Painel Admin</h1>
                  <p className="text-gray-500 text-xs mt-0.5 hidden sm:block">
                    {new Date().toLocaleDateString('pt-AO', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Acções no header */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user?.nome}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                {/* Botão Home — sempre visível no header */}
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition-colors"
                >
                  🏠 <span className="hidden sm:inline">Home</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition-colors"
                >
                  🚪 <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </div>
          </header>

          </div>{/* end sticky wrapper */}

          {/* Conteúdo dinâmico */}
          <div className="p-4 sm:p-6 lg:p-8">

            {/* Métricas */}
            {aba === 'metricas' && metricas && (
              <>
                <EstatisticasGlobais dados={estatisticasGlobais} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: 'Alunos Ativos', value: metricas.alunosAtivos, icon: '👥' },
                    { label: 'Inscrições Pendentes', value: metricas.inscricoesPendentes, icon: '⌛' },
                    { label: 'Total Inscrições', value: metricas.totalInscricoes, icon: '📝' },
                    { label: 'Inscrições Hoje', value: metricas.inscricoesHoje, icon: '📈' },
                  ].map(m => (
                    <div key={m.label} className="bg-card border border-gray-800 rounded-2xl p-4 sm:p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">{m.icon}</span>
                        <span className="font-mono text-accent text-2xl sm:text-3xl font-bold">{m.value}</span>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm font-mono uppercase tracking-wider">{m.label}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Alunos com Progresso */}
            {aba === 'alunos' && (
              <>
                <Filtros filtros={filtros} setFiltros={setFiltros} />
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {alunosFiltrados.map(aluno => (
                    <AlunoCard
                      key={aluno.id}
                      aluno={aluno}
                      onVerDetalhes={setAlunoSelecionado}
                      onToggleStatus={toggleStatusAluno}
                    />
                  ))}
                </div>
                {alunosFiltrados.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Nenhum aluno encontrado</p>
                  </div>
                )}
              </>
            )}

            {/* Inscrições */}
            {aba === 'inscricoes' && (
              <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[600px]">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase">Nome</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase">Email</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase hidden sm:table-cell">WhatsApp</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase hidden md:table-cell">Plano</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase">Status</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase hidden sm:table-cell">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscricoes.map(i => (
                        <tr key={i.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3 font-medium max-w-[140px] truncate">{i.nome}</td>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs max-w-[160px] truncate">{i.email}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{i.whatsapp}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{i.plano}</td>
                          <td className="px-4 py-3">
                            <span className={`font-mono text-xs px-2 py-1 rounded whitespace-nowrap ${
                              ['pago', 'confirmado'].includes(i.status)
                                ? 'bg-accent/10 text-accent'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {i.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden sm:table-cell">
                            {new Date(i.data_inscricao).toLocaleDateString('pt-AO')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagamentos */}
            {aba === 'pagamentos' && (
              <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase">Nome</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase hidden md:table-cell">Email</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase hidden sm:table-cell">Método</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase hidden md:table-cell">Plano</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase">Valor</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase">Status</th>
                        <th className="px-4 py-3 font-mono text-gray-500 text-xs uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagamentos.map(p => (
                        <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3 font-medium max-w-[120px] truncate">{p.nome}</td>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden md:table-cell max-w-[150px] truncate">{p.email}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{p.metodo}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{p.plano}</td>
                          <td className="px-4 py-3 font-mono text-accent text-xs whitespace-nowrap">
                            {p.plano?.toLowerCase().includes('completo') ? '18.000' : '10.000'} Kz
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-mono text-xs px-2 py-1 rounded whitespace-nowrap ${
                              ['pago', 'confirmado'].includes(p.status)
                                ? 'bg-accent/10 text-accent'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {p.status === 'pendente' && (
                              <div className="flex gap-1.5 flex-wrap">
                                <button
                                  onClick={() => confirmarPagamento(p.id, false)}
                                  className="bg-accent text-black font-bold text-xs px-2 py-1.5 rounded-lg hover:opacity-90 whitespace-nowrap"
                                  title="Confirmar e copiar credenciais"
                                >
                                  ✓ Confirmar
                                </button>
                                <button
                                  onClick={() => confirmarPagamento(p.id, true)}
                                  className="bg-blue-600 text-white font-bold text-xs px-2 py-1.5 rounded-lg hover:bg-blue-500 whitespace-nowrap"
                                  title="Confirmar e enviar email automático"
                                >
                                  📧 Email
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}