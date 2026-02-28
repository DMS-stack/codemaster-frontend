import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)   // ← CRÍTICO: evita redirect prematuro

  useEffect(() => {
    try {
      const savedUser  = localStorage.getItem('cm_user')
      const savedToken = localStorage.getItem('cm_token')
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
      }
    } catch {
      localStorage.removeItem('cm_user')
      localStorage.removeItem('cm_token')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData, tokenData) => {
    setUser(userData)
    localStorage.setItem('cm_token', tokenData)
    localStorage.setItem('cm_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cm_token')
    localStorage.removeItem('cm_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)