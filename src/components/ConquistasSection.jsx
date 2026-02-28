// components/ConquistasSection.jsx
//
// BUGS CORRIGIDOS:
// 1. Não aceitava props — fazia fetch próprio ignorando dados do Dashboard
// 2. Rota /conquistas/novas provavelmente não existe → erro silencioso → loading eterno
// 3. NaN% nas barras de progresso quando arrays estão vazios (divisão por zero)
// 4. Toast duplicado: Dashboard.jsx já tem NotificationToast, este componente criava um segundo
// 5. setInterval de 30s dentro do componente conflitua com o refresh do Dashboard
// 6. Estrutura esperada (conquistas.conquistas.progresso) pode não bater com o que a API devolve
//
import { useState, useEffect } from 'react';
import api from '../api';
import ConquistaBadge from './ConquistaBadge';

// Utilitário: evita NaN quando denominador é 0
const safePct = (num, den) => (den > 0 ? Math.round((num / den) * 100) : 0);

export default function ConquistasSection({ conquistas: conquistasProps, erro, onRetentar }) {
  // Se o Dashboard já passou os dados via props, usamo-los directamente.
  // Caso contrário (componente usado de forma autónoma), fazemos fetch local.
  const [conquistasLocais, setConquistasLocais]   = useState(null);
  const [novasConquistas, setNovasConquistas]      = useState([]);
  // loading só é true no modo autónomo (sem props do Dashboard)
  // !conquistasProps seria true com null, o que mantinha loading eternamente
  const [loading, setLoading] = useState(conquistasProps === undefined);

  // Só faz fetch se NÃO receber props (modo autónomo)
  useEffect(() => {
    if (conquistasProps !== undefined) return; // Dashboard já fornece os dados
    carregarLocal();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const carregarLocal = async () => {
    try {
      setLoading(true);
      const response = await api.get('/conquistas/minhas');
      setConquistasLocais(response.data);

      // Tenta buscar novas conquistas — pode não existir, por isso silencioso
      try {
        const novas = await api.get('/conquistas/novas');
        if (novas.data?.length > 0) {
          setNovasConquistas(novas.data);
          setTimeout(() => marcarComoVistas(novas.data.map(c => c.id)), 3000);
        }
      } catch (_) { /* rota ainda não implementada — ignorar */ }

    } catch (err) {
      console.error('Erro ao carregar conquistas:', err);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoVistas = async (conquistaIds) => {
    try {
      await api.post('/conquistas/vistas', { conquistaIds });
      setNovasConquistas([]);
    } catch (_) { /* silencioso */ }
  };

  // ----- Normalizar dados -----
  // O Dashboard passa um array simples: [{id, nome, icone, status, pontos, ...}]
  // O modo autónomo espera: { nivel, pontuacaoTotal, conquistas: { progresso:[], modulo:[], ... } }
  // Esta função unifica os dois formatos.
  const normalizar = (raw) => {
    if (!raw) return null;

    // Formato array simples vindo do Dashboard
    if (Array.isArray(raw)) {
      const grupos = raw.reduce((acc, c) => {
        const cat = c.categoria || 'outras';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(c);
        return acc;
      }, {});
      return {
        nivel: 1,
        pontuacaoTotal: raw.filter(c => c.status === 'conquistada').reduce((s, c) => s + (c.pontos || 0), 0),
        conquistas: { ...grupos, todas: raw },
      };
    }

    // Formato estruturado da API — garante 'todas' caso o service não a inclua
    if (raw.conquistas && !raw.conquistas.todas) {
      const todasArr = Object.values(raw.conquistas).flat();
      return { ...raw, conquistas: { ...raw.conquistas, todas: todasArr } };
    }
    return raw;
  };

  // Dados finais: props do Dashboard têm prioridade
  const dados = normalizar(conquistasProps !== undefined ? conquistasProps : conquistasLocais);

  // ----- Loading -----
  if (loading) {
    return (
      <div className="bg-card border border-gray-800 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-14 h-14 bg-gray-700 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----- Estado de erro -----
  if (erro && !dados?.conquistas?.todas?.length) {
    return (
      <div className="bg-card border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-lg">Suas Conquistas</h3>
          {onRetentar && (
            <button
              onClick={onRetentar}
              className="text-xs text-accent hover:underline font-mono"
            >
              ↻ Tentar novamente
            </button>
          )}
        </div>
        <p className="text-gray-500 text-sm">Sistema de conquistas temporariamente indisponível.</p>
      </div>
    );
  }

  // ----- Estado vazio (sem conquistas ainda) -----
  if (!dados) {
    return (
      <div className="bg-card border border-gray-800 rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg mb-2">Suas Conquistas</h3>
        <p className="text-gray-500 text-sm">Conclua tópicos para desbloquear conquistas! 🏆</p>
      </div>
    );
  }

  const todasConquistas  = dados.conquistas?.todas || [];
  const conquistadas     = todasConquistas.filter(c => c.status === 'conquistada').length;
  const emAndamento      = todasConquistas.filter(c => c.status === 'em_andamento').length;
  const bloqueadas       = todasConquistas.filter(c => c.status === 'bloqueada').length;
  const pontuacaoTotal   = dados.pontuacaoTotal || 0;
  const nivel            = dados.nivel || 1;

  // Categorias a mostrar (exclui 'todas' que é apenas índice)
  const categorias = Object.entries(dados.conquistas || {}).filter(([cat]) => cat !== 'todas');

  const labelCategoria = {
    progresso:  '📊 Progresso',
    modulo:     '📚 Módulos',
    streak:     '🔥 Consistência',
    velocidade: '⚡ Velocidade',
    horario:    '🕐 Horário',
    social:     '🤝 Social',
    outras:     '🎯 Outras',
  };

  // Barras de progresso por categoria
  const barras = [
    { cat: 'progresso', color: 'bg-accent' },
    { cat: 'modulo',    color: 'bg-blue-500' },
    { cat: 'streak',    color: 'bg-orange-500' },
    { cat: 'social',    color: 'bg-green-500' },
  ];

  return (
    <div className="bg-card border border-gray-800 rounded-2xl p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-display font-bold text-lg">Suas Conquistas</h3>
          <p className="text-gray-400 text-xs">
            Nível {nivel} · {pontuacaoTotal} pontos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-700"
              style={{ width: `${pontuacaoTotal % 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{pontuacaoTotal % 100}/100</span>
        </div>
      </div>

      {/* Barras de progresso por categoria */}
      {categorias.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            {barras.map(b => (
              <span key={b.cat}>{labelCategoria[b.cat]?.split(' ')[0]}</span>
            ))}
          </div>
          <div className="flex gap-1 h-1">
            {barras.map((b, i) => {
              const lista = dados.conquistas?.[b.cat] || [];
              const pct   = safePct(
                lista.filter(c => c.status === 'conquistada').length,
                lista.length
              );
              return (
                <div
                  key={b.cat}
                  className={`flex-1 bg-gray-700 overflow-hidden ${
                    i === 0 ? 'rounded-l-full' : i === barras.length - 1 ? 'rounded-r-full' : ''
                  }`}
                >
                  <div
                    className={`h-full ${b.color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid por categoria */}
      {categorias.length > 0 ? (
        <div className="space-y-6">
          {categorias.map(([categoria, lista]) => (
            <div key={categoria}>
              <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">
                {labelCategoria[categoria] || categoria}
              </h4>
              <div className="flex flex-wrap gap-2">
                {lista.map(conquista => (
                  <ConquistaBadge
                    key={conquista.id}
                    conquista={conquista}
                    isNova={novasConquistas.some(n => n.id === conquista.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">
          Conclui tópicos para desbloquear conquistas! 🏆
        </p>
      )}

      {/* Estatísticas */}
      {todasConquistas.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-accent">{conquistadas}</p>
            <p className="text-xs text-gray-500">Conquistadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">{emAndamento}</p>
            <p className="text-xs text-gray-500">Em andamento</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-400">{bloqueadas}</p>
            <p className="text-xs text-gray-500">Bloqueadas</p>
          </div>
        </div>
      )}
    </div>
  );
}