import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import InscricaoModal from '../components/InscricaoModal'

const MODULOS = [
  { 
    num: '01', 
    icon: '🧠', 
    title: 'Lógica & Algoritmos', 
    obj: 'Pensar como programador',
    items: [
      'O que é um algoritmo',
      'Fluxogramas', 
      'Variáveis e tipos de dados',
      'Estruturas condicionais',
      'Estruturas de repetição',
      'Vetores e matrizes'
    ] 
  },
  { 
    num: '02', 
    icon: '⚙️', 
    title: 'C++ — Fundamentos Fortes', 
    obj: 'Entender por baixo do capô',
    items: [
      'Sintaxe básica',
      'Entrada e saída de dados', 
      'Funções e modularidade',
      'Vetores e matrizes',
      'Introdução a ponteiros',
      'Estruturação de código'
    ] 
  },
  { 
    num: '03', 
    icon: '🐍', 
    title: 'Python Aplicado', 
    obj: 'Aplicar em linguagem moderna',
    items: [
      'Sintaxe moderna',
      'Estruturas de dados', 
      'Funções e listas',
      'Pequenos projetos',
      'Introdução a scripts',
      'Automação básica'
    ] 
  },
  { 
    num: '04', 
    icon: '🛠️', 
    title: 'Projetos Práticos', 
    obj: 'Aprender fazendo',
    items: [
      'Exercícios semanais',
      'Desafios progressivos', 
      'Mini-projetos guiados',
      'Projeto final integrado',
      'Code review individual',
      'Apresentação de resultados'
    ] 
  },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('opacity-100', 'translate-y-0')
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false)
  const [formStatus, setFormStatus] = useState(null)
  useReveal()

  const handleModalClose = () => {
    setModalOpen(false)
    if (formStatus === 'success') {
      // Mostrar mensagem de agradecimento ou toast
      console.log('Inscrição realizada com sucesso!')
    }
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white font-sans antialiased">
      {/* Fontes otimizadas */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=Syne:wght@700;800;900&display=swap');
        
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono-code { font-family: 'Space Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        /* Animações suaves */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Esconder elementos decorativos em mobile */
        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>

      <Navbar />

            {/* Hero Section - Mais compacta */}
      <section className="relative min-h-[75vh] sm:min-h-[80vh] flex items-center px-4 sm:px-[5%] pt-14 sm:pt-16 pb-10 sm:pb-12 overflow-hidden">
        {/* Glows ainda mais sutis */}
        <div className="absolute w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full pointer-events-none opacity-25 sm:opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,.08) 0%, transparent 70%)',
            top: '-60px',
            right: '-60px',
          }}
        />
        <div className="absolute w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] rounded-full pointer-events-none opacity-15 sm:opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,.05) 0%, transparent 70%)',
            bottom: '-30px',
            left: '-30px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full animate-fade-up">
          {/* Badge ainda menor */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-mono-code mb-3 sm:mb-4"
            style={{
              background: 'rgba(0,255,136,.07)',
              borderColor: 'rgba(0,255,136,.2)',
              color: '#00ff88'
            }}>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="whitespace-nowrap">🔥 Inscrições abertas · Março 2026</span>
          </div>

          <h1 className="font-display font-black leading-[1.1] tracking-tight mb-2 sm:mb-3 max-w-3xl">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl block">
              DO ZERO
            </span>
            <span className="text-[#00ff88] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl block">
              À BASE SÓLIDA
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl block">
              EM PROGRAMAÇÃO
            </span>
          </h1>

          <p className="text-gray-300 mb-4 sm:mb-5 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
            Para iniciantes absolutos — ou quem já tentou, mas ainda não conseguiu 
            <span className="text-[#00ff88] font-medium"> "entender de verdade"</span>.
          </p>

          {/* Tags mais compactas */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
            {[
              'Pensar como Programador',
              'Lógica',
              'Passo a Passo',
              'Compreender Código',
            ].map(t => (
              <span
                key={t}
                className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-gray-700 bg-gray-800/50 text-gray-200"
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTAs mais compactos */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-[#00ff88]/20 text-xs sm:text-sm"
            >
              🚀 Garantir minha vaga
            </button>
            <a
              href="#modulos"
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-700 text-gray-200 font-bold rounded-lg hover:border-gray-500 hover:bg-gray-800/50 active:bg-gray-800 transition-all duration-200 text-center text-xs sm:text-sm"
            >
              Ver plano →
            </a>
          </div>
        </div>

        {/* Code strip ainda mais discreto */}
        <div className="absolute bottom-2 left-0 right-0 font-mono-code text-[8px] sm:text-[10px] text-gray-800 overflow-hidden whitespace-nowrap pointer-events-none select-none hide-mobile opacity-30">
          {"<CodeMaster /> · #include <future.h> · while(practice) { skills++; }".repeat(2)}
        </div>
      </section>

      {/* Separador */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-4 sm:mx-[5%]" />

      {/* Para quem é - Seção */}
      <section className="py-16 sm:py-24 px-4 sm:px-[5%] bg-[#0a0c14]">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono-code text-xs tracking-widest uppercase mb-3 text-[#00ff88]">
            // Para quem é
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
            Este curso é para você
          </h2>
          <p className="text-gray-300 text-lg mb-10 sm:mb-12 max-w-2xl">
            Se você se identifica com alguma destas situações, veio ao lugar certo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                icon: '🧩',
                title: 'Falta de Base',
                desc: 'Está na faculdade mas trava na lógica e na prática.',
              },
              {
                icon: '🎓',
                title: 'Universitário',
                desc: 'Sabe a teoria, mas não consegue aplicar em problemas reais.',
              },
              {
                icon: '😤',
                title: 'Iniciante Frustrado',
                desc: 'Já tentou aprender, mas ainda não conseguiu entender de verdade.',
              },
              {
                icon: '🚀',
                title: 'Iniciante Absoluto',
                desc: 'Nunca programou e quer começar com os fundamentos certos.',
              },
            ].map((c, i) => (
              <div
                key={i}
                className="reveal opacity-0 translate-y-8 transition-all duration-700 bg-gray-800/30 border border-gray-700 rounded-2xl p-6 sm:p-7 hover:border-[#00ff88] hover:scale-[1.02] hover:bg-gray-800/50 cursor-default group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="text-3xl sm:text-4xl mb-3 block">{c.icon}</span>
                <h3 className="font-display font-bold text-lg sm:text-xl mb-2 text-white">
                  {c.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-4 sm:mx-[5%]" />

      {/* Conteúdo Programático */}
      <section className="py-16 sm:py-24 px-4 sm:px-[5%]">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono-code text-xs tracking-widest uppercase mb-3 text-[#00ff88]">
            // Conteúdo
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-10">
            O que você vai aprender
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {[
              {
                title: '🧠 Pensar como Programador',
                items: [
                  'Entender Lógica',
                  'Resolver Passo a Passo',
                  'Compreender o Código',
                  'Desenvolver Raciocínio',
                ],
              },
              {
                title: '🐍 Python',
                items: [
                  'Do Zero ao Avançado',
                  'Estruturas de Dados',
                  'Automação Básica',
                  'Pequenos Projetos',
                ],
              },
              {
                title: '💻 Informática Essencial',
                items: [
                  'Organização do PC',
                  'Instalação de Programas',
                  'Noções de Sistema',
                  'Ambiente de Desenvolvimento',
                ],
              },
              {
                title: '📐 Matemática & Inglês Técnico',
                items: [
                  'Lógica Essencial',
                  'Termos Técnicos em Inglês',
                  'Raciocínio Lógico-Matemático',
                ],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 sm:p-8 hover:border-gray-600 transition-colors"
              >
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-4 text-[#00ff88]">
                  {item.title}
                </h3>
                <ul className="space-y-3">
                  {item.items.map((subItem, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300">
                      <span className="text-[#00ff88] text-lg">✓</span>
                      <span>{subItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Resultado final */}
          <div className="bg-gradient-to-r from-[#00ff88]/10 to-transparent border border-[#00ff88]/20 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="font-display font-bold text-xl sm:text-2xl mb-3">
              Ao final do curso você terá:
            </h3>
            <p className="text-gray-300 text-base sm:text-lg">
              Base Forte · Confiança para Avançar · Fundamentos Sólidos · 
              <span className="text-[#00ff88]"> Capacidade de Evoluir por Conta Própria</span>
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-4 sm:mx-[5%]" />

      {/* Módulos */}
      <section id="modulos" className="py-16 sm:py-24 px-4 sm:px-[5%] bg-[#0a0c14]">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono-code text-xs tracking-widest uppercase mb-3 text-[#00ff88]">
            // Estrutura do Curso
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
            Base técnica em 4 módulos
          </h2>
          <p className="text-gray-300 text-lg mb-10 sm:mb-12 max-w-2xl">
            Cada módulo tem 2 meses de duração, com aulas presenciais e virtuais, 
            turma reduzida e acompanhamento personalizado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {MODULOS.map((m, i) => (
              <div
                key={i}
                className="reveal opacity-0 translate-y-8 transition-all duration-700 bg-gray-800/30 border border-gray-700 rounded-2xl p-6 sm:p-7 hover:border-[#00ff88] hover:scale-[1.02] hover:bg-gray-800/50"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-mono-code text-xs text-gray-500 mb-3">{m.num} / 04</div>
                <div className="text-3xl sm:text-4xl mb-3">{m.icon}</div>
                <h3 className="font-display font-bold text-lg sm:text-xl mb-1 text-white">
                  {m.title}
                </h3>
                <p className="font-mono-code text-xs mb-4 text-[#00ff88]">// {m.obj}</p>
                <ul className="space-y-2">
                  {m.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-[#00ff88] font-bold mt-0.5">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-4 sm:mx-[5%]" />

      {/* Metodologia */}
      <section id="metodologia" className="py-16 sm:py-24 px-4 sm:px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <p className="font-mono-code text-xs tracking-widest uppercase mb-3 text-[#00ff88]">
                // Metodologia
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
                Aulas presenciais e virtuais
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 sm:mb-8">
                Turma pequena, foco total em evolução e acompanhamento personalizado.
                <br />
                <br />
                Você será acompanhado de perto — porque dificuldade ignorada vira bloqueio.
              </p>

              <ul className="space-y-3 sm:space-y-4">
                {[
                  ['📚', '40% teoria objetiva, direto ao ponto'],
                  ['💻', '60% prática orientada com projetos reais'],
                  ['👥', 'Turmas controladas com atenção individual'],
                  ['📊', 'Acompanhamento de progresso personalizado'],
                  ['🎯', 'Foco em entender a lógica, não decorar código'],
                  ['🤝', 'Suporte direto para tirar dúvidas'],
                ].map(([icon, text], i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 reveal opacity-0 translate-y-8 transition-all duration-700">
              {[
                ['60%', 'Prática Intensiva'],
                ['15', 'Máx. por Turma'],
                ['4', 'Meses de Curso'],
                ['100%', 'Acompanhamento'],
              ].map(([num, lbl], i) => (
                <div
                  key={i}
                  className="bg-gray-800/30 border border-gray-700 rounded-2xl p-4 sm:p-6 text-center hover:border-[#00ff88]/30 transition-colors"
                >
                  <div className="font-display font-black text-3xl sm:text-4xl leading-none mb-2 text-[#00ff88]">
                    {num}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-4 sm:mx-[5%]" />

      {/* ── PRICING ── */}
      <section id="precos" className="py-16 sm:py-24 px-4 sm:px-[5%] bg-[#0a0c14]">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono-code text-xs tracking-widest uppercase mb-3 text-[#00ff88]">
            // Investimento
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 max-w-3xl">
            Escolha a melhor forma de garantir sua base sólida
          </h2>
          <p className="text-gray-300 text-lg mb-10 sm:mb-12 max-w-2xl leading-relaxed">
            O curso completo tem 4 meses de duração, dividido em 4 módulos de 2 meses cada. 
            Você pode pagar módulo a módulo ou garantir o pacote completo com 
            <span className="text-[#00ff88] font-medium"> desconto especial</span>.
          </p>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-4xl">
            {/* Opção 1: Por Módulo */}
            <div className="flex-1 bg-gray-800/30 border border-gray-700 rounded-2xl p-6 sm:p-8 hover:scale-[1.02] hover:border-gray-600 transition-all duration-200">
              <div className="text-sm text-gray-400 font-display font-bold mb-2">
                Por Módulo
              </div>
              <div className="font-display font-black text-3xl sm:text-4xl mb-2 text-white">
                10.000 <span className="text-lg font-normal text-gray-400">Kz</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">⏱ 2 meses por módulo</div>
              <p className="text-gray-300 text-sm mb-4">
                Pague módulo a módulo e avance no seu ritmo. Cada módulo tem duração de 2 meses.
              </p>
              <div className="text-xs text-[#00ff88] font-mono-code mb-6">
                → Flexibilidade para pagar aos poucos
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-xl border-2 border-gray-700 text-gray-200 font-bold hover:border-[#00ff88] hover:bg-[#00ff88]/10 transition-all duration-200 text-sm"
              >
                Quero começar
              </button>
            </div>

            {/* Opção 2: Pacote Completo (Destaque) */}
            <div
              className="flex-1 rounded-2xl p-6 sm:p-8 relative hover:scale-[1.02] transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,136,.08), #0f1219)',
                border: '2px solid #00ff88',
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono-code text-xs font-bold px-3 py-1.5 rounded-full text-black whitespace-nowrap"
                style={{ background: '#00ff88' }}
              >
                🔥 DESCONTO ESPECIAL
              </div>

              <div className="text-sm text-gray-400 font-display font-bold mb-2 mt-2 sm:mt-0">
                Curso Completo
              </div>
              
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-gray-500 line-through text-lg sm:text-xl">20.000 Kz</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-[#00ff88]">
                  18.000 Kz
                </span>
              </div>
              
              <div className="text-sm text-gray-400 mb-4">⏱ 4 meses (4 módulos de 2 meses cada)</div>
              
              <p className="text-gray-300 text-sm mb-3">
                Acesso a todos os 4 módulos de forma contínua e economia de 2.000 Kz no pacote completo.
              </p>
              
              <div className="text-xs text-[#00ff88] font-mono-code mb-5 bg-[#00ff88]/10 py-2 px-3 rounded-lg inline-block">
                💰 Economiza 2.000 Kz
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-xl font-bold text-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#00ff88]/20"
                style={{ background: '#00ff88' }}
              >
                🚀 Garantir pacote completo
              </button>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-6 sm:mt-8 flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-[#00ff88] text-lg">⏱</span>
            Vagas limitadas para garantir acompanhamento personalizado. 
            Início na primeira semana de Março.
          </p>
        </div>
      </section>
      
      {/* Formulário de Inscrição */}
      <section id="inscricao" className="py-16 sm:py-24 px-4 sm:px-[5%]">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono-code text-xs tracking-widest uppercase mb-3 text-center sm:text-left text-[#00ff88]">
            // Inscrição
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 text-center sm:text-left">
            Garanta sua vaga
          </h2>
          <p className="text-gray-300 text-lg mb-8 sm:mb-10 text-center sm:text-left">
            Preencha o formulário abaixo com seu nome e situação atual.
            <br />
            Após o envio, você receberá as instruções de pagamento.
          </p>

          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8">
            <InscricaoModal 
              inline 
              onStatusChange={setFormStatus}
              onClose={handleModalClose}
            />
          </div>
        </div>
      </section>

      {/* Footer melhorado */}
      <footer className="border-t border-gray-800 px-4 sm:px-[5%] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between gap-8 sm:gap-10">
            <div className="w-full sm:w-auto">
              <div className="font-display font-black text-xl tracking-tight mb-3">
                Code<span className="text-[#00ff88]">Master</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Formando programadores com entendimento real. Base sólida, carreira duradoura.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-16">
              <div>
                <h4 className="font-display font-bold text-sm mb-4 text-white">Curso</h4>
                <ul className="space-y-2">
                  {[
                    ['#modulos', 'Módulos'],
                    ['#metodologia', 'Metodologia'],
                    ['#precos', 'Preços'],
                    ['#inscricao', 'Inscrição'],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="text-gray-400 hover:text-[#00ff88] text-sm transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-display font-bold text-sm mb-4 text-white">Contacto</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span>📲</span>
                    <a href="https://wa.me/244943526836" className="hover:text-[#00ff88] transition-colors">
                      +244 943 526 836
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Presencial + Online</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Início: Março 2026</span>
                  </li>
                </ul>

                {/* Ícones sociais */}
                <div className="flex gap-3 mt-4">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00ff88] hover:text-black transition-colors text-gray-400"
                  >
                    <span className="text-sm">📘</span>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00ff88] hover:text-black transition-colors text-gray-400"
                  >
                    <span className="text-sm">📷</span>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00ff88] hover:text-black transition-colors text-gray-400"
                  >
                    <span className="text-sm">💼</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © 2026 CodeMaster — Todos os direitos reservados
            </p>
            <span className="font-mono-code text-gray-600 text-xs">
              Dev Pro v2.0 · by D. Mário Sacalumbo
            </span>
          </div>
        </div>
      </footer>

      {/* Modal de Inscrição */}
      {modalOpen && (
        <InscricaoModal 
          onClose={handleModalClose}
          onStatusChange={setFormStatus}
        />
      )}
    </div>
  )
}