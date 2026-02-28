import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuth, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-5 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'border-b border-[#1f2937] bg-[#060810]/80' : 'bg-transparent'}`}>
      
      {/* Logo com ícone >_ */}
      <Link to="/" className="font-display font-black text-xl tracking-tight flex items-center gap-2">
        <span className="text-sm font-mono bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] px-1.5 py-0.5 rounded">
          &gt;_
        </span>
        Code<span style={{color:'#00ff88'}}>Master</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-8">
        <li><a href="#modulos" className="text-[#64748b] hover:text-white transition-colors text-sm">Módulos</a></li>
        <li><a href="#metodologia" className="text-[#64748b] hover:text-white transition-colors text-sm">Metodologia</a></li>
        <li><a href="#precos" className="text-[#64748b] hover:text-white transition-colors text-sm">Preços</a></li>
        {isAuth ? (
          <>
            <li>
              <Link to={user?.tipo === 'admin' || user?.tipo === 'professor' ? '/admin' : '/dashboard'}
                className="text-[#64748b] hover:text-white transition-colors text-sm">
                Minha Área
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-sm text-[#64748b] hover:text-red-400 transition-colors">
                Sair
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="text-[#64748b] hover:text-white transition-colors text-sm">
                Entrar
              </Link>
            </li>
            <li>
              <a href="#inscricao" style={{background:'#00ff88'}}
                className="text-black font-bold text-sm px-5 py-2 rounded-lg hover:opacity-85 transition-opacity">
                Inscrever-me
              </a>
            </li>
          </>
        )}
      </ul>

      {/* Hambúrguer — mobile */}
      <button className="md:hidden text-[#64748b] hover:text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          }
        </svg>
      </button>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0d1117] border-b border-[#1f2937] px-6 py-5 flex flex-col gap-4 md:hidden">
          <a href="#modulos" className="text-[#64748b] hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Módulos</a>
          <a href="#metodologia" className="text-[#64748b] hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Metodologia</a>
          <a href="#precos" className="text-[#64748b] hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Preços</a>

          <div className="h-px bg-[#1f2937]" />

          {isAuth ? (
            <>
              <Link
                to={user?.tipo === 'admin' || user?.tipo === 'professor' ? '/admin' : '/dashboard'}
                className="text-white font-bold text-sm flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <span style={{color:'#00ff88'}}>›</span> Minha Área
              </Link>
              <button onClick={handleLogout} className="text-red-400 text-left text-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white font-bold text-sm flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <span style={{color:'#00ff88'}}>›</span> Entrar
              </Link>
              <a
                href="#inscricao"
                style={{background:'#00ff88'}}
                className="text-black font-bold px-5 py-3 rounded-lg text-center text-sm"
                onClick={() => setMenuOpen(false)}
              >
                🚀 Inscrever-me
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  )
}