import { useState, useEffect, useCallback } from 'react'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cc_token')
    if (token) {
      const decoded = decodeToken(token)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded)
      } else {
        localStorage.removeItem('cc_token')
      }
    }
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cc_token')
    setUser(null)
    window.location.href = '/login'
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    logout,
  }
}
