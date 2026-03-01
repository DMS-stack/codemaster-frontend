import { useState } from 'react'
import api from '../api'

const PLANOS = [
  'Primeiro Módulo — 2 meses (10.000 Kz)',
  'Segundo Módulo — 2 meses (10.000 Kz)',
  'Curso Completo — 4 meses (18.000 Kz)',
]

const SITUACOES = [
  'Iniciante absoluto — nunca programei',
  'Já tentei aprender e fiquei frustrado',
  'Estou na faculdade com dificuldades',
  'Quero reforçar minha base',
]

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-xs tracking-widest uppercase text-[#64748b]">{label}</label>
      <input
        className="bg-[#111827] border border-[#1f2937] rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/10 transition-all placeholder-[#374151]"
        {...props}
      />
    </div>
  )
}

function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-xs tracking-widest uppercase text-[#64748b]">{label}</label>
      <select
        className="bg-[#111827] border border-[#1f2937] rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/10 transition-all"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export default function InscricaoModal({ onClose, inline }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    plano: '',
    situacaoAtual: '',
    metodoPagamento: 'transferencia',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const getButtonText = () => {
    if (!form.plano) return '🚀 Enviar Inscrição'
    if (form.plano.includes('Curso Completo')) {
      return 'Quero o Curso Completo com desconto →'
    }
    const modulo = form.plano.split('—')[0].trim()
    return `Quero começar o ${modulo} →`
  }

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.whatsapp || !form.plano || !form.situacaoAtual) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/inscricoes', form)
      setResult(data)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const wrap = `${inline ? '' : 'fixed inset-0 z-50 flex items-center justify-center p-4'}`
  const inner = inline
    ? 'w-full max-w-2xl'
    : 'w-full max-w-2xl bg-[#0d1117] border border-[#1f2937] rounded-3xl p-8 relative animate-slide-in max-h-[90vh] overflow-y-auto scrollbar-thin'

  return (
    <div className={wrap}>
      {!inline && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />}
      <div className={inner}>
        {!inline && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#64748b] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono transition-all ${
                  step >= s ? 'text-black' : 'border border-[#1f2937] text-[#64748b]'
                }`}
                style={step >= s ? { background: '#00ff88' } : {}}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 2 && (
                <div
                  className={`h-px w-12 transition-all ${step > s ? 'bg-[#00ff88]' : 'bg-[#1f2937]'}`}
                />
              )}
            </div>
          ))}
          <span className="font-mono text-xs text-[#64748b] ml-2">
            {step === 1 ? 'Dados pessoais' : 'Pagamento & Confirmação'}
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <h3 className="font-display font-bold text-xl mb-2">Comece sua jornada agora</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                placeholder="Ex: Maria Silva"
                value={form.nome}
                onChange={(e) => set('nome', e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="maria@email.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
              <Input
                label="WhatsApp (com código do país)"
                type="tel"
                placeholder="+244 9xx xxx xxx"
                value={form.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
                required
              />

              <div className="sm:col-span-2">
                <Select
                  label="Plano de Interesse"
                  value={form.plano}
                  onChange={(e) => set('plano', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione o plano desejado
                  </option>
                  {PLANOS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>

                <p className="text-[#64748b] text-sm mt-2 leading-relaxed">
                  Cada módulo tem duração de 2 meses. Você pode fazer um módulo de cada vez (10.000 Kz cada) ou
                  escolher o <strong>Curso Completo</strong> de 4 meses com desconto especial (18.000 Kz).
                </p>
              </div>

              <div className="sm:col-span-2">
                <Select
                  label="Sua Situação Atual"
                  value={form.situacaoAtual}
                  onChange={(e) => set('situacaoAtual', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione sua situação
                  </option>
                  {SITUACOES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="sm:col-span-2">
                <p className="font-mono text-xs tracking-widest uppercase text-[#64748b] mb-3">
                  Como você prefere pagar?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      val: 'transferencia',
                      label: '🏦 Transferência Bancária',
                      desc: 'Faça a transferência para a conta que será informada após a inscrição',
                    },
                    {
                      val: 'multicaixa',
                      label: '📱 Multicaixa Express',
                      desc: 'Pague usando referência via Multicaixa Express (mais rápido)',
                    },
                  ].map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => set('metodoPagamento', m.val)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.metodoPagamento === m.val
                          ? 'border-[#00ff88] bg-[#00ff88]/5'
                          : 'border-[#1f2937] bg-[#111827] hover:border-[#64748b]'
                      }`}
                    >
                      <div className="text-sm font-bold mb-1">{m.label}</div>
                      <div className="text-xs text-[#64748b]">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-black text-base transition-all hover:opacity-85 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#00ff88' }}
            >
              {loading ? '⏳ Enviando...' : getButtonText()}
            </button>
          </div>
        )}

        {step === 2 && result && (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-display font-bold text-2xl mb-2">Inscrição recebida com sucesso!</h3>
              <p className="text-[#64748b] text-sm">
                Referência: <span className="font-mono text-white">{result.referencia}</span>
              </p>
            </div>

            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 space-y-3">
              <p className="font-mono text-xs text-[#00ff88] tracking-widest uppercase mb-4">
                // Dados para realizar o pagamento
              </p>

              {form.metodoPagamento === 'transferencia' ? (
                <>
                  <PayRow label="Banco" value={result.dadosPagamento?.banco} />
                  <PayRow label="Titular" value={result.dadosPagamento?.titular} />
                  <PayRow label="Nº de Conta" value={result.dadosPagamento?.conta} />
                  <PayRow label="IBAN" value={result.dadosPagamento?.iban} />
                </>
              ) : (
                <>
                  <PayRow label="Número" value={result.dadosPagamento?.telefone} />
                  <PayRow label="Nome" value={result.dadosPagamento?.nome} />
                </>
              )}

              <div className="border-t border-[#1f2937] pt-3 mt-3">
                <PayRow label="Referência" value={result.referencia} highlight />
                <p className="text-xs text-[#64748b] mt-2">⚠️ Não esqueça de incluir esta referência no comprovativo</p>
              </div>
            </div>

            <div className="bg-[#052e16] border border-[#00ff88]/20 rounded-2xl p-6">
              <p className="font-bold text-sm mb-2">📲 Envie o comprovativo agora</p>
              <p className="text-[#64748b] text-sm mb-4">
                Após o pagamento, envie o comprovativo pelo WhatsApp. A mensagem já vem preenchida com seus dados e a
                referência.
              </p>
              <a
                href={result.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-black text-sm transition-all hover:opacity-85"
                style={{ background: '#00ff88' }}
              >
                📲 Abrir WhatsApp e enviar comprovativo
              </a>
            </div>

            <p className="text-center text-xs text-[#64748b]">
              Após confirmação do pagamento, você receberá o acesso à plataforma em até 24 horas.
            </p>

            {!inline && (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-[#1f2937] text-[#64748b] hover:text-white transition-colors text-sm"
              >
                Fechar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PayRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-[#64748b] font-mono text-xs">{label}</span>
      <span className={`font-mono ${highlight ? 'text-[#00ff88] font-bold' : 'text-white'}`}>
        {value || '—'}
      </span>
    </div>
  )
}