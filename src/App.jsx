import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin     from './pages/Admin'

// Ecrã de loading
function Loading() {
  return (
    <div style={{ minHeight:'100vh', background:'#060810', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:'#00ff88', fontFamily:'monospace', fontSize:'13px', letterSpacing:'0.1em' }}>
        A CARREGAR...
      </span>
    </div>
  )
}

// Rota protegida com redirecionamento por tipo
function PrivateRoute({ children, apenasAdmin = false }) {
  const { user, isAuth, loading } = useAuth()

  if (loading) return <Loading />
  if (!isAuth)  return <Navigate to="/login" replace />

  // Admin/professor a tentar aceder ao dashboard → manda para /admin
  if (!apenasAdmin && (user.tipo === 'admin' || user.tipo === 'professor')) {
    return <Navigate to="/admin" replace />
  }

  // Aluno a tentar aceder ao /admin → manda para /dashboard
  if (apenasAdmin && user.tipo === 'aluno') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin"     element={<PrivateRoute apenasAdmin><Admin /></PrivateRoute>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}