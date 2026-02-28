import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Login() {
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { login, isAuth, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuth && user) {
      navigate(user.tipo === 'admin' || user.tipo === 'professor' ? '/admin' : '/dashboard', { replace: true })
    }
  }, [isAuth, user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    localStorage.removeItem('cm_token')
    localStorage.removeItem('cm_user')

    try {
      const { data } = await api.post('/auth/login', { email, senha })
      login(data.user, data.token)
      navigate(data.user.tipo === 'admin' || data.user.tipo === 'professor' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciais inválidas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{background:'#060810'}}>
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{background:'radial-gradient(circle, rgba(0,255,136,.08) 0%, transparent 70%)', top:'-200px', right:'-200px'}} />

      <div className="w-full max-w-md animate-fade-up">
        <Link to="/" className="block text-center font-display font-black text-2xl tracking-tight mb-10">
          Code<span style={{color:'#00ff88'}}>Master</span>
        </Link>

        <div className="bg-[#0d1117] border border-[#1f2937] rounded-3xl p-8">
          <h1 className="font-display font-bold text-2xl mb-1">Bem-vindo de volta</h1>
          <p className="text-[#64748b] text-sm mb-8">Entra na tua área de estudos</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs tracking-widest uppercase text-[#64748b]">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="bg-[#111827] border border-[#1f2937] rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-[#00ff88] transition-all"
                placeholder="seu@email.com" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs tracking-widest uppercase text-[#64748b]">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                className="bg-[#111827] border border-[#1f2937] rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-[#00ff88] transition-all"
                placeholder="••••••••" required />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                ❌ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-black text-sm transition-all hover:opacity-85 disabled:opacity-50 mt-2"
              style={{background:'#00ff88'}}>
              {loading ? '⏳ A verificar...' : 'Entrar na plataforma →'}
            </button>
          </form>

          <p className="text-center text-[#64748b] text-xs mt-6">
            Ainda não és aluno?{' '}
            <Link to="/#inscricao" style={{color:'#00ff88'}} className="hover:underline">
              Inscreve-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}